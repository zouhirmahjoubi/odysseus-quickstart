
import React from 'react';
import { motion } from 'framer-motion';

function NavPill({ label, icon: Icon, isActive, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        w-full px-4 py-3 rounded-full border-brutal text-left font-medium
        transition-all duration-200 flex items-center gap-3
        ${isActive 
          ? 'bg-[#BBF7D0] text-black' 
          : 'bg-white text-black hover:bg-[#BBF7D0]'
        }
      `}
      style={{
        boxShadow: '4px 4px 0px 0px #000000'
      }}
      whileHover={{
        x: -2,
        y: -2,
        boxShadow: '6px 6px 0px 0px #000000'
      }}
      whileTap={{
        scale: 0.98
      }}
    >
      {Icon && <Icon size={20} />}
      <span>{label}</span>
    </motion.button>
  );
}

export default NavPill;
