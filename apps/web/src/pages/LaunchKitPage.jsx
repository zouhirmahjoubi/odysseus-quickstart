import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Copy, Check, Download, RefreshCw, FileCode, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

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
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 pt-6 md:pt-12 px-4 sm:px-6">
      <Helmet>
        <title>Launch Kit Generator | OdysseusAI</title>
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
          <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black bg-accent text-black text-sm font-black mb-4 uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Rocket size={16} strokeWidth={3} /> Deployments
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase leading-none mb-4 text-balance">
            Launch Kit Generator
          </h1>
          <p className="text-lg font-bold max-w-3xl text-muted-foreground text-balance">
            Instantly generate production-ready deployment templates, startup scripts, and configurations for hosting models locally.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="neo-card bg-[#FFFDF0] p-6 flex flex-col space-y-6">
              {/* Step 1: Model */}
              <div>
                <label className="block text-sm font-black uppercase tracking-widest mb-3 border-b-2 border-black pb-1 text-black">
                  1. Choose LLM Model
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {MODELS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => handleSelect('model', m.id)}
                      className={`text-left p-3 border-2 border-black font-bold rounded-lg transition-all ${
                        selections.model === m.id 
                          ? 'bg-[hsl(var(--active-green))] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-0.5' 
                          : 'bg-white hover:bg-slate-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                      }`}
                    >
                      <div className="text-sm font-black">{m.name}</div>
                      <div className="text-[10px] text-black/60 uppercase">{m.family} • {m.size}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Infrastructure */}
              <div>
                <label className="block text-sm font-black uppercase tracking-widest mb-3 border-b-2 border-black pb-1 text-black">
                  2. Infrastructure Type
                </label>
                <div className="space-y-3">
                  {INFRASTRUCTURES.map(i => (
                    <button
                      key={i.id}
                      onClick={() => handleSelect('infra', i.id)}
                      className={`text-left p-3 w-full border-2 border-black font-bold rounded-lg transition-all flex justify-between items-center ${
                        selections.infra === i.id 
                          ? 'bg-[hsl(var(--light-blue))] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-0.5' 
                          : 'bg-white hover:bg-slate-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-black">{i.name}</div>
                        <div className="text-xs text-black/60 font-poppins">{i.desc}</div>
                      </div>
                      {selections.infra === i.id && <CheckCircle size={18} className="text-black" strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Hardware */}
              <div>
                <label className="block text-sm font-black uppercase tracking-widest mb-3 border-b-2 border-black pb-1 text-black">
                  3. Hardware Acceleration
                </label>
                <div className="space-y-3">
                  {HARDWARE.map(hw => (
                    <button
                      key={hw.id}
                      onClick={() => handleSelect('hardware', hw.id)}
                      className={`text-left p-3 w-full border-2 border-black font-bold rounded-lg transition-all flex justify-between items-center ${
                        selections.hardware === hw.id 
                          ? 'bg-[hsl(var(--accent))] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-0.5' 
                          : 'bg-white hover:bg-slate-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-black">{hw.name}</div>
                        <div className="text-xs text-black/60 font-poppins">{hw.desc}</div>
                      </div>
                      {selections.hardware === hw.id && <CheckCircle size={18} className="text-black" strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateKit}
                disabled={isGenerating}
                className="neo-button bg-secondary text-black font-black uppercase w-full py-4 text-base sm:text-lg"
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
                  className="neo-card bg-white p-8 border-dashed border-gray-400 flex flex-col items-center justify-center text-center h-full min-h-[350px]"
                >
                  <Rocket size={48} className="text-slate-300 mb-4 animate-pulse" strokeWidth={1.5} />
                  <h3 className="text-xl font-black uppercase mb-2">Build Conf File</h3>
                  <p className="text-muted-foreground max-w-sm font-semibold font-poppins">
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
                  <div className="neo-card bg-secondary p-5 border-4 border-black font-poppins font-bold">
                    <div className="flex gap-3 items-center text-black">
                      <CheckCircle size={22} className="text-black shrink-0" strokeWidth={3} />
                      <p>{generatedKit.summary}</p>
                    </div>
                  </div>

                  {/* Config File Box */}
                  <div className="neo-card bg-[#FFFDF0] p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
                      <span className="font-mono text-sm font-black text-black flex items-center gap-1.5">
                        📄 {generatedKit.configFileName}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopy(generatedKit.configFileContent, 'config')}
                          className="neo-button bg-white text-black py-1 px-3 text-xs flex items-center gap-1"
                        >
                          {copiedConfig ? <Check size={12} strokeWidth={3} /> : <Copy size={12} strokeWidth={3} />}
                          Copy
                        </button>
                        <button
                          onClick={() => triggerDownload(generatedKit.configFileName, generatedKit.configFileContent)}
                          className="neo-button bg-primary text-black py-1 px-3 text-xs flex items-center gap-1"
                        >
                          <Download size={12} strokeWidth={3} />
                          Download
                        </button>
                      </div>
                    </div>
                    <pre className="bg-black text-primary p-4 rounded-lg border-2 border-black font-mono text-xs overflow-x-auto max-h-[300px]">
                      <code>{generatedKit.configFileContent}</code>
                    </pre>
                  </div>

                  {/* Env Variables Box */}
                  <div className="neo-card bg-[#FFFDF0] p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
                      <span className="font-mono text-sm font-black text-black">
                        🔑 .env Template
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopy(generatedKit.envFileContent, 'env')}
                          className="neo-button bg-white text-black py-1 px-3 text-xs flex items-center gap-1"
                        >
                          {copiedEnv ? <Check size={12} strokeWidth={3} /> : <Copy size={12} strokeWidth={3} />}
                          Copy
                        </button>
                        <button
                          onClick={() => triggerDownload('.env', generatedKit.envFileContent)}
                          className="neo-button bg-primary text-black py-1 px-3 text-xs flex items-center gap-1"
                        >
                          <Download size={12} strokeWidth={3} />
                          Download
                        </button>
                      </div>
                    </div>
                    <pre className="bg-black text-primary p-4 rounded-lg border-2 border-black font-mono text-xs overflow-x-auto">
                      <code>{generatedKit.envFileContent}</code>
                    </pre>
                  </div>

                  {/* Run Steps */}
                  <div className="neo-card bg-[#FFFDF0] p-6">
                    <h3 className="text-lg font-black uppercase mb-4 border-b-2 border-black pb-2">Deployment Steps</h3>
                    <ol className="space-y-4 font-poppins">
                      {generatedKit.runSteps.map((step, idx) => (
                        <li key={idx} className="flex gap-3 text-black font-semibold text-sm">
                          <span className="w-6 h-6 rounded-full bg-accent border-2 border-black flex items-center justify-center text-xs text-black font-black shrink-0">
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
