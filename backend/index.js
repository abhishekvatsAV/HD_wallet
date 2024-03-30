const bip39 = require("bip39");
const express = require("express");
const ecc = require("tiny-secp256k1");
const { BIP32Factory } = require("bip32");
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
    console.log(hdNode);
    let wallet = new ethers.Wallet(hdNode.privateKey);
    wallets.push(wallet);
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

const createEthereumWallet = async () => {
  // generate Mnemonic
  let randomEntropyBytes = ethers.utils.randomBytes(16);
  const mnemonic = ethers.utils.entropyToMnemonic(randomEntropyBytes);
  //   validate mnemonic
  const isValid = ethers.utils.isValidMnemonic(mnemonic);
  let wallet;
  if (isValid) {
    wallet = ethers.utils.HDNode.fromMnemonic(mnemonic);
    console.log(wallet);
  }
  const xpriv = wallet.privateKey;
  const xpub = wallet.publicKey;
  const address = wallet.address;
  console.log(xpriv, xpub, address);

  //   let derivationPath = "m/44'/60'/0'/0";
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

    console.log(childNode);
    console.log("privatekey :", childNode.privateKey.toString("hex"));
    const address = bitcoin.payments.p2pkh({
      pubkey: childNode.publicKey,
      network,
    }).address;
    console.log(address);
    console.log("public key : ", childNode.publicKey.toString("hex"));
    wallets.push(childNode.toBase58());
  }
  const path = "m/49'/1'/0'/0";
  const child = root.derivePath(path);
};

const createBitcoinWallet = async () => {
  // generate mnemonic
  const mnemonic = bip39.generateMnemonic();
  console.log(mnemonic);
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed);
  console.log("root : ", root);
  console.log("priv : ", root.privateKey.toString("hex"));
  console.log("child nodes ----------------");
  const path = "m/49'/1'/0'/0";
  derivedWalletsFromBitcoinNode(root, path, 2);
};

// create ethereum for the user -------------------
app.get("/createEthereumAccount", (req, res) => {
  createEthereumWallet();
});

app.get("/createBitcoinAccount", (req, res) => {
  createBitcoinWallet();
});

// listening on port 3000-----------------
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
