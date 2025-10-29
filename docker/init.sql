-- First connect to default database
\c postgres;

-- Create rewards database if it doesn't exist
CREATE DATABASE rewards;

-- Connect to rewards database
\c rewards;

-- Create tables based on your Prisma schema
CREATE TABLE IF NOT EXISTS "UserClaim" (
    "user" TEXT PRIMARY KEY,
    "lastClaimedBlock" INTEGER NOT NULL,
    "lastTxnClaimedHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert dummy data
INSERT INTO "UserClaim" ("user", "lastClaimedBlock", "lastTxnClaimedHash") VALUES
('0x1234567890123456789012345678901234567890', 1000000, '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890');
