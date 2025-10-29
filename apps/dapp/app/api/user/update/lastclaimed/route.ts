import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const { user, lastClaimedBlock, lastTxnClaimedHash, tokensLastClaimed } = await request.json();

    // Validate required fields
    if (!user || !lastClaimedBlock || tokensLastClaimed === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to Neon database
    const sql = neon(process.env.STORAGE_DATABASE_URL || '');

    // Update the user's claim information
    await sql`
      UPDATE "UserClaim"
      SET 
        "lastClaimedBlock" = ${lastClaimedBlock},
        "lastTxnClaimedHash" = ${lastTxnClaimedHash},
        "lastClaimedTimestamp" = NOW(),
        "tokensLastClaimed" = ${tokensLastClaimed},
        "updatedAt" = NOW()
      WHERE "user" = ${user}
    `;

    return NextResponse.json({
      success: true,
      message: 'User claim information updated successfully'
    });
  } catch (error) {
    console.error('Error updating user claim information:', error);
    return NextResponse.json(
      { error: 'Failed to update user claim information' },
      { status: 500 }
    );
  }
}
