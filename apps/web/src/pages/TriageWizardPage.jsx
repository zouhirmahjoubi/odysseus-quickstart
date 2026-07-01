
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Copy, Check, AlertTriangle, RefreshCw, Wrench, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDiagnosticResult } from '@/services/DiagnosticService.js';
import { toast } from 'sonner';
import FeaturedLaunchKitCard from '@/components/FeaturedLaunchKitCard.jsx';

const OPTIONS = {
  os: [
    { label: 'macOS Silicon', value: 'macos_silicon' },
    { label: 'macOS Intel', value: 'macos_intel' },
    { label: 'Windows', value: 'windows' },
    { label: 'Linux', value: 'linux' }
  ],
  installRoute: [
    { label: 'macOS Native', value: 'macos_native' },
    { label: 'Docker', value: 'docker' },
    { label: 'Source', value: 'source' }
  ],
  stage: [
    { label: 'Runtime', value: 'runtime' },
    { label: 'Post-Installation', value: 'post_install' },
    { label: 'Model Loading', value: 'model_loading' }
  ],
  category: [
    { label: 'Ollama Missing', value: 'ollama_missing' },
    { label: 'Network Timeout', value: 'network_timeout' },
    { label: 'GPU/VRAM / CUDA Error', value: 'cuda_error' }
  ]
};

const TriageWizardPage = () => {
  const [selections, setSelections] = useState({
    os: '',
    installRoute: '',
    stage: '',
    category: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setSelections(prev => ({ ...prev, [name]: value }));
  };

  const isComplete = selections.os && selections.installRoute && selections.stage && selections.category;

  const runTriage = () => {
    if (!isComplete) {
      toast.error('Please complete all selections before running diagnostics.');
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate diagnostic analysis delay
    setTimeout(() => {
      const outcome = getDiagnosticResult(selections);
      setResult(outcome);
      setIsAnalyzing(false);
      toast.success('Diagnostics generated successfully.');
    }, 1200);
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Command copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy command');
    }
  };

  const handleReset = () => {
    setSelections({ os: '', installRoute: '', stage: '', category: '' });
    setResult(null);
    setIsAnalyzing(false);
    toast.info('Wizard reset.');
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 pt-6 md:pt-12 px-4 sm:px-6 text-left">
      <Helmet>
        <title>Triage Wizard | Error Diagnostics</title>
      </Helmet>

      <div>
        <Link 
          to="/" 
          className="bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-2 w-fit mb-8 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={3} />
          BACK TO HOME
        </Link>

        <header className="mb-14 select-none">
          <div className="flex items-center gap-2 bg-[#FF6B00]/10 px-4 py-1.5 rounded-full border border-[#FF6B00]/20 text-sm font-bold mb-6 inline-flex">
            <Terminal size={14} strokeWidth={3} className="text-[#FF6B00]" />
            <span className="text-gray-300 font-bold">Error Diagnostics</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Triage{' '}
            <span className="text-[#FF6B00] bg-[#FF6B00]/10 px-4 py-1 border border-[#FF6B00]/20 rounded-3xl inline-block transform -rotate-1 shadow-[0_0_15px_rgba(255,107,0,0.2)]">
              Wizard
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl font-medium leading-relaxed">
            Select your environment parameters to generate a targeted diagnostic report for your local AI stack.
          </p>
        </header>

        {/* Featured Launch Kit Promo */}
        <div className="mb-12">
          <FeaturedLaunchKitCard />
        </div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col backdrop-blur-md"
            >
              <div className="space-y-6">
                <div>
                  <label htmlFor="os" className="block text-xs font-black uppercase tracking-widest text-[#FF6B00] mb-2">
                    1. Operating System
                  </label>
                  <select
                    id="os"
                    name="os"
                    value={selections.os}
                    onChange={handleSelectChange}
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      color: 'var(--input-text)',
                      borderColor: 'var(--input-border)'
                    }}
                    className="w-full rounded-xl font-bold p-3 outline-none focus:ring-2 focus:ring-[#FF6B00] transition-all cursor-pointer border"
                  >
                    <option value="" disabled style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-muted)' }}>Select your OS...</option>
                    {OPTIONS.os.map(opt => (
                      <option key={opt.value} value={opt.value} style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="installRoute" className="block text-xs font-black uppercase tracking-widest text-[#FF6B00] mb-2">
                    2. Installation Route
                  </label>
                  <select
                    id="installRoute"
                    name="installRoute"
                    value={selections.installRoute}
                    onChange={handleSelectChange}
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      color: 'var(--input-text)',
                      borderColor: 'var(--input-border)'
                    }}
                    className="w-full rounded-xl font-bold p-3 outline-none focus:ring-2 focus:ring-[#FF6B00] transition-all cursor-pointer border"
                  >
                    <option value="" disabled style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-muted)' }}>Select installation route...</option>
                    {OPTIONS.installRoute.map(opt => (
                      <option key={opt.value} value={opt.value} style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="stage" className="block text-xs font-black uppercase tracking-widest text-[#FF6B00] mb-2">
                    3. Failure Stage
                  </label>
                  <select
                    id="stage"
                    name="stage"
                    value={selections.stage}
                    onChange={handleSelectChange}
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      color: 'var(--input-text)',
                      borderColor: 'var(--input-border)'
                    }}
                    className="w-full rounded-xl font-bold p-3 outline-none focus:ring-2 focus:ring-[#FF6B00] transition-all cursor-pointer border"
                  >
                    <option value="" disabled style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-muted)' }}>Select when it failed...</option>
                    {OPTIONS.stage.map(opt => (
                      <option key={opt.value} value={opt.value} style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="category" className="block text-xs font-black uppercase tracking-widest text-[#FF6B00] mb-2">
                    4. Symptom Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={selections.category}
                    onChange={handleSelectChange}
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      color: 'var(--input-text)',
                      borderColor: 'var(--input-border)'
                    }}
                    className="w-full rounded-xl font-bold p-3 outline-none focus:ring-2 focus:ring-[#FF6B00] transition-all cursor-pointer border"
                  >
                    <option value="" disabled style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-muted)' }}>Select the primary symptom...</option>
                    {OPTIONS.category.map(opt => (
                      <option key={opt.value} value={opt.value} style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                <button
                  onClick={runTriage}
                  disabled={!isComplete || isAnalyzing}
                  className={`w-full sm:w-auto font-black uppercase py-4 px-8 text-sm tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${
                    !isComplete || isAnalyzing
                      ? 'bg-white/5 border border-white/10 text-white/40 cursor-not-allowed' 
                      : 'bg-[#FF6B00] text-black border border-[#FF6B00]/30 shadow-[0_0_15px_rgba(255,107,0,0.2)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin mr-2" strokeWidth={3} />
                      Analyzing Stack...
                    </>
                  ) : (
                    <>
                      <Wrench className="w-5 h-5 mr-2" strokeWidth={3} />
                      Run Local Diagnostics
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden backdrop-blur-md text-left">
                <h2 className="text-2xl md:text-3xl font-black uppercase mb-4 text-white">{result.title}</h2>
                <p className="font-bold text-gray-300 mb-8 leading-relaxed text-base md:text-lg">{result.verdict}</p>

                {result.command && (
                  <div className="mb-8 text-left">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#FF6B00] mb-3 border-b border-white/10 pb-1.5">Execute Diagnostic Command</h3>
                    <div className="relative bg-black/40 border border-white/10 p-4 pr-16 rounded-2xl overflow-x-auto font-mono text-sm text-[#FF6B00]">
                      <code>{result.command}</code>
                      <button 
                        onClick={() => handleCopy(result.command)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-lg p-2 transition-all cursor-pointer"
                        aria-label="Copy code"
                      >
                        {copied ? <Check className="w-4 h-4 text-[#FF6B00]" strokeWidth={2} /> : <Copy className="w-4 h-4 text-white" strokeWidth={2} />}
                      </button>
                    </div>
                  </div>
                )}

                {result.actions && result.actions.length > 0 && (
                  <div className="mb-8 text-left">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#FF6B00] mb-3 border-b border-white/10 pb-1.5">Next Actions</h3>
                    <ul className="space-y-3">
                      {result.actions.map((action, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-300 font-semibold text-sm">
                          <div className="mt-1.5 min-w-[6px] w-1.5 h-1.5 bg-[#FF6B00] rounded-full"></div>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.avoid && result.avoid.length > 0 && (
                  <div className="bg-[#FF6B00]/5 border border-[#FF6B00]/20 rounded-2xl p-5 mt-8 text-left">
                    <h3 className="flex items-center gap-2 text-[#FF6B00] text-xs font-black mb-3 uppercase tracking-wider">
                      <ShieldAlert className="w-4 h-4 text-[#FF6B00]" strokeWidth={2.5} /> What you MUST avoid doing
                    </h3>
                    <ul className="space-y-2">
                      {result.avoid.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-300 font-semibold">
                          <AlertTriangle className="w-4 h-4 min-w-[16px] text-[#FF6B00] mt-0.5 shrink-0" strokeWidth={2.5} />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8">
                <button
                  onClick={() => toast.success('Fix report request sent to engineering.')}
                  className="bg-white/5 border border-white/10 text-white hover:bg-white/10 font-black py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  Request Fix Report
                </button>
                <button
                  onClick={handleReset}
                  className="bg-[#FF6B00] text-black border border-[#FF6B00]/30 font-black py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_10px_rgba(255,107,0,0.2)] cursor-pointer"
                >
                  Reset Wizard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TriageWizardPage;
