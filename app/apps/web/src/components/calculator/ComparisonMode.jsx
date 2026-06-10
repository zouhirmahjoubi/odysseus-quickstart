
import React from 'react';
import { MODELS } from '@/data/modelDatabase.js';
import { calculateWeightMemory, calculateKVCache, calculateActivationOverhead, calculateTotalVRAM } from '@/utils/vramCalculator.js';

const ComparisonMode = ({ comparedModels, onRemove, quantization, context, batchSize, flashAttention }) => {
  if (comparedModels.length === 0) return null;

  return (
    <div className="cute-card p-6 md:p-8 mb-8 bg-muted/30">
      <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-border/10 pb-4">Side-by-Side Comparison</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {comparedModels.map(modelId => {
          const model = MODELS.find(m => m.id === modelId);
          if (!model) return null;

          const weights = calculateWeightMemory(model.parameters, quantization);
          const kvCache = calculateKVCache(batchSize, context * 1000, model.num_layers, model.num_heads_kv, model.head_dim, 16);
          const activation = calculateActivationOverhead(model.parameters, context * 1000, flashAttention);
          const total = calculateTotalVRAM(weights, kvCache, activation);

          return (
            <div key={model.id} className="bg-card border-2 border-border rounded-[var(--radius-md)] p-5 shadow-sm relative">
              <button 
                onClick={() => onRemove(model.id)}
                className="absolute top-3 right-3 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center font-bold text-xs hover:scale-110 transition-transform"
              >
                ×
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{model.cute_icon}</span>
                <div>
                  <h3 className="font-black uppercase text-sm leading-tight">{model.name}</h3>
                  <p className="font-poppins text-[10px] font-bold text-muted-foreground">{model.parameters}B Params | {model.attention_type}</p>
                </div>
              </div>

              <div className="space-y-3 font-poppins text-sm font-bold">
                <div className="flex justify-between items-center p-2 bg-vram-weights/20 rounded-[var(--radius-sm)]">
                  <span>Weights</span>
                  <span>{weights.toFixed(1)} GB</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-vram-kv/20 rounded-[var(--radius-sm)]">
                  <span>KV Cache</span>
                  <span>{kvCache.toFixed(1)} GB</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-vram-act/20 rounded-[var(--radius-sm)]">
                  <span>Activation</span>
                  <span>{activation.toFixed(1)} GB</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-foreground text-background rounded-[var(--radius-sm)] mt-4">
                  <span className="uppercase font-black">Total</span>
                  <span className="font-black">{total.toFixed(1)} GB</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComparisonMode;
