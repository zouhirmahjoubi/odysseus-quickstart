
import React from 'react';
import { motion } from 'framer-motion';

function NeoBrutalCard({ children, className = '', gradientBorder = null, selected = false }) {
  const borderClass = gradientBorder === 'top' ? 'border-t-[4px] border-t-[hsl(var(--primary))]' : 
                      gradientBorder === 'left' ? 'border-l-[4px] border-l-[hsl(var(--primary))]' : '';

  const bgClass = selected ? 'bg-[hsl(var(--secondary))]' : 'bg-[hsl(var(--card))]';

  return (
    <motion.div 
      className={`${bgClass} border-[3px] border-[hsl(var(--border))] shadow-[4px_4px_0px_0px_hsl(var(--border))] rounded-[var(--radius)] text-[hsl(var(--card-foreground))] p-[15px] md:p-[24px] flex flex-col transition-all duration-300 w-full max-w-full overflow-hidden ${borderClass} ${className}`}
      whileHover={{ 
        y: -4, 
        x: -4, 
        boxShadow: '8px 8px 0px 0px hsl(var(--secondary))',
        borderColor: 'hsl(var(--border))' 
      }}
    >
      {children}
    </motion.div>
  );
}

export default NeoBrutalCard;
