"use client";
import GlowingBackground from "../Layouts/DashBackground";
import FloatingMiniCoinBalance from "../Animated/FloatingMiniCoinBalance";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface PositionSummaryProps {
  balance: string;
  balanceLoading: boolean;
}

const PositionSummary = ({ balance, balanceLoading }: PositionSummaryProps) => {
  const { t } = useTranslation();

  return (
    <GlowingBackground>
      <div className="flex flex-col items-center justify-center gap-12 max-h-[402px]">
        <h1 className="text-white text-[17px] font-['PolySans'] font-ultralight text-center py-10">
          {t("claim.position")}
        </h1>
        {balance && !balanceLoading ? (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              duration: 0.5,
            }}
          >
            <FloatingMiniCoinBalance
              balance={balance}
              balanceLoading={balanceLoading}
            />
          </motion.div>
        ) : null}
      </div>
    </GlowingBackground>
  );
};

export default PositionSummary;
