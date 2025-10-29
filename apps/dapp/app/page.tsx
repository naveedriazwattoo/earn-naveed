"use client";
import LandingPage from './Landing/page';
import { useState } from 'react';
import SplashScreen from '@/components/Displays/SplashScreen';
import { AnimatePresence, motion } from 'framer-motion';
export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  const handleComplete = () => {
    setShowIntro(false);
  };
  return (
    <>
      <AnimatePresence>
        {showIntro && <SplashScreen onComplete={handleComplete} />}
      </AnimatePresence>
      {!showIntro && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <LandingPage />
        </motion.div>
      )}
    </>
  );
}
