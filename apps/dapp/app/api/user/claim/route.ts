import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { utils } from "ethers";

export async function POST(req: Request) {
  try {
    const { address, blockNumber, txHash, tokensLastClaimed } = await req.json();

    if (!address || !blockNumber) {
      return NextResponse.json(
        { error: "Address and blockNumber are required" },
        { status: 400 }
      );
    }

    if (!utils.isAddress(address)) {
      return NextResponse.json(
        { error: "Invalid address format" },
        { status: 400 }
      );
    }

    const now = new Date();
    const updatedUser = await prisma.userClaim.update({
      where: { user: address },
      data: {
        lastClaimedBlock: blockNumber,
        lastTxnClaimedHash: txHash || "",
        lastClaimedTimestamp: now,
        ...(tokensLastClaimed !== undefined && { tokensLastClaimed }),
      }
    });

    return NextResponse.json({ user: updatedUser });

  } catch (error) {
    console.error("Error updating claim:", error);
    return NextResponse.json(
      { error: "Failed to update claim" },
      { status: 500 }
    );
  }
} 