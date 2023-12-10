// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ChatAndTrade {

    enum TRADE_TYPE { BUY, SELL }

    mapping (address=>bool) cryptoAllowedForTrading;

    mapping (address=>mapping (address=>uint) ) public buying; // user addr => user crypto addr => user crypto balance  
    mapping (address=>mapping (address=>uint) ) public selling; // user addr => user crypto addr => user crypto balance
    address[] public sellersList;
    mapping (address=>address[]) public sellersListMap; // seller addr => [array of selling crypto addr]
    mapping (address=>mapping (address=>uint)) public sellingPrice; // user addr => selling crypto addr => selling crypto price

    modifier isCryptoAllowed(address crypto_addr) {
        require(cryptoAllowedForTrading[crypto_addr] == true, "crypto not allowed");
        _;
    }

    event Deposit(
        address depositer, 
        address crypto, 
        uint amount,
        TRADE_TYPE trade_type 
    );

    event Withdraw(
        address depositer, 
        address crypto, 
        uint amount,
        TRADE_TYPE trade_type 
    );

    event TradeSettled(
        address buyer,
        address buyerCrypto,
        uint buyAmount,
        address seller,
        address sellerCrypto,
        uint sellAmount
    );

    function depositCrypto(address crypto, uint amount, TRADE_TYPE trade_type) isCryptoAllowed(crypto) public  {
        IERC20(crypto).transfer(address(this), amount);
        if(TRADE_TYPE.BUY==trade_type) {
           buying[msg.sender][crypto] += amount;
           emit Deposit(msg.sender, crypto, amount, trade_type);
        } else {
           selling[msg.sender][crypto] += amount;
           emit Deposit(msg.sender, crypto, amount, trade_type);
        }
    }

    function withdrawCrypto(address crypto, uint amount, TRADE_TYPE trade_type) isCryptoAllowed(crypto) public {
        if(TRADE_TYPE.BUY==trade_type) { 
            require(buying[msg.sender][crypto] >= amount, "Withdrawal amount exceeded");
            buying[msg.sender][crypto] -= amount;
            IERC20(crypto).transferFrom(address(this), msg.sender, amount);
            emit Withdraw(msg.sender, crypto, amount, trade_type);
        } else {
            require(selling[msg.sender][crypto] >= amount, "Withdrawal amount exceeded");
            selling[msg.sender][crypto] -= amount;
            IERC20(crypto).transferFrom(address(this), msg.sender, amount);
            emit Withdraw(msg.sender, crypto, amount, trade_type);
        }
    }

    function approveTradeExecByContract(address crypto) external {
        IERC20(crypto).approve(address(this), type(uint256).max);
    }

    function listAsSeller(address crypto, uint amount, uint sp) external {
        require(amount>1 ether && IERC20(crypto).balanceOf(msg.sender)>=amount, "Deposit more crypto");
        depositCrypto(crypto, amount, TRADE_TYPE.SELL);
        sellersList.push(msg.sender);
        sellersListMap[msg.sender].push(crypto);
        sellingPrice[msg.sender][crypto] = sp;
    }

    function settle_trade(
        address signer,
        address buyer,
        address buyerCrypto,
        uint buyAmount,
        address seller,
        address sellerCrypto,
        uint sellAmount,
        uint nonce,
        bytes memory signature
    ) external {
        require(verify(
            signer,
            buyer,
            buyerCrypto,
            buyAmount,
            seller,
            sellerCrypto,
            sellAmount,
            nonce,
            signature
        ), "Invalid signature");

        IERC20(buyerCrypto).transferFrom(address(this), seller, buyAmount);
        IERC20(sellerCrypto).transferFrom(address(this), buyer, sellAmount);

        emit TradeSettled(buyer, buyerCrypto, buyAmount, seller, sellerCrypto, sellAmount);
    }

    function getAllSellers() external view returns (address[] memory) {
        return sellersList;
    }

    function getMessageHash(
        address buyer,
        address buyerCrypto,
        uint buyAmount,
        address seller,
        address sellerCrypto,
        uint sellAmount,
        uint nonce
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(buyer, buyerCrypto, buyAmount, seller, sellerCrypto, sellAmount, nonce));
    }

    function getEthSignedMessageHash(bytes32 _messageHash)
        public
        pure
        returns (bytes32)
    {
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash)
            );
    }

    function verify(
        address signer,
        address buyer,
        address buyerCrypto,
        uint buyAmount,
        address seller,
        address sellerCrypto,
        uint sellAmount,
        uint nonce,
        bytes memory signature
    ) public pure returns (bool) {
        bytes32 messageHash = getMessageHash(buyer, buyerCrypto, buyAmount, seller, sellerCrypto, sellAmount, nonce);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        return recoverSigner(ethSignedMessageHash, signature) == signer;
    }

    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature)
        public
        pure
        returns (address)
    {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig)
        public
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(sig.length == 65, "invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }
}
