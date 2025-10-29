// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/*

    |    \  | _ _|   \  | _ _|     __ __|       |                 
   __)  |\/ |   |     \ |   |         |   _ \   |  /   _ \  __ \  
 \__ \  |   |   |   |\  |   |         |  (   |    <    __/  |   | 
 (   / _|  _| ___| _| \_| ___|       _| \___/  _|\_\ \___| _|  _| 
   _| 

*/

contract MiniToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 ether;

    constructor() ERC20("Mini Token", "MINI") Ownable(msg.sender) {}

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        _mint(to, amount);
    }
}
