import { useState, useEffect, useMemo } from "react";
import { useClaimableContext } from "@/contexts/claimableContext";

export interface RankingItem {
  rank: number;
  user: string;
  tokensLastClaimed: number;
  lastClaimedTimestamp: Date;
}

export function useRankings() {
  const { user } = useClaimableContext();
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userRanking, setUserRanking] = useState<RankingItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate user percentile (top x%)
  const userPercentile: number | null = useMemo(() => {
    return userRanking && totalUsers > 0
      ? Math.round((userRanking.rank / totalUsers) * 100)
      : null;
  }, [userRanking, totalUsers]);

  useEffect(() => {
    // Fetch all rankings without user context
    const fetchAllRankings = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/rankings");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch rankings");
        }

        setRankings(data.rankings);
        setTotalUsers(data.totalUsers);
      } catch (err) {
        console.error("Error fetching rankings:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch rankings"
        );
      } finally {
        setLoading(false);
      }
    };

    // Fetch user-specific rankings
    const fetchUserRankings = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/rankings");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch rankings");
        }

        setRankings(data.rankings);
        setTotalUsers(data.totalUsers);

        // Find current user's ranking
        const currentUserRanking = data.rankings.find(
          (item: RankingItem) => item.user.toLowerCase() === user.toLowerCase()
        );

        setUserRanking(currentUserRanking || null);
      } catch (err) {
        console.error("Error fetching rankings:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch rankings"
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      console.log("fetching user rankings");
      fetchUserRankings();
    } else {
      console.log("fetching all rankings");
      fetchAllRankings();
    }
  }, [user]);

  return {
    rankings,
    totalUsers,
    userRanking,
    userPercentile,
    loading,
    error,
  };
}
