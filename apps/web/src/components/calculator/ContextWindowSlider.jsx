
import React from 'react';

const presets = [
  { label: '2k', value: 2048 },
  { label: '8k', value: 8192 },
  { label: '32k', value: 32768 },
  { label: '64k', value: 65536 },
  { label: '128k', value: 131072 }
];

const ContextWindowSlider = ({ value, onChange }) => {
  return (
    <div className="mb-8 p-6 bg-[hsl(var(--card-bg))] border-neo shadow-neo">
      <div className="flex justify-between items-end mb-6">
        <label htmlFor="context-slider" className="text-xl font-black block">4. Target Context Window</label>
        <div className="text-3xl font-black space-grotesk">{value.toLocaleString()} <span className="text-lg">Tokens</span></div>
      </div>
      
      <input 
        id="context-slider"
        type="range" 
        min="2048" 
        max="131072" 
        step="2048"
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-4 bg-gray-200 border-neo appearance-none rounded-none accent-[hsl(var(--sidebar-bg))] mb-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4"
      />

      <div className="flex flex-wrap gap-2">
        {presets.map(preset => (
          <button
            key={preset.value}
            onClick={() => onChange(preset.value)}
            aria-pressed={value === preset.value}
            className={`px-4 py-2 border-neo font-bold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 hover:bg-[hsl(var(--sidebar-bg))] ${value === preset.value ? 'bg-[hsl(var(--sidebar-bg))]' : 'bg-[hsl(var(--background))]'}`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContextWindowSlider;
