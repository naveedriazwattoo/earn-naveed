#!/bin/bash

source .env && forge create \
    src/MiniClaim.sol:MiniClaim \
    --rpc-url "$WORLDCHAIN_RPC_URL" \
    --private-key "$(cat ~/solana/keys/wld-foundry)" \
    --via-ir \
    --legacy \
    --broadcast \
    --constructor-args 0x609b660Cb857f4c54DD1201f0E91451A27651571 