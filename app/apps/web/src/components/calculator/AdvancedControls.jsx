
import React from 'react';
import { MODELS } from '@/data/modelDatabase.js';

const AdvancedControls = ({ 
  selectedModelId, setSelectedModelId,
  quantization, setQuantization,
  context, setContext,
  batchSize, setBatchSize,
  flashAttention, setFlashAttention
}) => {
  const selectedModel = MODELS.find(m => m.id === selectedModelId) || MODELS[0];

  return (
    <div className="cute-card p-6 md:p-8 mb-8">
      <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-border/10 pb-4">Advanced Configuration</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <label className="block font-black uppercase text-sm mb-2">Model Selection</label>
            <select 
              className="neo-input rounded-[var(--radius-md)] py-3 cursor-pointer"
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
            >
              {MODELS.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.parameters}B) - {m.family}</option>
              ))}
            </select>
            <div className="mt-2 flex gap-2 font-poppins text-xs font-bold text-muted-foreground">
              <span className="bg-muted px-2 py-1 rounded-[var(--radius-sm)] border border-border/10">Attention: {selectedModel.attention_type}</span>
              <span className="bg-muted px-2 py-1 rounded-[var(--radius-sm)] border border-border/10">Max Ctx: {selectedModel.context_window_max / 1000}k</span>
            </div>
          </div>

          <div>
            <label className="block font-black uppercase text-sm mb-2">Quantization Precision</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'FP16/BF16', bits: 16 },
                { label: 'INT8 (Q8_0)', bits: 8 },
                { label: 'INT4 (Q4_K_M)', bits: 4 },
                { label: 'INT2 (IQ2_XXS)', bits: 2 }
              ].map(q => (
                <button 
                  key={q.bits}
                  onClick={() => setQuantization(q.bits)}
                  className={`border-2 border-border p-3 font-black uppercase text-sm rounded-[var(--radius-md)] transition-all duration-300 ${
                    quantization === q.bits 
                      ? 'bg-primary text-primary-foreground shadow-sm scale-[1.02]' 
                      : 'bg-card hover:bg-muted'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-black uppercase text-sm">Context Window</label>
              <span className="font-black text-sm bg-secondary text-secondary-foreground px-2 py-1 rounded-[var(--radius-sm)] border-2 border-border">{context}k Tokens</span>
            </div>
            <input 
              type="range" min="2" max="200" step="2" value={context} 
              onChange={(e) => setContext(Number(e.target.value))}
              className="w-full h-3 bg-muted border-2 border-border rounded-full appearance-none cursor-pointer mb-2"
            />
            <div className="flex flex-wrap gap-1">
              {[2, 8, 32, 64, 128].map(preset => (
                <button 
                  key={preset}
                  onClick={() => setContext(preset)}
                  className="text-[10px] font-bold bg-card border border-border px-2 py-1 rounded-[var(--radius-sm)] hover:bg-muted"
                >
                  {preset}k
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-black uppercase text-sm mb-2">Batch Size</label>
              <input 
                type="number" min="1" max="32" value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="neo-input rounded-[var(--radius-md)] py-2 text-center"
              />
            </div>
            <div>
              <label className="block font-black uppercase text-sm mb-2">FlashAttention</label>
              <button 
                onClick={() => setFlashAttention(!flashAttention)}
                className={`w-full border-2 border-border p-2 font-black uppercase text-sm rounded-[var(--radius-md)] transition-all duration-300 h-[52px] ${
                  flashAttention ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {flashAttention ? 'Enabled O(s)' : 'Disabled O(s²)'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedControls;
