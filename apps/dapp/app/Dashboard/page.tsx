"use client";
import Badges from "@/components/Displays/Badges";
import PostionSummary from "@/components/Displays/PositionSummary";
import PastClaims from "@/components/Displays/PastClaims";
import PageLayout from "@/components/Layouts/PageLayout";
import SwipeCountdown from "@/components/Swipe/Countdown";
import BadgeDrawer from "@/components/Modals/BadgeDrawer";
import { useState, useRef, useEffect, useMemo } from "react";
import TopEarner from "@/components/Modals/BadgeInfo/TopEarner";
import FirstClaim from "@/components/Modals/BadgeInfo/FirstClaim";
import ThreeDayStreak from "@/components/Modals/BadgeInfo/ThreeDayStreak";
import { useMiniBalance } from "@/hooks/useMiniBalance";
import { useData } from "@/contexts/dataContext";
import { motion } from "framer-motion";
import { useBadges } from "@/hooks/useBadges";

const DashboardPage = () => {
  const [showBadgeTab, setShowBadgeTab] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);
  const badgesRef = useRef<HTMLDivElement>(null);
  const { balance, isLoading: balanceLoading } = useMiniBalance();
  const { badgeList: tempBadgeList, newBadgeList, isFirstClaim } = useData();
  const { newBadges } = useBadges();

  console.log("newBadges: ", newBadges);
  console.log("newBadgeList: ", newBadgeList);
  const updatedNewBadgeList = useMemo(() => {
    console.log("isFirstClaim: ", isFirstClaim);
    if (isFirstClaim === false) {
      return  newBadges.includes("FirstClaim") ? newBadges : [...newBadges, "FirstClaim"];
    } else {
      return newBadges;
    }
  }, [newBadges, isFirstClaim]);

  const badgeList = useMemo(() => {
    return updatedNewBadgeList.includes("FirstClaim") && !tempBadgeList.includes("FirstClaim") ? [...tempBadgeList, "FirstClaim"]: tempBadgeList;
  }, [tempBadgeList, updatedNewBadgeList]);
  console.log("badgeList: ", badgeList);

  console.log("updatedNewBadgeList: ", updatedNewBadgeList);

  const handleNextBadge = () => {
    setCurrentBadgeIndex((prev) => prev + 1);
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    if (isDrawerOpen === false && currentBadgeIndex < updatedNewBadgeList.length ) {
      console.log("currentBadgeIndex: OPEN ", currentBadgeIndex);
      setTimeout(() => {
        setIsDrawerOpen(true);
      }, 1000);
    }
  }, [updatedNewBadgeList, currentBadgeIndex, badgeList, isDrawerOpen]);

  useEffect(() => {
    const currentRef = badgesRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowBadgeTab(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: "-184px 0px 0px 0px",
      }
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <PageLayout visible={true}>
        {/* {loading || balanceLoading || !balance ? <FullPageLoading message={t('common.loading')} /> : null} */}
        <div className="relative flex flex-col min-h-screen rounded-t-3xl">
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <PostionSummary
              balance={balance ?? "0"}
              balanceLoading={balanceLoading}
            />
            <div ref={badgesRef}>
              <Badges badgeList={badgeList} />
            </div>
            {
              <Badges
                isSticky={showBadgeTab}
                hidden={!showBadgeTab}
                badgeList={badgeList}
              />
            }
            <PastClaims />
          </div>
          <div className="sticky bottom-0">
            <SwipeCountdown />
          </div>
          {updatedNewBadgeList.length > 0 && (
            <BadgeDrawer isOpen={isDrawerOpen}>
              {updatedNewBadgeList[currentBadgeIndex] === "FirstClaim" && (
                <FirstClaim />
              )}
              {updatedNewBadgeList[currentBadgeIndex] === "ClaimStreak" && (
                <ThreeDayStreak />
              )}
              {updatedNewBadgeList[currentBadgeIndex] === "80thPercentile" && (
                <TopEarner percent={80} />
              )}
              <button
                onClick={handleNextBadge}
                className="mt-6 p-[1px] rounded-full bg-gradient-to-br from-[#7D0BF4] via-[#1A26E7] to-[#0D4BEF]"
              >
                <div className="px-[15px] py-2 rounded-full bg-[#161616] text-white">
                  {"Dismiss"}
                </div>
              </button>
            </BadgeDrawer>
          )}
        </div>
      </PageLayout>
    </motion.div>
  );
};

export default DashboardPage;
