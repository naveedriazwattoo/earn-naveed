// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Test, console2} from "forge-std/Test.sol";
import {MiniClaim} from "../src/MiniClaim.sol";
import {MiniToken} from "../src/MiniToken.sol";

contract MiniClaimTest is Test {
    MiniClaim public miniClaim;
    MiniToken public miniToken;

    address alice = makeAddr("alice");
    address bob = makeAddr("bob");
    address charlie = makeAddr("charlie");

    function setUp() public {
        // Alice deploys both contracts
        vm.startPrank(alice);

        miniToken = new MiniToken();
        miniClaim = new MiniClaim(address(miniToken));

        // Transfer ownership of MiniToken to MiniClaim
        miniToken.transferOwnership(address(miniClaim));

        vm.stopPrank();
    }

    function testOwnershipTransferFlow() public {
        // Bob claims some tokens
        vm.startPrank(bob);
        miniClaim.claim(1 ether);
        assertEq(miniToken.balanceOf(bob), 1 ether);
        vm.stopPrank();

        // Alice transfers MiniToken ownership to Charlie
        vm.startPrank(alice);
        miniClaim.moveOwnershipOfMiniToken(charlie);
        vm.stopPrank();

        // Verify Charlie is now the owner of MiniToken
        assertEq(miniToken.owner(), charlie);

        // Charlie should now be able to mint directly
        vm.startPrank(charlie);
        miniToken.mint(charlie, 1 ether);
        assertEq(miniToken.balanceOf(charlie), 1 ether);
        vm.stopPrank();

        // MiniClaim should no longer be able to mint through claim
        vm.startPrank(bob);
        vm.expectRevert();
        miniClaim.claim(1 ether);
        vm.stopPrank();
    }
}
