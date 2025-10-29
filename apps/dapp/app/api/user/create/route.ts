import { NextResponse } from "next/server";
import { utils } from "ethers";
import axios from "axios";
import { prisma } from "@/lib/prisma";

const WORLDSCAN_API_KEY = process.env.WORLDSCAN_API_KEY;
const WORLDSCAN_BASE_URL = "https://api.worldscan.org/api";

export async function POST(req: Request) {
  try {
    const { address } = await req.json();

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    if (!utils.isAddress(address)) {
      return NextResponse.json(
        { error: "Invalid address format" },
        { status: 400 }
      );
    }

    if (!WORLDSCAN_API_KEY) {
      console.error("WORLDSCAN_API_KEY is not set in environment variables");
      throw new Error("WORLDSCAN_API_KEY is not configured");
    }

    // Get current block from WorldScan
    const response = await axios.get(WORLDSCAN_BASE_URL, {
      params: {
        module: "proxy",
        action: "eth_blockNumber",
        apikey: WORLDSCAN_API_KEY,
      },
    });

    if (!response.data || !response.data.result) {
      throw new Error("Invalid response from WorldScan API");
    }
    
    const currentBlock = parseInt(response.data.result, 16);
    
    if (isNaN(currentBlock)) {
      throw new Error("Invalid block number received from WorldScan");
    }

    // Create new user
    const user = await prisma.userClaim.create({
      data: {
        user: address,
        lastClaimedBlock: currentBlock,
        lastTxnClaimedHash: null,
        lastClaimedTimestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // default to a week ago just at least 24hrs ago
      },
      select: {
        user: true,
        lastClaimedBlock: true,
        lastTxnClaimedHash: true,
        lastClaimedTimestamp: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.info("user created: ", user);
    return NextResponse.json({ user });

  } catch (error) {
    console.error("Error creating user:", error);
    
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: `API Error: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create user" },
      { status: 500 }
    );
  }
} 