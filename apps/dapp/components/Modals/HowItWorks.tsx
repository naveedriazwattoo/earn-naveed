import React from "react";
import { IoCloseOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from 'react-i18next';

const HowItWorks = ({ onClose }: { onClose: (bool: boolean) => void }) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 max-w-3xl mx-auto px-6 bg-[#161616] text-white rounded-t-3xl shadow-lg z-50 w-full h-full overflow-y-auto"
      >
        <button 
          className="absolute top-[15px] right-[14px] rounded-full bg-[#2C2C2E] bg-opacity-10 size-8 flex items-center justify-center"
          onClick={() => onClose(true)}
        >
          <IoCloseOutline size={20} color="white"/>
        </button>
        <h2 className="text-[24px] font-bold mb-[36px] mt-[55px]">{t('howItWorks.title')}</h2>

        <div className="space-y-10">
          {/* Section 1 */}
          <div>
            <p className="text-[#AEAEB2] text-[19px] font-thin">
              {t('howItWorks.earn.description')}
            </p>
            <ul className="text-white text-[19px] font-light list-disc list-inside space-y-[15px] mt-[15px] mb-[50px]">
              <li>{t('howItWorks.earn.points.one')}</li>
              <li>{t('howItWorks.earn.points.min')}</li>
              <li>{t('howItWorks.earn.points.max')}</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h3 className="text-[15px] font-semibold mb-[15px]">{t('howItWorks.supply.title')}</h3>
            <p className="text-gray-300 font-thin mb-[50px] text-[19px]">
              {t('howItWorks.supply.description')}
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h3 className="text-[15px] font-semibold mb-[15px]">{t('howItWorks.claim.title')}</h3>
            <p className="text-gray-300 font-thin mb-[50px] text-[19px]">
              {t('howItWorks.claim.description')}
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h3 className="text-[15px] font-semibold mb-[15px]">{t('howItWorks.ranking.title')}</h3>
            <p className="text-gray-300 font-thin mb-[50px] text-[19px]">
              {t('howItWorks.ranking.description')}
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h3 className="text-[15px] font-semibold mb-[15px]">{t('howItWorks.tracking.title')}</h3>
            <p className="text-gray-300 font-thin mb-[50px] text-[19px]">
              {t('howItWorks.tracking.description')}
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h3 className="text-[15px] font-semibold mb-[15px]">{t('howItWorks.noId.title')}</h3>
            <p className="text-gray-300 font-thin mb-[50px] text-[19px]">
              {t('howItWorks.noId.description')}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HowItWorks;
