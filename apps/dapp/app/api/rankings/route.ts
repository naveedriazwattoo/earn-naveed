import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Calculate the timestamp for 24 hours ago
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // Get claims from the last 24 hours, ordered by tokensLastClaimed (descending)
    const rankings = await prisma.userClaim.findMany({
      where: {
        lastClaimedTimestamp: {
          gte: twentyFourHoursAgo
        }
      },
      select: {
        user: true,
        tokensLastClaimed: true,
        lastClaimedTimestamp: true
      },
      orderBy: {
        tokensLastClaimed: 'desc'
      }
    });

    // Add ranking position to each result
    const rankedResults = rankings.map((ranking: typeof rankings[0], index: number) => ({
      rank: index + 1,
      user: ranking.user,
      tokensLastClaimed: ranking.tokensLastClaimed,
      lastClaimedTimestamp: ranking.lastClaimedTimestamp
    }));

    return NextResponse.json({ 
      rankings: rankedResults,
      totalUsers: rankedResults.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching rankings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rankings' },
      { status: 500 }
    );
  }
}
