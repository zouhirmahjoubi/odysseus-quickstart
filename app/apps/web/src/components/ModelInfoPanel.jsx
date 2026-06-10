
import React from 'react';
import { 
  Zap, BrainCircuit, Globe, Clock, Coins, Network, ShieldCheck, 
  Cpu, ZapOff, Activity, Layers, Bird, Database, Sparkles, MessageSquare, Wind, Briefcase, Crown, Brain
} from 'lucide-react';
import { MODELS_LLM } from '@/data/llmModelsDatabase.js';

const iconMap = {
  Zap, BrainCircuit, Globe, Network, Cpu, Database, Sparkles, MessageSquare, Wind, Briefcase, Crown, Brain, Bird, Layers
};

const ModelInfoPanel = ({ selectedModelId }) => {
  const model = MODELS_LLM.find(m => m.id === selectedModelId) || MODELS_LLM[0];
  const IconComponent = iconMap[model.icon] || Cpu;

  return (
    <div className="bg-[#FFFDF0] border-4 border-black rounded-[8px] p-5 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 pb-6 border-b-4 border-black">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 md:w-16 md:h-16 ${model.color} border-4 border-black rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0`}>
            <IconComponent className="w-8 h-8 text-black" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase text-black leading-none mb-2">{model.name}</h2>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-bold uppercase tracking-widest bg-black text-white px-2 py-1 rounded">
                {model.provider}
              </span>
              <span className="text-xs font-bold uppercase tracking-widest border-2 border-black px-2 py-1 rounded bg-white">
                {model.type}
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="font-bold text-black/80 mb-6 text-sm md:text-base leading-relaxed max-w-3xl">
        {model.description}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="border-2 border-black bg-white p-3 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-xs font-black uppercase text-muted-foreground tracking-widest mb-1 flex items-center gap-1"><Layers size={14}/> Context Window</div>
          <div className="font-black text-lg text-black">{model.contextWindow}</div>
        </div>
        <div className="border-2 border-black bg-white p-3 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-xs font-black uppercase text-muted-foreground tracking-widest mb-1 flex items-center gap-1"><Clock size={14}/> Data Cutoff</div>
          <div className="font-black text-lg text-black">{model.trainingDataCutoff}</div>
        </div>
        <div className="border-2 border-black bg-white p-3 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-xs font-black uppercase text-muted-foreground tracking-widest mb-1 flex items-center gap-1"><Coins size={14}/> Input (Per 1K)</div>
          <div className="font-black text-lg text-black">${model.inputTokenPrice}</div>
        </div>
        <div className="border-2 border-black bg-white p-3 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-xs font-black uppercase text-muted-foreground tracking-widest mb-1 flex items-center gap-1"><Coins size={14}/> Output (Per 1K)</div>
          <div className="font-black text-lg text-black">${model.outputTokenPrice}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest mb-3 border-b-2 border-black pb-1">Performance Specs</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>SPEED</span>
                <span>{model.performanceMetrics.speed}/10</span>
              </div>
              <div className="w-full bg-black/10 h-2 rounded-full overflow-hidden border border-black">
                <div className="bg-[#B3DDF2] h-full" style={{ width: `${model.performanceMetrics.speed * 10}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>ACCURACY</span>
                <span>{model.performanceMetrics.accuracy}/10</span>
              </div>
              <div className="w-full bg-black/10 h-2 rounded-full overflow-hidden border border-black">
                <div className="bg-[#B3DDF2] h-full" style={{ width: `${model.performanceMetrics.accuracy * 10}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>REASONING</span>
                <span>{model.performanceMetrics.reasoning}/10</span>
              </div>
              <div className="w-full bg-black/10 h-2 rounded-full overflow-hidden border border-black">
                <div className="bg-[#B3DDF2] h-full" style={{ width: `${model.performanceMetrics.reasoning * 10}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        <div>
           <h3 className="text-sm font-black uppercase tracking-widest mb-3 border-b-2 border-black pb-1">Capabilities</h3>
           <div className="flex flex-wrap gap-2">
             {model.capabilities.map((cap, i) => (
               <span key={i} className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground border-2 border-black px-2 py-1 rounded text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                 <ShieldCheck size={14} />
                 {cap}
               </span>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ModelInfoPanel;
