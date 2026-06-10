
import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

const gpuOptions = [
  { name: 'NVIDIA RTX 4090', tflops: 82.6 },
  { name: 'NVIDIA RTX 3090', tflops: 35.6 },
  { name: 'NVIDIA RTX 4080', tflops: 48.7 },
  { name: 'NVIDIA A100', tflops: 19.5 },
  { name: 'NVIDIA H100', tflops: 67.0 },
  { name: 'Apple M2 Ultra', tflops: 13.6 }
];

const InferenceSpeedCalculator = () => {
  const [gpuTflops, setGpuTflops] = useState(gpuOptions[0].tflops);
  const [modelSize, setModelSize] = useState(7);
  const [batchSize, setBatchSize] = useState(1);
  const [result, setResult] = useState(0);

  useEffect(() => {
    // Formula: (GPU_TFLOPS * 2) / (model_size_in_billions * 1000) / batch_size
    const speed = (gpuTflops * 2) / (modelSize * 1000) / batchSize;
    setResult(speed > 0 && isFinite(speed) ? speed : 0);
  }, [gpuTflops, modelSize, batchSize]);

  return (
    <div className="neo-card flex flex-col h-full" id="inference-speed">
      <div className="flex items-center gap-3 mb-6 border-b-[3px] border-[hsl(var(--border))] pb-4">
        <div className="bg-[hsl(var(--primary))] p-2 border-[3px] border-[hsl(var(--border))]">
          <Zap size={24} className="text-[hsl(var(--primary-foreground))]" />
        </div>
        <h3 className="text-2xl font-black font-space-grotesk uppercase tracking-tight">Inference Speed</h3>
      </div>

      <div className="space-y-5 flex-1">
        <div>
          <label className="block font-bold mb-2 text-sm uppercase tracking-wider">GPU Type (TFLOPS)</label>
          <select 
            className="neo-input cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] pr-10"
            value={gpuTflops}
            onChange={(e) => setGpuTflops(parseFloat(e.target.value))}
          >
            {gpuOptions.map((gpu) => (
              <option key={gpu.name} value={gpu.tflops}>
                {gpu.name} ({gpu.tflops} TFLOPS)
              </option>
            ))}
          </select>
        </div>

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
          <label className="block font-bold mb-2 text-sm uppercase tracking-wider">Batch Size</label>
          <input 
            type="number" 
            className="neo-input"
            value={batchSize}
            onChange={(e) => setBatchSize(parseInt(e.target.value) || 1)}
            min="1"
            step="1"
          />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t-[3px] border-[hsl(var(--border))]">
        <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Estimated Speed</div>
        <div className="bg-[hsl(var(--foreground))] text-[hsl(var(--primary))] p-4 border-[3px] border-[hsl(var(--border))] shadow-[4px_4px_0px_0px_hsl(var(--secondary))] font-jetbrains-mono text-2xl font-bold flex items-center justify-between">
          <span>{result.toFixed(4)}</span>
          <span className="text-sm text-gray-400 ml-2">tokens/sec</span>
        </div>
      </div>
    </div>
  );
};

export default InferenceSpeedCalculator;
