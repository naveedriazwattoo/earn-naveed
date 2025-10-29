import { NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { worldchain } from 'viem/chains'
import { formatEther } from 'viem'

const client = createPublicClient({
  chain: worldchain,
  transport: http(process.env.RPC_URL)
})

export async function POST(request: Request) {
  try {
    const { address, tokenAddress, abi, functionName, args } = await request.json()

    if (!address || !tokenAddress || !abi || !functionName || !args) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const result = await client.readContract({
      address: tokenAddress as `0x${string}`,
      abi,
      functionName,
      args
    }) as bigint

    // Convert to Ether and round to nearest integer
    const balanceInEther = formatEther(result)
    const roundedBalance = Math.floor(Number(balanceInEther))

    return NextResponse.json({ result: roundedBalance.toString() })
  } catch (error) {
    console.error('Error fetching token balance:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch token balance' },
      { status: 500 }
    )
  }
} 