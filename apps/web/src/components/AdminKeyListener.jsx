
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AdminKeyListener = ({ children }) => {
  const navigate = useNavigate();
  const [keySequence, setKeySequence] = useState([]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      setKeySequence(prev => {
        const newSequence = [...prev, e.key].slice(-5);
        
        // Check for "admin" sequence
        if (newSequence.join('').toLowerCase() === 'admin') {
          navigate('/odysseus-admin-login');
          return [];
        }
        
        return newSequence;
      });
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [navigate]);

  return <>{children}</>;
};
