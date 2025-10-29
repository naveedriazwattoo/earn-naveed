const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || 'development'
  console.log(`[${environment}] Starting database seed...`)

  // Sample data
  const sampleUsers = [
    {
      user: '0x58ae5b1f610452dd3a17c14b2cdb90861aee91ff',
      lastClaimedBlock: 12109502,
      lastClaimedTimestamp: new Date('2025-04-02T00:44:06.633Z'),
      tokensLastClaimed: 0,
      createdAt: new Date('2025-04-02T00:44:06.636Z'),
      updatedAt: new Date('2025-04-02T00:44:06.636Z'),
    },
    {
      user: '0x1234567890123456789012345678901234567890',
      lastClaimedBlock: 12109503,
      lastClaimedTimestamp: new Date('2025-04-02T00:45:06.633Z'),
      tokensLastClaimed: 100,
      createdAt: new Date('2025-04-02T00:45:06.636Z'),
      updatedAt: new Date('2025-04-02T00:45:06.636Z'),
    },
    {
      user: '0xabcdef1234567890abcdef1234567890abcdef12',
      lastClaimedBlock: 12109504,
      lastClaimedTimestamp: new Date('2025-04-02T00:46:06.633Z'),
      tokensLastClaimed: 200,
      createdAt: new Date('2025-04-02T00:46:06.636Z'),
      updatedAt: new Date('2025-04-02T00:46:06.636Z'),
    }
  ]

  // Clear existing data
  console.log(`[${environment}] Clearing existing data...`)
  await prisma.userClaim.deleteMany()

  // Insert new data
  console.log(`[${environment}] Inserting new data...`)
  for (const user of sampleUsers) {
    await prisma.userClaim.create({
      data: user
    })
  }

  console.log(`[${environment}] Database seed completed successfully!`)
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 