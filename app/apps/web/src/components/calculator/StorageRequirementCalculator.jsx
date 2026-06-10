
import React, { useState, useEffect } from 'react';
import { HardDrive } from 'lucide-react';

const quantOptions = [
  { name: 'FP32 (32-bit)', multiplier: 4 },
  { name: 'FP16/BF16 (16-bit)', multiplier: 2 },
  { name: 'INT8 (8-bit)', multiplier: 1 },
  { name: 'INT4 (4-bit)', multiplier: 0.5 }
];

const StorageRequirementCalculator = () => {
  const [modelSize, setModelSize] = useState(7);
  const [quantMultiplier, setQuantMultiplier] = useState(quantOptions[1].multiplier);
  const [additionalData, setAdditionalData] = useState(10);
  const [result, setResult] = useState(0);

  useEffect(() => {
    // Formula: (model_size * quantization_multiplier) + additional_data
    const storage = (modelSize * quantMultiplier) + additionalData;
    setResult(storage > 0 && isFinite(storage) ? storage : 0);
  }, [modelSize, quantMultiplier, additionalData]);

  return (
    <div className="neo-card flex flex-col h-full" id="storage-calculator">
      <div className="flex items-center gap-3 mb-6 border-b-[3px] border-[hsl(var(--border))] pb-4">
        <div className="bg-[hsl(var(--accent))] p-2 border-[3px] border-[hsl(var(--border))]">
          <HardDrive size={24} className="text-[hsl(var(--foreground))]" />
        </div>
        <h3 className="text-2xl font-black font-space-grotesk uppercase tracking-tight">Storage Requirements</h3>
      </div>

      <div className="space-y-5 flex-1">
        <div>
          <label className="block font-bold mb-2 text-sm uppercase tracking-wider">Model Size (Billions of Parameters)</label>
          <input 
            type="number" 
            className="neo-input"
            value={modelSize}
            onChange={(e) => setModelSize(parseFloat(e.target.value) || 0)}
            min="0.1"
            step="0.1"
          />
        </div>

        <div>
          <label className="block font-bold mb-2 text-sm uppercase tracking-wider">Quantization Level</label>
          <select 
            className="neo-input cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] pr-10"
            value={quantMultiplier}
            onChange={(e) => setQuantMultiplier(parseFloat(e.target.value))}
          >
            {quantOptions.map((opt) => (
              <option key={opt.name} value={opt.multiplier}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold mb-2 text-sm uppercase tracking-wider">Additional Data (GB)</label>
          <input 
            type="number" 
            className="neo-input"
            value={additionalData}
            onChange={(e) => setAdditionalData(parseFloat(e.target.value) || 0)}
            min="0"
            step="1"
          />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t-[3px] border-[hsl(var(--border))]">
        <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Storage Required</div>
        <div className="bg-[hsl(var(--foreground))] text-[hsl(var(--accent))] p-4 border-[3px] border-[hsl(var(--border))] shadow-[4px_4px_0px_0px_hsl(var(--primary))] font-jetbrains-mono text-2xl font-bold flex items-center justify-between">
          <span>{result.toFixed(2)}</span>
          <span className="text-sm text-gray-400 ml-2">GB</span>
        </div>
      </div>
    </div>
  );
};

export default StorageRequirementCalculator;
