
import React from 'react';
import { motion } from 'framer-motion';

function NeoBrutalButton({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick, 
  type = 'button',
  disabled = false,
  selected = false
}) {
  const getStyles = () => {
    if (selected) return 'bg-[#E73A5A] text-white shadow-[0_0_20px_rgba(231, 58, 90,0.4)]';
    
    switch(variant) {
      case 'primary': return 'bg-[#E73A5A] text-white shadow-[0_0_20px_rgba(231, 58, 90,0.4)] border-none';
      case 'secondary': return 'bg-transparent border-[1.5px] border-[#E73A5A] text-[#E73A5A] hover:bg-[#E73A5A] hover:text-white';
      case 'accent': return 'bg-[#E73A5A] text-white shadow-[0_0_20px_rgba(231, 58, 90,0.4)]';
      case 'destructive': return 'bg-[#E73A5A] text-white';
      case 'muted': return 'bg-white/5 text-gray-400 hover:text-white border border-white/10';
      default: return 'bg-white/5 text-white border border-white/10';
    }
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${getStyles()} 
        rounded-full px-[24px] py-[12px] font-bold text-center text-[14px] md:text-[16px]
        min-h-[44px] w-full sm:w-auto flex items-center justify-center gap-2
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      whileHover={disabled ? {} : { 
        scale: 1.03,
        filter: 'brightness(1.12)'
      }}
      whileTap={disabled ? {} : { 
        scale: 0.98
      }}
    >
      {children}
    </motion.button>
  );
}

export default NeoBrutalButton;
