const bip39 = require("bip39");
const express = require("express");
const ecc = require("tiny-secp256k1");
const { BIP32Factory } = require("bip32");
const { ethers, Wallet } = require("ethers");
const bitcoin = require("bitcoinjs-lib");
const { default: axios } = require("axios");
const bitcore = require("bitcore-lib");
// You must wrap a tiny-secp256k1 compatible implementation
const bip32 = BIP32Factory(ecc);
require("dotenv").config();

const app = express();
app.use(express.json());
const now_nodes_api_key = process.env.now_nodes_api_key;

const port = 3000;
const ethMainnet = `https://eth.nownodes.io/${now_nodes_api_key}`;
const ethTestnet = `https://eth-sepolia.nownodes.io/${now_nodes_api_key}`;
const btcMainnet = `https://btc.nownodes.io/${now_nodes_api_key}`;
const btcTestnet = `https://btc-testnet.nownodes.io/${now_nodes_api_key}`;

// ethereum Wallet Functions ---------------
const deriveWalletsFromEthereumNode = async (
  mnemonic,
  derivationPath,
  numberOfAccounts
) => {
  let accounts = [];
  for (let i = 0; i < numberOfAccounts; i++) {
    let hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic).derivePath(
      derivationPath + "/" + i
    );
    // console.log(hdNode);
    let wallet = new ethers.Wallet(hdNode.privateKey);
    accounts.push({ privateKey: wallet.privateKey, address: wallet.address });
  }
  console.log("successfully executed wallets derived");
  return accounts;
};

const getEthAccountsBalance = async (accounts, network) => {
  const provider = new ethers.providers.JsonRpcProvider(ethTestnet);
  for (let i = 0; i < accounts.length; i++) {
    let walletPrivateKey = new Wallet(accounts[i].privateKey);
    let wallet = walletPrivateKey.connect(provider);
    let balance = Number(await wallet.getBalance());
    balance = balance / 1e18;
    accounts[i].balance = balance;
  }
  console.log("successfully executed accountsbalance");
  return accounts;
};

const sendEthTransaction = async (PrivateKey, toAddress, value, network) => {
  const walletPrivateKey = new Wallet(PrivateKey);
  const ethNetwork = ethTestnet;
  const provider = new ethers.providers.JsonRpcProvider(ethNetwork);
  const wallet = walletPrivateKey.connect(provider);
  const balance = await wallet.getBalance();
  if (value >= balance) {
    return false;
  }
  const nonce = await wallet.getTransactionCount();
  let tx = {
    nonce: nonce,
    to: toAddress,
    value: ethers.utils.parseEther(value),
  };

  const txn = await wallet.sendTransaction(tx);
  txn.wait().then(async (receipt) => {
    if (receipt && receipt.status == 1) {
      console.log(receipt);
      return await wallet.getBalance();
    }
  });
};

const restoreEthereumWallet = async (mnemonic, index) => {
  const accounts = await createEthereumWallet(mnemonic, index);
  const updatedAccounts = await getEthAccountsBalance(accounts);
  return updatedAccounts;
};

const generateEthereumWallet = async (index) => {
  let randomEntropyBytes = ethers.utils.randomBytes(16);
  const mnemonic = ethers.utils.entropyToMnemonic(randomEntropyBytes);
  const accounts = await createEthereumWallet(mnemonic, index);
  const updatedAccounts = await getEthAccountsBalance(accounts);
  return { mnemonic, updatedAccounts };
};

const createEthereumWallet = async (mnemonic, index) => {
  const wallet = ethers.utils.HDNode.fromMnemonic(mnemonic);
  console.log(wallet);
  let derivationPath = "m/44'/60'/0'/0";
  return await deriveWalletsFromEthereumNode(mnemonic, derivationPath, index);
};

// bitcoin wallet fucntions ----------------

const sendBtcTransaction = async (
  fromAddress,
  privateKey,
  toAddress,
  value,
  network
) => {
  const url = `https://btcbook.nownodes.io/${now_nodes_api_key}/v2/utxo/${address}`;
  axios.get(url).then((response) => {
    let inputs = [];
    let utxos = response.data.data.txs;
    let totalAmountAvailable = 0;
    let inputCount = 0;

    for (const ele of utxos) {
      let utxo = {};
      utxo.satoshi = Math.floor(Number(ele.value) * 1e8);
      utxo.script = ele.script_hex;
      utxo.address = response.data.data.address;
      utxo.txid = ele.txid;
      utxo.outputIndex = ele.output_no;
      totalAmountAvailable += utxo.satoshi;
      inputCount + 1;
      inputs.push(utxo);
    }
    console.log(inputs);

    const transaction = new bitcore.Transaction();
    const satoshiToSend = value * 1e8;
    const outputCount = 2;

    const transactionSize =
      inputCount * 180 + outputCount * 34 + 10 - inputCount;
    let fee = transactionSize * 33;

    transaction.from(inputs);
    transaction.to(toAddress, satoshiToSend);
    transaction.change(fromAddress);
    transaction.fee(Math.round(fee));
    transaction.sign(privateKey);

    const serializedTransaction = transaction.serialize();

    // broadcast the transaction

    axios
      .get(
        `https://btcbook.nownodes.io/${now_nodes_api_key}/v2/sendtx/${serializedTransaction}`
      )
      .then((result) => console.log(result));
  });
};

const derivedWalletsFromBitcoinNode = async (
  root,
  derivationPath,
  numberOfAccounts
) => {
  let wallets = [];
  const network = bitcoin.networks.bitcoin;
  // bip49 derived path for mainnet =0 , testnet =1
  for (let i = 0; i < numberOfAccounts; i++) {
    let childNode = root.derivePath(derivationPath + "/" + i);

    const privateKey = childNode.privateKey.toString("hex");
    const address = bitcoin.payments.p2pkh({
      pubkey: childNode.publicKey,
      network,
    }).address;
    wallets.push({ privateKey: privateKey, address: address });
  }
  return wallets;
};

const restoreBtcWallet = async (mnemonic, index) => {
  const accounts = await createBitcoinWallet(mnemonic, index);
  return { mnemonic, accounts };
};

const generateBtcWallet = async (index) => {
  const mnemonic = bip39.generateMnemonic();
  console.log(mnemonic);
  const accounts = await createBitcoinWallet(mnemonic, index);
  return { mnemonic, accounts };
};

const createBitcoinWallet = async (mnemonic, accountNo) => {
  // generate mnemonic
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed);
  console.log("root : ", root);
  console.log("priv : ", root.privateKey.toString("hex"));
  console.log("child nodes ----------------");
  const path = "m/49'/1'/0'/0";
  return await derivedWalletsFromBitcoinNode(root, path, accountNo);
};

// create ethereum for the user -------------------
app.get("/:network/:number_of_addresses", async (req, res) => {
  const { network, number_of_addresses } = req.params;
  console.log(network, number_of_addresses);
  let result;
  try {
    if (network == "ethereum") {
      result = await generateEthereumWallet(number_of_addresses);
    } else if (network == "bitcoin") {
      result = await generateBtcWallet(number_of_addresses);
    } else {
      res
        .status(404)
        .json({ message: "only ethereum and bitcoin networks supported" });
      return;
    }
  } catch (e) {
    console.log(e);
  }
  const { mnemonic: seedToSend, updatedAccounts: accounts } = result;
  res.status(200).json({ seed: seedToSend, accounts: accounts });
});

app.post("/", async (req, res) => {
  console.log("body :- ", req.body);
  let { seed, number_of_addresses, network } = req.body;
  let accounts = [];
  try {
    if (network == "ethereum") {
      if (!ethers.utils.isValidMnemonic(seed)) {
        res.status(404).json({ message: "invalid seed" });
        return;
      }
      accounts = await restoreEthereumWallet(seed, Number(number_of_addresses));
    } else if (network == "bitcoin") {
      accounts = await restoreBtcWallet(seed, Number(number_of_addresses));
    }
  } catch (e) {
    console.log(e);
  }
  console.log("accounts recovered : ", accounts);

  res.status(200).json({ seed: seed, accounts: accounts });
});

app.post("/sendTransaction", async (req, res) => {
  let { privateKey, toAddress, value, network } = req.body;
  if (!ethers.utils.isHexString(privateKey, 32)) {
    res.status(404).json({ error: "private key must be of 32 bytes" });
    return;
  }
  try {
    if (network == "ethereum") {
      if (!sendEthTransaction(privateKey, toAddress, value)) {
        res.status(404).json({
          error:
            "transaction will fail , value is more than the account balance",
        });
        return;
      }
    } else if (network == "bitcoin") {
      if (!sendBtcTransaction(privateKey, toAddress, value)) {
        res.status(404).json({
          error:
            "transaction will fail , value is more than the account balance",
        });
        return;
      }
    } else {
      res.status(404).json({ error: "only ethereum and bitcoin supported" });
      return;
    }
  } catch (e) {
    console.log(e);
  }
});

// listening on port 3000-----------------
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
