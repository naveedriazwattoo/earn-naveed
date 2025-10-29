-- CreateTable
CREATE TABLE "UserClaim" (
    "user" TEXT NOT NULL,
    "lastClaimedBlock" INTEGER NOT NULL,
    "lastTxnClaimedHash" TEXT,
    "lastClaimedTimestamp" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tokensLastClaimed" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserClaim_pkey" PRIMARY KEY ("user")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserClaim_user_key" ON "UserClaim"("user");
