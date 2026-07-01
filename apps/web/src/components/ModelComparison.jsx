
import React from 'react';
import { MODELS_LLM } from '@/data/llmModelsDatabase.js';

const ModelComparison = ({ selectedModelId, inputTokens, outputTokens }) => {
  const selectedModel = MODELS_LLM.find(m => m.id === selectedModelId) || MODELS_LLM[0];
  
  // Find similar models (same provider or same tier based on price)
  const similarModels = MODELS_LLM.filter(m => 
    m.id !== selectedModel.id && 
    (m.provider === selectedModel.provider || Math.abs(m.inputTokenPrice - selectedModel.inputTokenPrice) < 0.01)
  ).slice(0, 3); // take up to 3

  const calculateCost = (model) => {
    return ((inputTokens / 1000) * model.inputTokenPrice + (outputTokens / 1000) * model.outputTokenPrice).toFixed(4);
  };

  const selectedCost = calculateCost(selectedModel);

  return (
    <div className="bg-[#FFFDF0] border-4 border-black rounded-[8px] p-5 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full overflow-hidden text-black">
      <h3 className="text-xl md:text-2xl font-black uppercase mb-6 inline-block border-b-4 border-black pb-1 text-black">
        Cost Comparison
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Selected Model Card */}
        <div className="bg-[#B3DDF2] border-4 border-black rounded-lg p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full relative text-black">
          <div className="absolute -top-3 right-4 bg-black text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
            Selected
          </div>
          <div className="text-xs font-black uppercase tracking-widest text-black/60 mb-1">{selectedModel.provider}</div>
          <div className="font-black text-lg leading-tight mb-4 text-black">{selectedModel.name}</div>
          
          <div className="mt-auto space-y-2 text-sm border-t-2 border-black/20 pt-4 text-black">
            <div className="flex justify-between font-bold text-black">
              <span>Cost:</span>
              <span className="text-black">${selectedCost}</span>
            </div>
            <div className="flex justify-between font-medium text-black">
              <span>Context:</span>
              <span>{selectedModel.contextWindow}</span>
            </div>
          </div>
        </div>

        {/* Similar Models */}
        {similarModels.map(model => (
          <div key={model.id} className="bg-white border-4 border-black rounded-lg p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full text-black">
            <div className="text-xs font-black uppercase tracking-widest text-black/60 mb-1">{model.provider}</div>
            <div className="font-black text-lg leading-tight mb-4 text-black">{model.name}</div>
            
            <div className="mt-auto space-y-2 text-sm border-t-2 border-black/20 pt-4 text-black">
              <div className="flex justify-between font-bold text-black">
                <span>Cost:</span>
                <span className="text-black">${calculateCost(model)}</span>
              </div>
              <div className="flex justify-between font-medium text-black/60">
                <span>Context:</span>
                <span>{model.contextWindow}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelComparison;
