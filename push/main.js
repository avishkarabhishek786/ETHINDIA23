import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { ethers } from "ethers";
import "dotenv/config";

const signer = new ethers.Wallet(process.env.PRIVATE_KEY);
//const userAlice = await PushAPI.initialize(signer, { env: CONSTANTS.ENV.STAGING });
const userAlice = await PushAPI.initialize(signer, {
  env: CONSTANTS.ENV.STAGING,
});

const toWalletAddress = "0x64f18353107c6084f16C31C92862C303d733594f";

const message = await userAlice.chat.send(toWalletAddress, {
  content: "Hello Abhijeet! .. Happy Hacking!!",
  type: "Text",
});

console.log(message);

// const stream = await userAlice.initStream([CONSTANTS.STREAM.CHAT]);

// stream.on(CONSTANTS.STREAM.CHAT, (message) => {
//   console.log(message);
// });

// stream.connect();
