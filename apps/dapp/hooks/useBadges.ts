import { useEffect, useState, useCallback } from 'react';
import { useClaimableContext } from '@/contexts/claimableContext';
import { useClaimHistory } from './useClaimHistory';
import { useRankings } from './useRankings';
// import { Badge, badgeTypeInfo } from '../utils/badges'; 

interface UserBadgeData {
  user: string;
  firstClaim: boolean;
  claimStreak: number;
  badgeThreeStreak: boolean;
  badgeEightyPercentile: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const useBadges = () => {
  const { user , lastClaimableTimestamp } = useClaimableContext();
  const { events, loading: historyLoading } = useClaimHistory();
  const [badgeData, setBadgeData] = useState<UserBadgeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalClaims, setTotalClaims] = useState(0);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const { userPercentile } = useRankings();
  
  const updateClaimStreak = useCallback(async (newStreak: number) => {
    if (!user) return;

    try {
      const response = await fetch('/api/badges/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user,
          claimStreak: newStreak
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update claim streak');
      }

      const updatedBadges = await response.json();
      setBadgeData(updatedBadges);
    } catch (err) {
      console.error('Error updating claim streak:', err);
      throw err;
    }
  }, [user]);

  const updateThreeClaimStreak = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/badges/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user,
          badgeThreeStreak: true
        }),
      });



      if (!response.ok) {
        throw new Error('Failed to update three claim streak');
      }

      const updatedBadges = await response.json();
      setBadgeData(updatedBadges);
    } catch (err) {
      console.error('Error updating three claim streak:', err);
      throw err;
    }
  }, [user]);

  const updateEightyPercentile = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/badges/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user,
          badgeEightyPercentile: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update eighty percentile');
      }

      const updatedBadges = await response.json();
      setBadgeData(updatedBadges);
    } catch (err) {
      console.error('Error updating eighty percentile:', err);
      throw err;
    }
  }, [user]); 

  useEffect(() => {
    const fetchBadges = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/badges?user=${user}`);
        if (!response.ok) {
          throw new Error('Failed to fetch badges');
        }
        const data = await response.json();
        setBadgeData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch badges');
      } finally {
        setLoading(false);
      }
    };

    if (lastClaimableTimestamp) {
      fetchBadges();
    } else {
      fetchBadges();
    }
  }, [user, lastClaimableTimestamp]);

  useEffect(() => {
    const updateFirstClaim = async () => {
      if (!user || !badgeData || badgeData.firstClaim || historyLoading) return;
      
      if (events.length > 0) {
        setTotalClaims(events.length);
        try {
          const response = await fetch('/api/badges/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user,
              firstClaim: true
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to update first claim status');
          }

          const updatedBadges = await response.json();
          console.log("NEWBADGE: updatedBadges: ", updatedBadges);
          setBadgeData(updatedBadges);
        } catch (err) {
          console.error('Error updating first claim:', err);
        }
      }
    };

    if (badgeData && !badgeData?.firstClaim) {
      setNewBadges(prev => prev.includes("FirstClaim") ? prev : [...prev, "FirstClaim"]);
      updateFirstClaim(); 
      console.log("NEWBADGE: first claim updated now")
    } else { console.log("NEWBADGE: first claim already updated") }
  }, [user, badgeData, events, historyLoading]);
  
  useEffect(() => {
    // if (badgeData?.firstClaim === false) {
    //   setNewBadges(prev => prev.includes("FirstClaim") ? prev : [...prev, "FirstClaim"]);
    // }
    // if (badgeData?.claimStreak === 3) {
    //   setNewBadges(prev => prev.includes("ClaimStreak") ? prev : [...prev, "ClaimStreak"]);
    // }
    if (badgeData?.badgeThreeStreak === false && badgeData?.claimStreak === 3) {
      setNewBadges(prev => prev.includes("ClaimStreak") ? prev : [...prev, "ClaimStreak"]);
    }
    if (badgeData?.badgeEightyPercentile === false && userPercentile && userPercentile <= 20 ) {
      setNewBadges(prev => prev.includes("80thPercentile") ? prev : [...prev, "80thPercentile"]);
    }
  }, [badgeData, events, userPercentile]);


//   function checkRanking() {}

  return {
    badgeData,
    loading,
    error,
    isFirstClaim: badgeData?.firstClaim ?? false,
    claimStreak: badgeData?.claimStreak ?? 0,
    badgeThreeStreak: badgeData?.badgeThreeStreak ?? false,
    badgeEightyPercentile: badgeData?.badgeEightyPercentile ?? false,
    updateClaimStreak,
    totalClaims,
    newBadges,
    updateThreeClaimStreak,
    updateEightyPercentile  
  };
};
