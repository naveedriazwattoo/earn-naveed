"use client"
import { useEffect, useState } from 'react'
import Image from "next/image"
import { motion } from "framer-motion"
import { useTranslation } from 'react-i18next'
import AirStream from "../icons/airstream-y.svg"
import MiniTokenBalance from "../icons/floating-token/en/mini-token-yourbalance.svg"
import MiniTokenBalanceES from "../icons/floating-token/es/mini-token-tusaldo.svg"
interface FloatingMiniCoinBalanceProps {
  balance: string | null
  balanceLoading: boolean
}

const FloatingMiniCoinBalance = ({ balance, balanceLoading }: FloatingMiniCoinBalanceProps) => {
  const { i18n } = useTranslation();
  const [tokenImage, setTokenImage] = useState<string>('');
  
  useEffect(() => {
    const loadImage = async () => {
      try {
        const image = i18n.language === 'es' 
          ? MiniTokenBalanceES
          : MiniTokenBalance
        setTokenImage(image);
      } catch (error) {
        console.error('Error loading token image:', error);
      }
    };

    loadImage();
  }, [i18n.language]);

  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={{
        y: [0, -8, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="absolute w-[250px] h-[250px] z-10">
        <div className="relative w-full h-full flex items-center justify-center">
          {tokenImage && (
            <Image
              className=""
              src={tokenImage}
              alt="Mini Token Balance"
              width={250}
              height={250}
            />
          )}
          <h1 className="absolute z-20 text-white w-full h-full flex items-center justify-center font-['PolySans'] text-[90px] font-medium text-center">
            {balanceLoading ? '0' : (balance || '0')}
          </h1>
        </div>
      </div>
      <Image
        className="transform translate-y-7/12"
        src={AirStream}
        alt="Mini Token Balance"
        width={250}
        height={270}
      />
    </motion.div>
  )
}

export default FloatingMiniCoinBalance 