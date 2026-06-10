
import React from 'react';
import { Database, Code, MessageSquare, Microscope, Server } from 'lucide-react';

const PresetConfigurations = ({ onApplyPreset }) => {
  const presets = [
    { id: 'rag', name: 'RAG Specialist', icon: <Database size={20}/>, ctx: 128, batch: 4, q: 4, desc: 'Long context retrieval' },
    { id: 'code', name: 'Code Master', icon: <Code size={20}/>, ctx: 32, batch: 1, q: 8, desc: 'Code generation' },
    { id: 'chat', name: 'Chat Optimized', icon: <MessageSquare size={20}/>, ctx: 8, batch: 1, q: 4, desc: 'Balanced conversation' },
    { id: 'research', name: 'Research Mode', icon: <Microscope size={20}/>, ctx: 200, batch: 1, q: 16, desc: 'Maximum context' },
    { id: 'prod', name: 'Production Server', icon: <Server size={20}/>, ctx: 8, batch: 16, q: 4, desc: 'High throughput' }
  ];

  return (
    <div className="mb-8">
      <h3 className="font-black uppercase text-sm mb-4 tracking-wider text-muted-foreground">Quick Presets</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {presets.map(preset => (
          <button
            key={preset.id}
            onClick={() => onApplyPreset(preset)}
            className="cute-card p-4 text-left hover:-translate-y-1 transition-transform group"
          >
            <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-primary/20 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              {preset.icon}
            </div>
            <h4 className="font-black uppercase text-sm leading-tight mb-1">{preset.name}</h4>
            <p className="font-poppins text-[10px] font-bold text-muted-foreground">{preset.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PresetConfigurations;
