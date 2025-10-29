import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user = searchParams.get('user');

    if (!user) {
      return NextResponse.json(
        { error: 'User address is required' },
        { status: 400 }
      );
    }

    const userBadges = await prisma.userBadges.findUnique({
      where: {
        user: user
      }
    });

    if (!userBadges) {
      // If no badges exist, create a new entry
      const newBadges = await prisma.userBadges.create({
        data: {
          user: user,
          firstClaim: false,
          claimStreak: 0
        }
      });
      return NextResponse.json(newBadges);
    }

    return NextResponse.json(userBadges);
  } catch (error) {
    console.error('Error fetching user badges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user badges' },
      { status: 500 }
    );
  }
} 