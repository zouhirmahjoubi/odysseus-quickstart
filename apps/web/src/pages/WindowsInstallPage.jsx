import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Monitor, Copy, Check, Terminal, CheckCircle2, ChevronRight, AlertTriangle, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

const WindowsInstallPage = () => {
  const [copiedText, setCopiedText] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    toast.success('Command copied to clipboard!');
    setTimeout(() => setCopiedText(null), 2000);
  };

  const scripts = {
    prereqs: 'winget install Python.Python.3.11 Git.Git',
    clone: 'git clone https://github.com/pewdiepie-archdaemon/odysseus.git\ncd odysseus',
    launch: 'powershell -ExecutionPolicy Bypass -File .\\launch-windows.ps1',
    manualVenv: 'python -m venv .venv\n.\\.venv\\Scripts\\activate\npip install -r requirements.txt',
    manualStart: 'python -m uvicorn apps.api.src.main:app --port 3001 --reload'
  };

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 md:px-8 font-sans text-white">
      <Helmet>
        <title>Windows Native Setup | Odysseus AI Installation Guide</title>
        <meta name="description" content="Native Windows installation instructions for Odysseus AI. Copy-paste script execution policies, local virtual environment configurations, and CUDA acceleration." />
      </Helmet>

      {/* Hero Banner */}
      <div className="max-w-4xl mx-auto mb-12 pt-6 text-left">
        <div className="flex items-center gap-4 mb-4">
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-4 py-1 text-xs font-black uppercase tracking-wider">
            OS SETUP
          </span>
          <span className="font-bold text-sm text-white/50">Compatible with Windows 10/11</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 flex items-center gap-3 text-white">
          <Monitor className="w-10 h-10 text-amber-400" />
          WINDOWS <span className="bg-amber-500/10 text-amber-400 px-4 py-0.5 border border-amber-500/20 rounded-3xl inline-block transform -rotate-1">INSTALLATION</span>
        </h1>
        <p className="text-lg text-white/60 font-medium leading-relaxed">
          Configure Odysseus AI natively on Windows. Trigger direct CUDA acceleration by routing prompts directly to your local GPU.
        </p>
      </div>

      {/* Main Steps */}
      <div className="max-w-4xl mx-auto space-y-8 mb-16 text-left">
        {/* Step 1 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="flex gap-4 items-start mb-6">
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full w-10 h-10 flex items-center justify-center font-black flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Verify Python & Git Prerequisites</h3>
              <p className="text-sm text-white/60 font-medium mt-1 text-left">
                You will need Git to clone the source code and Python 3.10+ to run the backend engine. Run this in PowerShell to install them via winget:
              </p>
            </div>
          </div>

          <div className="bg-black/60 text-emerald-400 p-4 rounded-[16px] border border-white/10 flex justify-between items-center font-mono text-sm overflow-x-auto">
            <code>{scripts.prereqs}</code>
            <button
              onClick={() => handleCopy(scripts.prereqs, 'prereqs')}
              className="ml-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1.5 flex-shrink-0 cursor-pointer transition-all duration-200"
            >
              {copiedText === 'prereqs' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText === 'prereqs' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="flex gap-4 items-start mb-6">
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full w-10 h-10 flex items-center justify-center font-black flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Clone the Codebase</h3>
              <p className="text-sm text-white/60 font-medium mt-1 text-left">
                Open PowerShell, navigate to your development directory, and run:
              </p>
            </div>
          </div>

          <div className="bg-black/60 text-emerald-400 p-4 rounded-[16px] border border-white/10 flex justify-between items-center font-mono text-sm overflow-x-auto">
            <code>{scripts.clone}</code>
            <button
              onClick={() => handleCopy(scripts.clone, 'clone')}
              className="ml-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1.5 flex-shrink-0 cursor-pointer transition-all duration-200"
            >
              {copiedText === 'clone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText === 'clone' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="flex gap-4 items-start mb-6">
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full w-10 h-10 flex items-center justify-center font-black flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Execute Launch Script</h3>
              <p className="text-sm text-white/60 font-medium mt-1 text-left">
                Use the bypass execution policy command to run the official Windows script launcher:
              </p>
            </div>
          </div>

          <div className="bg-black/60 text-emerald-400 p-4 rounded-[16px] border border-white/10 flex justify-between items-center font-mono text-sm overflow-x-auto">
            <code>{scripts.launch}</code>
            <button
              onClick={() => handleCopy(scripts.launch, 'launch')}
              className="ml-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1.5 flex-shrink-0 cursor-pointer transition-all duration-200"
            >
              {copiedText === 'launch' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText === 'launch' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* PowerShell Security Policy Warning */}
      <div className="max-w-4xl mx-auto border border-[#E73A5A]/20 bg-[#E73A5A]/5 p-6 mb-8 rounded-2xl flex gap-4 items-start backdrop-blur-md text-left">
        <ShieldAlert className="w-8 h-8 text-[#E73A5A] flex-shrink-0 mt-1" />
        <div>
          <h4 className="font-black text-white mb-1">PowerShell Script Blocking Policy</h4>
          <p className="text-sm text-white/70 font-medium leading-relaxed text-left">
            By default, Windows prevents scripts downloaded from the internet from running. Using the <code>-ExecutionPolicy Bypass</code> flag instructs PowerShell to run the installation scripts safely inside this terminal scope without changing your global system policy.
          </p>
        </div>
      </div>

      {/* Manual Installation Fallback */}
      <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 p-8 mb-12 rounded-2xl backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-left">
        <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-2">
          <Terminal className="w-6 h-6 text-amber-400" />
          MANUAL NATIVE FALLBACK
        </h3>
        <p className="text-sm text-white/60 font-medium mb-6 leading-relaxed">
          If the automated launch script fails, you can perform a manual setup. Create a virtual environment, activate it, install libraries, and spin up the web dashboard server:
        </p>

        <div className="space-y-6">
          <div>
            <h4 className="font-black text-sm text-amber-400 uppercase tracking-wider mb-2">Step A: Setup Virtual Environment</h4>
            <div className="bg-black/60 text-emerald-400 p-4 rounded-[12px] border border-white/10 flex justify-between items-center font-mono text-xs md:text-sm overflow-x-auto">
              <code>{scripts.manualVenv}</code>
              <button
                onClick={() => handleCopy(scripts.manualVenv, 'manualVenv')}
                className="ml-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full px-3 py-1 text-xs font-bold cursor-pointer transition-all duration-200"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-black text-sm text-amber-400 uppercase tracking-wider mb-2">Step B: Launch Backend Server</h4>
            <div className="bg-black/60 text-emerald-400 p-4 rounded-[12px] border border-white/10 flex justify-between items-center font-mono text-xs md:text-sm overflow-x-auto">
              <code>{scripts.manualStart}</code>
              <button
                onClick={() => handleCopy(scripts.manualStart, 'manualStart')}
                className="ml-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full px-3 py-1 text-xs font-bold cursor-pointer transition-all duration-200"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WindowsInstallPage;
