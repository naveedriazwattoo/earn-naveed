import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { NextResponse } from 'next/server'
import { worldchain } from '@/config/chains'
import { Abi } from 'viem'
import { parseEther } from 'viem'

interface TransactionRequest {
  address: `0x${string}`
  abi: Abi
  functionName: string
  args: (string | number | null)[]
}

// Timeout in milliseconds
const TIMEOUT = 30000 // 30 seconds

export async function POST(request: Request) {
  const startTime = Date.now()
  
  try {
    const body: TransactionRequest = await request.json()
    
    // Log the incoming request for debugging
    console.log('Transaction request:', {
      address: body.address,
      functionName: body.functionName,
      args: body.args,
      requestTime: Date.now() - startTime
    })

    // Check for timeout
    if (Date.now() - startTime > TIMEOUT) {
      console.error('Transaction submission timeout:', {
        address: body.address,
        functionName: body.functionName,
        elapsedTime: Date.now() - startTime
      })
      return NextResponse.json(
        { error: 'Transaction submission timeout' },
        { status: 504 }
      )
    }

    if (!process.env.RPC_URL || !process.env.PRIVATE_KEY) {
      throw new Error('Required environment variables are not set')
    }

    // Ensure private key is properly formatted as hex
    const privateKey = process.env.PRIVATE_KEY.startsWith('0x') 
      ? process.env.PRIVATE_KEY 
      : `0x${process.env.PRIVATE_KEY}`

    const account = privateKeyToAccount(privateKey as `0x${string}`)
    const client = createWalletClient({
      account,
      chain: worldchain,
      transport: http(worldchain.rpcUrls.private.http[0], {
        timeout: TIMEOUT
      }),
    })

    // Convert string amounts to BigInt, handling null values and decimal amounts
    const formattedArgs = body.args.map((arg, index) => {
      if (arg === null) {
        throw new Error(`Null value provided in contract argument at index ${index}`)
      }
      
      if (typeof arg === 'string') {
        // If it's a hex string, keep it as is
        if (arg.startsWith('0x')) return arg
        
        // If it's a decimal number (e.g. "1.5"), convert to wei
        if (!isNaN(Number(arg)) && arg.includes('.')) {
          try {
            return parseEther(arg)
          } catch (err) {
            const error = err as Error
            throw new Error(`Failed to parse decimal amount at index ${index}: ${error.message}`)
          }
        }
        
        // Otherwise try to convert to BigInt
        try {
          return BigInt(arg)
        } catch (err) {
          const error = err as Error
          throw new Error(`Failed to convert argument at index ${index} to BigInt: ${error.message}`)
        }
      }
      
      // If it's a number, convert to BigInt
      try {
        return BigInt(arg)
      } catch (err) {
        const error = err as Error
        throw new Error(`Failed to convert number at index ${index} to BigInt: ${error.message}`)
      }
    })

    // Log the formatted arguments
    console.log('Formatted args:', formattedArgs)

    const hash = await client.writeContract({
      address: body.address,
      abi: body.abi,
      functionName: body.functionName,
      args: formattedArgs,
      value: BigInt(0),
    })

    // Convert BigInt values to strings in the response
    return NextResponse.json({ 
      hash: hash.toString(),
      args: formattedArgs.map(arg => arg.toString()),
      elapsedTime: Date.now() - startTime
    })
  } catch (error) {
    console.error('Transaction submission error:', error)
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        elapsedTime: Date.now() - startTime
      })
    }
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to submit transaction',
        elapsedTime: Date.now() - startTime
      },
      { status: 500 }
    )
  }
} 