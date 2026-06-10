
import React from 'react';
import { Check, X, AlertTriangle, Star } from 'lucide-react';

const HardwareCompatibilityMatrix = ({ hardware }) => {
  const categories = {
    'Consumer': hardware.filter(h => h.type === 'Consumer'),
    'Professional': hardware.filter(h => h.type === 'Professional'),
    'Apple Silicon': hardware.filter(h => h.type === 'Apple Silicon')
  };

  return (
    <div className="cute-card p-6 md:p-8 mb-8">
      <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-border/10 pb-4">Hardware Compatibility</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {Object.entries(categories).map(([category, gpus]) => (
          <div key={category}>
            <h3 className="font-black uppercase text-sm text-muted-foreground mb-4 tracking-wider">{category}</h3>
            <div className="space-y-3">
              {gpus.map(gpu => (
                <div 
                  key={gpu.name} 
                  className={`p-4 border-2 border-border rounded-[var(--radius-md)] transition-all duration-300 flex items-center justify-between ${
                    gpu.compatible ? 'bg-card hover:bg-muted' : 'bg-muted/50 opacity-60 grayscale'
                  }`}
                >
                  <div>
                    <div className="font-black uppercase text-sm">{gpu.name}</div>
                    <div className="font-poppins text-xs font-bold text-muted-foreground">{gpu.vram}GB VRAM</div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    {gpu.compatible ? (
                      <div className="flex items-center gap-2">
                        {gpu.status === 'recommended' && <span className="cute-badge bg-secondary text-secondary-foreground text-[10px]"><Star size={10}/> REC</span>}
                        {gpu.status === 'tight' && <span className="cute-badge bg-accent text-accent-foreground text-[10px]"><AlertTriangle size={10}/> TIGHT</span>}
                        <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center border border-border">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center border border-border">
                        <X size={14} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HardwareCompatibilityMatrix;
