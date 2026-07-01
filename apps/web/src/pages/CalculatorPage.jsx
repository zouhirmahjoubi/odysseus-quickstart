
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { MODELS } from '@/data/modelDatabase.js';
import { calculateWeightMemory, calculateKVCache, calculateActivationOverhead, calculateTotalVRAM, getHardwareCompatibility } from '@/utils/vramCalculator.js';
import { Copy, Trash2, Sparkles, Cpu, DollarSign, Zap, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip } from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn, Reveal } from '@/components/ScrollAnimations.jsx';

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
    if (!isCompareMode && comparedModels.length === 0) setComparedModels([selectedHwModelId]);
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

  // Cost proportion for bar
  const inputPct = apiInputCost + apiOutputCost > 0
    ? (apiInputCost / (apiInputCost + apiOutputCost)) * 100
    : 50;

  return (
    <div className="max-w-7xl mx-auto px-4 pt-12 pb-24 font-rounded">
      <Helmet>
        <title>Infrastructure & Cost Calculator | OdysseusAI</title>
        <meta name="description" content="Calculate AI API costs and VRAM requirements across 50+ models. Estimate monthly spend, hardware compatibility, and memory breakdown for local LLM deployment." />
      </Helmet>

      {/* ── Hero ── */}
      <div className="text-center mb-14 select-none">
        <FadeIn direction="down" distance={20} delay={0.05}>
          <div className="inline-flex items-center gap-2 bg-[#E73A5A]/10 px-4 py-1.5 rounded-full border border-[#E73A5A]/20 text-sm font-bold mb-6">
            <span className="bg-[#E73A5A] px-2 py-0.5 rounded-full text-xs text-white font-black">CALC</span>
            <span className="text-gray-300">API Costs + VRAM Requirements — All in One Place</span>
          </div>
        </FadeIn>

        <FadeIn direction="up" distance={30} delay={0.1}>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Infrastructure &amp;{' '}
            <span className="text-[#E73A5A] bg-[#E73A5A]/10 px-4 py-1 border border-[#E73A5A]/20 rounded-3xl inline-block transform -rotate-1 shadow-[0_0_15px_rgba(231, 58, 90,0.2)]">
              Cost Calculator
            </span>
          </h1>
        </FadeIn>

        <FadeIn direction="up" distance={20} delay={0.2}>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Estimate API spend across cloud providers and calculate exact VRAM requirements for local model deployment.
          </p>
        </FadeIn>

        {/* Stats strip */}
        <FadeIn direction="up" distance={16} delay={0.3}>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { icon: '☁️', val: `${MODELS_LLM.length}+`, label: 'API Models' },
              { icon: '💻', val: `${MODELS.length}+`, label: 'Local Models' },
              { icon: '⚡', val: 'Live', label: 'Calculation' },
              { icon: '🎛️', val: 'VRAM', label: '+ Cost' },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-3 backdrop-blur-md">
                <span className="text-xl">{s.icon}</span>
                <div className="text-left">
                  <div className="text-lg font-black text-white leading-none">{s.val}</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 1 — API COST CALCULATOR
      ═══════════════════════════════════════════ */}
      <section className="mb-20">
        <FadeIn direction="up" distance={20}>
          <div className="flex items-center gap-3 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#E73A5A]/20 bg-[#E73A5A]/10 text-[#E73A5A] font-black text-sm uppercase tracking-widest rounded-xl">
              <Sparkles size={14} /> Cloud Economics
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">API Cost Calculator</h2>
          </div>
          <p className="text-sm font-semibold text-gray-400 max-w-2xl mb-8">
            Estimate execution costs across all major proprietary and open-weight models based on actual token volumes.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls column */}
          <FadeIn direction="left" distance={30} className="lg:col-span-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl flex flex-col h-full backdrop-blur-md overflow-hidden">
              {/* Header */}
              <div className="bg-white/5 px-5 py-4 border-b border-white/10">
                <span className="text-xs font-black uppercase tracking-widest text-[#E73A5A]">Select Model</span>
              </div>
              <div className="p-5 flex flex-col flex-grow gap-5">
                {/* Model picker */}
                <div>
                  <ModelSelector selectedModelId={selectedApiModelId} onModelSelect={setSelectedApiModelId} />
                </div>

                {/* Token inputs */}
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 border-b border-white/10 pb-2">
                    Token Volumes
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-1.5 text-gray-400">
                        <span>Input Tokens</span>
                        <span className="font-mono text-white">{inputTokens.toLocaleString()}</span>
                      </div>
                      <input
                        type="number"
                        min={0}
                        step={100}
                        value={inputTokens}
                        onChange={e => setInputTokens(Number(e.target.value) || 0)}
                        className="w-full border border-white/10 rounded-xl px-3 py-2 font-mono font-bold text-sm text-white bg-white/5 outline-none focus:ring-2 focus:ring-[#E73A5A] transition-all"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-1.5 text-gray-400">
                        <span>Output Tokens</span>
                        <span className="font-mono text-white">{outputTokens.toLocaleString()}</span>
                      </div>
                      <input
                        type="number"
                        min={0}
                        step={100}
                        value={outputTokens}
                        onChange={e => setOutputTokens(Number(e.target.value) || 0)}
                        className="w-full border border-white/10 rounded-xl px-3 py-2 font-mono font-bold text-sm text-white bg-white/5 outline-none focus:ring-2 focus:ring-[#E73A5A] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Total cost result */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={apiTotalCost}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-auto"
                  >
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-5 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                      <div className="text-[10px] font-black uppercase tracking-widest text-[#E73A5A] mb-1">Total Estimated Cost</div>
                      <div className="text-4xl font-black text-white mb-1">${apiTotalCost}</div>
                      <div className="text-[10px] font-medium text-white/60">
                        Input: ${apiInputCost.toFixed(4)} &nbsp;|&nbsp; Output: ${apiOutputCost.toFixed(4)}
                      </div>
                      {/* Cost proportion bar */}
                      <div className="flex gap-0.5 mt-3 h-2.5 rounded-full overflow-hidden border border-white/10 bg-white/5">
                        <motion.div
                          className="bg-[#E73A5A] h-full rounded-l-full"
                          animate={{ width: `${inputPct}%` }}
                          transition={{ duration: 0.5 }}
                        />
                        <motion.div
                          className="bg-[#E73A5A]/50 h-full rounded-r-full"
                          animate={{ width: `${100 - inputPct}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-white/40 font-bold mt-1">
                        <span>Input</span><span>Output</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleCopyApiResults}
                    className="bg-[#E73A5A] text-white font-black text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 uppercase tracking-wide"
                  >
                    <Copy size={13} /> Copy
                  </button>
                  <button
                    onClick={handleClearApiInputs}
                    className="bg-white/5 border border-white/10 text-white font-black text-xs py-2.5 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-1.5 uppercase tracking-wide"
                  >
                    <Trash2 size={13} /> Clear
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Info + comparison column */}
          <div className="lg:col-span-8 space-y-5">
            <FadeIn direction="right" distance={30} delay={0.1}>
              <ModelInfoPanel selectedModelId={selectedApiModelId} />
            </FadeIn>
            <FadeIn direction="right" distance={30} delay={0.2}>
              <ModelComparison
                selectedModelId={selectedApiModelId}
                inputTokens={inputTokens}
                outputTokens={outputTokens}
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Divider */}
      <FadeIn direction="none">
        <div className="flex items-center gap-4 my-4">
          <div className="flex-1 border-t border-dashed border-white/10" />
          <span className="text-xs font-black uppercase tracking-widest text-gray-400 bg-[#0a0a0a] px-4 py-1.5 border border-white/10 rounded-full">
            Local Deployment ↓
          </span>
          <div className="flex-1 border-t border-dashed border-white/10" />
        </div>
      </FadeIn>

      {/* ─── SECTION 2 — VRAM CALCULATOR ─── */}
      <section className="mt-8">
        <FadeIn direction="up" distance={20}>
          <div className="flex items-center gap-3 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#E73A5A]/20 bg-[#E73A5A]/10 text-[#E73A5A] font-black text-sm uppercase tracking-widest rounded-xl">
              <Cpu size={14} /> Local Deployment
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">Hardware VRAM Calculator</h2>
          </div>
          <p className="text-sm font-semibold text-gray-400 max-w-2xl mb-8">
            Precise hardware estimation based on model architecture, quantization, context length, and attention mechanisms for local hosting.
          </p>
        </FadeIn>

        {/* Preset configs */}
        <FadeIn direction="up" distance={16} delay={0.1}>
          <PresetConfigurations onApplyPreset={handleApplyPreset} />
        </FadeIn>

        {/* Compare toggle */}
        <FadeIn direction="up" distance={12} delay={0.15}>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleToggleCompare}
              className={`border border-white/10 font-black uppercase text-sm py-2.5 px-6 rounded-xl transition-all ${isCompareMode ? 'bg-[#E73A5A] text-white' : 'bg-white/5 hover:bg-white/10 text-white'}`}
            >
              {isCompareMode ? '✕ Close Comparison' : '⇄ Compare Models'}
            </button>
          </div>
        </FadeIn>

        <AnimatePresence>
          {isCompareMode && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md mb-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Add model to compare (max 3)</label>
                <select
                  className="border border-white/10 rounded-xl bg-[#0a0a0a] text-white font-bold text-sm py-2 px-3 outline-none focus:ring-2 focus:ring-[#E73A5A] transition-all"
                  onChange={e => {
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Advanced controls */}
        <FadeIn direction="up" distance={16} delay={0.2}>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-6 backdrop-blur-md">
            <div className="bg-white/5 px-5 py-4 border-b border-white/10">
              <span className="text-xs font-black uppercase tracking-widest text-[#E73A5A]">⚙️ Model & Runtime Configuration</span>
            </div>
            <div className="p-5">
              <AdvancedControls
                selectedModelId={selectedHwModelId} setSelectedModelId={setSelectedHwModelId}
                quantization={quantization} setQuantization={setQuantization}
                context={context} setContext={setContext}
                batchSize={batchSize} setBatchSize={setBatchSize}
                flashAttention={flashAttention} setFlashAttention={setFlashAttention}
              />
            </div>
          </div>
        </FadeIn>

        {/* Memory breakdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
          className="mb-6"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
            <div className="bg-white/5 px-5 py-4 border-b border-white/10">
              <span className="text-xs font-black uppercase tracking-widest text-[#E73A5A]">📊 Memory Breakdown</span>
            </div>
            <div className="p-5">
              <MemoryBreakdownPanel weights={weights} kvCache={kvCache} activation={activation} total={totalVRAM} />
            </div>
          </div>
        </motion.div>

        {/* Hardware compatibility */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
            <div className="bg-white/5 px-5 py-4 border-b border-white/10">
              <span className="text-xs font-black uppercase tracking-widest text-[#E73A5A]">🖥️ Hardware Compatibility Matrix</span>
            </div>
            <div className="p-5">
              <HardwareCompatibilityMatrix hardware={hardware} />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Bottom CTA ── */}
      <Reveal delay={0.1}>
        <div className="mt-20 bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 text-center select-none backdrop-blur-md">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
            Ready to deploy a model locally?
          </h2>
          <p className="text-sm text-gray-400 font-semibold max-w-lg mx-auto mb-6">
            Install Odysseus AI and connect any local model with Ollama — no cloud, no API keys, 100% private.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/odysseus-ai-install" className="bg-[#E73A5A] text-white px-8 py-4 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(231, 58, 90,0.3)] hover:bg-[#E73A5A]/85">
              Install Odysseus AI →
            </a>
            <a href="/benchmark" className="bg-white/5 text-white border border-white/10 hover:bg-white/10 px-8 py-4 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-2">
              View Benchmark Rankings →
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  );
};

export default CalculatorPage;
