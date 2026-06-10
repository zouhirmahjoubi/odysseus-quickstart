
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isCyberMode, setIsCyberMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'cyber';
  });

  useEffect(() => {
    if (isCyberMode) {
      document.documentElement.classList.add('cyber-mode');
      localStorage.setItem('theme', 'cyber');
    } else {
      document.documentElement.classList.remove('cyber-mode');
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
