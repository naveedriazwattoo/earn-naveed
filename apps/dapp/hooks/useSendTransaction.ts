import { MiniKit } from '@worldcoin/minikit-js'
import { utils } from 'ethers'
import { MiniTokenAbi } from '@mini/shared'
import { useState } from 'react'

interface TransactionState {
  transactionId: string | null
  isLoading: boolean
  error: Error | null
  isConfirming: boolean
  isConfirmed: boolean
  receipt: unknown | null
}

interface SendTokensParams {
  to: string
  amount: string // Amount in decimal format (e.g. "1.5" for 1.5 tokens)
}

interface MiniKitTransaction {
  address: string
  abi: typeof MiniTokenAbi
  functionName: string
  args: (string | number)[]
}

interface SendTransactionInput {
  transaction: MiniKitTransaction[]
  permit2?: {
    permitted: {
      token: string
      amount: string
    }
    nonce: string
    deadline: string
    spender: string
  }[]
}

interface MiniKitResponse {
  finalPayload: {
    status: 'success' | 'error'
    transactionId?: string
  }
}

const MINI_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_MINI_TOKEN_ADDRESS as `0x${string}`
const PERMIT2_ADDRESS = '0x000000000022D473030F116dDEE9F6B43aC78BA3' // Universal Permit2 contract

export function useSendTransaction() {
  const [state, setState] = useState<TransactionState>({
    transactionId: null,
    isLoading: false,
    error: null,
    isConfirming: false,
    isConfirmed: false,
    receipt: null,
  })

  const validateAddress = (address: string): boolean => {
    try {
      return utils.isAddress(address)
    } catch {
      return false
    }
  }

  const validateAmount = (amount: string): boolean => {
    try {
      const parsedAmount = utils.parseEther(amount)
      return parsedAmount.gt(0)
    } catch {
      return false
    }
  }

  const sendTransaction = async (transaction: SendTransactionInput) => {
    if (!MiniKit.isInstalled()) {
      throw new Error('MiniKit is not installed')
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await MiniKit.commandsAsync.sendTransaction(transaction) as MiniKitResponse
      
      if (response.finalPayload.status === 'error' || !response.finalPayload.transactionId) {
        throw new Error('Transaction failed')
      }

      const transactionId = response.finalPayload.transactionId

      setState(prev => ({ 
        ...prev, 
        transactionId,
        isLoading: false,
        isConfirming: true 
      }))

      // For now, we'll just mark the transaction as confirmed after sending
      // The actual confirmation will be handled by the blockchain
      setState(prev => ({
        ...prev,
        isConfirming: false,
        isConfirmed: true
      }))

      return response.finalPayload
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Transaction failed'
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: new Error(errorMessage)
      }))
      throw error
    }
  }

  const sendTokens = async ({ to, amount }: SendTokensParams) => {
    if (!validateAddress(to)) {
      throw new Error('Invalid recipient address')
    }

    if (!validateAmount(amount)) {
      throw new Error('Invalid amount')
    }

    const parsedAmount = utils.parseEther(amount)
    const deadline = Math.floor((Date.now() + 30 * 60 * 1000) / 1000).toString() // 30 minutes from now

    const permitTransfer = {
      permitted: {
        token: MINI_TOKEN_ADDRESS,
        amount: parsedAmount.toString(),
      },
      nonce: Date.now().toString(),
      deadline,
    }

    const transaction = {
      transaction: [{
        address: PERMIT2_ADDRESS,
        abi: MiniTokenAbi,
        functionName: 'transferFrom',
        args: [PERMIT2_ADDRESS, to, parsedAmount.toString()]
      }],
      permit2: [{
        ...permitTransfer,
        spender: PERMIT2_ADDRESS,
      }]
    }

    return sendTransaction(transaction)
  }

  return {
    ...state,
    sendTokens
  }
}
