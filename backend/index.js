const { default: axios } = require("axios");
const { networks } = require("bitcoinjs-lib");
const { bitcoin } = require("bitcoinjs-lib/src/networks");
const { ethers, providers } = require("ethers");
const express = require("express");

const app = express();

const port = 3000;
// const ethMainnet = "https://eth.nownodes.io/"
// const ethTestnet = `eth-sepolia.nownodes.io/${pro}`
const createBitcoinWallet = async () => {
  console.log(" creation of bitcoin wallet in progress -----");
};

function deriveFiveWalletsFromHdNode(
  mnemonic,
  derivationPath,
  numberOfAccounts
) {
  let wallets = [];

  for (let i = 0; i < numberOfAccounts; i++) {
    let hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic).derivePath(
      derivationPath + "/" + i
    );
    console.log(hdNode);
    let wallet = new ethers.Wallet(hdNode.privateKey);
    wallets.push(wallet);
  }
  const provider = new ethers.providers.JsonRpcProvider("");
  return wallets;
}

async function signTransaction(wallet, toAddress, value) {
  let transaction = {
    nonce: 0,
    gasLimit: 21000,
    gasPrice: ethers.utils.bigNumberify("2000000000"),
    to: toAddress,
    value: ethers.utils.parseEther(value),
    data: "0x",
  };
  sendTransaction(wallet);
}

const sendTransaction = async (wallet) => {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://eth.nownodes.io/14188213-eac0-40f4-a03d-7aec5f671ebb"
  );
  const signer = wallet.connect(provider);
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
