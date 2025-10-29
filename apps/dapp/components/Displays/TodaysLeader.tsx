"use client";
import Image from "next/image";
import MiniTokenIcon from "../icons/mini-logo.png";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { useData } from "@/contexts/dataContext";

const TodaysLeader = () => {
  const { rankings } = useData();
  const { t } = useTranslation();

  const useMemoizedRankings = useMemo(() => {
    return rankings && rankings.length > 0
      ? `${rankings[0].tokensLastClaimed}`
      : "0";
  }, [rankings]);
  return (
    <div className="relative p-[1px] rounded-full bg-gradient-to-br from-[#9B3CFF] to-[#2D67FF]">
      <motion.div
        className="absolute w-full h-full bg-black/20 z-20 rounded-full"
        animate={{
          opacity: [1, 0.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className="relative flex items-center justify-between w-fit pl-4 pr-2 py-2 gap-2 rounded-full bg-black">
        <div className="absolute bottom-[-320px] left-3/7 transform -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(118,84,254,0.6)_25%,transparent_75%)] pointer-events-none" />
        <div className="absolute left-0 top-0 w-full h-full bg-black/20 z-10 rounded-full" />
        <p className="text-[13px] text-white z-10">{t("claim.leader")}</p>
        <p className="text-[17px] font-bold text-white z-10">
          {`${useMemoizedRankings} MINI`}
        </p>

        <Image
          src={MiniTokenIcon}
          alt="MINI Token"
          width={32}
          height={32}
          className="z-10"
        />
      </div>
    </div>
  );
};

export default TodaysLeader;
