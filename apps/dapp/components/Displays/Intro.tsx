"use client"
import React from 'react'
import FloatingMiniCoin from '../Animated/FloatingMiniCoin'
import TodaysLeader from './TodaysLeader'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const Intro = () => {
  const { t } = useTranslation();
  
  return (
    <div className='relative flex flex-col items-center justify-end h-full min-h-[440px] xs:min-h-[550px] bg-black rounded-t-3xl overflow-hidden'>
      {/* Bottom Center Purple Glow */}
      <div className="absolute bottom-[-320px] left-3/7 transform -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(118,84,254,0.6)_15%,transparent_65%)] pointer-events-none" />
      <motion.div
        className='pb-[35px] xs:pb-[65px]'
        initial={{ x: "-140%" }}
        animate={{ x: "0%" }}
        transition={{ 
          type: "spring",
          stiffness: 100,
          damping: 20,
          duration: 0.5,
          delay: 0.5
        }}
      >
        <FloatingMiniCoin />
      </motion.div>

      <motion.span 
        className='flex flex-col items-center text-center justify-end mx-10 pb-[19px] xs:pb-[28px] z-10'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h4 className='z-10 text-white text-[20px] font-bold mb-[5px] xs:mb-[8px]'>{t('claim.title')}</h4>
        <p className='z-10 text-white text-[15px] mb-[12px] xs:mb-[18px] w-[302px]'>{t('claim.description')}</p>
        <TodaysLeader />
      </motion.span>
    </div>
  )
}

export default Intro