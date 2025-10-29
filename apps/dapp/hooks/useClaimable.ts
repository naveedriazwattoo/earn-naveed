import { useTransactions, WorldScanTransaction } from './useTransactions';
import { useEffect, useMemo, useState } from 'react';
import { useClaimableContext } from '@/contexts/claimableContext';

export function useClaimable() {
  const { userInfo, user, lastClaimableTimestamp } = useClaimableContext();
  const { data: transactions, loading: txLoading, error: txError, totalTxnCount, erc20Transfers, nativeTxns } = useTransactions(user, userInfo?.lastClaimedBlock);
  const [ claimableTransactions, setClaimableTransactions ] = useState<WorldScanTransaction[]>([]);
  const [claimableTokens, setClaimableTokens] = useState<number>(0);
  const [claimableTimestamp, setClaimableTimestamp] = useState<Date | null>(null);

  const limitedErc20Transfers = useMemo(() => {
    const addressCounts = new Map<string, number>();
    if (Array.isArray(erc20Transfers) && erc20Transfers.length > 0) {
      return erc20Transfers.filter(tx => {
        const count = addressCounts.get(tx.from) || 0;
        if (count >= 3) {
          return false;
        }
        addressCounts.set(tx.from, count + 1);
        return true;
      });
    }
    return [];
  }, [erc20Transfers]);

  useEffect(() => {
    if (userInfo?.lastClaimedTimestamp) {
      const lastClaimed = lastClaimableTimestamp ? new Date(lastClaimableTimestamp) : new Date(userInfo.lastClaimedTimestamp);
      const now = new Date();
      const hoursSinceLastClaim = (now.getTime() - lastClaimed.getTime()) / (1000 * 60 * 60);
      if (hoursSinceLastClaim > 24) {
        // If more than 24 hours have passed, set to 24 hours ago
        const TWENTY_FOUR_HOURS_AGO = new Date(now.getTime() - (24 * 60 * 60 * 1000));
        // const TWO_MINUTES_AGO = new Date(now.getTime() - (2 * 60 * 1000));
        const ZERO_MS = new Date(now.getTime() - (0 * 60 * 1000));

        const TIMER = process.env.NEXT_PUBLIC_ENVIRONMENT === "production"? TWENTY_FOUR_HOURS_AGO : ZERO_MS;

        setClaimableTimestamp(TIMER);
      } else {
        // If less than 24 hours have passed, use the last claimed timestamp
        setClaimableTimestamp(lastClaimed);
      }
    }
  }, [userInfo, lastClaimableTimestamp]);

  useEffect(() => {
    if (transactions && userInfo) {
      setClaimableTransactions(nativeTxns.concat(limitedErc20Transfers));
      const claimable = totalTxnCount >= 199 ? 200 : totalTxnCount > 0 ? totalTxnCount + 1 : 1 
      setClaimableTokens(claimable);
    }
  }, [transactions, userInfo, totalTxnCount, nativeTxns, limitedErc20Transfers]);

  return {
    claimableTransactions,
    claimableTransactionsCount: claimableTransactions.length,
    loading: txLoading,
    error: txError,
    userInfo,
    claimableTokens,
    claimableTimestamp,
  };
} 