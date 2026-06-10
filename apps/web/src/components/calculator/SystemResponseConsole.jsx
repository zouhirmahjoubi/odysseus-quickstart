
import React, { useState, useMemo } from 'react';
import { MODELS } from '@/data/modelDatabase.js';
import ModelFilterSort from '@/components/calculator/ModelFilterSort.jsx';
import ModelRecommendationPanel from '@/components/calculator/ModelRecommendationPanel.jsx';
import ModelComparisonModal from '@/components/calculator/ModelComparisonModal.jsx';
import { toast } from 'sonner';

const SystemResponseConsole = ({ vram, quantization, contextWindow, overheads }) => {
  const [filteredModels, setFilteredModels] = useState([]);
  const [comparedModels, setComparedModels] = useState([]);

  // Memoize total overhead to prevent recalculation
  const totalOverhead = useMemo(() => {
    return Object.values(overheads || {}).reduce((sum, val) => sum + val, 0);
  }, [overheads]);

  // CRITICAL FIX: Memoize analyzed models to break infinite render loop with ModelFilterSort
  const analyzedModels = useMemo(() => {
    const rawModels = Array.isArray(MODELS) ? MODELS : [];
    
    return rawModels.map(model => {
      const paramCount = model.params || parseFloat(model.baseSize) || model.requiredVram || 7;
      const hidden = model.hiddenSize || 4096;
      
      const weightVram = paramCount * 2 * quantization;
      const kvCacheVram = (contextWindow * 2 * 2 * hidden) / Math.pow(1024, 3);
      const totalRequired = weightVram + kvCacheVram + totalOverhead;
      
      return {
        ...model,
        weightVram,
        kvCacheVram,
        totalRequired,
        fits: totalRequired <= vram
      };
    });
  }, [vram, quantization, contextWindow, totalOverhead]);
  
  // Calculate max fitting model safely
  const { fittingModels, maxModel } = useMemo(() => {
    const fitting = [...analyzedModels].filter(m => m.fits).sort((a, b) => a.totalRequired - b.totalRequired);
    const max = fitting.length > 0 
      ? fitting[fitting.length - 1] 
      : [...analyzedModels].sort((a, b) => a.totalRequired - b.totalRequired)[0] || { name: 'None', weightVram: 0, kvCacheVram: 0, totalRequired: 0, fits: false };
    return { fittingModels: fitting, maxModel: max };
  }, [analyzedModels]);

  const usagePercent = maxModel.totalRequired > 0 ? (maxModel.totalRequired / vram) * 100 : 0;
  const isOOM = !maxModel.fits;
  const isWarning = usagePercent > 80 && !isOOM;

  const handleCompare = (model) => {
    if (comparedModels.find(m => m.id === model.id)) return;
    if (comparedModels.length >= 3) {
      toast.error("You can only compare up to 3 models simultaneously.");
      return;
    }
    setComparedModels([...comparedModels, model]);
  };

  const handleRemoveCompare = (id) => {
    setComparedModels(comparedModels.filter(m => m.id !== id));
  };

  return (
    <div className="mt-12 mb-12">
      {/* Top Console Interface */}
      <div className="bg-black text-[hsl(var(--highlight-mint))] p-6 border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] font-mono-code mb-8">
        <div className="flex items-center gap-2 mb-6 border-b border-[hsl(var(--highlight-mint))]/30 pb-3">
          <div className="w-3 h-3 bg-[hsl(var(--destructive))] rounded-full"></div>
          <div className="w-3 h-3 bg-[hsl(var(--accent-orange))] rounded-full"></div>
          <div className="w-3 h-3 bg-[hsl(var(--highlight-mint))] rounded-full"></div>
          <span className="ml-2 text-sm font-bold opacity-80 uppercase tracking-widest text-[hsl(var(--highlight-mint))]">SYSTEM_RESPONSE_CONSOLE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border border-[hsl(var(--highlight-mint))]/30 p-4 bg-black/50">
            <h3 className="text-xs opacity-70 mb-1 uppercase tracking-wider text-[hsl(var(--highlight-mint))]">Max Fitting Model Size</h3>
            <div className="text-2xl font-bold text-white">{(maxModel.weightVram || 0).toFixed(2)} GB</div>
            <div className="text-xs mt-1 text-[hsl(var(--highlight-mint))]/70">Based on {maxModel.name} @ {quantization * 100}% precision</div>
          </div>

          <div className="border border-[hsl(var(--highlight-mint))]/30 p-4 bg-black/50">
            <h3 className="text-xs opacity-70 mb-1 uppercase tracking-wider text-[hsl(var(--highlight-mint))]">Context KV-Cache Overhead</h3>
            <div className="text-2xl font-bold text-[hsl(var(--accent-orange))]">{(maxModel.kvCacheVram || 0).toFixed(2)} GB</div>
            <div className="text-xs mt-1 text-[hsl(var(--highlight-mint))]/70">{contextWindow.toLocaleString()} tokens context</div>
          </div>
        </div>

        <div className="border border-[hsl(var(--highlight-mint))]/30 p-4 bg-black">
          <h3 className="text-xs opacity-70 mb-3 uppercase tracking-wider text-[hsl(var(--highlight-mint))]">Remaining System VRAM Guard</h3>
          <div className="w-full h-8 bg-gray-900 border border-[hsl(var(--highlight-mint))]/50 relative overflow-hidden flex items-center">
            <div 
              className={`h-full absolute left-0 top-0 transition-all duration-500 ease-in-out ${isOOM ? 'bg-[hsl(var(--destructive))] animate-pulse' : isWarning ? 'bg-[hsl(var(--accent-orange))]' : 'bg-[hsl(var(--highlight-mint))]'}`}
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            ></div>
            <div className="relative z-10 w-full text-center font-bold mix-blend-difference text-white">
              {(maxModel.totalRequired || 0).toFixed(1)} GB / {vram} GB ({usagePercent.toFixed(1)}%)
            </div>
          </div>
          {isOOM && (
            <div className="mt-3 text-[hsl(var(--destructive))] font-bold animate-pulse uppercase text-sm border border-[hsl(var(--destructive))] bg-[hsl(var(--destructive))]/10 p-2 text-center">
              ⚠️ OUT OF MEMORY (OOM) RISK - EXCEEDS CAPACITY
            </div>
          )}
        </div>
      </div>

      {/* Model Recommendation Engine */}
      <div>
        <h2 className="text-2xl md:text-3xl font-black mb-6 uppercase tracking-tight text-[hsl(var(--foreground))]">Model Compatibility Engine</h2>
        
        <ModelFilterSort 
          models={analyzedModels} 
          selectedVram={vram} 
          onUpdate={setFilteredModels} 
        />
        
        <ModelRecommendationPanel 
          models={filteredModels} 
          onCompare={handleCompare} 
          selectedVram={vram}
        />
      </div>

      {comparedModels.length > 0 && (
        <ModelComparisonModal 
          models={comparedModels} 
          onClose={() => setComparedModels([])} 
          onRemove={handleRemoveCompare}
          onClear={() => setComparedModels([])}
        />
      )}
    </div>
  );
};

export default SystemResponseConsole;
