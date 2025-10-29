// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Test.sol";
import "../src/MiniToken.sol";

contract MiniTokenTest is Test {
    MiniToken public miniToken;
    address public owner = address(0x123);
    address public user = address(0x456);

    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18;

    function setUp() public {
        vm.prank(owner);
        miniToken = new MiniToken();
    }

    function testInitialSupplyIsZero() public {
        assertEq(miniToken.totalSupply(), 0);
        assertEq(miniToken.balanceOf(owner), 0);
    }

    function testOwnerCanMint() public {
        uint256 mintAmount = 1_000_000 * 10 ** 18;
        vm.prank(owner);
        miniToken.mint(user, mintAmount);

        assertEq(miniToken.totalSupply(), mintAmount);
        assertEq(miniToken.balanceOf(user), mintAmount);
    }

    function testNonOwnerCannotMint() public {
        uint256 mintAmount = 1_000_000 * 10 ** 18;
        vm.prank(user);
        vm.expectRevert(
            abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", user)
        );
        miniToken.mint(user, mintAmount);
    }

    function testCannotMintBeyondMaxSupply() public {
        uint256 overLimit = MAX_SUPPLY + 1;
        vm.prank(owner);
        vm.expectRevert("Max supply exceeded");
        miniToken.mint(owner, overLimit);
    }

    function testCanMintUpToMaxSupplyInChunks() public {
        vm.prank(owner);
        miniToken.mint(owner, MAX_SUPPLY / 2);

        vm.prank(owner);
        miniToken.mint(owner, MAX_SUPPLY / 2);

        assertEq(miniToken.totalSupply(), MAX_SUPPLY);
    }
}
