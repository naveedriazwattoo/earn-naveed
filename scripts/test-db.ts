import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Try to query the database
    const claims = await prisma.userClaim.findMany()
    console.log('Database connection successful!')
    console.log('Claims:', claims)
  } catch (error) {
    console.error('Database connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 