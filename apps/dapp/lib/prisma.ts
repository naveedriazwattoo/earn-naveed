import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || 'development'
  
  // Add environment-specific connection parameters
  const dbUrl = new URL(process.env.STORAGE_DATABASE_URL || '')
  const connectionLimit = environment === 'production' ? '1' : '5'
  const poolTimeout = environment === 'production' ? '2' : '5'
  
  dbUrl.searchParams.set('connection_limit', connectionLimit)
  dbUrl.searchParams.set('pool_timeout', poolTimeout)

  console.log(`[${environment}] Initializing Prisma client with connection limit: ${connectionLimit}`)

  return new PrismaClient({
    log: ['query', 'error', 'warn'],
    datasources: {
      db: {
        url: dbUrl.toString()
      }
    }
  })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

// In development, we want to reuse the connection
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Handle cleanup on process termination
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})