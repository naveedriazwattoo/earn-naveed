"use client"
import Image from 'next/image'
import { motion } from 'framer-motion'
import MiniTokenIcon from '../icons/floating-token/intro/intro-token.png'
import AirStream from '../icons/airstream-x.svg'

const FloatingMiniCoin = () => {
  return (
    <motion.div className='relative flex items-center justify-center'
      animate={{
        y: [0, -7, 0], 
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Top Left Blue Glow */}
      <div className="absolute right-[110px] -bottom-[-60px] w-[543px] h-[383px] rounded-full bg-[radial-gradient(circle_at_center,rgba(10,109,225,0.9),transparent_70%)] pointer-events-none" />
      <Image 
        className='absolute z-10'
        src={MiniTokenIcon} 
        alt='Intro Mini Token' 
        width={218} 
        height={233} 
      />
      <Image 
        className='transform -translate-x-[109px]'
        src={AirStream} 
        alt='airstream' 
        width={270} 
        height={283} 
      />
    </motion.div>
  )
}

export default FloatingMiniCoin