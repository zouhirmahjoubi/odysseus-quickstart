
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Copy, Check, AlertTriangle, RefreshCw, Wrench, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDiagnosticResult } from '@/services/DiagnosticService.js';
import { toast } from 'sonner';

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
    <div className="max-w-4xl mx-auto pb-24 pt-6 md:pt-12 px-4 sm:px-6">
      <Helmet>
        <title>Triage Wizard | Error Diagnostics</title>
      </Helmet>

      <div>
        <Link 
          to="/" 
          className="neo-button bg-white text-black text-sm py-2 px-4 mb-8 flex items-center gap-2 w-fit"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={3} />
          BACK TO HOME
        </Link>

        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black bg-primary text-black text-sm font-black mb-4 uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Terminal size={16} strokeWidth={3} /> Diagnostics
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase leading-none mb-4 text-balance">
            Triage Wizard
          </h1>
          <p className="text-lg font-bold max-w-3xl text-muted-foreground text-balance">
            Select your environment parameters to generate a targeted diagnostic report for your local AI stack.
          </p>
        </header>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="neo-card bg-[#FFFDF0] p-6 md:p-8 flex flex-col"
            >
              <div className="space-y-6">
                <div>
                  <label htmlFor="os" className="block text-sm font-black uppercase tracking-widest mb-3 border-b-2 border-black pb-1 text-black">
                    1. Operating System
                  </label>
                  <select
                    id="os"
                    name="os"
                    value={selections.os}
                    onChange={handleSelectChange}
                    className="neo-input"
                  >
                    <option value="" disabled>Select your OS...</option>
                    {OPTIONS.os.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="installRoute" className="block text-sm font-black uppercase tracking-widest mb-3 border-b-2 border-black pb-1 text-black">
                    2. Installation Route
                  </label>
                  <select
                    id="installRoute"
                    name="installRoute"
                    value={selections.installRoute}
                    onChange={handleSelectChange}
                    className="neo-input"
                  >
                    <option value="" disabled>Select installation route...</option>
                    {OPTIONS.installRoute.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="stage" className="block text-sm font-black uppercase tracking-widest mb-3 border-b-2 border-black pb-1 text-black">
                    3. Failure Stage
                  </label>
                  <select
                    id="stage"
                    name="stage"
                    value={selections.stage}
                    onChange={handleSelectChange}
                    className="neo-input"
                  >
                    <option value="" disabled>Select when it failed...</option>
                    {OPTIONS.stage.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-black uppercase tracking-widest mb-3 border-b-2 border-black pb-1 text-black">
                    4. Symptom Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={selections.category}
                    onChange={handleSelectChange}
                    className="neo-input"
                  >
                    <option value="" disabled>Select the primary symptom...</option>
                    {OPTIONS.category.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t-[3px] border-black flex justify-end">
                <button
                  onClick={runTriage}
                  disabled={!isComplete || isAnalyzing}
                  className={`neo-button text-black font-black uppercase py-4 px-8 text-base md:text-lg ${
                    !isComplete || isAnalyzing
                      ? 'bg-slate-300 opacity-50 cursor-not-allowed shadow-none hover:translate-x-0 hover:translate-y-0' 
                      : 'bg-secondary'
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
              <div className="neo-card bg-[hsl(var(--primary))] p-6 md:p-8 relative overflow-hidden">
                <h2 className="text-2xl md:text-3xl font-black uppercase mb-4 text-black">{result.title}</h2>
                <p className="font-poppins font-semibold text-black/85 mb-8 leading-relaxed text-base md:text-lg">{result.verdict}</p>

                {result.command && (
                  <div className="mb-8">
                    <h3 className="text-black text-sm font-black mb-3 uppercase tracking-wider border-b border-black pb-1">Execute Diagnostic Command</h3>
                    <div className="relative bg-black text-primary p-4 pr-16 rounded-[var(--border-radius-lg)] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-x-auto font-mono text-sm">
                      <code>{result.command}</code>
                      <button 
                        onClick={() => handleCopy(result.command)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 neo-button bg-white text-black py-1.5 px-3 text-xs"
                        aria-label="Copy code"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} /> : <Copy className="w-3.5 h-3.5" strokeWidth={3} />}
                      </button>
                    </div>
                  </div>
                )}

                {result.actions && result.actions.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-black text-sm font-black mb-3 uppercase tracking-wider border-b border-black pb-1">Next Actions</h3>
                    <ul className="space-y-3 font-poppins">
                      {result.actions.map((action, i) => (
                        <li key={i} className="flex items-start gap-3 text-black font-semibold">
                          <div className="mt-1.5 min-w-[8px] w-2 h-2 bg-black"></div>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.avoid && result.avoid.length > 0 && (
                  <div className="bg-[#fee2e2] border-[4px] border-black rounded-[var(--border-radius-lg)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 mt-8 text-black">
                    <h3 className="flex items-center gap-2 text-red-600 text-sm font-black mb-3 uppercase tracking-wider">
                      <ShieldAlert className="w-4 h-4" strokeWidth={3} /> What you MUST avoid doing
                    </h3>
                    <ul className="space-y-2 font-poppins">
                      {result.avoid.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-black font-semibold">
                          <AlertTriangle className="w-4 h-4 min-w-[16px] text-red-600 mt-0.5" strokeWidth={3} />
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
                  className="neo-button bg-white text-black font-black py-3 px-6 text-sm sm:text-base uppercase"
                >
                  Request Fix Report
                </button>
                <button
                  onClick={handleReset}
                  className="neo-button bg-accent text-black font-black py-3 px-6 text-sm sm:text-base uppercase"
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
