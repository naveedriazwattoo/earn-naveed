"use client"
import { useState, useEffect, useMemo } from 'react'
import Image from "next/image";
import InfoIcon from "../icons/info-icon.svg";
import TopEarnerBadge from "../icons/badges/4th-top-earner-badge.svg";
import HowItWorks from '../Modals/HowItWorks'
import { useTranslation } from 'react-i18next';
import MiniTokenBalance from "../icons/floating-token/en/mini-token-yoursharetoday.svg"
import MiniTokenBalanceES from "../icons/floating-token/es/mini-token-tupartehoy.svg"
import PurpleOrb from "../icons/orb/orb-purple.svg"
import { useData } from '@/contexts/dataContext';
interface ClaimableTokenDisplayProps {
  claimableTokens: number | null
}

const ClaimableTokenDisplay = ({ claimableTokens }: ClaimableTokenDisplayProps) => {
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const { userPercentile } = useData();

  console.log("userPercentile: ", userPercentile);
  const { t, i18n } = useTranslation();
  const [tokenImage, setTokenImage] = useState<string>('');
  
  // Get the current language
  const currentLang = i18n.language;
  
  // Helper function to get ordinal suffix
  const getOrdinalSuffix = (n: number): string => {
    const j = n % 10;
    const k = n % 100;
    if (j === 1 && k !== 11) return 'ST';
    if (j === 2 && k !== 12) return 'ND';
    if (j === 3 && k !== 13) return 'RD';
    return 'TH';
  };
  
  useEffect(() => {
    const loadImage = async () => {
      try {
        const image = currentLang === 'es' 
          ? MiniTokenBalanceES
          : MiniTokenBalance
        setTokenImage(image);
      } catch (error) {
        console.error('Error loading token image:', error);
      }
    };

    loadImage();
  }, [currentLang]);
  
  // Default to 0 if no percentile available yet
  const displayPercentile = useMemo(() => {
    return userPercentile? userPercentile > 99 ? 99 : userPercentile : 99;
  }, [userPercentile]);

  const ordinalSuffix = useMemo(() => {
    return getOrdinalSuffix(displayPercentile === 0 ? 99 : displayPercentile);
  }, [displayPercentile]);

  return (
    <>
      <div className="relative bg-black w-full h-full flex flex-col gap-10 rounded-t-3xl justify-end">
        <span className="absolute top-0 left-0 w-full flex items-center justify-end">
   
          <button
              className="p-4"
              onClick={() => setShowHowItWorks(true)}
              >
              <Image src={InfoIcon} alt="info" width={35} height={35} />
          </button>
        </span>

        <div className="flex flex-col items-center justify-end h-full mt-[60px] xs:mt-[80px] pb-[125px] xxs:pb-[145px] xs:pb-[175px]">
          <span className="relative flex items-center h-full justify-center">
            <div className= "absolute z-10 w-[250px] h-[250px]">
              <div className="absolute z-30 text-white font-['PolySans'] flex items-center justify-center text-[90px] w-full h-full">{claimableTokens}</div>
              {tokenImage && (
                <Image 
                  src={tokenImage} 
                  className="absolute z-10" 
                  alt="mini token" 
                  width={250} 
                  height={250} 
                />
              )}
            </div>

            <div className="">
              <Image src={PurpleOrb} alt="orb" width={438} height={302} />
            </div>
          </span>
          <span className="flex flex-col items-center justify-center mx-10 gap-[2px] xs:gap-1">
            <div className="relative flex items-center justify-center">
              <p className="absolute z-10 font-['PolySans'] bg-[#161616] text-[15px] font-medium text-white rounded-full p-4">
                <span className="absolute inset-0 flex items-center justify-center top-1 text-[24px]">
                {`${displayPercentile < 2 ? 1 : displayPercentile}`}
                  <span className="text-[8px] font-medium text-white h-full pt-[3px]">
                    {ordinalSuffix}
                  </span>
                </span>
              </p>
              <Image src={TopEarnerBadge} alt="top earner" width={80} height={80} />
            </div>
            <h4 className="text-center font-['PolySans'] font-medium text-[15px] text-white">
              {t('claim.percentile', { percent: `${displayPercentile < 2 ? 1 : displayPercentile}${ordinalSuffix}` })}
            </h4>
            <p className="text-center font-light text-[13px] xs:text-[15px] text-[#AEAEB2] ">
              {t('claim.activity', { percent: displayPercentile === 0 ? 1 : displayPercentile })}
            </p>
          </span>
        </div>
      </div>
      {showHowItWorks && <HowItWorks onClose={() => setShowHowItWorks(false)} />}
    </>
  );
}

export default ClaimableTokenDisplay