
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const LEVELS = [
  { id: 'fp32', name: 'FP32 (Uncompressed)', desc: 'Full 32-bit precision. Baseline for quality and size.', score: 10, reduction: '0%', speed: '1x', pros: 'Maximum quality', cons: 'Massive VRAM usage' },
  { id: 'fp16', name: 'FP16 / BF16', desc: '16-bit precision. Standard for most local inference.', score: 9.9, reduction: '50%', speed: '1.5x', pros: 'Great balance, native support', cons: 'Still large for 70B+ models' },
  { id: 'int8', name: 'INT8', desc: '8-bit integer quantization.', score: 9.5, reduction: '75%', speed: '2x', pros: 'Good quality retention', cons: 'Slower than 4-bit on some hardware' },
  { id: 'int4', name: 'INT4', desc: '4-bit integer quantization.', score: 8.5, reduction: '87.5%', speed: '3x', pros: 'Fits large models on consumer GPUs', cons: 'Noticeable quality drop on small models' },
  { id: 'gguf', name: 'GGUF', desc: 'Format optimized for CPU/Apple Silicon.', score: 8.8, reduction: 'Variable', speed: 'Varies', pros: 'Great for Mac/CPU', cons: 'Not optimal for pure NVIDIA GPU' },
  { id: 'awq', name: 'AWQ', desc: 'Activation-aware Weight Quantization.', score: 9.0, reduction: '85%', speed: '3.5x', pros: 'Fastest on modern NVIDIA GPUs', cons: 'Requires specific hardware support' },
  { id: 'gptq', name: 'GPTQ', desc: 'Post-training quantization.', score: 8.7, reduction: '85%', speed: '3x', pros: 'Widely supported', cons: 'Slightly slower than AWQ' }
];

const QuantizationLevels = () => {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold mb-4">Quantization Methods</h3>
      {LEVELS.map(level => (
        <div key={level.id} className="neo-card p-0 overflow-hidden">
          <button 
            onClick={() => setExpanded(expanded === level.id ? null : level.id)}
            className="w-full flex justify-between items-center p-4 bg-[hsl(var(--card))] hover:bg-[hsl(var(--muted))] transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="font-bold text-lg">{level.name}</span>
              <span className="text-sm px-2 py-1 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] neo-border">
                {level.reduction} Size
              </span>
            </div>
            {expanded === level.id ? <ChevronUp /> : <ChevronDown />}
          </button>
          <AnimatePresence>
            {expanded === level.id && (
              <motion.div 
                initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                className="border-t-[3px] border-[hsl(var(--border))] overflow-hidden"
              >
                <div className="p-4 bg-[hsl(var(--background))] grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="mb-2"><strong>Description:</strong> {level.desc}</p>
                    <p className="mb-2"><strong>Quality Score:</strong> {level.score}/10</p>
                    <p><strong>Speed:</strong> {level.speed}</p>
                  </div>
                  <div>
                    <p className="mb-2 text-green-600 dark:text-green-400"><strong>Pros:</strong> {level.pros}</p>
                    <p className="text-red-600 dark:text-red-400"><strong>Cons:</strong> {level.cons}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default QuantizationLevels;
