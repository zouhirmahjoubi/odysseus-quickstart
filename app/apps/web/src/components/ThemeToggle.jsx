
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext.jsx';

const ThemeToggle = () => {
  const { isCyberMode, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full neo-border neo-shadow flex items-center justify-center bg-[hsl(var(--card-bg))] text-[hsl(var(--text-primary))] absolute top-6 right-6 z-50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle Theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isCyberMode ? 180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="text-xl"
      >
        {isCyberMode ? '◑' : '◐'}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
