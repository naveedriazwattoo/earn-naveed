import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { utils } from "ethers";

// type UserData = {
//   user: string;
//   lastClaimedBlock: bigint | null;
//   lastTxnClaimedHash: string | null;
//   lastClaimedTimestamp: Date | null;
//   tokensLastClaimed: bigint | null;
//   createdAt: Date;
//   updatedAt: Date;
// };

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || 'development';

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

  try {
    console.log(`[${environment}] Fetching user with address:`, address);
    
    const user = await prisma.userClaim.findUnique({
      where: { user: address },
      select: {
        user: true,
        lastClaimedBlock: true,
        lastTxnClaimedHash: true,
        lastClaimedTimestamp: true,
        tokensLastClaimed: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    console.log(`[${environment}] Found user:`, user);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      user,
      environment // Include environment in response for debugging
    });
  } catch (error) {
    console.error(`[${environment}] Detailed error fetching user:`, error);
    // Log the full error object
    console.error(`[${environment}] Full error object:`, JSON.stringify(error, null, 2));
    return NextResponse.json(
      { 
        error: "Failed to fetch user", 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        environment // Include environment in error response for debugging
      },
      { status: 500 }
    );
  }
} 