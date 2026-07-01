import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SHAPES = ['square', 'circle', 'star'];
const COLORS = [
  '#fe6e00', // Deep Orange
  '#ffeb3b', // Neobrutalist Yellow
  '#ff627e', // Rose/Pink
  '#5cd1a5', // Mint Green
  '#6cc4f4'  // Light Blue
];

const ClickEffect = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const handleClick = (e) => {
      // Create a burst of 6 particles at the cursor location
      const newParticles = Array.from({ length: 6 }).map((_, i) => {
        const angle = (i * 60 + Math.random() * 20) * (Math.PI / 180);
        const distance = 40 + Math.random() * 40;
        return {
          id: `${Date.now()}-${i}-${Math.random()}`,
          x: e.clientX,
          y: e.clientY,
          tx: Math.cos(angle) * distance,
          ty: Math.sin(angle) * distance,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
          size: 8 + Math.random() * 10,
          rotation: Math.random() * 360,
          rotSpeed: -180 + Math.random() * 360
        };
      });

      setParticles((prev) => [...prev, ...newParticles]);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // Periodically clean up old particles to keep memory low
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        setParticles((prev) => prev.slice(6));
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [particles]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ 
              opacity: 1, 
              scale: 0,
              x: p.x - p.size / 2, 
              y: p.y - p.size / 2,
              rotate: p.rotation
            }}
            animate={{ 
              opacity: [1, 1, 0], 
              scale: [0.3, 1.2, 0.4],
              x: p.x + p.tx - p.size / 2,
              y: p.y + p.ty - p.size / 2,
              rotate: p.rotation + p.rotSpeed
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: p.size,
              height: p.size,
              backgroundColor: p.shape !== 'star' ? p.color : 'transparent',
              border: p.shape !== 'star' ? '2.5px solid black' : 'none',
              borderRadius: p.shape === 'circle' ? '50%' : '2px',
              boxShadow: p.shape !== 'star' ? '1.5px 1.5px 0px 0px black' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {p.shape === 'star' && (
              <span 
                style={{ 
                  fontSize: `${p.size + 4}px`, 
                  lineHeight: 1, 
                  color: p.color,
                  textShadow: '1.5px 1.5px 0px black'
                }}
              >
                ★
              </span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ClickEffect;
