import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useRankings, RankingItem } from "@/hooks/useRankings";
import { useClaimHistory } from "@/hooks/useClaimHistory";
import { useBadges } from "@/hooks/useBadges";

type ClaimEvent = {
    transactionHash: string;
    blockNumber: number;
    timestamp: number;
    amount: number;
    from: string;
    to: string;
    status: string;
    gasUsed: number | null;
    gasPrice: number | null;
  }
interface DataContextType {
  rankings: RankingItem[];
  totalUsers: number;
  userRanking: RankingItem | null;
  userPercentile: number;
  loading: boolean;
  setLastClaimTxn: (lastClaimTxn: ClaimEvent | null) => void;
  lastClaimTxn: ClaimEvent | null;
  pastClaimEvents: ClaimEvent[];
  badgeList: string[];
  newBadgeList: string[];
  isFirstClaim: boolean | null;
}

export const DataContext = createContext<DataContextType>({
  rankings: [],
  totalUsers: 0,
  userRanking: null,
  userPercentile: 0,
  loading: false,
  lastClaimTxn: null,
  setLastClaimTxn: () => {},
  pastClaimEvents: [],
  badgeList: [],
  newBadgeList: [],
  isFirstClaim: null,
});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { rankings, totalUsers, userRanking, userPercentile, loading } = useRankings();
  const [lastClaimTxn, setLastClaimTxn] = useState<ClaimEvent | null>(null);
  const { events: pastEvents } = useClaimHistory();
  const [newBadgeList, setNewBadgeList] = useState<string[]>([]);

  const events = useMemo(() => {
    if (!lastClaimTxn) return pastEvents;
    return [...pastEvents, lastClaimTxn].sort((a, b) => {
      if (!a || !b) return 0;
      return b.timestamp - a.timestamp;
    });
  }, [pastEvents, lastClaimTxn]);

  const {
    claimStreak,
    totalClaims,
    isFirstClaim,
    badgeThreeStreak,
    badgeEightyPercentile,
    updateThreeClaimStreak,
    updateEightyPercentile
  } = useBadges();

  const badgeList = useMemo(() => {
    const badges: string[] = [];
    if (isFirstClaim) {
      badges.push("FirstClaim");
    }
    if (claimStreak >= 3 || badgeThreeStreak) {
      badges.push("ClaimStreak");
    }
    if ((userPercentile && userPercentile >= 80) || badgeEightyPercentile) {
      badges.push("80thPercentile");
    }
    return badges;
  }, [
    isFirstClaim,
    claimStreak,
    userPercentile,
    badgeThreeStreak,
    badgeEightyPercentile,
  ]);

  useEffect(() => {
    if (isFirstClaim === false && claimStreak === 1) {
      console.log("isFirstClaim in useEffect: ", isFirstClaim);
      setNewBadgeList(prev => prev.includes("FirstClaim") ? prev : [...prev, "FirstClaim"]);
    }
    if (claimStreak === 3 && badgeThreeStreak === false) {
      setNewBadgeList(prev => prev.includes("ClaimStreak") ? prev : [...prev, "ClaimStreak"]);
      updateThreeClaimStreak();
    }
    if (
      userPercentile &&
      userPercentile <= 20 &&
      badgeEightyPercentile === false
    ) {
        setNewBadgeList(prev => prev.includes("80thPercentile") ? prev : [...prev, "80thPercentile"]);
        updateEightyPercentile();
    }
  }, [
    claimStreak,
    badgeThreeStreak,
    userPercentile,
    badgeEightyPercentile,
    updateThreeClaimStreak,
    updateEightyPercentile,
    isFirstClaim,
    totalClaims,
  ]);

  const value = {
    rankings: rankings || [],
    totalUsers: totalUsers || 0,
    userRanking: userRanking || null,
    userPercentile: userPercentile || 0,
    loading: loading || false,
    lastClaimTxn: lastClaimTxn || null,
    setLastClaimTxn: setLastClaimTxn,
    pastClaimEvents: events || [],
    badgeList: badgeList || [],
    newBadgeList: newBadgeList || [],
    isFirstClaim: isFirstClaim || false,
  };

  return <DataContext.Provider value={{ ...value }}>{children}</DataContext.Provider>;
};

export const useData = () => {
  return useContext(DataContext);
};
