import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Copy, Check, Download, RefreshCw, FileCode, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import FeaturedLaunchKitCard from '@/components/FeaturedLaunchKitCard.jsx';

const MODELS = [
  { id: 'llama3', name: 'Llama 3 (8B)', family: 'Meta', size: '4.7 GB' },
  { id: 'mistral', name: 'Mistral (7B)', family: 'Mistral AI', size: '4.1 GB' },
  { id: 'qwen2', name: 'Qwen 2 (7B)', family: 'Alibaba', size: '4.4 GB' },
  { id: 'phi3', name: 'Phi 3 (3.8B)', family: 'Microsoft', size: '2.2 GB' }
];

const INFRASTRUCTURES = [
  { id: 'docker', name: 'Docker Compose', desc: 'Pre-configured multi-container stack.' },
  { id: 'binary', name: 'Local Shell Script', desc: 'Run via local binaries and scripts.' },
  { id: 'systemd', name: 'Systemd Service', desc: 'Run as a background daemon on Linux.' }
];

const HARDWARE = [
  { id: 'cpu', name: 'CPU Only', desc: 'No GPU acceleration. Slowest inference.' },
  { id: 'cuda', name: 'NVIDIA GPU (CUDA)', desc: 'Full GPU offloading via CUDA.' },
  { id: 'metal', name: 'Apple Silicon (Metal)', desc: 'Native Mac hardware acceleration.' }
];

const API_INTERFACES = [
  { id: 'ollama', name: 'Ollama Backend', desc: 'Easy runtime manager with simple API.' },
  { id: 'llamacpp', name: 'Llama.cpp Server', desc: 'Lightweight C/C++ backend.' },
  { id: 'vllm', name: 'vLLM Engine', desc: 'High-throughput production server.' }
];

const LaunchKitPage = () => {
  const [selections, setSelections] = useState({
    model: 'llama3',
    infra: 'docker',
    hardware: 'cuda',
    api: 'ollama'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedKit, setGeneratedKit] = useState(null);
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const handleSelect = (field, value) => {
    setSelections(prev => ({ ...prev, [field]: value }));
  };

  const generateKit = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const selectedModelObj = MODELS.find(m => m.id === selections.model);
      const selectedInfraObj = INFRASTRUCTURES.find(i => i.id === selections.infra);
      
      let configFileContent = '';
      let configFileName = '';
      let envFileContent = '';
      let runSteps = [];

      // Generate configs based on selections
      if (selections.infra === 'docker') {
        configFileName = 'docker-compose.yml';
        envFileContent = `# OdysseusAI Generated Environment\nMODEL_NAME=${selectedModelObj.id}\nAPI_PORT=11434\nGPU_ENABLED=${selections.hardware === 'cuda' ? 'true' : 'false'}\n`;
        
        if (selections.hardware === 'cuda') {
          configFileContent = `version: '3.8'

services:
  inference-engine:
    image: ollama/ollama:latest
    container_name: odysseus-inference
    ports:
      - "\${API_PORT}:11434"
    volumes:
      - ollama_data:/root/.ollama
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
    restart: always

volumes:
  ollama_data:`;
        } else {
          configFileContent = `version: '3.8'

services:
  inference-engine:
    image: ollama/ollama:latest
    container_name: odysseus-inference
    ports:
      - "\${API_PORT}:11434"
    volumes:
      - ollama_data:/root/.ollama
    restart: always

volumes:
  ollama_data:`;
        }
        
        runSteps = [
          "Install Docker and Docker Compose on your host system.",
          "Save the generated 'docker-compose.yml' and '.env' files in the same directory.",
          "Run 'docker compose up -d' in your terminal.",
          `Execute 'docker exec -it odysseus-inference ollama run ${selectedModelObj.id}' to pull and start model.`
        ];
      } else if (selections.infra === 'binary') {
        configFileName = 'run.sh';
        envFileContent = `# OdysseusAI Local Environment\nexport PORT=11434\nexport MODEL=${selectedModelObj.id}\n`;
        
        if (selections.hardware === 'cuda') {
          configFileContent = `#!/bin/bash
# Local running script with CUDA acceleration
echo "Initializing ${selectedModelObj.name} with CUDA..."

# Check for Ollama installation
if ! command -v ollama &> /dev/null; then
    echo "Ollama is not installed. Installing..."
    curl -fsSL https://ollama.com/install.sh | sh
fi

export OLLAMA_HOST="127.0.0.1:11434"
ollama serve &
sleep 5
ollama run \${MODEL}`;
        } else if (selections.hardware === 'metal') {
          configFileContent = `#!/bin/bash
# Local running script for Apple Silicon
echo "Initializing ${selectedModelObj.name} on Apple Silicon..."

if ! command -v ollama &> /dev/null; then
    echo "Please download Ollama from https://ollama.com/download"
    exit 1
fi

export OLLAMA_HOST="127.0.0.1:11434"
ollama run \${MODEL}`;
        } else {
          configFileContent = `#!/bin/bash
# Local running script (CPU only)
echo "Initializing ${selectedModelObj.name} (CPU Only)..."
export OLLAMA_NUM_PARALLEL=1
ollama serve &
sleep 5
ollama run \${MODEL}`;
        }

        runSteps = [
          "Make the script executable: 'chmod +x run.sh'",
          "Create a '.env' file in the same directory and add environment variables.",
          "Source the env variables: 'source .env'",
          "Execute the script: './run.sh' to start inference."
        ];
      } else {
        // Systemd
        configFileName = 'ollama.service';
        envFileContent = `OLLAMA_HOST=127.0.0.1:11434\nOLLAMA_MODELS=/usr/share/ollama/.ollama/models\n`;
        configFileContent = `[Unit]
Description=Ollama Service for ${selectedModelObj.name}
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/ollama serve
User=ollama
Group=ollama
Restart=always
RestartSec=3
EnvironmentFile=/etc/default/ollama

[Install]
WantedBy=default.target`;

        runSteps = [
          "Move 'ollama.service' to '/etc/systemd/system/'.",
          "Save the '.env' variables to '/etc/default/ollama'.",
          "Reload systemd daemon: 'sudo systemctl daemon-reload'.",
          "Start and enable service: 'sudo systemctl enable --now ollama'.",
          `Pull the model: 'ollama pull ${selectedModelObj.id}'`
        ];
      }

      setGeneratedKit({
        configFileName,
        configFileContent,
        envFileContent,
        runSteps,
        summary: `Launch Kit configured for ${selectedModelObj.name} using ${selectedInfraObj.name} on ${selections.hardware.toUpperCase()} hardware.`
      });
      setIsGenerating(false);
      toast.success('Launch Kit generated successfully!');
    }, 1200);
  };

  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'config') {
        setCopiedConfig(true);
        setTimeout(() => setCopiedConfig(false), 2000);
      } else {
        setCopiedEnv(true);
        setTimeout(() => setCopiedEnv(false), 2000);
      }
      toast.success('Copied to clipboard');
    } catch (err) {
      toast.error('Copy failed');
    }
  };

  const triggerDownload = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`${filename} download started! 📥`);
  };  return (
    <div className="max-w-7xl mx-auto pb-24 pt-6 md:pt-12 px-4 sm:px-6 text-left font-rounded">
      <Helmet>
        <title>Launch Kit Generator | OdysseusAI</title>
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
          <div className="flex items-center gap-2 bg-[#0066FF]/10 px-4 py-1.5 rounded-full border border-[#0066FF]/20 text-sm font-bold mb-6 inline-flex">
            <Rocket size={14} strokeWidth={3} className="text-[#0066FF]" />
            <span className="text-gray-300 font-bold">Local Deployments</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Launch Kit{' '}
            <span className="text-[#0066FF] bg-[#0066FF]/10 px-4 py-1 border border-[#0066FF]/20 rounded-3xl inline-block transform -rotate-1 shadow-[0_0_15px_rgba(0,102,255,0.2)]">
              Generator
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl font-medium leading-relaxed">
            Instantly generate production-ready deployment templates, startup scripts, and configurations for hosting models locally.
          </p>
        </header>

        {/* Featured Launch Kit Promo */}
        <div className="mb-12">
          <FeaturedLaunchKitCard />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col space-y-6 backdrop-blur-md">
              {/* Step 1: Model */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-[#0066FF] mb-2">
                  1. Choose LLM Model
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {MODELS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => handleSelect('model', m.id)}
                      className={`text-left p-3 border rounded-xl font-bold transition-all cursor-pointer ${
                        selections.model === m.id 
                          ? 'bg-[#0066FF] text-white border-[#0066FF]/30 shadow-[0_0_12px_rgba(0,102,255,0.3)]' 
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="text-sm font-black">{m.name}</div>
                      <div className={`text-[10px] uppercase ${selections.model === m.id ? 'text-white/70' : 'text-gray-400'}`}>{m.family} • {m.size}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Infrastructure */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-[#0066FF] mb-2">
                  2. Infrastructure Type
                </label>
                <div className="space-y-3">
                  {INFRASTRUCTURES.map(i => (
                    <button
                      key={i.id}
                      onClick={() => handleSelect('infra', i.id)}
                      className={`text-left p-3.5 w-full border rounded-xl font-bold transition-all flex justify-between items-center cursor-pointer ${
                        selections.infra === i.id 
                          ? 'bg-[#0066FF] text-white border-[#0066FF]/30 shadow-[0_0_12px_rgba(0,102,255,0.3)]' 
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-black">{i.name}</div>
                        <div className={`text-xs ${selections.infra === i.id ? 'text-white/70' : 'text-gray-400'}`}>{i.desc}</div>
                      </div>
                      {selections.infra === i.id && <CheckCircle size={18} className="text-white shrink-0 ml-2" strokeWidth={2} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Hardware */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-[#0066FF] mb-2">
                  3. Hardware Acceleration
                </label>
                <div className="space-y-3">
                  {HARDWARE.map(hw => (
                    <button
                      key={hw.id}
                      onClick={() => handleSelect('hardware', hw.id)}
                      className={`text-left p-3.5 w-full border rounded-xl font-bold transition-all flex justify-between items-center cursor-pointer ${
                        selections.hardware === hw.id 
                          ? 'bg-[#0066FF] text-white border-[#0066FF]/30 shadow-[0_0_12px_rgba(0,102,255,0.3)]' 
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-black">{hw.name}</div>
                        <div className={`text-xs ${selections.hardware === hw.id ? 'text-white/70' : 'text-gray-400'}`}>{hw.desc}</div>
                      </div>
                      {selections.hardware === hw.id && <CheckCircle size={18} className="text-white shrink-0 ml-2" strokeWidth={2} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateKit}
                disabled={isGenerating}
                className="w-full font-black uppercase py-4 rounded-xl text-sm tracking-wider transition-all flex items-center justify-center gap-2 bg-[#0066FF] text-white border border-[#0066FF]/30 shadow-[0_0_15px_rgba(0,102,255,0.2)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin mr-2" strokeWidth={3} />
                    Assembling Files...
                  </>
                ) : (
                  <>
                    <FileCode className="w-5 h-5 mr-2" strokeWidth={3} />
                    Assemble Launch Kit
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Column (7 Cols) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!generatedKit ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/5 border border-dashed border-white/20 p-8 rounded-3xl flex flex-col items-center justify-center text-center h-full min-h-[350px] backdrop-blur-md"
                >
                  <Rocket size={48} className="text-gray-600 mb-4 animate-pulse" strokeWidth={1.5} />
                  <h3 className="text-xl font-black uppercase mb-2 text-white">Assemble Launch Kit</h3>
                  <p className="text-gray-400 max-w-sm font-semibold">
                    Select your local deployment parameters on the left and click "Assemble Launch Kit" to compile configurations.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Summary Banner */}
                  <div className="bg-[#0066FF]/5 border border-[#0066FF]/20 p-5 rounded-2xl">
                    <div className="flex gap-3 items-center text-white font-bold text-sm">
                      <CheckCircle size={20} className="text-[#0066FF] shrink-0" strokeWidth={2.5} />
                      <p>{generatedKit.summary}</p>
                    </div>
                  </div>

                  {/* Config File Box */}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col backdrop-blur-md text-left">
                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
                      <span className="font-mono text-sm font-black text-white flex items-center gap-1.5">
                        📄 {generatedKit.configFileName}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopy(generatedKit.configFileContent, 'config')}
                          className="bg-white/5 border border-white/10 text-white hover:bg-white/10 py-1.5 px-3 rounded-lg text-xs font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          {copiedConfig ? <Check size={12} className="text-[#0066FF]" strokeWidth={2.5} /> : <Copy size={12} strokeWidth={2.5} />}
                          Copy
                        </button>
                        <button
                          onClick={() => triggerDownload(generatedKit.configFileName, generatedKit.configFileContent)}
                          className="bg-[#0066FF] text-white border border-[#0066FF]/30 py-1.5 px-3 rounded-lg text-xs font-black uppercase flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_10px_rgba(0,102,255,0.2)]"
                        >
                          <Download size={12} strokeWidth={2.5} />
                          Download
                        </button>
                      </div>
                    </div>
                    <pre className="bg-black/40 text-[#0066FF] p-4 rounded-xl border border-white/10 font-mono text-xs overflow-x-auto max-h-[300px]">
                      <code>{generatedKit.configFileContent}</code>
                    </pre>
                  </div>

                  {/* Env Variables Box */}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col backdrop-blur-md text-left">
                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
                      <span className="font-mono text-sm font-black text-white flex items-center gap-1.5">
                        🔑 .env Template
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopy(generatedKit.envFileContent, 'env')}
                          className="bg-white/5 border border-white/10 text-white hover:bg-white/10 py-1.5 px-3 rounded-lg text-xs font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          {copiedEnv ? <Check size={12} className="text-[#0066FF]" strokeWidth={2.5} /> : <Copy size={12} strokeWidth={2.5} />}
                          Copy
                        </button>
                        <button
                          onClick={() => triggerDownload('.env', generatedKit.envFileContent)}
                          className="bg-[#0066FF] text-white border border-[#0066FF]/30 py-1.5 px-3 rounded-lg text-xs font-black uppercase flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_10px_rgba(0,102,255,0.2)]"
                        >
                          <Download size={12} strokeWidth={2.5} />
                          Download
                        </button>
                      </div>
                    </div>
                    <pre className="bg-black/40 text-[#0066FF] p-4 rounded-xl border border-white/10 font-mono text-xs overflow-x-auto">
                      <code>{generatedKit.envFileContent}</code>
                    </pre>
                  </div>

                  {/* Run Steps */}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-left backdrop-blur-md">
                    <h3 className="text-lg font-black uppercase mb-4 border-b border-white/10 pb-3 text-white">Deployment Steps</h3>
                    <ol className="space-y-4">
                      {generatedKit.runSteps.map((step, idx) => (
                        <li key={idx} className="flex gap-3 text-gray-300 font-semibold text-sm">
                          <span className="w-6 h-6 rounded-full bg-[#0066FF] flex items-center justify-center text-xs text-white font-black shrink-0 shadow-[0_0_8px_rgba(0,102,255,0.3)]">
                            {idx + 1}
                          </span>
                          <span className="mt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchKitPage;
