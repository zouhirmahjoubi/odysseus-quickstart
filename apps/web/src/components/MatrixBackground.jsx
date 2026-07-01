import React, { useEffect, useRef } from 'react';

const MatrixBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let columns = [];
    const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:,.<>?';

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const columnCount = Math.floor(canvas.width / 10); // Column spacing: 10px (dense)
      
      // Initialize or adjust columns
      const newColumns = [];
      for (let i = 0; i < columnCount; i++) {
        if (columns[i]) {
          newColumns.push(columns[i]);
        } else {
          newColumns.push({
            x: i * 10,
            y: Math.random() * -canvas.height - 100, // start randomized offscreen
            speed: 5 + Math.random() * 4, // fast speed (5-9px per frame)
            trailLength: 12 + Math.floor(Math.random() * 16), // high density dramatic trails
          });
        }
      }
      columns = newColumns;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      // Determine theme background and character colors dynamically
      let bgColor = '#0B0B0C';
      let charColorRgb = '229, 142, 38'; // Default dark mode (Amber)
      
      const isDark = document.documentElement.classList.contains('dark') || document.documentElement.classList.contains('cyber-mode');
      if (isDark) {
        bgColor = '#0B0B0C';
        charColorRgb = '229, 142, 38';
      } else {
        bgColor = '#FBF8F3'; // Warm cream notebook canvas
        charColorRgb = '231, 58, 90'; // Pink-Red
      }

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = '10px monospace'; // Font size: 10px monospace (dense)

      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        
        // Update y position
        col.y += col.speed;

        // Draw the trail
        const headRow = Math.floor(col.y / 10);
        const trailLen = col.trailLength;

        for (let j = 0; j < trailLen; j++) {
          const row = headRow - j;
          if (row < 0) continue;

          const charY = row * 10;
          if (charY > canvas.height) continue;

          // Pseudo-random character based on grid coordinates mutating fast
          const seed = Math.floor(Date.now() / 70) + row * 17 + col.x * 23;
          const charIndex = Math.abs(seed) % CHARS.length;
          const char = CHARS[charIndex];

          let opacity;
          if (j === 0) {
            // Leading character brighter
            opacity = 0.80;
          } else {
            // Trailing characters fade out
            opacity = 0.25 * (1 - j / trailLen);
          }

          ctx.fillStyle = `rgba(${charColorRgb}, ${opacity})`;
          ctx.fillText(char, col.x, charY);
        }

        // Each column resets randomly when it reaches bottom
        if (col.y > canvas.height + 150 || (col.y > canvas.height && Math.random() > 0.975)) {
          col.y = -Math.random() * 100 - 50;
          col.speed = 5 + Math.random() * 4;
          col.trailLength = 12 + Math.floor(Math.random() * 16);
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden select-none">
      {/* 1. Canvas Layer (Matrix Effect) */}
      <canvas
        ref={canvasRef}
        id="matrix-canvas"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />
      
      {/* 2. Blueprint Grid Layer */}
      <div 
        className="blueprint-grid absolute inset-0 z-[2] opacity-80"
        style={{ pointerEvents: 'none' }}
      />
      
      {/* 3. Aurora / Ambient Mesh Gradient Blobs */}
      <div 
        className="absolute left-[-10%] top-[10%] w-[45vw] h-[45vw] rounded-full filter blur-[120px] transition-colors duration-500 z-[0] opacity-40 md:opacity-30"
        style={{
          background: 'var(--color-accent)',
        }}
      />
      <div 
        className="absolute right-[-10%] top-[30%] w-[45vw] h-[45vw] rounded-full filter blur-[120px] transition-colors duration-500 z-[0] opacity-35 md:opacity-25"
        style={{
          background: 'var(--color-bg-mesh-right, #00A896)',
        }}
      />
    </div>
  );
};

export default MatrixBackground;

