const { default: axios } = require("axios");
const { networks } = require("bitcoinjs-lib");
const { bitcoin } = require("bitcoinjs-lib/src/networks");
const { ethers, providers } = require("ethers");
const express = require("express");

const app = express();

port = 3000;
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
  return wallet.sign(transaction);
}

const sendTransaction = async () => {
  var data =
    '{\n    "jsonrpc": "2.0",\n    "method": "eth_sendTransaction",\n    "params": [\n        {\n            "from": "0xb60e8dd61c5d32be8058bb8eb970870f07233155",\n            "to": "0xd46e8dd67c5d32be8058bb8eb970870f07244567",\n            "gas": "0x76c0", // 30400\n            "gasPrice": "0x9184e72a000", // 10000000000000\n            "value": "0x9184e72a", // 2441406250\n            "data": "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"\n        }\n    ],\n    "id": 1\n}';
  var daata = {
    jsonrc: "2.0",
    method: "eth_sendTransaction",
  };
  var config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://eth.nownodes.io/14188213-eac0-40f4-a03d-7aec5f671ebb",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
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
