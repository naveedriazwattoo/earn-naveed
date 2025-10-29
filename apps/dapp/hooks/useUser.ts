import { useEffect, useState, useCallback } from 'react';
import { useClaimableContext } from '@/contexts/claimableContext';

export type UserInfo = {
  user: string;
  lastClaimedBlock: number;
  lastTxnClaimedHash: string | null;
  lastClaimedTimestamp: Date | null;
  createdAt: Date;
  updatedAt: Date;
  tokensLastClaimed: number;
}

export type UserError = {
  type: 'FETCH_ERROR' | 'CREATE_ERROR' | 'GENERAL_ERROR';
  message: string;
}

export function useUser(address: string | null) {
  const { setUserInfo } = useClaimableContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<UserError | null>(null);
  const [isReady, setIsReady] = useState(false);

  const checkUser = useCallback(async () => {
    if (!address) {
      setError({ type: 'GENERAL_ERROR', message: 'No address provided' });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setIsReady(false);
      
      const response = await fetch(`/api/user?address=${address}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();

      if (!response.ok) {
        if (result.error === "User not found") {
          // User doesn't exist, create new user
          const createResponse = await fetch('/api/user/create', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address })
          });
          const createResult = await createResponse.json();

          if (!createResponse.ok) {
            throw new Error(createResult.error || 'Failed to create user');
          }

          setUserInfo(createResult.user);
        } else {
          throw new Error(result.error || 'Failed to fetch user data');
        }
      } else {
        setUserInfo(result.user);
      }
      
      setIsReady(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError({ 
        type: err instanceof Error && err.message.includes('create') ? 'CREATE_ERROR' : 'FETCH_ERROR',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  }, [address, setUserInfo]);

  useEffect(() => {
    if (address) {
      console.log("address in useUser: ", address)
      checkUser();
    }
  }, [address, checkUser]);

  return {
    loading,
    error,
    isReady,
    revalidateUser: checkUser
  };
} 