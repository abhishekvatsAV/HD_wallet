const bip39 = require("bip39");
const express = require("express");
const ecc = require("tiny-secp256k1");
const { BIP32Factory } = require("bip32");
const { ethers } = require("ethers");
const bitcoin = require("bitcoinjs-lib");
const { default: ECPairFactory } = require("ecpair");
// You must wrap a tiny-secp256k1 compatible implementation
const bip32 = BIP32Factory(ecc);
require("dotenv").config();

const app = express();

const now_nodes_api_key = process.env.now_nodes_api_key;

const port = 3000;
const ethMainnet = `https://eth.nownodes.io/${now_nodes_api_key}`;
const ethTestnet = `https://eth-sepolia.nownodes.io/${now_nodes_api_key}`;

function deriveWalletsFromHdNode(mnemonic, derivationPath, numberOfAccounts) {
  let wallets = [];
  for (let i = 0; i < numberOfAccounts; i++) {
    let hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic).derivePath(
      derivationPath + "/" + i
    );
    // console.log(hdNode);
    let wallet = new ethers.Wallet(hdNode.privateKey);
    wallets.push({ privateKey: wallet.privateKey, address: wallet.address });
  }
  return wallets;
}

async function sendTransaction(walletMnemonic, toAddress, value) {
  const ethNetwork = ethTestnet;
  const provider = new ethers.providers.JsonRpcProvider(ethNetwork);
  const wallet = walletMnemonic.connect(provider);
  const nonce = await wallet.getTransactionCount();
  let tx = {
    nonce: nonce,
    gasLimit: 21000,
    gasPrice: ethers.utils.bigNumberify("2000000000"),
    to: toAddress,
    value: ethers.utils.parseEther(value),
    data: "0x",
  };

  await wallet.sendTransaction(tx);
}

const restoreEthereumWallet = async (mnemonic) => {
  return ethers.Wallet.fromMnemonic(mnemonic);
};

const createEthereumWallet = async (accountsNo) => {
  // generate Mnemonic
  let randomEntropyBytes = ethers.utils.randomBytes(16);
  const mnemonic = ethers.utils.entropyToMnemonic(randomEntropyBytes);
  //   validate mnemonic
  const wallet = ethers.utils.HDNode.fromMnemonic(mnemonic);
  console.log(wallet);
  console.log(mnemonic);
  // const xpriv = wallet.privateKey;
  // const xpub = wallet.publicKey;
  // const address = wallet.address;
  // console.log(xpriv, xpub, address);

  let derivationPath = "m/44'/60'/0'/0";
  const wallets = deriveWalletsFromHdNode(mnemonic, derivationPath, accountsNo);
  return { mnemonic, wallets };
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

const createBitcoinWallet = async (accountNo) => {
  // generate mnemonic
  const mnemonic = bip39.generateMnemonic();
  console.log(mnemonic);
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed);
  console.log("root : ", root);
  console.log("priv : ", root.privateKey.toString("hex"));
  console.log("child nodes ----------------");
  const path = "m/49'/1'/0'/0";
  const wallets = await derivedWalletsFromBitcoinNode(root, path, accountNo);
  return { mnemonic, wallets };
};

// create ethereum for the user -------------------
app.get("/:network/:number_of_addresses", async (req, res) => {
  const { network, number_of_addresses } = req.params;
  console.log(network, number_of_addresses);
  let result;
  try {
    if (network == "ethereum") {
      result = await createEthereumWallet(number_of_addresses);
    } else if (network == "bitcoin") {
      result = await createBitcoinWallet(number_of_addresses);
    }
  } catch (e) {
    console.log(e);
  }
  console.log(result);
  const { mnemonic: seedToSend, wallets: accounts } = result;
  const accountsToSend = [];
  for (let i = 0; i < accounts?.length; i++) {
    accountsToSend.push({
      privateKey: accounts[i].privateKey,
      address: accounts[i].address,
      balance: 0,
    });
  }
  res.status(200).json({ seed: seedToSend, accounts: accountsToSend });
});

// listening on port 3000-----------------
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
