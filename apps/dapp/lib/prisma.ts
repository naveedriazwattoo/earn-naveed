import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || 'development'
  
  // Configure connection for Neon serverless database
  const dbUrl = process.env.STORAGE_DATABASE_URL || ''
  // For Neon serverless, use lower connection limits to avoid connection closure issues
  const connectionLimit = environment === 'production' ? 1 : 5
  const poolTimeout = environment === 'production' ? 5 : 30
  
  // Parse URL and add connection parameters for Neon
  try {
    const url = new URL(dbUrl)
    url.searchParams.set('connection_limit', connectionLimit.toString())
    url.searchParams.set('pool_timeout', poolTimeout.toString())
    url.searchParams.set('connect_timeout', '10')
    
    // Use unpooled connection for migrations/direct queries
    const directUrl = process.env.STORAGE_DATABASE_URL_UNPOOLED || dbUrl

    console.log(`[${environment}] Initializing Prisma client with connection limit: ${connectionLimit}`)

    const client = new PrismaClient({
      // Only log errors, not queries and warnings to reduce noise
      // Connection closures are normal for Neon serverless
      log: process.env.NODE_ENV === 'development' 
        ? ['error'] 
        : ['error'],
      datasources: {
        db: {
          url: url.toString(),
          directUrl: directUrl
        }
      }
    })
    
    // Add connection error handling
    client.$connect().catch((err) => {
      console.error('Prisma connection error:', err)
    })
    
    // Handle connection disconnections gracefully
    process.on('SIGINT', async () => {
      await client.$disconnect()
    })
    
    process.on('SIGTERM', async () => {
      await client.$disconnect()
    })
    
    return client
  } catch (error) {
    console.error('Error configuring database URL:', error)
    // Fallback to original URL if parsing fails
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      datasources: {
        db: {
          url: dbUrl
        }
      }
    })
  }
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