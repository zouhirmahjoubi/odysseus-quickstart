
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const ModelRecommendationPanel = ({ models, onCompare, selectedVram }) => {
  if (models.length === 0) {
    return (
      <div className="p-8 text-center bg-[hsl(var(--card))] border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] text-[hsl(var(--foreground))] font-bold">
        No models match your current hardware constraints or filters. Try increasing your VRAM or using a stronger quantization.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {models.map(m => {
        const isCompatible = m.totalRequired <= selectedVram;
        return (
          <div key={m.id} className="bg-[hsl(var(--card))] text-[hsl(var(--foreground))] border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] p-5 flex flex-col hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000] transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="mr-2">
                <h3 className="font-black text-xl leading-tight">{m.name}</h3>
                <p className="text-sm font-bold text-[hsl(var(--muted-foreground))] mt-1">{m.provider || 'Open Source'}</p>
              </div>
              <span className="px-2 py-1 bg-[hsl(var(--sidebar-bg))] text-black border-[2px] border-black text-xs font-bold whitespace-nowrap shadow-[2px_2px_0px_0px_#000000]">
                {m.type || 'LLM'}
              </span>
            </div>
            
            <div className="my-2">
              <span className={`inline-flex items-center px-2 py-1 border-[2px] border-black text-xs font-bold shadow-[2px_2px_0px_0px_#000000] ${isCompatible ? 'bg-[hsl(var(--highlight-mint))] text-black' : 'bg-[hsl(var(--destructive))] text-white'}`}>
                {isCompatible ? <CheckCircle size={14} className="mr-1"/> : <XCircle size={14} className="mr-1"/>}
                {isCompatible ? 'Recommended' : 'Not Compatible'}
              </span>
            </div>

            <p className="text-sm font-medium my-4 flex-grow opacity-90 line-clamp-3">
              {m.description || 'General purpose language model suitable for various applications.'}
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t-[3px] border-black">
              <div className="font-bold flex flex-col">
                <span className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Req. VRAM</span>
                <span className={`text-xl font-black ${!isCompatible ? 'text-[hsl(var(--destructive))]' : 'text-[hsl(var(--foreground))]'}`}>
                  {m.totalRequired.toFixed(1)} GB
                </span>
              </div>
              <button 
                onClick={() => onCompare(m)}
                className="px-4 py-2 bg-[hsl(var(--accent-orange))] text-black border-[2px] border-black font-bold hover:brightness-110 active:scale-95 transition-all shadow-[2px_2px_0px_0px_#000000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                aria-label={`Compare ${m.name}`}
              >
                Compare
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ModelRecommendationPanel;
