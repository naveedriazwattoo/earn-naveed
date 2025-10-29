"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useClaimableContext } from "@/contexts/claimableContext";
import { useTranslation } from 'react-i18next';

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000; 
// const TWO_MINUTES_MS = 2 * 60 * 1000;
const ZERO_MS = 0;

const TIMER = process.env.NEXT_PUBLIC_ENVIRONMENT === "production"? TWENTY_FOUR_HOURS_MS : ZERO_MS;

const SwipeCountdown = () => {
  const { userInfo, lastClaimableTimestamp } = useClaimableContext();
  const { t } = useTranslation();

  const claimableTimestamp = useMemo(() => {
    if (!userInfo) return 0;
    const lastClaimed = lastClaimableTimestamp ? new Date(lastClaimableTimestamp) : new Date(userInfo!.lastClaimedTimestamp!);
    const now = new Date();
    const timeDifference = now.getTime() - lastClaimed.getTime();
    if (timeDifference < TIMER) {
      return Math.floor((TIMER - timeDifference) / 1000); // Convert to seconds
    } else {
      return 0
    }
  }, [userInfo, lastClaimableTimestamp]);
  
  const [remainingTime, setRemainingTime] = useState(claimableTimestamp); 
  
  useEffect(() => {
    setRemainingTime(claimableTimestamp); // Reset countdown when claimableTimestamp changes
    
    const interval = setInterval(() => {
      setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [claimableTimestamp]);

  const formatTime = (seconds: number) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <span className="absolute bottom-0 inset-x-0 flex justify-center items-center w-full h-[100px] bg-black pb-[40px] pt-[19px] rounded-b-none">
      <div className="relative flex justify-center items-center w-full mx-[24px] px-4 h-[45px] rounded-full bg-[#111] text-white border border-neutral-800 shadow-lg backdrop-blur">
        <div className="absolute left-0 w-auto h-full flex items-center justify-center rounded-full bg-black mr-3">
          <ArrowRight className="w-auto h-full text-[#2C2C2E] p-2" />
        </div>
        <span className="font-normal tracking-tighter text-[19px] bg-gradient-to-br from-[#9B3CFF] to-[#2D67FF] text-transparent bg-clip-text">
          {t('claim.countdown', { time: formatTime(remainingTime) })}
        </span>
      </div>
    </span>
  );
};

export default SwipeCountdown;
