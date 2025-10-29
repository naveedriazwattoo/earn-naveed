import { parseEther, createPublicClient, http, formatEther } from 'viem'
import { worldchain } from 'viem/chains'
import { useState, useEffect } from 'react'
import { useClaimableContext } from '@/contexts/claimableContext'
import { TransactionReceipt } from 'viem'
import { useBadges } from './useBadges'
import { useData } from '@/contexts/dataContext'
import { MiniKit } from '@worldcoin/minikit-js'
import { useWaitForTransactionReceipt } from '@worldcoin/minikit-react'


interface ClaimState {
  transactionId: string | null
  isLoading: boolean
  transactionHash: string | null
  error: Error | null
  isConfirming: boolean
  isConfirmed: boolean
  receipt: TransactionReceipt | null
  blockNumber: number | null
  validSignature: boolean
  isError: boolean
}

interface ClaimTokensParams {
  amount: string // Amount in decimal format (e.g. "1.5" for 1.5 tokens)
}

const TWENTY_FOUR_HOURS = 1000 * 60 * 60 * 24;
const CLAIM_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CLAIM_CONTRACT_ADDRESS as `0x${string}`

export function useClaimTokens() {
  const [transactionId, setTransactionId] = useState<string>('')
  const { user, userInfo } = useClaimableContext()
  const { updateClaimStreak, claimStreak } = useBadges();
  const { setLastClaimTxn } = useData();
  const [amountInWei, setAmountInWei] = useState<number | null>(null)
  const [state, setState] = useState<ClaimState>({
    transactionId: null,
    transactionHash: null,
    isLoading: false,
    error: null,
    isConfirming: false,
    isConfirmed: false,
    receipt: null,
    blockNumber: null,
    validSignature: false,
    isError: false
  })

  const client = createPublicClient({
    chain: worldchain,
    transport: http(process.env.NEXT_PUBLIC_RPC_URL || ''),
  })

  // console.log("RPC URL being used:", process.env.NEXT_PUBLIC_RPC_URL);
  
  const { isLoading: isConfirming, isSuccess: isConfirmed, receipt, transactionHash, isError, error } = useWaitForTransactionReceipt({
    client: client,
    appConfig: {
      app_id: process.env.NEXT_PUBLIC_APP_ID as string,
    },
    transactionId: transactionId,
  })

  // Update state when transaction status changes
  useEffect(() => {
    if (isConfirming || isConfirmed || isError || error || transactionHash) {
      console.log("isError: ", isError);
      console.log("error useEffect: ", JSON.stringify(error));
      setState(prev => ({
        ...prev,
        transactionId: transactionId,
        isConfirming,
        transactionHash: transactionHash as `0x${string}`,
        isConfirmed,
        isError,
        error: error as Error | null,
      }))
    }
  }, [transactionId, isConfirming, isConfirmed, isError, error, transactionHash])

  useEffect(() => {
    if (state.isError) {
      console.log("state.isError: ", state.isError);
    }
    if (state.error) {
      console.log("state.error: ", state.error);
    }
    if (state) {
      console.log("state: ", state);
    }
  }, [state, state.isError, state.error])

  useEffect(() => {
    if (transactionHash && receipt && user && amountInWei) {
    const txInfo = {
      transactionHash: transactionHash as `0x${string}`,
      blockNumber: Number(receipt?.blockNumber),
      timestamp: Date.now()/1000,
      amount: Number(formatEther(BigInt(amountInWei || 0))),
      from: user, 
      to: CLAIM_CONTRACT_ADDRESS,
      status: receipt?.status || '',
      gasUsed: Number(receipt?.gasUsed),
      gasPrice: null
    }
      setState(prev => ({
        ...prev,
        blockNumber: Number(receipt?.blockNumber),
      })) 
      console.log("txInfo: ", txInfo);
      setLastClaimTxn(txInfo)
    }
  }, [transactionHash, receipt, user, amountInWei, setLastClaimTxn])

  const claimTokens = async ({ amount }: ClaimTokensParams) => {
    if (!MiniKit.isInstalled()) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: new Error('MiniKit is not installed')
      }))
      throw new Error('MiniKit is not installed')
    }

    console.log("Claiming tokens for: ", user);
    if (!user) {
      throw new Error('User not connected')
    }
    
    const payload = {
      transaction: [
        {
          address: CLAIM_CONTRACT_ADDRESS as `0x${string}`,
          abi: [
            {
              type: "function",
              name: "claim",
              inputs: [
                {
                  type: "uint256",
                  name: "amount"
                }
              ],
              outputs: [],
              stateMutability: "nonpayable"
            }
          ],
          functionName: "claim",
          args: [parseEther(amount).toString()],
        },
      ],
    };

    console.log("Claiming tokens payload: ", payload);

    try {
      // Validate amount
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        throw new Error('Invalid amount')
      }

      // Convert amount to wei
      setAmountInWei(Number(parseEther(amount)))

      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction(
        payload
      );
  
      console.log("Claiming tokens finalPayload: ", finalPayload);

      if (finalPayload.status === "error") {
        console.log("Claiming tokens finalPayload error: ", finalPayload);
        setState(prev => ({ ...prev, isLoading: false, error: new Error(JSON.stringify(finalPayload.details)) }))
        throw new Error(
          finalPayload.details
            ? JSON.stringify(finalPayload.details)
            : `Transaction failed: ${JSON.stringify(finalPayload)}`
        );
      }

      setTransactionId(finalPayload.transaction_id)

      // Update claim streak
      if (userInfo?.lastClaimedTimestamp) {
        const lastClaimedTimestamp = new Date(userInfo.lastClaimedTimestamp);
        const today = new Date();
        const timeDiff = today.getTime() - lastClaimedTimestamp.getTime();
        console.log("timeDiff: ", timeDiff);

        const daysDiff = (timeDiff / (TWENTY_FOUR_HOURS)).toFixed(2); // give users at least 1 day to claim after a 24 hour timer period 
        console.log("daysDiff: ", daysDiff);
        if (1.00 <= Number(daysDiff) && Number(daysDiff) <= 2.00) {
          updateClaimStreak(claimStreak + 1);
        } else {
          updateClaimStreak(1);
        }
        // updateClaimStreak(claimStreak + 1);
      } else {
        console.warn('No last claimed timestamp found for user', user);
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
      }))

      return { transactionId: transactionId }
    } catch (error) {
      console.log("error: ", error);
      const errorMessage = error instanceof Error ? error.message : 'Transaction failed'
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: new Error(errorMessage)
      }))
      throw error
      
    }
  }

  

  return {
    ...state,
    claimTokens
  }
} 