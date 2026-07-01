
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isCyberMode, setIsCyberMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'cyber';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isCyberMode) {
      document.documentElement.classList.add('cyber-mode', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'cyber');
    } else {
      document.documentElement.classList.remove('cyber-mode', 'dark');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'yellow');
    }
  }, [isCyberMode]);

  const toggleTheme = () => {
    setIsCyberMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isCyberMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
