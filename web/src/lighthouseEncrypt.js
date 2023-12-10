import { ethers } from "ethers"
import lighthouse from '@lighthouse-web3/sdk'
import kavach from "@lighthouse-web3/kavach"

const signAuthMessage = async (privateKey) => {
    const signer = new ethers.Wallet(privateKey)
    console.log("Aigner:", signer)

    const authMessage = await kavach.getAuthMessage(signer.address)
    console.log("AuthMessage:", authMessage)

    const signedMessage = await signer.signMessage(authMessage.message)
    console.log("SignedMessage:", signedMessage)

    const { JWT, error } = await kavach.getJWT(signer.address, signedMessage)
    return (JWT)
    // return await kavach.getJWT(signer.address, signedMessage);
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

const lighthouseEncrypt = async (tradeReq, privKey) => {
    try {
        const jsonData = JSON.stringify(tradeReq);
        console.log(typeof(jsonData));
        const apiKey = "328f16a1.d9b328f413c34b199fa0fb352954f28c";
        const publicKey = getPublicKey(privKey);
        const signedMessage = await signAuthMessage(privKey)
     
        console.log("signedMessage", signedMessage)
        console.log("yourText", jsonData)
        console.log("apiKey", apiKey)
        console.log("publicKey", publicKey)

        const response = await lighthouse.textUploadEncrypted(jsonData, apiKey, publicKey, signedMessage);
        console.log("RRRRRRRRRRRRRRRRRR =>",response);
    } catch (error) {
        console.log(error);
    }
}

// const yourText = {
//     "_signer": "0xYourSignerAddress",
//     "buyer": "0xBuyerAddress",
//     "buyerCrypto": "0xBuyerCryptoAddress",
//     "buyAmount": 100,
//     "seller": "0xSellerAddress",
//     "sellerCrypto": "0xSellerCryptoAddress",
//     "sellAmount": 80,
//     "_nonce": 123,
//     "signature": "0xYourSignature"
// };

export default lighthouseEncrypt