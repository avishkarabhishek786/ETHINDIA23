// import * as dotenv from 'dotenv'

// import fs from "fs"
import { ethers } from "ethers"
import lighthouse from '@lighthouse-web3/sdk'
import { Buffer } from 'buffer';
// import kavach from "@lighthouse-web3/kavach"
// dotenv.config()


const signAuthMessage = async (publicKey, privateKey) => {
    const provider = new ethers.providers.JsonRpcProvider()
    const signer = new ethers.Wallet(privateKey, provider)
    const messageRequested = (await lighthouse.getAuthMessage(publicKey)).data.message
    const signedMessage = await signer.signMessage(messageRequested)
    return signedMessage
}

function getPublicKey(privateKey) {
    try {
      // Create a wallet instance from the private key
      const wallet = new ethers.Wallet(privateKey);
  
      // Get the public key
      const publicKey = wallet.address;
  
      console.log('Public Key:', publicKey);
      return publicKey;
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  }

const lighthouseDecrypt = async (cid, privKey) => {

    try {
        const publicKey = getPublicKey(privKey);
        const signedMessage = await signAuthMessage(publicKey, privKey);
        const fileEncryptionKey = await lighthouse.fetchEncryptionKey(
            cid,
            publicKey,
            signedMessage
        )
        console.log("file:", fileEncryptionKey)
        const decrypted = await lighthouse.decryptFile(
            cid,
            fileEncryptionKey.data.key
        )

        console.log(decrypted);

        console.log("Decryyyyypt =>", Buffer.from(decrypted).toString())

    } catch (error) {
        console.log('----', error)
    }


}


export default lighthouseDecrypt