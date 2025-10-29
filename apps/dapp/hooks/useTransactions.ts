import { useState, useEffect } from 'react';

type WorldScanTransaction = {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
}

type ApiResponse = {
  erc20Transfers: WorldScanTransaction[];
  nftTransfers: WorldScanTransaction[];
  nativeTransfers: WorldScanTransaction[];
}

export function useTransactions(address: string | null, lastClaimedBlock?: number) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [erc20Transfers, setErc20Transfers] = useState<WorldScanTransaction[]>([]);
  const [nativeTxns, setNativeTxns] = useState<WorldScanTransaction[]>([]);
  const [totalTxnCount, setTotalTxnCount] = useState<number>(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const url = new URL('/api/transactions', window.location.origin);
        url.searchParams.append('address', address || '');
        if (lastClaimedBlock !== undefined) {
          url.searchParams.append('lastClaimedBlock', lastClaimedBlock.toString());
        }
        
        const response = await fetch(url.toString());
        const result: ApiResponse = await response.json();
  
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
  
        setData(result);
        setErc20Transfers(result.erc20Transfers || []);
        setNativeTxns(result.nativeTransfers || []);
        setTotalTxnCount(result.erc20Transfers.length + result.nativeTransfers.length);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (address && lastClaimedBlock) {
      fetchTransactions();
    }
  }, [address, lastClaimedBlock]);

  return {
    data,
    loading,
    error,
    erc20Transfers,
    nativeTxns,
    totalTxnCount
  };
}

export type { WorldScanTransaction }; 