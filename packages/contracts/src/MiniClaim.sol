// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./MiniToken.sol";

contract MiniClaim is Ownable {
    MiniToken public token;

    uint256 public constant MAX_AMOUNT = 200 ether; // erc20 18 decimals
    uint256 public claimInterval = 24 hours;
    bool public requireVerification;

    mapping(address => UserClaim[]) public userClaims;

    struct UserClaim {
        uint256 timestamp;
    }

    event Claimed(address indexed user, uint256 amount, uint256 timestamp);

    constructor(address _token) Ownable(msg.sender) {
        token = MiniToken(_token);
    }

    function moveOwnershipOfMiniToken(address newOwner) external onlyOwner {
        token.transferOwnership(newOwner);
    }

    function setClaimInterval(uint256 _claimInterval) external onlyOwner {
        claimInterval = _claimInterval;
    }

    function setMiniTokenAddress(address _tokenAddress) external onlyOwner {
        token = MiniToken(_tokenAddress);
    }

    function claim(uint256 amount) external {
        require(amount <= MAX_AMOUNT, "Amount too high");
        if (userClaims[msg.sender].length > 0) {
            require(
                block.timestamp >= userClaims[msg.sender][userClaims[msg.sender].length - 1].timestamp + claimInterval,
                "Too early to claim"
            );
        }

        userClaims[msg.sender].push(UserClaim({timestamp: block.timestamp}));

        token.mint(msg.sender, amount);

        emit Claimed(msg.sender, amount, block.timestamp);
    }
}
