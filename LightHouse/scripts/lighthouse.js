import {ethers} from "ethers"
import lighthouse from '@lighthouse-web3/sdk'
import kavach from "@lighthouse-web3/kavach"

 const signAuthMessage = async(privateKey) =>{
    const signer = new ethers.Wallet(privateKey)
    console.log("Aigner:", signer)

    const authMessage = await kavach.getAuthMessage(signer.address)
    console.log("AuthMessage:", authMessage)

    const signedMessage = await signer.signMessage(authMessage.message)
    console.log("SignedMessage:", signedMessage)

    const { JWT, error } = await kavach.getJWT(signer.address, signedMessage)
    return(JWT)
    // return await kavach.getJWT(signer.address, signedMessage);
  }

  const yourText = {
    "_signer": "0xYourSignerAddress",
    "buyer": "0xBuyerAddress",
    "buyerCrypto": "0xBuyerCryptoAddress",
    "buyAmount": 100,
    "seller": "0xSellerAddress",
    "sellerCrypto": "0xSellerCryptoAddress",
    "sellAmount": 80,
    "_nonce": 123,
    "signature": "0xYourSignature"
  };
  
  const jsonData = JSON.stringify(yourText);
  console.log(jsonData);  
const apiKey = "328f16a1.d9b328f413c34b199fa0fb352954f28c"
const publicKey = "0xA23b5c2a64dF31f41C90b08CE0c5AdA3f4c4f5C2"
const signedMessage = await signAuthMessage("71ea6ed777657ec19df3ef03bdedf008e9a3f3ad981f0da98f273f874769ddbc")
const name = "anime"
console.log("signedMessage",signedMessage)
console.log("yourText",jsonData)
console.log("apiKey",apiKey)
console.log("publicKey",publicKey)
// console.log("signedMessage JWT =>",signedMessage.split('jwt:')[1])

const response = await lighthouse.textUploadEncrypted(jsonData, apiKey, publicKey, signedMessage);
console.log(response);

// console.log(uploadResponse);