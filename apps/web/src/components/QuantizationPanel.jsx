
import React from 'react';

const quantizationOptions = [
  { 
    id: 'q4', 
    title: 'GGUF Q4_K_M (Optimal Local)', 
    subtitle: '4-bit, ~25% size' 
  },
  { 
    id: 'q8', 
    title: 'GGUF Q8_0 (High Accuracy)', 
    subtitle: '8-bit, ~50% size' 
  }
];

const QuantizationPanel = ({ selected, onChange }) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-black uppercase mb-6">3. Quantization Level</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quantizationOptions.map((option) => {
          const isActive = selected === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onChange(option.id)}
              className={`
                neo-border p-6 text-left transition-all duration-200 flex flex-col justify-center min-h-[120px]
                ${isActive 
                  ? 'bg-accent text-accent-foreground shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))] translate-x-0 translate-y-0' 
                  : 'bg-card text-card-foreground shadow-[6px_6px_0px_0px_hsl(var(--shadow-color))] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_hsl(var(--shadow-color))]'
                }
              `}
            >
              <span className="font-black text-xl mb-2">{option.title}</span>
              <span className={`font-bold ${isActive ? 'text-accent-foreground/80' : 'text-muted-foreground'}`}>
                {option.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuantizationPanel;
