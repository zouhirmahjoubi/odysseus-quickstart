import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Laptop, Copy, Check, Terminal, Info, Cpu, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const MacBookInstallPage = () => {
  const [copiedText, setCopiedText] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    toast.success('Command copied to clipboard!');
    setTimeout(() => setCopiedText(null), 2000);
  };

  const scripts = {
    homebrew: '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
    prereqs: 'brew install python@3.11 git ollama',
    clone: 'git clone https://github.com/pewdiepie-archdaemon/odysseus.git\ncd odysseus',
    launch: 'chmod +x start-macos.sh\n./start-macos.sh',
    mpsEnv: 'export PYTORCH_ENABLE_MPS_FALLBACK=1\npython -c "import torch; print(torch.backends.mps.is_available())"'
  };

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 md:px-8 font-sans text-white">
      <Helmet>
        <title>macOS MacBook Setup | Odysseus AI Installation Guide</title>
        <meta name="description" content="Step-by-step MacBook (M1/M2/M3/M4 Apple Silicon and Intel) installation instructions for Odysseus AI. Set up MPS hardware acceleration." />
      </Helmet>

      {/* Hero Banner */}
      <div className="max-w-4xl mx-auto mb-12 pt-6 text-left">
        <div className="flex items-center gap-4 mb-4">
          <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full px-4 py-1 text-xs font-black uppercase tracking-wider">
            macOS SETUP
          </span>
          <span className="font-bold text-sm text-white/50">Optimized for Apple Silicon (M1 / M2 / M3 / M4)</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 flex items-center gap-3 text-white">
          <Laptop className="w-10 h-10 text-purple-400" />
          MACBOOK <span className="bg-purple-500/10 text-purple-400 px-4 py-0.5 border border-purple-500/20 rounded-3xl inline-block transform -rotate-1">INSTALLATION</span>
        </h1>
        <p className="text-lg text-white/60 font-medium leading-relaxed">
          Configure Odysseus AI natively on macOS. Leverage Apple's unified memory architecture and Metal Performance Shaders (MPS) for high-speed local inference.
        </p>
      </div>

      {/* Steps List */}
      <div className="max-w-4xl mx-auto space-y-8 mb-16 text-left">
        {/* Step 1 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="flex gap-4 items-start mb-6">
            <div className="bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full w-10 h-10 flex items-center justify-center font-black flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Install Homebrew Package Manager</h3>
              <p className="text-sm text-white/60 font-medium mt-1">
                If you do not have Homebrew installed, open Terminal and execute the official bootstrap command:
              </p>
            </div>
          </div>

          <div className="bg-black/60 text-emerald-400 p-4 rounded-[16px] border border-white/10 flex justify-between items-center font-mono text-sm overflow-x-auto">
            <code>{scripts.homebrew}</code>
            <button
              onClick={() => handleCopy(scripts.homebrew, 'homebrew')}
              className="ml-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1.5 flex-shrink-0 cursor-pointer transition-all duration-200"
            >
              {copiedText === 'homebrew' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText === 'homebrew' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="flex gap-4 items-start mb-6">
            <div className="bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full w-10 h-10 flex items-center justify-center font-black flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Fetch Development Prerequisites</h3>
              <p className="text-sm text-white/60 font-medium mt-1">
                Use Homebrew to grab Python 3.11, Git, and Ollama in one sweep:
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

        {/* Step 3 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="flex gap-4 items-start mb-6">
            <div className="bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full w-10 h-10 flex items-center justify-center font-black flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Clone the Repository</h3>
              <p className="text-sm text-white/60 font-medium mt-1">
                Download the workspace source folders:
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

        {/* Step 4 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="flex gap-4 items-start mb-6">
            <div className="bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full w-10 h-10 flex items-center justify-center font-black flex-shrink-0">
              4
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Apply Execution Permissions & Launch</h3>
              <p className="text-sm text-white/60 font-medium mt-1">
                Grant run permissions to the shell script wrapper and initiate native execution:
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

      {/* Metal MPS Acceleration & memory warnings */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-left">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <h4 className="font-black text-white mb-3 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-purple-400" />
            Metal (MPS) Acceleration
          </h4>
          <p className="text-sm text-white/60 font-medium leading-relaxed mb-4">
            Apple Silicon uses Metal Performance Shaders (MPS) for tensor operations. Verify that MPS device allocation is operational in Python using this test command:
          </p>
          <div className="bg-black/60 text-emerald-400 p-3 rounded-[12px] border border-white/10 font-mono text-xs overflow-x-auto flex justify-between items-center">
            <code>{scripts.mpsEnv}</code>
            <button
              onClick={() => handleCopy(scripts.mpsEnv, 'mpsEnv')}
              className="ml-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full px-3 py-1 text-xs font-bold transition-all duration-200"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div>
            <h4 className="font-black text-[#E73A5A] mb-3 flex items-center gap-2">
              <Info className="w-6 h-6" />
              Unified Memory Recommendations
            </h4>
            <ul className="text-sm text-white/60 font-medium space-y-2 list-disc pl-5">
              <li><strong>8GB RAM Macs:</strong> Keep to 3B models (Llama 3.2). Avoid running heavy background apps (Chrome/Slack) to reduce memory swapping.</li>
              <li><strong>16GB+ RAM Macs:</strong> Ideal for 7B/8B parameter models. Up to 12 layers can be allocated natively.</li>
            </ul>
          </div>
          <span className="text-[10px] uppercase font-black tracking-widest text-white/40 mt-4 block">
            Note: Intel-based MacBooks default to CPU execution.
          </span>
        </div>
      </div>
    </div>
  );
};

export default MacBookInstallPage;
