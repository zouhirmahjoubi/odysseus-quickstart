
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
    if (selected) return 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]';
    
    switch(variant) {
      case 'primary': return 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]';
      case 'secondary': return 'bg-[hsl(var(--card))] text-[hsl(var(--foreground))]';
      case 'accent': return 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]';
      case 'destructive': return 'bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))]';
      case 'muted': return 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]';
      default: return 'bg-[hsl(var(--card))] text-[hsl(var(--foreground))]';
    }
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${getStyles()} 
        border-[3px] border-[hsl(var(--border))] shadow-[4px_4px_0px_0px_hsl(var(--border))] rounded-[var(--radius)]
        px-[20px] py-[12px] font-bold text-center text-[14px] md:text-[16px]
        min-h-[44px] w-full sm:w-auto flex items-center justify-center gap-2
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--secondary-foreground))]
        ${className}
      `}
      whileHover={disabled ? {} : { 
        x: -2,
        y: -2,
        boxShadow: '6px 6px 0px 0px hsl(var(--border))'
      }}
      whileTap={disabled ? {} : { 
        x: 2,
        y: 2,
        boxShadow: '2px 2px 0px 0px hsl(var(--border))' 
      }}
    >
      {children}
    </motion.button>
  );
}

export default NeoBrutalButton;
