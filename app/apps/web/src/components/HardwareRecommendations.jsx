
import React, { useState } from 'react';
import { GPUS } from '@/data/gpuDatabase.js';
import { Cpu, DollarSign, Zap } from 'lucide-react';

const HardwareRecommendations = () => {
  const [useCase, setUseCase] = useState('Chat');

  const getRecommendations = () => {
    let sorted = [...GPUS];
    if (useCase === 'Research' || useCase === 'Image Generation') {
      sorted.sort((a, b) => b.vram - a.vram);
    } else {
      sorted.sort((a, b) => b.valueScore - a.valueScore);
    }
    return sorted.slice(0, 3);
  };

  const recs = getRecommendations();

  return (
    <div className="neo-card mt-8">
      <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
        <Cpu className="text-[hsl(var(--primary))]" /> What GPU should I buy?
      </h2>
      
      <div className="mb-6">
        <label className="block font-bold mb-2">Primary Use Case</label>
        <select 
          className="neo-input w-full max-w-md font-bold"
          value={useCase}
          onChange={(e) => setUseCase(e.target.value)}
        >
          <option>Chat</option>
          <option>Coding</option>
          <option>Research</option>
          <option>Image Generation</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recs.map((gpu, idx) => (
          <div key={gpu.id} className="neo-border p-4 bg-[hsl(var(--bg-primary))] relative">
            {idx === 0 && (
              <div className="absolute -top-3 -right-3 bg-[hsl(var(--primary))] text-black font-bold px-2 py-1 neo-border text-xs transform rotate-3">
                Top Pick
              </div>
            )}
            <h3 className="font-black text-lg mb-2">{gpu.name}</h3>
            <div className="space-y-2 text-sm font-medium">
              <div className="flex justify-between"><span>VRAM:</span> <strong>{gpu.vram} GB</strong></div>
              <div className="flex justify-between"><span>Est. Price:</span> <strong>${gpu.price}</strong></div>
              <div className="flex justify-between"><span>Type:</span> <strong>{gpu.type}</strong></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HardwareRecommendations;
