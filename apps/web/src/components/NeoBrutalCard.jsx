
import React from 'react';
import { motion } from 'framer-motion';

function NeoBrutalCard({ children, className = '', gradientBorder = null, selected = false }) {
  const borderClass = gradientBorder === 'top' ? 'border-t border-t-[#E73A5A]' : 
                      gradientBorder === 'left' ? 'border-l border-l-[#E73A5A]' : '';

  const bgClass = selected ? 'bg-[rgba(231, 58, 90,0.15)] border-[#E73A5A]' : 'bg-white/5 border-white/10';

  return (
    <motion.div 
      className={`border rounded-2xl backdrop-blur-md text-white p-[15px] md:p-[24px] flex flex-col transition-all duration-300 w-full max-w-full overflow-hidden ${bgClass} ${borderClass} ${className}`}
      whileHover={{ 
        y: -4, 
        boxShadow: '0 12px 40px rgba(231, 58, 90,0.25)',
        borderColor: 'rgba(231, 58, 90,0.4)' 
      }}
    >
      {children}
    </motion.div>
  );
}

export default NeoBrutalCard;
