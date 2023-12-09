import { ethers } from "ethers";

async function getPublicKey(privateKey) {
  try {
    // Create a wallet instance from the private key
    const wallet = new ethers.Wallet(privateKey);

    // Get the public key
    const publicKey = wallet.publicKey;

    console.log('Public Key:', publicKey);
    return publicKey;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

// Replace 'yourPrivateKey' with your actual private key
const yourPrivateKey = '71ea6ed777657ec19df3ef03bdedf008e9a3f3ad981f0da98f273f874769ddbc';

// Call the function
getPublicKey(yourPrivateKey)
  .then((publicKey) => {
    // Do something with the public key if needed
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
//Public - 0x04bd3dd98f330dd8fbd3f83e160f239f9f98567c9adcd242fddd88716632aef02d556be5b2765cd3d5eedd5e401dc51ef2f715e169da06dae9089554958356b981