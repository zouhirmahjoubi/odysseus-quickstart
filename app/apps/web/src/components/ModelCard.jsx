
import React from 'react';
import { Cpu, Zap } from 'lucide-react';

const ModelCard = ({ name, description, vram, recommended }) => {
  return (
    <div className="bg-white neo-border neo-shadow-sm p-6 flex flex-col h-full relative group hover:bg-[#FFFEF0] transition-colors">
      {recommended && (
        <div className="absolute -top-4 right-4 bg-accent text-black font-bold px-3 py-1 neo-border text-sm flex items-center gap-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10 rotate-2">
          <Zap size={14} className="fill-black" /> Recommended
        </div>
      )}
      
      <div className="mb-4">
        <h3 className="text-2xl font-black mb-2">{name}</h3>
        <p className="text-sm font-medium opacity-80 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-auto pt-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm font-bold bg-muted p-2 neo-border">
          <Cpu size={16} />
          <span>VRAM Required: <span className="text-accent font-black">{vram}</span></span>
        </div>
        
        <button className="w-full bg-primary text-black font-bold py-3 neo-border neo-interactive">
          Compare Details
        </button>
      </div>
    </div>
  );
};

export default ModelCard;
