
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
    <div className="min-h-screen bg-[var(--slate-900)] py-12 px-4 font-sans text-slate-200 selection:bg-[var(--cyan-500)] selection:text-white">
      <Helmet>
        <title>Triage Wizard | Error Diagnostics</title>
      </Helmet>

      <div className="max-w-[700px] mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-[var(--cyan-400)] hover:text-[var(--cyan-500)] mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--slate-800)] border border-[var(--cyan-500)] shadow-[0_0_20px_rgba(14,165,233,0.2)] mb-6">
            <Terminal className="w-8 h-8 text-[var(--cyan-400)]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">Triage Wizard</h1>
          <p className="text-slate-400 max-w-lg mx-auto">Select your environment parameters to generate a targeted diagnostic report for your local AI stack.</p>
        </header>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--slate-800)] p-6 md:p-8 rounded-xl border border-slate-700 shadow-2xl"
            >
              <div className="space-y-6">
                <div>
                  <label htmlFor="os" className="block text-[var(--cyan-400)] text-sm font-semibold mb-2 uppercase tracking-wider">
                    1. Operating System
                  </label>
                  <select
                    id="os"
                    name="os"
                    value={selections.os}
                    onChange={handleSelectChange}
                    className="w-full bg-[var(--slate-900)] border border-slate-700 text-slate-200 rounded-md py-3 px-4 outline-none focus:border-[var(--cyan-500)] focus:ring-1 focus:ring-[var(--cyan-500)] transition-all"
                  >
                    <option value="" disabled>Select your OS...</option>
                    {OPTIONS.os.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="installRoute" className="block text-[var(--cyan-400)] text-sm font-semibold mb-2 uppercase tracking-wider">
                    2. Installation Route
                  </label>
                  <select
                    id="installRoute"
                    name="installRoute"
                    value={selections.installRoute}
                    onChange={handleSelectChange}
                    className="w-full bg-[var(--slate-900)] border border-slate-700 text-slate-200 rounded-md py-3 px-4 outline-none focus:border-[var(--cyan-500)] focus:ring-1 focus:ring-[var(--cyan-500)] transition-all"
                  >
                    <option value="" disabled>Select installation route...</option>
                    {OPTIONS.installRoute.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="stage" className="block text-[var(--cyan-400)] text-sm font-semibold mb-2 uppercase tracking-wider">
                    3. Failure Stage
                  </label>
                  <select
                    id="stage"
                    name="stage"
                    value={selections.stage}
                    onChange={handleSelectChange}
                    className="w-full bg-[var(--slate-900)] border border-slate-700 text-slate-200 rounded-md py-3 px-4 outline-none focus:border-[var(--cyan-500)] focus:ring-1 focus:ring-[var(--cyan-500)] transition-all"
                  >
                    <option value="" disabled>Select when it failed...</option>
                    {OPTIONS.stage.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="category" className="block text-[var(--cyan-400)] text-sm font-semibold mb-2 uppercase tracking-wider">
                    4. Symptom Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={selections.category}
                    onChange={handleSelectChange}
                    className="w-full bg-[var(--slate-900)] border border-slate-700 text-slate-200 rounded-md py-3 px-4 outline-none focus:border-[var(--cyan-500)] focus:ring-1 focus:ring-[var(--cyan-500)] transition-all"
                  >
                    <option value="" disabled>Select the primary symptom...</option>
                    {OPTIONS.category.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-slate-700 flex justify-end">
                <button
                  onClick={runTriage}
                  disabled={!isComplete || isAnalyzing}
                  className={`flex items-center gap-2 px-8 py-3 rounded-md font-semibold text-white transition-all duration-300 ${
                    !isComplete || isAnalyzing
                      ? 'bg-slate-700 cursor-not-allowed opacity-50' 
                      : 'bg-[var(--cyan-500)] hover:bg-[var(--cyan-400)] hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] active:scale-[0.98]'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Analyzing Stack...
                    </>
                  ) : (
                    <>
                      <Wrench className="w-5 h-5" />
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
              className="space-y-6"
            >
              <div className="bg-[var(--slate-800)] p-6 md:p-8 rounded-xl border border-[var(--cyan-500)] shadow-[0_0_30px_rgba(14,165,233,0.15)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--cyan-500)] to-[var(--cyan-400)]"></div>
                
                <h2 className="text-2xl font-bold text-white mb-4">{result.title}</h2>
                <p className="text-slate-300 mb-8 leading-relaxed text-lg">{result.verdict}</p>

                {result.command && (
                  <div className="mb-8">
                    <h3 className="text-[var(--cyan-400)] text-sm font-semibold mb-3 uppercase tracking-wider">Execute Diagnostic Command</h3>
                    <div className="triage-code-block relative group">
                      <code>{result.command}</code>
                      <button 
                        onClick={() => handleCopy(result.command)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                        aria-label="Copy code"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {result.actions && result.actions.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-[var(--cyan-400)] text-sm font-semibold mb-3 uppercase tracking-wider">Next Actions</h3>
                    <ul className="space-y-3">
                      {result.actions.map((action, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-300">
                          <div className="mt-1 min-w-[6px] w-1.5 h-1.5 rounded-full bg-[var(--cyan-500)]"></div>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.avoid && result.avoid.length > 0 && (
                  <div className="bg-red-500/10 border border-[var(--red-500)] rounded-lg p-5 mt-8">
                    <h3 className="flex items-center gap-2 text-[var(--red-500)] text-sm font-bold mb-3 uppercase tracking-wider">
                      <ShieldAlert className="w-4 h-4" /> What you MUST avoid doing
                    </h3>
                    <ul className="space-y-2">
                      {result.avoid.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-red-200">
                          <AlertTriangle className="w-4 h-4 min-w-[16px] text-[var(--red-500)] mt-0.5" />
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
                  className="px-6 py-3 rounded-md font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-colors text-center active:scale-[0.98]"
                >
                  Request Fix Report
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-md font-semibold bg-[var(--cyan-500)] text-white hover:bg-[var(--cyan-400)] shadow-lg shadow-[var(--cyan-500)]/20 transition-all text-center active:scale-[0.98]"
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
