-- CreateTable
CREATE TABLE "UserBadges" (
    "user" TEXT NOT NULL,
    "firstClaim" BOOLEAN NOT NULL DEFAULT false,
    "claimStreak" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "badgeThreeStreak" BOOLEAN NOT NULL DEFAULT false,
    "badgeEightyPercentile" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserBadges_pkey" PRIMARY KEY ("user")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserBadges_user_key" ON "UserBadges"("user");
