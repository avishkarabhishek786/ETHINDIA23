import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { ethers } from "ethers";
// import "dotenv/config";

const pushMsg = async (toWalletAddress, msg='hi hello namaskar') => {
    try {
        const signer = new ethers.Wallet("77240eece840652e95ea05dad31c606659afd34adf795a1ce53f13511524bfb1");

        const userAlice = await PushAPI.initialize(signer, {
            env: CONSTANTS.ENV.STAGING,
        });

        await userAlice.chat.send(toWalletAddress, {
            content: JSON.stringify(msg),
            type: "Text",
        });

    } catch (error) {
        console.error(error);
    }
}

export default pushMsg;