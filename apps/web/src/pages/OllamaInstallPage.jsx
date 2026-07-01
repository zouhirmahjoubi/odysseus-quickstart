import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Settings, Copy, Check, Terminal, Info, Server, Cpu } from 'lucide-react';
import { toast } from 'sonner';

const OllamaInstallPage = () => {
  const [copiedText, setCopiedText] = useState(null);
  const [deployment, setDeployment] = useState('native');
  const [vram, setVram] = useState('8gb');

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Compute endpoint & model suggestion
  const getResolverDetails = () => {
    let endpoint = 'http://127.0.0.1:11434/v1';
    let explanation = 'Since you are running Odysseus and Ollama on the same host system, they communicate directly via the localhost loopback interface.';
    
    if (deployment === 'docker') {
      endpoint = 'http://host.docker.internal:11434/v1';
      explanation = 'Since Odysseus is running inside a Docker container, "localhost" refers to the container itself. Use "host.docker.internal" to route requests out of the container back to the host machine where Ollama is served.';
    }

    let modelName = 'llama3.2';
    let modelDesc = 'Llama 3.2 (3B) - Perfect for lightweight machines or systems with minimal VRAM. Low latency and fast output.';
    let size = '2.0 GB';

    if (vram === '6gb') {
      modelName = 'llama3.2:3b';
      modelDesc = 'Llama 3.2 (3B) - Best fit for 6GB VRAM. Fast generation speed and excellent general language capabilities.';
      size = '2.0 GB';
    } else if (vram === '8gb') {
      modelName = 'qwen2.5:7b';
      modelDesc = 'Qwen 2.5 (7B) or Llama 3.1 (8B) - Ideal balance of reasoning capacity and GPU compatibility for 8GB VRAM cards.';
      size = '4.7 GB';
    } else if (vram === '12gb') {
      modelName = 'deepseek-coder:6.7b';
      modelDesc = 'DeepSeek Coder (6.7B) or Qwen 2.5 (14B) - Perfect match for 12GB VRAM cards. Deep reasoning and complex programming assistants.';
      size = '4.8 GB';
    } else if (vram === '16gb') {
      modelName = 'qwen2.5-coder:14b';
      modelDesc = 'Qwen 2.5 Coder (14B) - Excellent coding assistant for 16GB VRAM. Allows comfortable context windows.';
      size = '9.0 GB';
    } else if (vram === '24gb') {
      modelName = 'qwen2.5-coder:32b';
      modelDesc = 'Qwen 2.5 Coder (32B) or Llama 3.1 (70B Quantized) - The ultimate setup for 24GB VRAM. Near proprietary-grade reasoning offline.';
      size = '20 GB';
    }

    return { endpoint, explanation, modelName, modelDesc, size };
  };

  const resolver = getResolverDetails();

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 md:px-8 font-sans text-white">
      <Helmet>
        <title>Ollama Setup & Endpoint Resolver | Odysseus AI Guide</title>
        <meta name="description" content="Set up Ollama for Odysseus AI local LLM workspace. Interactive model size advisor based on system VRAM and docker-host loopback coordinates resolver." />
      </Helmet>

      {/* Hero Banner */}
      <div className="max-w-4xl mx-auto mb-12 pt-6 text-left">
        <div className="flex items-center gap-4 mb-4">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-4 py-1 text-xs font-black uppercase tracking-wider">
            LLM PROVIDER
          </span>
          <span className="font-bold text-sm text-white/50">Compatible with Windows, Mac, and Linux</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 flex items-center gap-3 text-white">
          <Settings className="w-10 h-10 text-emerald-400" />
          OLLAMA <span className="bg-emerald-500/10 text-emerald-400 px-4 py-0.5 border border-emerald-500/20 rounded-3xl inline-block transform -rotate-1">SETUP</span>
        </h1>
        <p className="text-lg text-white/60 font-medium leading-relaxed">
          Configure Ollama as your local AI engine. Set up correct host loopbacks and allocate models tailored to your system resources.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-4xl mx-auto space-y-8 mb-16 text-left">
        {/* Step 1: Base Install */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-left">
          <h3 className="text-2xl font-black mb-4 flex items-center gap-2 text-emerald-400">
            <Server className="w-6 h-6" />
            1. Install Ollama Runtime
          </h3>
          <p className="text-sm md:text-base text-white/60 font-medium leading-relaxed mb-6">
            Ollama serves LLM weights locally. Download the official installer for your platform from{' '}
            <a
              href="https://ollama.com/download"
              target="_blank"
              rel="noreferrer"
              className="text-[#E73A5A] font-black underline hover:text-[#E73A5A]/80 transition-colors"
            >
              ollama.com/download
            </a>{' '}
            and run it. Once running, you should see an Ollama icon in your menu bar or task tray.
          </p>
        </div>

        {/* Interactive Endpoint Resolver & Allocator */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-left">
          <h3 className="text-2xl font-black mb-4 flex items-center gap-2 text-emerald-400">
            <Cpu className="w-6 h-6" />
            2. Interactive Endpoint Resolver
          </h3>
          <p className="text-sm text-white/60 font-medium mb-6">
            Adjust the configurations to output the correct environment endpoint and pulling commands:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Deploy Selector */}
            <div className="bg-white/[0.02] p-4 rounded-[16px] border border-white/10 text-left">
              <label className="block text-xs font-black uppercase tracking-wider text-emerald-400 mb-2">
                Odysseus Deployment Style
              </label>
              <div className="flex gap-4 text-white">
                <label className="flex items-center gap-2 font-black text-sm cursor-pointer select-none">
                  <input
                    type="radio"
                    name="deploy"
                    checked={deployment === 'native'}
                    onChange={() => setDeployment('native')}
                    className="accent-[#E73A5A] w-4 h-4"
                  />
                  Native
                </label>
                <label className="flex items-center gap-2 font-black text-sm cursor-pointer select-none">
                  <input
                    type="radio"
                    name="deploy"
                    checked={deployment === 'docker'}
                    onChange={() => setDeployment('docker')}
                    className="accent-[#E73A5A] w-4 h-4"
                  />
                  Docker Container
                </label>
              </div>
            </div>

            {/* VRAM Selector */}
            <div className="bg-white/[0.02] p-4 rounded-[16px] border border-white/10 text-left text-white">
              <label className="block text-xs font-black uppercase tracking-wider text-emerald-400 mb-2">
                Graphics Card VRAM Size
              </label>
              <select
                value={vram}
                onChange={(e) => setVram(e.target.value)}
                style={{
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  borderColor: 'var(--input-border)'
                }}
                className="w-full font-black outline-none cursor-pointer border rounded-lg p-1.5"
              >
                <option value="6gb" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>6 GB (Budget Laptop / Air)</option>
                <option value="8gb" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>8 GB (Standard RTX 3060/4060)</option>
                <option value="12gb" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>12 GB (RTX 4070 / Apple M-series)</option>
                <option value="16gb" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>16 GB (RTX 4080 / unified Mac)</option>
                <option value="24gb" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>24 GB+ (RTX 3090/4090 / Studio)</option>
              </select>
            </div>
          </div>

          {/* Results Block */}
          <div className="bg-white/[0.02] p-6 rounded-[20px] border border-white/10 shadow-sm space-y-6">
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-emerald-400 mb-1">
                API Base Endpoint Coordinates
              </h4>
              <p className="text-xs text-white/50 font-medium mb-3 leading-relaxed">
                {resolver.explanation}
              </p>
              <div className="bg-black/60 text-emerald-400 p-3 rounded-[12px] border border-white/10 font-mono text-xs md:text-sm flex justify-between items-center overflow-x-auto">
                <code>{resolver.endpoint}</code>
                <button
                  onClick={() => handleCopy(resolver.endpoint, 'endpoint')}
                  className="ml-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full px-3 py-1 text-xs font-bold transition-all duration-200"
                >
                  {copiedText === 'endpoint' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-emerald-400 mb-1">
                Recommended Model Weight
              </h4>
              <p className="text-xs text-white/50 font-medium mb-3 leading-relaxed">
                {resolver.modelDesc}
              </p>
              <div className="bg-black/60 text-emerald-400 p-3 rounded-[12px] border border-white/10 font-mono text-xs md:text-sm flex justify-between items-center overflow-x-auto">
                <code>ollama pull {resolver.modelName}</code>
                <button
                  onClick={() => handleCopy(`ollama pull ${resolver.modelName}`, 'pullCmd')}
                  className="ml-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full px-3 py-1 text-xs font-bold transition-all duration-200"
                >
                  {copiedText === 'pullCmd' ? 'Copied' : 'Copy Command'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Verification banner */}
        <div className="border border-[#E73A5A]/20 bg-[#E73A5A]/5 p-6 rounded-2xl flex gap-4 items-start backdrop-blur-md">
          <Info className="w-8 h-8 text-[#E73A5A] flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-black text-[#E73A5A] mb-1">Testing Connection</h4>
            <p className="text-sm text-white/70 font-medium leading-relaxed">
              Before launching Odysseus, ensure Ollama is listening by opening your browser and visiting{' '}
              <code className="text-emerald-400 bg-white/5 px-1 py-0.5 rounded border border-white/10">http://localhost:11434</code>. You should see a blank screen with the text: <code>"Ollama is running"</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OllamaInstallPage;
