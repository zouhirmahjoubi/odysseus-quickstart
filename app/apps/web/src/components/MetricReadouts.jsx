
import React from 'react';
import { Zap, Lock, HardDrive } from 'lucide-react';

const MetricReadouts = () => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-black uppercase mb-6">4. Estimated Metrics</h2>
      <div className="flex flex-col gap-4">
        
        <div className="neo-card bg-card flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="bg-muted p-3 neo-border">
              <Zap size={28} strokeWidth={2.5} className="text-muted-foreground" />
            </div>
            <span className="text-xl font-black uppercase">Inference Speed</span>
          </div>
          <span className="text-2xl font-black">~45 tokens/s</span>
        </div>

        <div className="neo-card bg-card flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="bg-muted p-3 neo-border">
              <Lock size={28} strokeWidth={2.5} className="text-muted-foreground" />
            </div>
            <span className="text-xl font-black uppercase">Training Estimator</span>
          </div>
          <span className="text-2xl font-black">Supported (LoRA)</span>
        </div>

        <div className="neo-card bg-card flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="bg-muted p-3 neo-border">
              <HardDrive size={28} strokeWidth={2.5} className="text-muted-foreground" />
            </div>
            <span className="text-xl font-black uppercase">Storage Requirements</span>
          </div>
          <span className="text-2xl font-black">18.4 GB</span>
        </div>

      </div>
    </div>
  );
};

export default MetricReadouts;
