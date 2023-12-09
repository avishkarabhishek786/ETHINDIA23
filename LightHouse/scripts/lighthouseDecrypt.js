import * as dotenv from 'dotenv'
dotenv.config()
import fs from "fs"
import { ethers } from "ethers"
import lighthouse from '@lighthouse-web3/sdk'
import kavach from "@lighthouse-web3/kavach"


const signAuthMessage = async (publicKey, privateKey) => {
  const provider = new ethers.providers.JsonRpcProvider()
  const signer = new ethers.Wallet(privateKey, provider)
  const messageRequested = (await lighthouse.getAuthMessage(publicKey)).data.message
  const signedMessage = await signer.signMessage(messageRequested)
  return signedMessage
}


const decrypt = async () => {
  const cid = "Qme6b6GmqsxAvKV5oHC48bWtFCRACnrFog5iYrjVfGDguY" //Example: 'QmbGN1YcBM25s6Ry9V2iMMsBpDEAPzWRiYQQwCTx7PPXRZ'
  const publicKey = "0xA23b5c2a64dF31f41C90b08CE0c5AdA3f4c4f5C2" //Example: '0xa3c960b3ba29367ecbcaf1430452c6cd7516f588'

  // Get file encryption key
//   const signedMessage = await signAuthMessage( publicKey, "71ea6ed777657ec19df3ef03bdedf008e9a3f3ad981f0da98f273f874769ddbc")
    
  try {
    // const signedMessage = "0xd874d04a91196b668c6d3a7a2303a9c75163b1ed3feb3cf8567091b3c298a36a1a9255d89b2006ff759ec18fff117fa89ac429534e573ed3f492e4c1ecbc636d1b";
    const signedMessage = await signAuthMessage( publicKey, "71ea6ed777657ec19df3ef03bdedf008e9a3f3ad981f0da98f273f874769ddbc");
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
    //   console.log("Decryyyyy",decrypted)
    console.log(Buffer.from(decrypted).toString())
    //fs.createWriteStream("fileName.png").write(Buffer.from(decrypted))
  } catch (error) {
    console.log('----',error)
  }
  

  // Decrypt File


  // Save File
  
}

decrypt()