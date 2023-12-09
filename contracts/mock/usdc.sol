// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract USDCoin is ERC20, ERC20Burnable {
    constructor(address initialOwner)
        ERC20("USD Coin", "USDC")
    {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}