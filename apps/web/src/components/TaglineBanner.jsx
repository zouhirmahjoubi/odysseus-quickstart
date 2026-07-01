import React from 'react';
import { motion } from 'framer-motion';

const TaglineBanner = () => {
  const text = "100% PRIVATE • ZERO DATA TRACKING, EVER • POWERED BY LOCAL OPEN-SOURCE AI";
  
  // We repeat the text enough times to guarantee it covers even ultra-wide desktop screens.
  // We use two identical halves and animate by -50% to create a flawless infinite loop.
  return (
    <div className="w-full bg-black/90 border-b border-white/10 flex items-center h-[40px] md:h-[45px] overflow-hidden whitespace-nowrap">
      <motion.div
        className="flex whitespace-nowrap w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
      >
        <div className="flex shrink-0">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-white/80 font-bold text-xs md:text-sm tracking-[2px] uppercase text-center leading-none mt-1 px-[20px] shrink-0">
              {text}
            </span>
          ))}
        </div>
        <div className="flex shrink-0">
          {[...Array(4)].map((_, i) => (
            <span key={`dup-${i}`} className="text-white/80 font-bold text-xs md:text-sm tracking-[2px] uppercase text-center leading-none mt-1 px-[20px] shrink-0">
              {text}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TaglineBanner;
