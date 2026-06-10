
import React from 'react';
import { getMemoryColor } from '@/utils/vramCalculator.js';

const MemoryBreakdownPanel = ({ weights, kvCache, activation, total }) => {
  const colorClass = getMemoryColor(total);

  return (
    <div className="cute-card p-6 md:p-8 mb-8">
      <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-border/10 pb-4">Memory Breakdown</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Weights */}
        <div className="bg-vram-weights text-black p-4 rounded-[var(--radius-md)] border-2 border-border shadow-sm stagger-1">
          <h3 className="font-black uppercase text-sm mb-2 opacity-80">Model Weights</h3>
          <div className="text-3xl font-black mb-2">{weights.toFixed(2)} GB</div>
          <p className="font-poppins text-xs font-medium opacity-90">
            Formula: (Params × Bits) / 8<br/>
            Includes 15% buffer
          </p>
        </div>

        {/* KV Cache */}
        <div className="bg-vram-kv text-black p-4 rounded-[var(--radius-md)] border-2 border-border shadow-sm stagger-2">
          <h3 className="font-black uppercase text-sm mb-2 opacity-80">KV Cache</h3>
          <div className="text-3xl font-black mb-2">{kvCache.toFixed(2)} GB</div>
          <p className="font-poppins text-xs font-medium opacity-90">
            Formula: 2 × Batch × Ctx × L × H_kv × D<br/>
            Scales with context length
          </p>
        </div>

        {/* Activation */}
        <div className="bg-vram-act text-black p-4 rounded-[var(--radius-md)] border-2 border-border shadow-sm stagger-3">
          <h3 className="font-black uppercase text-sm mb-2 opacity-80">Activation Overhead</h3>
          <div className="text-3xl font-black mb-2">{activation.toFixed(2)} GB</div>
          <p className="font-poppins text-xs font-medium opacity-90">
            O(s) FlashAttention or O(s²) Vanilla<br/>
            Required for forward pass
          </p>
        </div>
      </div>

      {/* Total */}
      <div className={`p-6 rounded-[var(--radius-lg)] border-4 border-border shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))] stagger-4 ${colorClass}`}>
        <h3 className="font-black uppercase text-lg mb-2 opacity-90">Total Required VRAM</h3>
        <div className="text-6xl md:text-7xl font-black tracking-tighter">
          {total.toFixed(2)} <span className="text-3xl opacity-80">GB</span>
        </div>
        <p className="font-poppins text-sm font-bold mt-4 opacity-90">
          Includes 15% safety buffer for CUDA context and system overhead.
        </p>
      </div>
    </div>
  );
};

export default MemoryBreakdownPanel;
