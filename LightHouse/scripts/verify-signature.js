const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("VerifySignature", function () {
  it("Check signature", async function () {
    const accounts = await ethers.getSigners(5)

    const VerifySignature = await ethers.getContractFactory("VerifySignature")
    const contract = await VerifySignature.deploy()
    await contract.deployed()

    const signer = accounts[0]
    const buyer = accounts[1].address
    const buyerCrypto = "0xb4ee6879Ba231824651991C8F0a34Af4d6BFca6a"
    const buyAmount = 1
    const seller = accounts[2].address
    const sellerCrypto = "0xb4ee6879Ba231824651991C8F0a34Af4d6BFca6a"
    const sellAmount = 10000
    const nonce = 123

    const hash = await contract.getMessageHash(buyer, buyerCrypto, buyAmount, seller, sellerCrypto, sellAmount, nonce)
    const sig = await signer.signMessage(ethers.utils.arrayify(hash))

    const ethHash = await contract.getEthSignedMessageHash(hash)

    console.log("signer          ", signer.address)
    console.log("recovered signer", await contract.recoverSigner(ethHash, sig))

    // Correct signature and message returns true
    expect(
        await contract.verify(signer.address, buyer, buyerCrypto, buyAmount, seller, sellerCrypto, sellAmount, nonce, sig)
      ).to.equal(true)
  
      // Incorrect message returns false
      expect(
        await contract.verify(signer.address, buyer, buyerCrypto, buyAmount+1, seller, sellerCrypto, sellAmount, nonce, sig)
      ).to.equal(false)
  })
})