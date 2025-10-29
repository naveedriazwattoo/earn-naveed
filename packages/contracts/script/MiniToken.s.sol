// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import "../src/MiniToken.sol";

contract DeployMiniToken is Script {
    function run() external {
        vm.startBroadcast(); 

        MiniToken miniToken = new MiniToken();

        console.log("MiniToken deployed at:", address(miniToken));

        vm.stopBroadcast();
    }
}
