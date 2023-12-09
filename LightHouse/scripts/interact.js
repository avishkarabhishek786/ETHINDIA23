import {ethers} from "ethers";
import ChatAndTradeAbi from "./ChatAndTradeAbi.json" assert { type: "json" };
// Replace these values with your contract ABI, addrthereum node provider URL, and private key
const contractABI = ChatAndTradeAbi; // Your contract's ABI (array)
const contractAddress = '0x3EB358F0c5D85B8CE9D3A2c96fd6816b0546cacB'; // Your contract's address
const providerUrl = 'https://rpc.public.zkevm-test.net/'; // Example: Infura URL
const privateKey = '71ea6ed777657ec19df3ef03bdedf008e9a3f3ad981f0da98f273f874769ddbc'; // Private key of the account calling the function

// Replace these values with the trade details
const signer = '0xSignerAddress';
const buyer = '0xBuyerAddress';
const buyerCrypto = '0xBuyerCryptoAddress';
const buyAmount = 100;
const seller = '0xSellerAddress';
const sellerCrypto = '0xSellerCryptoAddress';
const sellAmount = 80;
const nonce = 123;

async function signMessage() {
  // Connect to the Ethereum network
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);

  // Create a signer using your private key
  const wallet = new ethers.Wallet(privateKey, provider);

  // Create a contract instance
  const contract = new ethers.Contract(contractAddress, contractABI, wallet);

  // Get the message hash
  const messageHash = contract.getMessageHash(
    buyer,
    buyerCrypto,
    buyAmount,
    seller,
    sellerCrypto,
    sellAmount,
    nonce
  );

  // Sign the message
  const signature = await wallet.signMessage(ethers.utils.arrayify(messageHash));

  return signature;
}

async function settleTrade() {
  try {
    // Sign the message
    const signature = await signMessage();

    // Connect to the Ethereum network
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);

    // Create a signer using your private key
    const wallet = new ethers.Wallet(privateKey, provider);

    // Create a contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // Call the settle_trade function
    const tx = await contract.settle_trade(
      signer,
      buyer,
      buyerCrypto,
      buyAmount,
      seller,
      sellerCrypto,
      sellAmount,
      nonce,
      signature
    );

    // Wait for the transaction to be mined
    await tx.wait();

    console.log('Trade settled successfully. Transaction hash:', tx.hash);
  } catch (error) {
    console.error('Error settling trade:', error.message);
  }
}

// Call the function
settleTrade();
