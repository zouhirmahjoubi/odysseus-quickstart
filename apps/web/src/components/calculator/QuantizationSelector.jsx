
import React from 'react';

const options = [
  { id: 0.25, label: 'GGUF Q4_K_M (Optimal Local)', desc: '4-bit, ~25% size' },
  { id: 0.5, label: 'GGUF Q8_0 (High Accuracy)', desc: '8-bit, ~50% size' },
  { id: 0.51, label: 'AWQ / EXL2 (GPU Native)', desc: 'GPU-optimized, ~50% size' },
  { id: 1.0, label: 'Unquantized FP16/BF16', desc: 'Lossless precision, 100% size' },
];

const QuantizationSelector = ({ value, onChange }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-black mb-4" id="quant-group">3. Quantization Precision</h2>
      <div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        role="radiogroup"
        aria-labelledby="quant-group"
      >
        {options.map((opt) => {
          const isSelected = value === opt.id;
          return (
            <button
              key={opt.id}
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(opt.id)}
              className={`border-neo shadow-neo p-4 cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_hsl(var(--secondary))] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
                isSelected ? 'bg-[hsl(var(--primary))] text-black' : 'bg-[hsl(var(--card))] text-[hsl(var(--foreground))]'
              }`}
            >
              <h3 className="font-bold text-lg">{opt.label}</h3>
              <p className={`text-sm font-medium mt-1 ${isSelected ? 'opacity-90' : 'text-[hsl(var(--muted-foreground))]'}`}>{opt.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuantizationSelector;
