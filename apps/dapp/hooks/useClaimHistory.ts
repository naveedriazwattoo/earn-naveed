import { useEffect, useState } from 'react';
import { useClaimableContext } from '@/contexts/claimableContext';

interface ClaimEvent {
  transactionHash: string;
  blockNumber: number;
  timestamp: number;
  amount: number;
  from: string;
  to: string;
  status: string;
  gasUsed: number;
  gasPrice: number;
}

export function useClaimHistory() {
  const { user } = useClaimableContext();
  const [events, setEvents] = useState<ClaimEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetch, setRefetch] = useState(false);

  function refetchClaimHistory() {
    setRefetch(!refetch);
  }

  useEffect(() => {
    const fetchClaimEvents = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/claim-history?address=${user}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch claim history');
        }

        setEvents(data.events);
      } catch (err) {
        console.error('Error fetching claim events:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch claim events');
      } finally {
        setLoading(false);
      }
    };
    if (refetch) {
      setRefetch(false);
    } 
    fetchClaimEvents();
  }, [user, refetch]);

  return {
    events,
    loading,
    error,
    refetchClaimHistory
  };
} 