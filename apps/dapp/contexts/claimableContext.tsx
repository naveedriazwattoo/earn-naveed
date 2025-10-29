'use client'

import { createContext, useState, useContext, useCallback, useEffect } from 'react'
import { UserInfo } from '@/hooks/useUser'

interface ClaimableContextType {   
  user: string | null
  userInfo: UserInfo | null
  claimableTokens: number
  lastClaimableTimestamp: Date | null
  setUser: (user: string | null) => void
  setUserInfo: (info: UserInfo | null) => void
  setClaimableTokens: (tokens: number) => void
  setClaimableTimestamp: (timestamp: Date | null) => void
}

export const ClaimableContext = createContext<ClaimableContextType>({
  user: null,
  userInfo: null,
  claimableTokens: 0,
  lastClaimableTimestamp: null,
  setUser: () => {},
  setUserInfo: () => {},
  setClaimableTokens: () => {},
  setClaimableTimestamp: () => {},
})

export function ClaimableProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
    // Initialize from sessionStorage if available
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('userInfo')
      return saved ? JSON.parse(saved) : null
    }
    return null
  })
  const [claimableTokens, setClaimableTokens] = useState<number>(0)
  const [lastClaimableTimestamp, setClaimableTimestamp] = useState<Date | null>(null)

  const updateUserInfo = useCallback((newUserInfo: UserInfo | null) => {
    if (newUserInfo) {
      sessionStorage.setItem('userInfo', JSON.stringify(newUserInfo))
    } else {
      sessionStorage.removeItem('userInfo')
    }
    setUserInfo(newUserInfo)
    if (newUserInfo?.lastClaimedTimestamp) {
      setClaimableTimestamp(newUserInfo.lastClaimedTimestamp)
    } else {
      setClaimableTimestamp(new Date())
    }
  }, [])

  useEffect(() => {
    const sessionUser = sessionStorage.getItem('user')
    if (!user && sessionUser) {
      setUser(sessionUser)
    }
  }, [user])

  return (
    <ClaimableContext.Provider value={{ 
      user,
      userInfo, 
      claimableTokens, 
        lastClaimableTimestamp,
        setUser,
        setUserInfo: updateUserInfo,
        setClaimableTokens,
        setClaimableTimestamp
      }}
    >
      {children}
    </ClaimableContext.Provider>
  )
}

export const useClaimableContext = () => {
  const context = useContext(ClaimableContext)
  if (!context) {
    throw new Error('useClaimableContext must be used within a ClaimableProvider')
  }
  return context
}

