"use client"
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import HowItWorks from "../Modals/HowItWorks";
import { ToggleLanguage } from "../Buttons/ToggleLanguage";
import { ChevronRight } from "lucide-react";
export const SeeHowItWorks = () => {
  const [showPopup, setShowPopup] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <AnimatePresence>
        {showPopup && <HowItWorks onClose={() => setShowPopup(false)} />}
      </AnimatePresence>
      <div className="h-[58px] flex items-center justify-between mx-3 py-3 border-b border-[#2C2C2E]">
        <button
          className="text-white text-[13px] font-medium flex items-center justify-center gap-1 font-polysans-median"
          onClick={() => setShowPopup(true)}
        >
          {t("howItWorks.title")}
        <ChevronRight className="w-4 h-4" />
        </button>
        <ToggleLanguage />
      </div>
    </>
  );
};