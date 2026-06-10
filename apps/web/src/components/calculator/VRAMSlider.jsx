
import React from 'react';

const presets = [12, 16, 24, 48, 80, 128];

const VRAMSlider = ({ value, onChange }) => {
  return (
    <div className="mb-8 p-6 bg-[hsl(var(--card))] border-neo shadow-neo">
      <div className="flex justify-between items-end mb-6">
        <label htmlFor="vram-slider" className="text-xl font-black block">2. Total Available VRAM</label>
        <div className="text-3xl font-black space-grotesk">{value} GB</div>
      </div>
      
      <input 
        id="vram-slider"
        type="range" 
        min="4" 
        max="192" 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-4 bg-[hsl(var(--muted))] border-neo appearance-none rounded-none accent-[hsl(var(--secondary))] mb-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4"
      />

      <div className="flex flex-wrap gap-2">
        {presets.map(preset => (
          <button
            key={preset}
            onClick={() => onChange(preset)}
            aria-pressed={value === preset}
            className={`px-4 py-2 border-neo font-bold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 hover:bg-[hsl(var(--secondary))] ${value === preset ? 'bg-[hsl(var(--secondary))] text-black' : 'bg-[hsl(var(--card))] text-[hsl(var(--foreground))]'}`}
          >
            {preset}GB
          </button>
        ))}
      </div>
    </div>
  );
};

export default VRAMSlider;
