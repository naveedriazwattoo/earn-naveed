"use client"
import { motion, AnimatePresence } from 'framer-motion'

interface BadgeDrawerProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const BadgeDrawer = ({ isOpen, children }: BadgeDrawerProps) => {
  const variants = {
    enter: {
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
        delay: 1
      }
    },
    exit: {
      y: "100%",
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate="enter"
          exit="exit"
          variants={variants}
          className="fixed bottom-0 left-0 right-0 h-1/2 bg-[#161616] text-white flex flex-col items-center justify-center rounded-t-3xl rounded-b-none shadow-lg px-6 z-50"
        >
          <div className="absolute top-4 w-[50px] h-[3px] rounded-full bg-[#3A3A3C]" />
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BadgeDrawer;
