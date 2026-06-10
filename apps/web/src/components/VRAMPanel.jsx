
import React from 'react';

const vramPresets = [12, 16, 24, 48, 80, 128];

const VRAMPanel = ({ value, onChange }) => {
  return (
    <div className="neo-card bg-card mb-12">
      <h2 className="text-2xl font-black uppercase mb-8">2. Total Available VRAM</h2>
      
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1 w-full">
          {/* Slider */}
          <div className="mb-8 relative">
            <input 
              type="range" 
              min="12" 
              max="128" 
              step="1"
              value={value}
              onChange={(e) => onChange(parseInt(e.target.value, 10))}
              className="w-full h-4 bg-card neo-border appearance-none cursor-pointer accent-accent"
              style={{
                background: `linear-gradient(to right, hsl(var(--accent)) ${(value - 12) / (128 - 12) * 100}%, hsl(var(--card)) ${(value - 12) / (128 - 12) * 100}%)`
              }}
            />
            <style>{`
              input[type=range]::-webkit-slider-thumb {
                appearance: none;
                width: 24px;
                height: 32px;
                background: hsl(var(--accent));
                border: 4px solid hsl(var(--border));
                cursor: pointer;
                box-shadow: 2px 2px 0px 0px hsl(var(--shadow-color));
              }
              input[type=range]::-moz-range-thumb {
                appearance: none;
                width: 24px;
                height: 32px;
                background: hsl(var(--accent));
                border: 4px solid hsl(var(--border));
                cursor: pointer;
                box-shadow: 2px 2px 0px 0px hsl(var(--shadow-color));
              }
            `}</style>
          </div>

          {/* Quick Toggles */}
          <div className="flex flex-wrap gap-3">
            {vramPresets.map((preset) => {
              const isActive = value === preset;
              return (
                <button
                  key={preset}
                  onClick={() => onChange(preset)}
                  className={`
                    neo-border px-4 py-2 font-black text-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-secondary text-secondary-foreground shadow-[2px_2px_0px_0px_hsl(var(--shadow-color))] translate-x-0.5 translate-y-0.5' 
                      : 'bg-card text-card-foreground shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_hsl(var(--shadow-color))]'
                    }
                  `}
                >
                  {preset}GB
                </button>
              );
            })}
          </div>
        </div>

        {/* Massive Display */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-end min-w-[200px]">
          <div className="text-center">
            <span className="text-7xl md:text-8xl font-black tracking-tighter">{value}</span>
            <span className="text-3xl font-black ml-2">GB</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VRAMPanel;
