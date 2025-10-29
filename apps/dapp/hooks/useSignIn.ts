import { useState } from 'react'
import { MiniKit } from '@worldcoin/minikit-js'

interface MiniKitUser {
  walletAddress: string | null
  username: string | null
  profilePictureUrl: string | null
}

interface SignInState {
  isSignedIn: boolean
  walletAddress: string | null
  user: MiniKitUser | null
  isLoading: boolean
  error: string | null
}

export const useSignIn = () => {
  const [state, setState] = useState<SignInState>({
    isSignedIn: false,
    walletAddress: null,
    user: null,
    isLoading: false,
    error: null
  })

  const signIn = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      if (!MiniKit.isInstalled()) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          error: 'MiniKit is not installed'
        }))
        return
      }

      const res = await fetch(`/api/nonce`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const { nonce } = await res.json()


      const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce: nonce,
        requestId: '0',
        expirationTime: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        statement: 'This is my statement and here is a link https://worldcoin.com/apps',
      })

      if (finalPayload.status === 'error') {
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          error: 'Authentication failed'
        }))
        return
      }

      const response = await fetch('/api/complete-siwe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: finalPayload,
          nonce,
        }),
      })

      const data = await response.json()
      
      if (data.status === 'success' && data.isValid) {
        console.log("Successfully signed in with MiniKit.user: ", MiniKit.user)
        setState({
          isSignedIn: true,
          walletAddress: MiniKit.walletAddress,
          user: MiniKit.user, 
          isLoading: false,
          error: null
        })
        if (MiniKit.walletAddress) {
          sessionStorage.setItem('user', MiniKit.walletAddress)
        }
      } else {
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          error: data.message || 'Authentication failed'
        }))
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      }))
    }
  }

  return {
    ...state,
    signIn
  }
} 