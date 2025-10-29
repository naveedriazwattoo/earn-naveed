// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./MiniToken.sol";
import "./IWorldID.sol";
import "./ByteHasher.sol";

contract MiniClaimVerifiable is Ownable {
    MiniToken public immutable token;

    uint256 public constant MAX_AMOUNT = 200 ether; // erc20 18 decimals
    uint256 public constant CLAIM_INTERVAL = 24 hours;
    bool public requireVerification;

    mapping(address => UserClaim[]) public userClaims;

    struct UserClaim {
        uint256 timestamp;
    }

    event Claimed(address indexed user, uint256 amount, uint256 timestamp);

    constructor(
        address _token,
        bool _requireVerification,
        address _worldId,
        string memory _appId,
        string memory _actionId
    ) Ownable(msg.sender) {
        token = MiniToken(_token);
        requireVerification = _requireVerification;
        worldId = IWorldID(_worldId);
        externalNullifier = abi
            .encodePacked(abi.encodePacked(_appId).hashToField(), _actionId)
            .hashToField();
    }

    function setRequireVerification(
        bool _requireVerification
    ) external onlyOwner {
        requireVerification = _requireVerification;
    }

    function claim(uint256 amount) external {
        require(amount <= MAX_AMOUNT, "Amount too high");
        if (requireVerification) {
            require(verified[msg.sender], "Not verified");
        }
        require(
            block.timestamp >=
                userClaims[msg.sender][userClaims[msg.sender].length - 1]
                    .timestamp +
                    CLAIM_INTERVAL,
            "Too early to claim"
        );

        userClaims[msg.sender].push(UserClaim({timestamp: block.timestamp}));

        token.mint(msg.sender, amount);

        emit Claimed(msg.sender, amount, block.timestamp);
    }

    /// -- World ID verification mixin --
    using ByteHasher for bytes;

    /// @dev The World ID instance that will be used for verifying proofs
    IWorldID public immutable worldId;

    /// @dev The contract's external nullifier hash
    uint256 internal immutable externalNullifier;

    /// @dev The World ID group ID (always 1)
    uint256 internal immutable groupId = 1;

    /// @dev Whether a nullifier hash has been used already. Used to guarantee an
    /// action is only performed once by a single person
    /// nullifier hash <=> hash(person's identity) through $WLD ID
    mapping(uint256 => bool) internal nullifierHashes;

    error DuplicateNullifier(uint256 nullifierHash);
    error ReceiverAlreadySet();

    /// @param nullifierHash The nullifier hash for the verified proof
    /// @dev A placeholder event that is emitted when a user successfully
    /// verifies with World ID
    event Verified(uint256 nullifierHash);

    mapping(address => bool) public verified;

    function verify(
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) public {
        if (nullifierHashes[nullifierHash]) {
            revert DuplicateNullifier(nullifierHash);
        }

        worldId.verifyProof(
            root,
            groupId,
            abi.encodePacked(signal).hashToField(),
            nullifierHash,
            externalNullifier,
            proof
        );

        nullifierHashes[nullifierHash] = true;
        verified[msg.sender] = true;

        emit Verified(nullifierHash);
    }
}
