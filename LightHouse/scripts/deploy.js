// // We require the Hardhat Runtime Environment explicitly here. This is optional
// // but useful for running the script in a standalone fashion through `node <script>`.
// //
// // You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// // will compile your contracts, add the Hardhat Runtime Environment's members to the
// // global scope, and execute the script.
// const hre = require("hardhat");

// async function main() {
//   const currentTimestampInSeconds = Math.round(Date.now() / 1000);
//   const unlockTime = currentTimestampInSeconds + 60;

//   const lockedAmount = hre.ethers.parseEther("0.001");

//   const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
//     value: lockedAmount,
//   });

//   await lock.waitForDeployment();

//   console.log(
//     `Lock with ${ethers.formatEther(
//       lockedAmount
//     )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
//   );
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

// var ethers = require('ethers');
// var crypto = require('crypto');
// var id = crypto. randomBytes(32). ...
// import { ethers } from "ethers";

// const app = async() => {
  71ea6ed777657ec19df3ef03bdedf008e9a3f3ad981f0da98f273f874769ddbc

// var privateKey = "71ea6ed777657ec19df3ef03bdedf008e9a3f3ad981f0da98f273f874769ddbc";
// console. log("SAVE BUT DO NOT SHARE THIS:", privateKey);
// var wallet = new ethers.Wallet(privateKey);

// console. log("Address: ", wallet.publicKey)

// }

// app()

import { ethers } from "ethers";

async function getPublicKey(privateKey) {
  try {
    // Create a wallet instance from the private key
    const wallet = new ethers.Wallet(privateKey);

     console.log("signed msg: :",  await wallet.signMessage("abc"));

    // Get the public key
    const publicKey = wallet.publicKey;

    console.log('Public Key:', publicKey);
    return publicKey;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

// // Replace 'yourPrivateKey' with your actual private key
const yourPrivateKey = "71ea6ed777657ec19df3ef03bdedf008e9a3f3ad981f0da98f273f874769ddbc";

// // Call the function
getPublicKey(yourPrivateKey);

// const SigningKeys = new ethers.utils.SigningKey("71ea6ed777657ec19df3ef03bdedf008e9a3f3ad981f0da98f273f874769ddbc");

// const signature = SigningKeys.signDigest("0xabc");

// console.log("My sign : ", signature);

// // new ethers.Wallet.from

