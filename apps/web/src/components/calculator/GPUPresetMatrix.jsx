
import React from 'react';
import { Monitor, Server, Cpu, Laptop } from 'lucide-react';

const options = [
  { id: 'NVIDIA RTX Series', icon: <Monitor size={24} />, desc: 'Consumer GPUs' },
  { id: 'NVIDIA A100/H100/H200', icon: <Server size={24} />, desc: 'Enterprise GPUs' },
  { id: 'AMD Radeon/Instinct', icon: <Cpu size={24} />, desc: 'AMD Hardware' },
  { id: 'Apple Mac Silicon', icon: <Laptop size={24} />, desc: 'Unified Memory' },
];

const GPUPresetMatrix = ({ value, onChange }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-black mb-4" id="gpu-preset-group">1. Select GPU Architecture</h2>
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        role="radiogroup"
        aria-labelledby="gpu-preset-group"
      >
        {options.map((opt) => {
          const isSelected = value === opt.id;
          return (
            <button
              key={opt.id}
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(opt.id)}
              className={`border-neo shadow-neo p-4 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_hsl(var(--secondary))] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
                isSelected ? 'bg-[hsl(var(--secondary))] text-black' : 'bg-[hsl(var(--card))] text-[hsl(var(--foreground))]'
              }`}
            >
              <div className="mb-2">{opt.icon}</div>
              <h3 className="font-bold text-lg leading-tight">{opt.id}</h3>
              <p className={`text-sm font-medium mt-1 ${isSelected ? 'opacity-90' : 'text-[hsl(var(--muted-foreground))]'}`}>{opt.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GPUPresetMatrix;
