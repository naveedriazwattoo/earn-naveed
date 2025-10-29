import { useEffect, useState } from 'react'
import { useClaimableContext } from '@/contexts/claimableContext'

const MINI_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_MINI_TOKEN_ADDRESS as `0x${string}`

interface BalanceState {
  balance: string | null
  isLoading: boolean
  error: string | null
}

export const useMiniBalance = () => {
  const { user } = useClaimableContext()
  const [state, setState] = useState<BalanceState>({
    balance: '0',
    isLoading: false,
    error: null
  })

  useEffect(() => {
    const fetchBalance = async () => {
      console.log('fetching balance for user: ', user)
      if (!user) {
        setState(prev => ({ ...prev, balance: '0' }))
        return
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }))

      try {
        const response = await fetch('/api/token-balance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: user,
            tokenAddress: MINI_TOKEN_ADDRESS,
            abi: [
              {
                "inputs": [
                  {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                  }
                ],
                "name": "balanceOf",
                "outputs": [
                  {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                  }
                ],
                "stateMutability": "view",
                "type": "function"
              }
            ],
            functionName: 'balanceOf',
            args: [user]
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch balance')
        }

        // The balance is already formatted as a rounded integer in Ether
        setState({
          balance: data.result,
          isLoading: false,
          error: null
        })
      } catch (error) {
        setState({
          balance: '0',
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch balance'
        })
      }
    }

    fetchBalance()
  }, [user])

  return state
} 