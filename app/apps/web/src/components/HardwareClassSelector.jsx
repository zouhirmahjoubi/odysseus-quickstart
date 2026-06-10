
import React from 'react';

const hardwareOptions = [
  { id: 'rtx', title: 'NVIDIA RTX Series', subtitle: 'Consumer GPUs' },
  { id: 'datacenter', title: 'NVIDIA A100/H100/H200', subtitle: 'Data Center GPUs' },
  { id: 'amd', title: 'AMD Radeon/Instinct', subtitle: 'AMD Architecture' },
  { id: 'apple', title: 'Apple Mac Silicon', subtitle: 'Unified Memory' }
];

const HardwareClassSelector = ({ selected, onChange }) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-black uppercase mb-6">1. Select Hardware Class</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {hardwareOptions.map((option) => {
          const isActive = selected === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onChange(option.id)}
              className={`
                neo-border p-6 text-left transition-all duration-200 flex flex-col justify-between min-h-[120px]
                ${isActive 
                  ? 'bg-secondary text-secondary-foreground shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))] translate-x-0 translate-y-0' 
                  : 'bg-card text-card-foreground shadow-[6px_6px_0px_0px_hsl(var(--shadow-color))] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_hsl(var(--shadow-color))]'
                }
              `}
            >
              <span className="font-black text-lg leading-tight mb-2">{option.title}</span>
              <span className={`text-sm font-bold ${isActive ? 'text-secondary-foreground/80' : 'text-muted-foreground'}`}>
                {option.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HardwareClassSelector;
