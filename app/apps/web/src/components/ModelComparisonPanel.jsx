
import React, { useState } from 'react';
import { Settings, Sliders, AlignLeft, Info, Server, Scale } from 'lucide-react';

const ModelComparisonPanel = ({ 
  selectedModel, 
  models, 
  temperature,
  maxTokens,
  systemPrompt,
  onTemperatureChange,
  onMaxTokensChange,
  onSystemPromptChange
}) => {
  const [compareModel, setCompareModel] = useState('');
  
  const currentModelData = models.find(m => m.name === selectedModel) || models[0];
  const compareModelData = models.find(m => m.name === compareModel);

  return (
    <div className="flex flex-col h-full bg-[hsl(var(--card))] border-[3px] border-[hsl(var(--workspace-border-color))] shadow-[4px_4px_0px_0px_hsl(var(--workspace-border-color))] overflow-y-auto">
      <div className="p-4 border-b-[3px] border-[hsl(var(--workspace-border-color))] bg-[hsl(var(--workspace-highlight))] sticky top-0 z-10">
        <h2 className="text-lg font-black uppercase tracking-tight text-black flex items-center gap-2">
          <Settings size={20} /> Parameters
        </h2>
      </div>

      <div className="p-5 space-y-8">
        
        {/* Specs Display */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-black/60 uppercase tracking-widest flex items-center gap-1.5"><Info size={14}/> Context Target</h3>
          <div className="bg-[hsl(var(--workspace-bg))] border-[3px] border-black shadow-[2px_2px_0px_0px_#000000] p-4 text-black">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-sm">Model</span>
              <span className="font-black text-sm">{currentModelData.name}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-sm">Max Context</span>
              <span className="font-black text-sm">{currentModelData.contextWindow ? currentModelData.contextWindow.toLocaleString() : '8,192'} Tokens</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm">Est. VRAM</span>
              <span className="font-black text-sm text-[hsl(var(--workspace-accent))]">{currentModelData.requiredVram ? currentModelData.requiredVram.toFixed(1) : '7.0'} GB</span>
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-black/60 uppercase tracking-widest flex items-center gap-1.5"><Scale size={14}/> Compare With</h3>
          <select 
            value={compareModel}
            onChange={(e) => setCompareModel(e.target.value)}
            className="w-full border-[3px] border-black p-2 bg-white text-black font-bold shadow-[2px_2px_0px_0px_#000000] focus:outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-black"
            aria-label="Select model to compare"
          >
            <option value="">Select model to compare...</option>
            {models.filter(m => m.name !== selectedModel).map(m => (
              <option key={m.id} value={m.name}>{m.name}</option>
            ))}
          </select>

          {compareModelData && (
            <div className="mt-4 border-[3px] border-black bg-white shadow-[2px_2px_0px_0px_#000000] overflow-hidden">
              <div className="bg-black text-white p-2 text-xs font-bold uppercase text-center">Benchmark Results</div>
              <table className="w-full text-sm text-left">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="p-2 font-bold bg-gray-50 w-1/3 text-black">Metric</td>
                    <td className="p-2 font-bold text-[hsl(var(--workspace-accent))] w-1/3">{currentModelData.name}</td>
                    <td className="p-2 font-bold text-blue-600 w-1/3">{compareModelData.name}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-2 font-medium bg-gray-50 text-black">VRAM</td>
                    <td className="p-2 text-black">{currentModelData.requiredVram || 7} GB</td>
                    <td className="p-2 text-black">{compareModelData.requiredVram || 7} GB</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-2 font-medium bg-gray-50 text-black">Context</td>
                    <td className="p-2 text-black">{(currentModelData.contextWindow || 8192)/1000}k</td>
                    <td className="p-2 text-black">{(compareModelData.contextWindow || 8192)/1000}k</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium bg-gray-50 text-black">Speed</td>
                    <td className="p-2 text-black">{currentModelData.tokensPerSec || 40} t/s</td>
                    <td className="p-2 text-black">{compareModelData.tokensPerSec || 40} t/s</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Temperature */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label htmlFor="temp-slider" className="font-bold text-sm text-black uppercase tracking-wider flex items-center gap-1.5">
              <Sliders size={16}/> Temperature
            </label>
            <span className="font-black bg-black text-white px-2 py-0.5 text-xs">{temperature.toFixed(2)}</span>
          </div>
          <input 
            id="temp-slider"
            type="range" 
            min="0" 
            max="2" 
            step="0.01" 
            value={temperature}
            onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-[#E5E7EB] rounded-none appearance-none cursor-pointer border-2 border-black [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-[hsl(var(--workspace-accent))] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          />
          <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase">
            <span>Precise (0.0)</span>
            <span>Creative (2.0)</span>
          </div>
        </div>

        {/* Max Tokens */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label htmlFor="tokens-slider" className="font-bold text-sm text-black uppercase tracking-wider flex items-center gap-1.5">
              <AlignLeft size={16}/> Max Tokens
            </label>
            <span className="font-black bg-black text-white px-2 py-0.5 text-xs">{maxTokens.toLocaleString()}</span>
          </div>
          <input 
            id="tokens-slider"
            type="range" 
            min="1" 
            max="8192" 
            step="1" 
            value={maxTokens}
            onChange={(e) => onMaxTokensChange(parseInt(e.target.value))}
            className="w-full h-2 bg-[#E5E7EB] rounded-none appearance-none cursor-pointer border-2 border-black [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-[hsl(var(--workspace-highlight))] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          />
        </div>

        {/* System Prompt */}
        <div className="space-y-3">
          <label htmlFor="system-prompt" className="font-bold text-sm text-black uppercase tracking-wider flex items-center gap-1.5">
            <Server size={16}/> System Prompt
          </label>
          <textarea 
            id="system-prompt"
            value={systemPrompt}
            onChange={(e) => onSystemPromptChange(e.target.value)}
            className="w-full border-[3px] border-black bg-[hsl(var(--workspace-bg))] p-3 text-sm font-medium text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_#000000] transition-shadow resize-y min-h-[120px]"
            placeholder="You are a helpful AI assistant..."
          />
          <p className="text-xs font-bold text-gray-500">Guides the model's behavior and personality.</p>
        </div>

      </div>
    </div>
  );
};

export default ModelComparisonPanel;
