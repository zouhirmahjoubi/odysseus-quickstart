
import React, { useState } from 'react';

const QuantizationPrecision = () => {
  const [selected, setSelected] = useState('GGUF Q4_K_M');

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-black mb-6">Quantization Precision</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Option 1: Q4 */}
        <div 
          onClick={() => setSelected('GGUF Q4_K_M')}
          className={`
            p-8 neo-border cursor-pointer transition-all duration-300
            ${selected === 'GGUF Q4_K_M' 
              ? 'bg-accent shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] scale-[1.02]' 
              : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] opacity-70 hover:opacity-100 hover:scale-[1.01]'}
          `}
        >
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-2xl font-black">GGUF Q4_K_M</h4>
            {selected === 'GGUF Q4_K_M' && (
              <span className="bg-white text-black text-xs font-bold px-2 py-1 neo-border uppercase tracking-widest">Active</span>
            )}
          </div>
          <p className="font-bold text-sm mb-4 leading-relaxed">
            Optimal balance of speed, size, and perplexity. Recommended for most consumer hardware and 24GB VRAM targets.
          </p>
          <ul className="space-y-2 font-medium text-sm">
            <li className="flex items-center gap-2"><span className="w-2 h-2 bg-black"></span> Medium compression</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 bg-black"></span> Minor perplexity loss</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 bg-black"></span> Fast inference</li>
          </ul>
        </div>

        {/* Option 2: Q8 */}
        <div 
          onClick={() => setSelected('GGUF Q8_0')}
          className={`
            p-8 neo-border cursor-pointer transition-all duration-300
            ${selected === 'GGUF Q8_0' 
              ? 'bg-primary shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] scale-[1.02]' 
              : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] opacity-70 hover:opacity-100 hover:scale-[1.01]'}
          `}
        >
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-2xl font-black">GGUF Q8_0</h4>
            {selected === 'GGUF Q8_0' && (
              <span className="bg-white text-black text-xs font-bold px-2 py-1 neo-border uppercase tracking-widest">Active</span>
            )}
          </div>
          <p className="font-bold text-sm mb-4 leading-relaxed">
            Near-unquantized quality with moderate memory savings. Best for strict precision requirements on enterprise setups.
          </p>
          <ul className="space-y-2 font-medium text-sm">
            <li className="flex items-center gap-2"><span className="w-2 h-2 bg-black"></span> Low compression</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 bg-black"></span> Negligible perplexity loss</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 bg-black"></span> Requires high VRAM</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default QuantizationPrecision;
