
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { MODELS } from '@/data/modelDatabase.js';
import { calculateWeightMemory, calculateKVCache, calculateActivationOverhead, calculateTotalVRAM, getHardwareCompatibility } from '@/utils/vramCalculator.js';
import { Copy, Trash2, Calculator } from 'lucide-react';
import { toast } from 'sonner';

import AdvancedControls from '@/components/calculator/AdvancedControls.jsx';
import MemoryBreakdownPanel from '@/components/calculator/MemoryBreakdownPanel.jsx';
import HardwareCompatibilityMatrix from '@/components/calculator/HardwareCompatibilityMatrix.jsx';
import PresetConfigurations from '@/components/calculator/PresetConfigurations.jsx';
import ComparisonMode from '@/components/calculator/ComparisonMode.jsx';
import ModelSelector from '@/components/ModelSelector.jsx';
import ModelInfoPanel from '@/components/ModelInfoPanel.jsx';
import ModelComparison from '@/components/ModelComparison.jsx';
import { MODELS_LLM } from '@/data/llmModelsDatabase.js';

const CalculatorPage = () => {
  // HW State
  const [selectedHwModelId, setSelectedHwModelId] = useState(MODELS[0].id);
  const [quantization, setQuantization] = useState(4);
  const [context, setContext] = useState(8);
  const [batchSize, setBatchSize] = useState(1);
  const [flashAttention, setFlashAttention] = useState(true);
  const [comparedModels, setComparedModels] = useState([]);
  const [isCompareMode, setIsCompareMode] = useState(false);

  // API Calculator State
  const [selectedApiModelId, setSelectedApiModelId] = useState('gpt-4');
  const [inputTokens, setInputTokens] = useState(1000);
  const [outputTokens, setOutputTokens] = useState(1000);

  const selectedHwModel = MODELS.find(m => m.id === selectedHwModelId) || MODELS[0];
  const selectedApiModel = MODELS_LLM.find(m => m.id === selectedApiModelId) || MODELS_LLM[0];

  // Calculations HW
  const weights = calculateWeightMemory(selectedHwModel.parameters, quantization);
  const kvCache = calculateKVCache(batchSize, context * 1000, selectedHwModel.num_layers, selectedHwModel.num_heads_kv, selectedHwModel.head_dim, 16);
  const activation = calculateActivationOverhead(selectedHwModel.parameters, context * 1000, flashAttention);
  const totalVRAM = calculateTotalVRAM(weights, kvCache, activation);
  const hardware = getHardwareCompatibility(totalVRAM);

  // Calculations API
  const apiInputCost = (inputTokens / 1000) * selectedApiModel.inputTokenPrice;
  const apiOutputCost = (outputTokens / 1000) * selectedApiModel.outputTokenPrice;
  const apiTotalCost = (apiInputCost + apiOutputCost).toFixed(4);

  const handleApplyPreset = (preset) => {
    setContext(preset.ctx);
    setBatchSize(preset.batch);
    setQuantization(preset.q);
  };

  const handleToggleCompare = () => {
    if (!isCompareMode && comparedModels.length === 0) {
      setComparedModels([selectedHwModelId]);
    }
    setIsCompareMode(!isCompareMode);
  };

  const handleRemoveCompare = (id) => {
    setComparedModels(comparedModels.filter(m => m !== id));
    if (comparedModels.length <= 1) setIsCompareMode(false);
  };

  const handleCopyApiResults = () => {
    const text = `API Cost Estimate for ${selectedApiModel.name}:\nTokens: ${inputTokens} In / ${outputTokens} Out\nTotal Cost: $${apiTotalCost}`;
    navigator.clipboard.writeText(text);
    toast.success('Results copied to clipboard');
  };

  const handleClearApiInputs = () => {
    setInputTokens(0);
    setOutputTokens(0);
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 pt-12 px-4 space-y-24">
      <Helmet>
        <title>Infrastructure & Cost Calculator | OdysseusAI</title>
      </Helmet>

      {/* --- API INFERENCE COST CALCULATOR --- */}
      <section>
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black bg-primary text-black text-sm font-black mb-4 uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Cloud Economics
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase leading-none mb-4 text-balance">
            API Cost Calculator
          </h1>
          <p className="text-lg font-bold max-w-3xl text-muted-foreground text-balance">
            Estimate execution costs across all major proprietary and open-weight models based on actual token volumes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#FFFDF0] border-4 border-black p-6 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full">
              <label className="block text-sm font-black uppercase tracking-widest mb-3 border-b-2 border-black pb-1">
                Select Model
              </label>
              <div className="mb-6">
                <ModelSelector 
                  selectedModelId={selectedApiModelId} 
                  onModelSelect={setSelectedApiModelId} 
                />
              </div>

              <label className="block text-sm font-black uppercase tracking-widest mb-3 border-b-2 border-black pb-1">
                Token Volumes
              </label>
              
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-widest">
                    <span>Input Tokens</span>
                    <span>{inputTokens.toLocaleString()}</span>
                  </div>
                  <input 
                    type="number" 
                    min="0"
                    step="100"
                    value={inputTokens}
                    onChange={(e) => setInputTokens(Number(e.target.value) || 0)}
                    className="w-full border-2 border-black rounded bg-white p-2 font-mono font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-widest">
                    <span>Output Tokens</span>
                    <span>{outputTokens.toLocaleString()}</span>
                  </div>
                  <input 
                    type="number" 
                    min="0"
                    step="100"
                    value={outputTokens}
                    onChange={(e) => setOutputTokens(Number(e.target.value) || 0)}
                    className="w-full border-2 border-black rounded bg-white p-2 font-mono font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div className="mt-auto bg-black text-white border-4 border-black rounded-lg p-5">
                <div className="text-xs font-black uppercase tracking-widest mb-2 text-primary">Total Estimated Cost</div>
                <div className="text-4xl font-black mb-1">${apiTotalCost}</div>
                <div className="text-xs font-medium text-white/70">
                  Input: ${apiInputCost.toFixed(4)} | Output: ${apiOutputCost.toFixed(4)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button 
                  onClick={handleCopyApiResults}
                  className="bg-[#B3DDF2] border-2 border-black text-black font-black uppercase text-xs py-3 rounded-md hover:bg-[#9ACCE8] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2"
                >
                  <Copy size={16} /> Copy
                </button>
                <button 
                  onClick={handleClearApiInputs}
                  className="bg-white border-2 border-black text-black font-black uppercase text-xs py-3 rounded-md hover:bg-slate-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} /> Clear
                </button>
              </div>
            </div>
          </div>

          {/* Info and Comparison */}
          <div className="lg:col-span-8 space-y-6">
            <ModelInfoPanel selectedModelId={selectedApiModelId} />
            <ModelComparison 
              selectedModelId={selectedApiModelId}
              inputTokens={inputTokens}
              outputTokens={outputTokens}
            />
          </div>
        </div>
      </section>

      <div className="w-full border-t-8 border-black border-dashed opacity-20 my-16"></div>

      {/* --- HARDWARE VRAM CALCULATOR --- */}
      <section>
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black bg-secondary text-black text-sm font-black mb-4 uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Local Deployment
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase leading-none mb-4 text-balance">
            Hardware VRAM Calculator
          </h2>
          <p className="text-lg font-bold max-w-3xl text-muted-foreground text-balance">
            Precise hardware estimation based on model architecture, quantization, context length, and attention mechanisms for local hosting.
          </p>
        </div>

        <PresetConfigurations onApplyPreset={handleApplyPreset} />

        <div className="flex justify-end mb-4">
          <button 
            onClick={handleToggleCompare}
            className={`neo-button py-2 px-4 text-sm ${isCompareMode ? 'bg-accent text-accent-foreground' : 'bg-card'}`}
          >
            {isCompareMode ? 'Close Comparison' : 'Compare Models'}
          </button>
        </div>

        {isCompareMode && (
          <div className="mb-8">
            <div className="flex gap-4 items-center mb-4">
              <select 
                className="neo-input rounded-[var(--radius-md)] py-2 w-auto"
                onChange={(e) => {
                  if (!comparedModels.includes(e.target.value) && comparedModels.length < 3) {
                    setComparedModels([...comparedModels, e.target.value]);
                  }
                }}
                value=""
              >
                <option value="" disabled>Add model to compare...</option>
                {MODELS.map(m => (
                  <option key={m.id} value={m.id} disabled={comparedModels.includes(m.id)}>{m.name}</option>
                ))}
              </select>
            </div>
            <ComparisonMode 
              comparedModels={comparedModels} 
              onRemove={handleRemoveCompare}
              quantization={quantization}
              context={context}
              batchSize={batchSize}
              flashAttention={flashAttention}
            />
          </div>
        )}

        <AdvancedControls 
          selectedModelId={selectedHwModelId} setSelectedModelId={setSelectedHwModelId}
          quantization={quantization} setQuantization={setQuantization}
          context={context} setContext={setContext}
          batchSize={batchSize} setBatchSize={setBatchSize}
          flashAttention={flashAttention} setFlashAttention={setFlashAttention}
        />

        <MemoryBreakdownPanel 
          weights={weights}
          kvCache={kvCache}
          activation={activation}
          total={totalVRAM}
        />

        <HardwareCompatibilityMatrix hardware={hardware} />
      </section>

    </div>
  );
};

export default CalculatorPage;
