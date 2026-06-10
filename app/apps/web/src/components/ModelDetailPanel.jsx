
import React from 'react';
import { motion } from 'framer-motion';
import { X, Star, Cpu, Zap, Database } from 'lucide-react';

const ModelDetailPanel = ({ model, onClose }) => {
  if (!model) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="neo-card w-full max-w-3xl max-h-[90vh] overflow-y-auto relative bg-[hsl(var(--bg-primary))]"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 neo-border bg-[hsl(var(--card-bg))] hover:bg-[hsl(var(--primary))] transition-colors"
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-[hsl(var(--primary))] text-black font-bold text-xs neo-border">
              {model.category}
            </span>
            <div className="flex items-center gap-1 text-[hsl(var(--primary))]">
              <Star size={16} fill="currentColor" />
              <span className="font-bold text-[hsl(var(--text-primary))]">{model.rating}/5</span>
            </div>
          </div>
          <h2 className="text-3xl font-black">{model.name}</h2>
          <p className="font-medium opacity-80">{model.params} Parameters • MMLU: {model.mmlu}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="neo-border p-4 bg-[hsl(var(--card-bg))]">
            <h3 className="font-bold flex items-center gap-2 mb-4"><Database size={18}/> VRAM Requirements</h3>
            <ul className="space-y-2 font-mono-code text-sm">
              <li className="flex justify-between"><span>FP32 (Unquantized):</span> <strong>{model.vramReq.fp32} GB</strong></li>
              <li className="flex justify-between"><span>FP16 (Half):</span> <strong>{model.vramReq.fp16} GB</strong></li>
              <li className="flex justify-between"><span>INT8 (8-bit):</span> <strong>{model.vramReq.int8} GB</strong></li>
              <li className="flex justify-between text-[hsl(var(--primary))]"><span>INT4 (4-bit/GGUF):</span> <strong>{model.vramReq.int4} GB</strong></li>
            </ul>
          </div>

          <div className="neo-border p-4 bg-[hsl(var(--card-bg))]">
            <h3 className="font-bold flex items-center gap-2 mb-4"><Zap size={18}/> Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm opacity-80 mb-1">Est. Inference Speed</div>
                <div className="text-2xl font-black">{model.speed} <span className="text-sm font-medium">tok/s</span></div>
              </div>
              <div>
                <div className="text-sm opacity-80 mb-1">Best Use Cases</div>
                <div className="flex flex-wrap gap-2">
                  {model.useCases.map(uc => (
                    <span key={uc} className="px-2 py-1 bg-[hsl(var(--secondary))] text-black text-xs font-bold neo-border">
                      {uc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModelDetailPanel;
