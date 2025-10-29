import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface UpdateBadgeRequest {
  user: string;
  firstClaim?: boolean;
  claimStreak?: number;
  badgeThreeStreak?: boolean;
  badgeEightyPercentile?: boolean;
}

interface UpdateData {
  firstClaim?: boolean;
  claimStreak?: number;
  badgeThreeStreak?: boolean;
  badgeEightyPercentile?: boolean;
}

export async function POST(request: Request) {
  try {
    const body: UpdateBadgeRequest = await request.json();
    const { user, firstClaim, claimStreak, badgeThreeStreak, badgeEightyPercentile } = body;

    if (!user) {
      return NextResponse.json(
        { error: 'User address is required' },
        { status: 400 }
      );
    }

    const updateData: UpdateData = {};
    if (firstClaim !== undefined) updateData.firstClaim = firstClaim;
    if (claimStreak !== undefined) updateData.claimStreak = claimStreak;
    if (badgeThreeStreak !== undefined) updateData.badgeThreeStreak = badgeThreeStreak;
    if (badgeEightyPercentile !== undefined) updateData.badgeEightyPercentile = badgeEightyPercentile;

    const updatedBadges = await prisma.userBadges.upsert({
      where: {
        user: user
      },
      update: updateData,
      create: {
        user: user,
        firstClaim: firstClaim ?? false,
        claimStreak: claimStreak ?? 0,
      }
    });

    return NextResponse.json(updatedBadges);
  } catch (error) {
    console.error('Error updating user badges:', error);
    return NextResponse.json(
      { error: 'Failed to update user badges' },
      { status: 500 }
    );
  }
}
