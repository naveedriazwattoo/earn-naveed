"use client";

import { ArrowDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from 'react-i18next';
import { useData } from "@/contexts/dataContext";

const PastClaims = () => {
  const { pastClaimEvents: events } = useData();
  const { t } = useTranslation();

  const formatTimeAgo = (timestamp: number) => {
    const distance = formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: false });
    const [count, unit] = distance.split(' ');
    
    if (distance.includes('less than a minute')) {
      return t('claim.time.justNow');
    }
    
    const countNum = parseInt(count);
    const unitKey = unit.toLowerCase();
    
    if (unitKey.includes('minute')) {
      return t(countNum === 1 ? 'claim.time.minute' : 'claim.time.minutes', { count: countNum });
    } else if (unitKey.includes('hour')) {
      return t(countNum === 1 ? 'claim.time.hour' : 'claim.time.hours', { count: countNum });
    } else if (unitKey.includes('day')) {
      return t(countNum === 1 ? 'claim.time.day' : 'claim.time.days', { count: countNum });
    }
    
    return distance;
  };
  
  return (
    <div className="max-w-md mx-auto text-white w-full pb-[102px]">
      <h3 className="mx-[24px] text-lg font-semibold border-t-[0.5px] border-t-[#2C2C2E] mt-[16px] py-[16px]">
        {t('claim.claims')}
      </h3>
      <ul className="space-y-4 overflow-y-auto mx-[24px]">
        {Array.isArray(events) && events.length > 0 ? events.map((event) => (
          <li key={event.transactionHash} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center border border-gray-700">
                <ArrowDown className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm">
                <div className="text-gray-100 font-medium">{t('claim.received')}</div>
                <div className="text-gray-400 text-xs">
                  {formatTimeAgo(event.timestamp)}
                </div>
              </div>
            </div>
            <div className="text-right text-sm">
              <div className="font-semibold">+{event.amount.toFixed(1)} MINI</div>
              <div className="text-xs text-gray-400">+${0.00} USD</div>
            </div>
          </li>
        )) : (
          <li className="text-gray-400 text-sm text-center py-4">{t('claim.noClaims')}</li>
        )}
      </ul>
    </div>
  );
};

export default PastClaims;
