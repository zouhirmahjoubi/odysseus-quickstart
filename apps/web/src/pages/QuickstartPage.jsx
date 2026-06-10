import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, Terminal, Copy, Check, ChevronDown, HelpCircle, 
  CheckCircle, ArrowRight, Laptop, Cpu, ShieldAlert, BookOpen, 
  ExternalLink, Mail, ArrowUpRight, DollarSign, Zap, FileCode,
  AlertTriangle, Play, Settings, Server, RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

// Sample Data for the comparative matrix
const PATH_MATRIX = [
  {
    path: 'Docker Compose (Recommended)',
    chooseIf: 'You want a clean, isolated environment with zero system pollution.',
    doNotChooseIf: 'You have restricted Docker daemon permissions on your machine.',
    command: 'docker compose up -d',
    trap: 'Forgetting to map port 11434 to host.docker.internal.',
    highlighted: true
  },
  {
    path: 'Native Windows',
    chooseIf: 'You want maximum performance on a Windows machine with an NVIDIA GPU.',
    doNotChooseIf: 'You are uncomfortable configuring environment system variables.',
    command: 'python main.py',
    trap: 'Missing CUDA toolkit paths or C++ compiler dependencies.',
    highlighted: false
  },
  {
    path: 'Native Apple Silicon',
    chooseIf: 'You have an M1/M2/M3 Mac and want native Metal API acceleration.',
    doNotChooseIf: 'You want an isolated container setup without local Python envs.',
    command: 'ollama run llama3',
    trap: 'Ollama application not permitted in macOS background permissions.',
    highlighted: false
  },
  {
    path: 'Ollama Connection',
    chooseIf: 'You want to query local models running on your system.',
    doNotChooseIf: 'You are using a remote server without SSH port forwarding.',
    command: 'curl http://localhost:11434/api/tags',
    trap: 'Binding host to 127.0.0.1 instead of 0.0.0.0 for container networks.',
    highlighted: false
  },
  {
    path: 'API-Backed Setup',
    chooseIf: 'You have low RAM/VRAM and prefer OpenRouter, OpenAI, or Anthropic.',
    doNotChooseIf: 'You want offline operation and 100% data privacy.',
    command: 'export OPENROUTER_API_KEY="..."',
    trap: 'Setting blank local endpoints while expecting cloud routing.',
    highlighted: false
  },
  {
    path: 'Troubleshooting First',
    chooseIf: 'You are hitting SQLite locks or NPM peer dependency errors.',
    doNotChooseIf: 'Your system builds cleanly without locks.',
    command: 'rm -rf node_modules package-lock.json',
    trap: 'Running npm install in the sub-apps instead of the root workspace.',
    highlighted: false
  }
];

// Workflow snippets data
const WORKFLOWS = [
  {
    id: 'research',
    title: 'Research Agent Starter',
    desc: 'Deep search agent configured with web search capabilities and output structuring.',
    code: `import { Agent } from 'odysseus';\n\nconst researcher = new Agent({\n  name: 'Scholar',\n  role: 'Academic Researcher',\n  goal: 'Aggregate and cross-reference local research papers.',\n  tools: ['pdf-reader', 'google-scholar-api'],\n  verbose: true\n});`
  },
  {
    id: 'seo',
    title: 'SEO Content Specialist',
    desc: 'Analyzes keyword search volume and constructs optimal semantic drafts.',
    code: `import { Crew } from 'odysseus-swarms';\n\nconst seoCrew = new Crew({\n  agents: [keywordAnalyst, contentWriter],\n  tasks: [analyzeTrends, draftOptimizedArticle],\n  process: 'sequential'\n});`
  },
  {
    id: 'debug',
    title: 'Coding Debug Assistant',
    desc: 'Injects code files, executes sandboxed test suites, and drafts patches.',
    code: `# Run Debugger Swarm\nnpx odysseus-cli debug --path ./src --issue "Fix Stripe webhook signature verification"`
  },
  {
    id: 'qa',
    title: 'Local Documents Q&A',
    desc: 'High-speed local vector query pipeline using GGUF embeddings.',
    code: `# Query local index database\nodysseus-rag ingest --source ./docs\nodysseus-rag query "What are the Q3 API rate limits?"`
  }
];

const QuickstartPage = () => {
  // Navigation Guides Dropdown state
  const [isGuidesOpen, setIsGuidesOpen] = useState(false);

  // Stateful Quiz Selections
  const [quizSelections, setQuizSelections] = useState({
    os: '',
    route: '',
    engine: '',
    state: ''
  });
  const [emailInput, setEmailInput] = useState('');
  
  // Docker vs Ollama Tabs State
  const [activeTab, setActiveTab] = useState('docker');

  // Diagnostics state
  const [activeError, setActiveError] = useState(null);

  // UI interaction copy statuses
  const [copiedState, setCopiedState] = useState({});

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedState(prev => ({ ...prev, [key]: true }));
    toast.success('Copied to clipboard');
    setTimeout(() => {
      setCopiedState(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const handleQuizSelect = (field, value) => {
    setQuizSelections(prev => ({ ...prev, [field]: value }));
  };

  const isQuizComplete = quizSelections.os && quizSelections.route && quizSelections.engine && quizSelections.state;

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!emailInput) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success(`Setup plan sent to ${emailInput}! Check your inbox soon. 📧`);
    setEmailInput('');
  };

  // Dynamic Quiz Outcomes
  const getQuizRecommendation = () => {
    const { os, route, engine, state } = quizSelections;
    
    if (route === 'docker' || os === 'linux') {
      return {
        title: "Docker Compose is your safest Odysseus AI install path",
        subtitle: "High confidence for most Windows, Linux, and beginner installs.",
        why: "Docker isolates Python runtimes and Node packages, meaning local package-lock sync errors or Python path issues will not corrupt your system.",
        prereqs: "Docker Desktop installed, Git, at least 8GB of free RAM.",
        commands: `git clone https://github.com/pewdiepie-archdaemon/odysseus.git\ncd odysseus\ndocker compose up -d --build`,
        avoid: "Do not run local Node/npm install commands concurrently with Docker execution, as lockfiles will sync and cause container build failures."
      };
    } else if (os === 'macos_silicon' && route === 'native') {
      return {
        title: "Native Apple Silicon Python / Ollama Pipeline",
        subtitle: "Best performance for macOS M1/M2/M3 with Metal Acceleration.",
        why: "Native macOS execution allows Ollama and PyTorch to direct-access unified Apple Silicon memory, bypass Docker VM overhead, and speed up token generation by up to 2.5x.",
        prereqs: "macOS Silicon, Python 3.10+, Ollama for Mac installed locally.",
        commands: `git clone https://github.com/pewdiepie-archdaemon/odysseus.git\ncd odysseus\nnpm run install-all\nexport OLLAMA_HOST="127.0.0.1:11434"\nnpm run dev`,
        avoid: "Avoid using virtual machines or Rosetta 2 x86 emulation, as they bypass Metal API hardware acceleration entirely."
      };
    } else if (engine === 'api') {
      return {
        title: "API-Backed Cloud LLM Routing Setup",
        subtitle: "Ideal for low-spec systems or cloud-native setups.",
        why: "Running Odysseus with OpenRouter or OpenAI keys bypasses all local VRAM requirements, allowing even weak laptops to orchestrate advanced workflows.",
        prereqs: "An active OpenRouter or OpenAI API key, Node.js installed.",
        commands: `git clone https://github.com/pewdiepie-archdaemon/odysseus.git\ncd odysseus/apps/api\ncp .env.example .env\n# Edit .env with your OPENROUTER_API_KEY\nnpm run start`,
        avoid: "Do not leave default endpoints enabled if no local Ollama service is running, otherwise the client will throw immediate 502/504 gateways."
      };
    } else {
      return {
        title: "Deterministic Git-to-Local Development Setup",
        subtitle: "Standard local development workspace workflow.",
        why: "Cloning the repository and executing a local npm workspace allows full customization of frontend assets and API endpoints directly.",
        prereqs: "Node.js 18+, Python 3.10+, Git installed.",
        commands: `git clone https://github.com/pewdiepie-archdaemon/odysseus.git\ncd odysseus\nnpm install\nnpm run build\nnpm run start`,
        avoid: "Do not run npm install inside individual subfolders; run it once in the root folder so npm workspaces can handle dependencies."
      };
    }
  };

  const recommendation = getQuizRecommendation();

  // Workflow tab states
  const [activeWorkflowTab, setActiveWorkflowTab] = useState('research');

  return (
    <div className="min-h-screen bg-[#0f0f11] text-neutral-100 font-sans selection:bg-purple-600 selection:text-white pb-32">
      <Helmet>
        <title>Odysseus AI Quickstart | Install local AI without errors</title>
        <meta name="description" content="Deploy Odysseus AI locally using Docker, Python, or Ollama. Complete interactive guide, troubleshooting matrix, and pricing." />
      </Helmet>

      {/* --- 1. NAVIGATION BAR --- */}
      <nav className="sticky top-0 z-50 w-full bg-[#161619]/90 backdrop-blur-md border-b-2 border-neutral-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="font-black tracking-widest text-lg uppercase text-white">
            ODYSSEUS AI
          </span>
          <span className="bg-purple-600 text-white border-2 border-black rounded px-1.5 py-0.5 font-black text-xs shadow-[1.5px_1.5px_0px_0px_rgba(255,255,255,1)]">
            QUICKSTART
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-black uppercase tracking-wider text-neutral-300">
          <a href="#install" className="hover:text-purple-500 transition-colors">Install Guide</a>
          
          {/* Custom Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsGuidesOpen(!isGuidesOpen)}
              className="hover:text-purple-500 transition-colors flex items-center gap-1 uppercase"
            >
              Guides <ChevronDown size={14} className={`transform transition-transform ${isGuidesOpen ? 'rotate-185' : ''}`} />
            </button>
            {isGuidesOpen && (
              <div className="absolute top-8 left-0 bg-[#161619] border-2 border-neutral-700 p-3 flex flex-col gap-2.5 rounded-lg w-52 shadow-[4px_4px_0px_0px_rgba(168,85,247,0.5)]">
                <a href="#matrix" onClick={() => setIsGuidesOpen(false)} className="hover:text-purple-400 py-1 transition-colors text-xs">Install Matrix</a>
                <a href="#docker-ollama" onClick={() => setIsGuidesOpen(false)} className="hover:text-purple-400 py-1 transition-colors text-xs">Docker & Ollama Routing</a>
                <a href="#snippets" onClick={() => setIsGuidesOpen(false)} className="hover:text-purple-400 py-1 transition-colors text-xs">Swarms & Snippets</a>
              </div>
            )}
          </div>

          <a href="#checker" className="hover:text-purple-500 transition-colors">Check Path</a>
          <a href="#diagnostics" className="hover:text-purple-500 transition-colors">Fix Problems</a>
          <a href="#pricing" className="hover:text-purple-500 transition-colors">Launch Kit</a>
          <a href="#faq" className="hover:text-purple-500 transition-colors">FAQ</a>
          
          <a 
            href="https://github.com/pewdiepie-archdaemon/odysseus" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-purple-500 transition-colors flex items-center gap-1 border-l-2 border-neutral-700 pl-6"
          >
            GitHub <ExternalLink size={14} />
          </a>
        </div>

        <div>
          <a 
            href="#pricing" 
            className="bg-purple-600 border-2 border-neutral-100 text-white font-black uppercase text-xs px-5 py-2.5 rounded-md hover:bg-purple-500 hover:shadow-[3px_3px_0px_0px_rgba(34,197,94,1)] shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none inline-block text-center"
          >
            Get Launch Kit
          </a>
        </div>
      </nav>

      {/* --- 2. HERO SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Value Prop */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full mb-6">
            🛠️ Odysseus AI Quickstart — Install Without Fighting (Docker, Python or Ollama)
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-[1.05] tracking-tight mb-6">
            The safest, fastest, and most beginner-friendly way to run Odysseus locally.
          </h2>
          <p className="text-lg md:text-xl text-neutral-400 font-semibold mb-8 max-w-2xl leading-relaxed">
            Odysseus AI is a free, open-source AI interface created by PewDiePie. This independent Launch Kit eliminates terminal errors and configuration loops.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-12">
            <a 
              href="#pricing" 
              className="bg-purple-600 border-2 border-neutral-100 text-white font-black uppercase text-sm px-8 py-4 rounded-lg hover:bg-purple-500 shadow-[4px_4px_0px_0px_rgba(34,197,94,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              Get Odysseus Launch Kit – $19 <Rocket size={16} />
            </a>
            <a 
              href="#checker" 
              className="bg-neutral-800 border-2 border-neutral-700 text-white font-black uppercase text-sm px-8 py-4 rounded-lg hover:bg-neutral-700 transition-colors text-center"
            >
              Check My Setup Path – Free
            </a>
          </div>

          {/* Feature Badges Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full pt-6 border-t border-neutral-800">
            {[
              { label: 'Windows • Mac • Linux', desc: 'Cross-platform support' },
              { label: 'Docker & Ollama Ready', desc: 'Optimized containers' },
              { label: 'Beginner Friendly', desc: 'No terminal friction' },
              { label: 'Secure & Localhost-First', desc: '100% private vectors' }
            ].map((b, i) => (
              <div key={i} className="border border-neutral-800 p-3.5 rounded-lg bg-[#141416]/50">
                <div className="text-xs font-black text-white mb-1 uppercase tracking-wide">{b.label}</div>
                <div className="text-[10px] text-neutral-500 font-semibold uppercase">{b.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Screenshot Placeholder */}
        <div className="lg:col-span-5 w-full">
          <div className="border-4 border-neutral-800 rounded-xl bg-[#141416] p-4 relative shadow-[8px_8px_0px_0px_rgba(168,85,247,0.3)]">
            <div className="flex items-center gap-1.5 mb-3 border-b border-neutral-800 pb-3">
              <span className="w-3.5 h-3.5 rounded-full bg-red-500/80"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-yellow-500/80"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-green-500/80"></span>
              <span className="text-[10px] text-neutral-600 font-mono ml-2">pewdiepie-archdaemon/odysseus-workspace</span>
            </div>
            
            <div className="aspect-video w-full bg-neutral-950 rounded border border-neutral-800 flex flex-col items-center justify-center p-6 text-center">
              <Terminal size={40} className="text-purple-500 mb-3" />
              <div className="font-mono text-xs text-neutral-400 max-w-xs uppercase font-bold tracking-widest leading-relaxed">
                Official Odysseus Workspace Screenshot
              </div>
              <div className="text-[10px] text-neutral-600 font-mono mt-1">
                Ref: https://github.com/pewdiepie-archdaemon/odysseus
              </div>
            </div>

            <div className="absolute -bottom-3 -right-3 bg-purple-600 text-white text-[10px] font-black uppercase px-2.5 py-1 shadow border border-black">
              WORKSPACE ACTIVE
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto border-t-2 border-dashed border-neutral-800 my-12"></div>

      {/* --- 3. CORE SEGMENTATION --- */}
      <section id="install" className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12 text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 text-purple-500 font-black uppercase text-sm tracking-widest">
            <HelpCircle size={16} /> Segment Selection
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase mt-3">
            What is the Odysseus AI Quickstart?
          </h2>
          <p className="text-base text-neutral-400 font-semibold mt-2 max-w-2xl">
            Choose the state that matches your current progress to get targeted commands and instant resolutions.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="border-4 border-neutral-800 bg-[#FFFDF0]/[0.02] p-6 rounded-xl flex flex-col justify-between h-full hover:border-purple-600 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6 border border-purple-500/30">
                <BookOpen size={20} />
              </div>
              <h3 className="text-xl font-black uppercase mb-3 text-white">I haven't installed Odysseus AI yet</h3>
              <p className="text-sm font-poppins text-neutral-400 mb-6 leading-relaxed">
                Start by cloning the official GitHub repository, then choose Docker, Windows native, macOS native, or API-backed cloud setup.
              </p>
              
              <div className="relative bg-black border border-neutral-800 rounded p-3 text-left mb-6 font-mono text-xs text-emerald-400">
                <code>git clone https://github.com/pewdiepie-archdaemon/odysseus.git</code>
                <button 
                  onClick={() => handleCopy('git clone https://github.com/pewdiepie-archdaemon/odysseus.git', 'clone')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-neutral-800 hover:bg-neutral-700 text-white p-1 rounded transition-colors"
                >
                  {copiedState['clone'] ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-4 border-t border-neutral-800/50">
              <a href="#checker" className="bg-purple-600 text-white text-xs font-black uppercase py-2.5 text-center rounded hover:bg-purple-500 transition-colors">
                Check My Install Path
              </a>
              <a href="https://github.com/pewdiepie-archdaemon/odysseus" target="_blank" rel="noopener noreferrer" className="bg-neutral-800 text-white text-xs font-black uppercase py-2.5 text-center rounded hover:bg-neutral-700 transition-colors">
                Read Official Install Hub
              </a>
            </div>
          </div>

          {/* Card 2 */}
          <div className="border-4 border-neutral-800 bg-[#FFFDF0]/[0.02] p-6 rounded-xl flex flex-col justify-between h-full hover:border-purple-600 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/30">
                <Laptop size={20} />
              </div>
              <h3 className="text-xl font-black uppercase mb-3 text-white">I need Docker or Ollama setup</h3>
              <p className="text-sm font-poppins text-neutral-400 mb-6 leading-relaxed">
                Most Docker problems are not Odysseus problems. They are port, .env, container health, or Ollama endpoint mapping problems.
              </p>
              
              <div className="relative bg-black border border-neutral-800 rounded p-3 text-left mb-6 font-mono text-xs text-emerald-400">
                <code>http://host.docker.internal:11434/v1</code>
                <button 
                  onClick={() => handleCopy('http://host.docker.internal:11434/v1', 'docker-endpoint')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-neutral-800 hover:bg-neutral-700 text-white p-1 rounded transition-colors"
                >
                  {copiedState['docker-endpoint'] ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-4 border-t border-neutral-800/50">
              <a href="#docker-ollama" className="bg-purple-600 text-white text-xs font-black uppercase py-2.5 text-center rounded hover:bg-purple-500 transition-colors">
                Resolve My Ollama Endpoint
              </a>
              <a href="#matrix" className="bg-neutral-800 text-white text-xs font-black uppercase py-2.5 text-center rounded hover:bg-neutral-700 transition-colors">
                Open Docker Setup Guide
              </a>
            </div>
          </div>

          {/* Card 3 */}
          <div className="border-4 border-neutral-800 bg-[#FFFDF0]/[0.02] p-6 rounded-xl flex flex-col justify-between h-full hover:border-purple-600 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center mb-6 border border-red-500/30">
                <ShieldAlert size={20} />
              </div>
              <h3 className="text-xl font-black uppercase mb-3 text-white">Odysseus AI is already not working</h3>
              <p className="text-sm font-poppins text-neutral-400 mb-6 leading-relaxed">
                Do not delete folders or disable authentication. First classify the error: admin passwords, localhost:7000, Docker Compose, or GPU.
              </p>
              
              <div className="relative bg-black border border-neutral-800 rounded p-3 text-left mb-6 font-mono text-xs text-emerald-400">
                <code>docker compose ps</code>
                <button 
                  onClick={() => handleCopy('docker compose ps', 'ps-cmd')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-neutral-800 hover:bg-neutral-700 text-white p-1 rounded transition-colors"
                >
                  {copiedState['ps-cmd'] ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-4 border-t border-neutral-800/50">
              <a href="#diagnostics" className="bg-purple-600 text-white text-xs font-black uppercase py-2.5 text-center rounded hover:bg-purple-500 transition-colors">
                Diagnose My Error
              </a>
              <a href="#diagnostics" className="bg-neutral-800 text-white text-xs font-black uppercase py-2.5 text-center rounded hover:bg-neutral-700 transition-colors">
                Open Error Doctor
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto border-t-2 border-dashed border-neutral-800 my-12"></div>

      {/* --- 4. INTERACTIVE SETUP PATH CHECKER --- */}
      <section id="checker" className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12 text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-black uppercase text-sm tracking-widest">
            <Zap size={16} /> Setup Checker
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase mt-3">
            Interactive Setup Path Checker
          </h2>
          <p className="text-base text-neutral-400 font-semibold mt-2">
            Answer 4 quick questions to instantly generate your tailored local setup recipe.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Quiz Inputs (5 Cols) */}
          <div className="lg:col-span-5 bg-[#161619] border-4 border-black p-6 rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
            
            {/* Q1 */}
            <div>
              <span className="block text-xs font-black uppercase tracking-wider text-purple-400 mb-2.5">
                Q1: What machine are you using?
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'windows', label: 'Windows PC' },
                  { value: 'macos_silicon', label: 'Mac Apple Silicon' },
                  { value: 'macos_intel', label: 'Mac Intel' },
                  { value: 'linux', label: 'Linux OS' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleQuizSelect('os', opt.value)}
                    className={`p-2.5 text-xs font-bold border-2 border-black rounded transition-all text-center uppercase ${
                      quizSelections.os === opt.value 
                        ? 'bg-purple-600 text-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] translate-y-0.5' 
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Q2 */}
            <div>
              <span className="block text-xs font-black uppercase tracking-wider text-purple-400 mb-2.5">
                Q2: What setup route do you prefer?
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'docker', label: 'Docker' },
                  { value: 'native', label: 'Native' },
                  { value: 'not_sure', label: 'Not Sure' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleQuizSelect('route', opt.value)}
                    className={`p-2.5 text-[10px] font-bold border-2 border-black rounded transition-all text-center uppercase ${
                      quizSelections.route === opt.value 
                        ? 'bg-purple-600 text-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] translate-y-0.5' 
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Q3 */}
            <div>
              <span className="block text-xs font-black uppercase tracking-wider text-purple-400 mb-2.5">
                Q3: Models Source Preference?
              </span>
              <div className="space-y-2">
                {[
                  { value: 'ollama', label: 'Local Ollama Models' },
                  { value: 'api', label: 'API-Backed (OpenRouter/OpenAI)' },
                  { value: 'cookbook', label: 'Custom GPU cookbook serving' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleQuizSelect('engine', opt.value)}
                    className={`p-2.5 w-full text-xs font-bold border-2 border-black rounded transition-all text-left uppercase flex justify-between items-center ${
                      quizSelections.engine === opt.value 
                        ? 'bg-purple-600 text-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] translate-y-0.5' 
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-750'
                    }`}
                  >
                    {opt.label}
                    {quizSelections.engine === opt.value && <CheckCircle size={14} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Q4 */}
            <div>
              <span className="block text-xs font-black uppercase tracking-wider text-purple-400 mb-2.5">
                Q4: What is your current state?
              </span>
              <div className="space-y-2">
                {[
                  { value: 'fresh', label: 'Fresh install (Nothing setup)' },
                  { value: 'cloned', label: 'Repo is already cloned' },
                  { value: 'docker_running', label: 'Docker container is running' },
                  { value: 'ollama_missing', label: 'Ollama not detected' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleQuizSelect('state', opt.value)}
                    className={`p-2.5 w-full text-xs font-bold border-2 border-black rounded transition-all text-left uppercase flex justify-between items-center ${
                      quizSelections.state === opt.value 
                        ? 'bg-purple-600 text-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] translate-y-0.5' 
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-750'
                    }`}
                  >
                    {opt.label}
                    {quizSelections.state === opt.value && <CheckCircle size={14} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quiz Output Panel (7 Cols) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!isQuizComplete ? (
                <div className="border-4 border-dashed border-neutral-700 bg-neutral-900/40 rounded-xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[350px]">
                  <HelpCircle size={40} className="text-neutral-600 mb-4 animate-bounce" />
                  <h3 className="text-lg font-black uppercase mb-1">Recipe Pending</h3>
                  <p className="text-xs font-poppins text-neutral-500 max-w-xs uppercase leading-relaxed font-bold">
                    Select answers to all 4 questions on the left to compile your recommended local setup path.
                  </p>
                </div>
              ) : (
                <motion.div
                  key="output"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-4 border-purple-600 bg-[#161619] p-6 md:p-8 rounded-xl shadow-[8px_8px_0px_0px_rgba(168,85,247,0.25)] flex flex-col justify-between h-full"
                >
                  <div>
                    <span className="bg-emerald-500 text-black font-black uppercase text-[10px] px-2.5 py-1 rounded inline-block mb-4">
                      Recommended install recipe
                    </span>
                    <h3 className="text-2xl md:text-3xl font-black uppercase mb-2 text-white">
                      {recommendation.title}
                    </h3>
                    <p className="text-sm font-poppins font-bold text-neutral-400 mb-6 uppercase tracking-wider">
                      {recommendation.subtitle}
                    </p>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xs font-black uppercase text-purple-400 mb-1 tracking-wider">Why this path:</h4>
                        <p className="text-xs text-neutral-300 font-poppins font-semibold leading-relaxed">{recommendation.why}</p>
                      </div>

                      <div>
                        <h4 className="text-xs font-black uppercase text-purple-400 mb-1 tracking-wider">Prerequisites:</h4>
                        <p className="text-xs text-neutral-300 font-poppins font-semibold leading-relaxed">{recommendation.prereqs}</p>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-xs font-black uppercase text-purple-400 tracking-wider">First commands:</h4>
                          <button 
                            onClick={() => handleCopy(recommendation.commands, 'quiz-code')}
                            className="bg-neutral-800 text-white font-black uppercase text-[10px] px-2 py-1 flex items-center gap-1 hover:bg-neutral-700 rounded border border-neutral-700"
                          >
                            {copiedState['quiz-code'] ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
                            Copy commands
                          </button>
                        </div>
                        <pre className="bg-black border border-neutral-800 p-4 rounded text-left font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
                          <code>{recommendation.commands}</code>
                        </pre>
                      </div>

                      <div className="bg-red-500/10 border-2 border-red-500/30 p-4 rounded text-left flex gap-3 items-start">
                        <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={16} />
                        <div>
                          <div className="text-xs font-black text-red-400 uppercase tracking-wide mb-1">Avoid this mistake:</div>
                          <p className="text-[11px] text-red-200 font-poppins font-semibold leading-relaxed">{recommendation.avoid}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleEmailSubmit} className="mt-8 pt-6 border-t-2 border-neutral-800/80 flex flex-col sm:flex-row gap-2">
                    <input 
                      type="email" 
                      placeholder="Enter your email to receive this plan..." 
                      className="bg-neutral-800 text-white border-2 border-neutral-700 text-xs px-4 py-3 rounded outline-none placeholder:text-neutral-500 font-bold uppercase flex-1"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                    />
                    <button 
                      type="submit" 
                      className="bg-purple-600 hover:bg-purple-500 text-white border-2 border-neutral-100 font-black uppercase text-xs px-6 py-3 rounded shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-1.5"
                    >
                      Email Plan <Mail size={12} />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto border-t-2 border-dashed border-neutral-800 my-12"></div>

      {/* --- 5. INSTALL PATH DECISION MATRIX --- */}
      <section id="matrix" className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12 text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 text-purple-500 font-black uppercase text-sm tracking-widest">
            <Server size={16} strokeWidth={2.5} /> Decision Grid
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase mt-3">
            Install Path Decision Matrix
          </h2>
          <p className="text-base text-neutral-400 font-semibold mt-2">
            A comprehensive mapping of all configuration paths to isolate traps and fast-track deployment.
          </p>
        </header>

        {/* Structural Table / Responsive Layout */}
        <div className="border-4 border-black rounded-xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-[#161619] max-w-full">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-neutral-900 border-b-4 border-black font-black uppercase text-xs tracking-wider text-neutral-300">
                  <th className="p-4 border-r-2 border-black">Path Name</th>
                  <th className="p-4 border-r-2 border-black">Choose This If</th>
                  <th className="p-4 border-r-2 border-black">Do Not Choose This If</th>
                  <th className="p-4 border-r-2 border-black">First Command / Endpoint</th>
                  <th className="p-4 border-r-2 border-black text-red-400">Common Trap</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black font-poppins text-xs font-semibold">
                {PATH_MATRIX.map((row, idx) => (
                  <tr key={idx} className={`hover:bg-neutral-800/20 transition-colors ${row.highlighted ? 'bg-purple-600/5' : ''}`}>
                    <td className="p-4 font-black uppercase tracking-wide border-r-2 border-black text-white">
                      {row.path}
                      {row.highlighted && <span className="block text-[8px] bg-emerald-500 text-black font-black px-1.5 py-0.5 rounded w-fit mt-1">RECOMMENDED</span>}
                    </td>
                    <td className="p-4 border-r-2 border-black text-neutral-300 leading-relaxed">{row.chooseIf}</td>
                    <td className="p-4 border-r-2 border-black text-neutral-400 leading-relaxed">{row.doNotChooseIf}</td>
                    <td className="p-4 border-r-2 border-black font-mono text-[11px] text-emerald-400">
                      <code>{row.command}</code>
                    </td>
                    <td className="p-4 border-r-2 border-black text-red-200 bg-red-500/5 leading-relaxed">{row.trap}</td>
                    <td className="p-4 text-center">
                      <a href="#pricing" className="bg-neutral-850 hover:bg-neutral-700 text-white font-black uppercase text-[10px] px-3 py-2 border border-neutral-700 rounded transition-colors inline-block whitespace-nowrap">
                        Configure
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto border-t-2 border-dashed border-neutral-800 my-12"></div>

      {/* --- 6. DOCKER QUICK PATH & OLLAMA ROUTING TABLES --- */}
      <section id="docker-ollama" className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12 text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-black uppercase text-sm tracking-widest">
            <Terminal size={16} strokeWidth={2.5} /> Dev Reference
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase mt-3">
            Docker Quick Path & Ollama Routing
          </h2>
          <p className="text-base text-neutral-400 font-semibold mt-2">
            Switch tabs below to view either Docker compose commands or local host routing addresses.
          </p>
        </header>

        {/* Tab Controls */}
        <div className="flex gap-3 mb-6 border-b-2 border-neutral-800 pb-3">
          <button
            onClick={() => setActiveTab('docker')}
            className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider border-2 border-black rounded transition-all ${
              activeTab === 'docker' 
                ? 'bg-purple-600 text-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] translate-y-0.5' 
                : 'bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            🐳 Docker Quick Path
          </button>
          <button
            onClick={() => setActiveTab('ollama')}
            className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider border-2 border-black rounded transition-all ${
              activeTab === 'ollama' 
                ? 'bg-purple-600 text-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] translate-y-0.5' 
                : 'bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            🦙 Ollama Routing Tables
          </button>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {activeTab === 'docker' ? (
            <>
              {/* Docker Content */}
              <div className="lg:col-span-6 bg-[#161619] border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black uppercase text-white mb-2">Build and Start Docker Swarm</h3>
                  <p className="text-xs font-poppins text-neutral-400 mb-6 leading-relaxed">
                    Instantly compile individual front/back containers within the workspace using the default configuration file.
                  </p>
                  
                  <div className="space-y-4">
                    {[
                      { label: 'Step 1: Check Docker state', cmd: 'docker info' },
                      { label: 'Step 2: Start compose bundle', cmd: 'docker compose up -d --build' },
                      { label: 'Step 3: Verify container statuses', cmd: 'docker compose ps' }
                    ].map((step, idx) => (
                      <div key={idx} className="bg-black/40 border border-neutral-800 rounded p-3 text-left">
                        <div className="text-[10px] font-black uppercase text-purple-400 mb-1">{step.label}</div>
                        <div className="font-mono text-xs text-emerald-400 flex justify-between items-center">
                          <code>{step.cmd}</code>
                          <button 
                            onClick={() => handleCopy(step.cmd, `docker-cmd-${idx}`)}
                            className="bg-neutral-800 hover:bg-neutral-700 text-white p-1 rounded transition-colors"
                          >
                            {copiedState[`docker-cmd-${idx}`] ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-[#161619] border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black uppercase text-white mb-2">Clean Container Cache</h3>
                  <p className="text-xs font-poppins text-neutral-400 mb-6 leading-relaxed">
                    Prune dangling layers, delete unlinked volumes, and force rebuild containers to resolve lockfile and package issues.
                  </p>

                  <div className="space-y-4">
                    {[
                      { label: 'Stop and prune containers', cmd: 'docker compose down --v' },
                      { label: 'Prune unused build caching layers', cmd: 'docker builder prune -f' },
                      { label: 'Force build clean workspace', cmd: 'docker compose build --no-cache' }
                    ].map((step, idx) => (
                      <div key={idx} className="bg-black/40 border border-neutral-800 rounded p-3 text-left">
                        <div className="text-[10px] font-black uppercase text-purple-400 mb-1">{step.label}</div>
                        <div className="font-mono text-xs text-emerald-400 flex justify-between items-center">
                          <code>{step.cmd}</code>
                          <button 
                            onClick={() => handleCopy(step.cmd, `docker-clean-${idx}`)}
                            className="bg-neutral-800 hover:bg-neutral-700 text-white p-1 rounded transition-colors"
                          >
                            {copiedState[`docker-clean-${idx}`] ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Ollama Content */}
              <div className="lg:col-span-12 bg-[#161619] border-4 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-neutral-900 border-b-2 border-black font-black uppercase text-xs tracking-wider text-neutral-300">
                        <th className="p-4 border-r-2 border-black">Run Mode</th>
                        <th className="p-4 border-r-2 border-black">Endpoint URL Base</th>
                        <th className="p-4 border-r-2 border-black">Ollama Env Variable binding</th>
                        <th className="p-4 text-center">Diagnostics Ping</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800 font-poppins text-xs font-semibold">
                      {[
                        {
                          mode: 'Docker Container to Local Host Ollama',
                          url: 'http://host.docker.internal:11434/v1',
                          binding: 'OLLAMA_HOST="0.0.0.0:11434"',
                          ping: 'curl http://host.docker.internal:11434/api/tags'
                        },
                        {
                          mode: 'Local Host Node APP to Native Local Ollama',
                          url: 'http://localhost:11434/v1',
                          binding: 'OLLAMA_HOST="127.0.0.1:11434"',
                          ping: 'curl http://localhost:11434/api/tags'
                        },
                        {
                          mode: 'Container to Container (Docker Network)',
                          url: 'http://ollama-container:11434/v1',
                          binding: 'OLLAMA_HOST="0.0.0.0:11434"',
                          ping: 'ping ollama-container'
                        },
                        {
                          mode: 'Remote Server / Public Reverse Proxy Tunnel',
                          url: 'https://ollama.yourdomain.com/v1',
                          binding: 'OLLAMA_HOST="0.0.0.0:11434"',
                          ping: 'curl -I https://ollama.yourdomain.com/api/tags'
                        }
                      ].map((item, i) => (
                        <tr key={i} className="hover:bg-neutral-850/10">
                          <td className="p-4 border-r border-neutral-800 font-black uppercase text-white">{item.mode}</td>
                          <td className="p-4 border-r border-neutral-800 font-mono text-[11px] text-emerald-400">{item.url}</td>
                          <td className="p-4 border-r border-neutral-800 font-mono text-neutral-400">{item.binding}</td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => handleCopy(item.ping, `ping-cmd-${i}`)}
                              className="bg-neutral-800 hover:bg-neutral-700 text-white font-black uppercase text-[10px] px-3 py-1.5 border border-neutral-700 rounded transition-colors inline-flex items-center gap-1"
                            >
                              {copiedState[`ping-cmd-${i}`] ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
                              Copy Ping
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto border-t-2 border-dashed border-neutral-800 my-12"></div>

      {/* --- 7. INTERACTIVE DIAGNOSTIC HUB & FAQ ACCORDION --- */}
      <section id="diagnostics" className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12 text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 text-purple-500 font-black uppercase text-sm tracking-widest">
            <HelpCircle size={16} strokeWidth={2.5} /> Diagnostics Hub
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase mt-3">
            Interactive Diagnostic Hub & FAQ
          </h2>
          <p className="text-base text-neutral-400 font-semibold mt-2">
            Click on common errors to expand deep root causes and copy recovery commands.
          </p>
        </header>

        {/* Direct Answers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              title: "Where is the admin password?",
              ans: "When first running Odysseus, check container logs or startup shell stdout. Look for lines containing 'Temporary Admin Password'. Do not restart the container, or it will generate a new one.",
              cmd: "docker compose logs | grep -i password"
            },
            {
              title: "Why does localhost:7000 not open?",
              ans: "Port 7000 might be bound by macOS AirPlay Receiver, or the container crashed. Verify port allocations using the terminal check, and disable macOS AirPlay receiver if necessary.",
              cmd: "sudo lsof -i :7000"
            },
            {
              title: "Is it safe to expose publicly?",
              ans: "No. Odysseus local has zero default authentication rate limits or endpoint encryption. Do not expose host 7000 to the public WAN without setting up a reverse proxy with TLS/SSL authentication.",
              cmd: "ufw status verbose"
            }
          ].map((card, i) => (
            <div key={i} className="border-4 border-black bg-neutral-900 p-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-lg font-black uppercase mb-3 text-white">{card.title}</h3>
              <p className="text-xs font-poppins text-neutral-400 mb-6 leading-relaxed font-semibold">{card.ans}</p>
              
              <div className="bg-black/60 border border-neutral-800 rounded p-2.5 flex justify-between items-center">
                <code className="font-mono text-[10px] text-emerald-400">{card.cmd}</code>
                <button 
                  onClick={() => handleCopy(card.cmd, `faq-cmd-${i}`)}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white p-1 rounded transition-colors"
                >
                  {copiedState[`faq-cmd-${i}`] ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Accordion Errors list */}
        <div className="space-y-4">
          {[
            {
              id: 'err1',
              title: 'Cannot find admin password / SQLite locks',
              desc: 'SQLite databases locks occur when two node threads access the db file concurrently. To fix, close active developer processes and remove the lockfile.',
              solution: 'rm -f apps/pocketbase/pb_data/*.db-journal'
            },
            {
              id: 'err2',
              title: 'Local Ollama not detected (502 / 504 Bad Gateway)',
              desc: 'Docker containers resolve localhost internally. You must bind the API server to look at host.docker.internal inside container networks.',
              solution: 'export VITE_POCKETBASE_URL="http://host.docker.internal:8090"'
            },
            {
              id: 'err3',
              title: 'CUDA out-of-memory / Offloading failure',
              desc: 'If model size exceeds GPU RAM, execution collapses. Force partial CPU offloading or load Q4 GGUF models.',
              solution: 'ollama run llama3:8b-instruct-q4_K_M'
            },
            {
              id: 'err4',
              title: 'Node Workspace lockfile sync failures',
              desc: 'NPM ci crashes if lockfiles contain mismatched root dependencies. Run installation omitting local dev values.',
              solution: 'npm install --omit=dev'
            }
          ].map(err => {
            const isOpen = activeError === err.id;
            return (
              <div 
                key={err.id} 
                className="border-2 border-neutral-800 bg-[#161619] rounded-lg overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveError(isOpen ? null : err.id)}
                  className="w-full p-4 flex justify-between items-center text-left hover:bg-neutral-800/20"
                >
                  <span className="font-black text-sm uppercase tracking-wide flex items-center gap-2">
                    <span className="text-red-500 font-bold">⚠️</span> {err.title}
                  </span>
                  <ChevronDown className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} size={16} />
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden border-t border-neutral-800"
                    >
                      <div className="p-4 bg-neutral-950/40 text-xs font-semibold leading-relaxed space-y-4 font-poppins text-neutral-300">
                        <p>{err.desc}</p>
                        
                        <div className="bg-black border border-neutral-800 p-3 rounded flex justify-between items-center font-mono text-emerald-400">
                          <code>{err.solution}</code>
                          <button 
                            onClick={() => handleCopy(err.solution, `err-sol-${err.id}`)}
                            className="bg-neutral-800 hover:bg-neutral-700 text-white p-1 rounded transition-colors"
                          >
                            {copiedState[`err-sol-${err.id}`] ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto border-t-2 border-dashed border-neutral-800 my-12"></div>

      {/* --- 8. TIERED PRICING MATRIX --- */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12 text-center">
          <span className="inline-flex items-center gap-1.5 text-purple-500 font-black uppercase text-sm tracking-widest">
            <DollarSign size={16} strokeWidth={2.5} /> Pricing
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase mt-3">
            Pricing Plans & Support Levels
          </h2>
          <p className="text-base text-neutral-400 font-semibold mt-2 max-w-xl mx-auto">
            Choose the plan that suits your developer flow, from community tools to full remote workspace setups.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 */}
          <div className="border-4 border-neutral-800 bg-[#161619] p-6 rounded-xl flex flex-col justify-between h-full">
            <div>
              <div className="text-neutral-400 font-black uppercase text-xs mb-2">Developer Route</div>
              <div className="text-3xl font-black text-white mb-4">$0</div>
              <p className="text-xs text-neutral-400 font-poppins leading-relaxed font-semibold mb-6">
                For developers comfortable building from git, reading logs, and writing configs.
              </p>
              <ul className="space-y-3.5 mb-6 text-xs text-neutral-300 font-poppins font-semibold">
                <li className="flex gap-2"><Check size={14} className="text-green-500 shrink-0 mt-0.5" /> Core repository source</li>
                <li className="flex gap-2"><Check size={14} className="text-green-500 shrink-0 mt-0.5" /> Community discussions</li>
                <li className="flex gap-2"><Check size={14} className="text-green-500 shrink-0 mt-0.5" /> Documentation resources</li>
              </ul>
            </div>
            <button className="bg-neutral-800 text-white font-black uppercase text-xs w-full py-3 hover:bg-neutral-700 transition-colors border border-neutral-700 rounded-md">
              Start Free Path
            </button>
          </div>

          {/* Card 2 - Highlighted */}
          <div className="border-4 border-purple-600 bg-[#161619] p-6 rounded-xl flex flex-col justify-between h-full relative shadow-[6px_6px_0px_0px_rgba(168,85,247,0.25)]">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-black border border-black font-black uppercase text-[9px] px-2 py-0.5 shadow">
              Recommended / Early Access
            </span>
            <div>
              <div className="text-purple-400 font-black uppercase text-xs mb-2">Launch Kit</div>
              <div className="text-3xl font-black text-white mb-4">$19</div>
              <p className="text-xs text-neutral-300 font-poppins leading-relaxed font-semibold mb-6">
                The full local deployment template bundle, startup scripts, and configurations.
              </p>
              <ul className="space-y-3.5 mb-6 text-xs text-neutral-200 font-poppins font-semibold">
                <li className="flex gap-2"><Check size={14} className="text-green-500 shrink-0 mt-0.5" /> Battle-tested Compose yaml</li>
                <li className="flex gap-2"><Check size={14} className="text-green-500 shrink-0 mt-0.5" /> Pre-built .env templates</li>
                <li className="flex gap-2"><Check size={14} className="text-green-500 shrink-0 mt-0.5" /> Error fix-guide PDF</li>
                <li className="flex gap-2"><Check size={14} className="text-green-500 shrink-0 mt-0.5" /> 1-Click execution shell scripts</li>
              </ul>
            </div>
            <button className="bg-purple-600 hover:bg-purple-500 text-white border border-neutral-100 font-black uppercase text-xs w-full py-3 rounded-md shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-y-0.5 active:shadow-none transition-all">
              Unlock Launch Kit
            </button>
          </div>

          {/* Card 3 */}
          <div className="border-4 border-neutral-800 bg-[#161619] p-6 rounded-xl flex flex-col justify-between h-full">
            <div>
              <div className="text-neutral-400 font-black uppercase text-xs mb-2">Fix Report</div>
              <div className="text-3xl font-black text-white mb-4">$49</div>
              <p className="text-xs text-neutral-400 font-poppins leading-relaxed font-semibold mb-6">
                Receive customized diagnostic report for your environment errors from engineers.
              </p>
              <ul className="space-y-3.5 mb-6 text-xs text-neutral-300 font-poppins font-semibold">
                <li className="flex gap-2"><Check size={14} className="text-green-500 shrink-0 mt-0.5" /> Detailed stack log diagnostic</li>
                <li className="flex gap-2"><Check size={14} className="text-green-500 shrink-0 mt-0.5" /> Custom config templates</li>
                <li className="flex gap-2"><Check size={14} className="text-green-500 shrink-0 mt-0.5" /> Email support within 12h</li>
              </ul>
            </div>
            <button className="bg-neutral-800 text-white font-black uppercase text-xs w-full py-3 hover:bg-neutral-700 transition-colors border border-neutral-700 rounded-md">
              Order Fix Report
            </button>
          </div>

          {/* Card 4 */}
          <div className="border-4 border-neutral-800 bg-[#161619] p-6 rounded-xl flex flex-col justify-between h-full">
            <div>
              <div className="text-neutral-400 font-black uppercase text-xs mb-2">Remote Setup</div>
              <div className="text-3xl font-black text-white mb-4">$199</div>
              <p className="text-xs text-neutral-400 font-poppins leading-relaxed font-semibold mb-6">
                A live, dedicated technician will connect via AnyDesk/TeamViewer to solve installation.
              </p>
              <ul className="space-y-3.5 mb-6 text-xs text-neutral-300 font-poppins font-semibold">
                <li className="flex gap-2"><Check size={14} className="text-green-500 shrink-0 mt-0.5" /> Remote desktop installation</li>
                <li className="flex gap-2"><Check size={14} className="text-green-500 shrink-0 mt-0.5" /> Docker / Python optimization</li>
                <li className="flex gap-2"><Check size={14} className="text-green-500 shrink-0 mt-0.5" /> Model pulling and test check</li>
                <li className="flex gap-2"><Check size={14} className="text-green-500 shrink-0 mt-0.5" /> 7 days direct query support</li>
              </ul>
            </div>
            <button className="bg-neutral-800 text-white font-black uppercase text-xs w-full py-3 hover:bg-neutral-700 transition-colors border border-neutral-700 rounded-md">
              Book Remote Session
            </button>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto border-t-2 border-dashed border-neutral-800 my-12"></div>

      {/* --- 9. WORKFLOW STARTER CODE SNIPPETS --- */}
      <section id="snippets" className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12 text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 text-purple-500 font-black uppercase text-sm tracking-widest">
            <FileCode size={16} strokeWidth={2.5} /> Swarm Templates
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase mt-3">
            Workflow Starter Code Snippets
          </h2>
          <p className="text-base text-neutral-400 font-semibold mt-2">
            Copy configured code blocks to initialize specialized agents inside your workspace.
          </p>
        </header>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {WORKFLOWS.map(w => (
            <button
              key={w.id}
              onClick={() => setActiveWorkflowTab(w.id)}
              className={`p-3 text-xs font-black uppercase border-2 border-black rounded transition-all text-center ${
                activeWorkflowTab === w.id 
                  ? 'bg-purple-600 text-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] translate-y-0.5' 
                  : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              {w.title}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <AnimatePresence mode="wait">
          {WORKFLOWS.map(w => {
            if (w.id !== activeWorkflowTab) return null;
            return (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="border-4 border-black bg-[#161619] p-6 rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative"
              >
                <div className="flex justify-between items-start mb-4 border-b border-neutral-800 pb-4">
                  <div>
                    <h3 className="text-lg font-black uppercase text-white">{w.title}</h3>
                    <p className="text-xs font-poppins text-neutral-400 mt-1 font-semibold">{w.desc}</p>
                  </div>
                  <button 
                    onClick={() => handleCopy(w.code, `workflow-snippet-${w.id}`)}
                    className="bg-purple-600 text-white hover:bg-purple-500 border border-neutral-100 font-black uppercase text-xs px-4 py-2 flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-y-0.5 active:shadow-none rounded"
                  >
                    {copiedState[`workflow-snippet-${w.id}`] ? <Check size={12} className="text-green-500 animate-pulse" /> : <Copy size={12} />}
                    Copy Code
                  </button>
                </div>
                <pre className="bg-black/80 border border-neutral-800 p-5 rounded-lg font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
                  <code>{w.code}</code>
                </pre>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </section>

      {/* --- 10. FOOTER BLUEPRINT --- */}
      <footer className="border-t-2 border-neutral-800 bg-[#141416] py-16 px-6 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Brand Col (5 Cols) */}
          <div className="md:col-span-5 flex flex-col items-start text-left">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-black tracking-widest text-lg uppercase text-white">ODYSSEUS AI</span>
              <span className="bg-purple-600 text-white border-2 border-black rounded px-1.5 py-0.5 font-black text-xs shadow-[1.5px_1.5px_0px_0px_rgba(255,255,255,1)]">QUICKSTART</span>
            </div>
            <p className="text-xs font-poppins font-semibold text-neutral-500 uppercase leading-relaxed max-w-sm">
              UNOFFICIAL RESOURCE. THIS PROJECT IS AN INDEPENDENT DEV INITIATIVE AND IS NOT AFFILIATED WITH PEWDIEPIE-ARCHDAEMON OR THE OFFICIAL ODYSSEUS AI CORE DEVELOPMENT TEAM. ALL BRAND LOGOS OR MARKS REMAIN THE PROPERTY OF THEIR RESPECTIVE HOLDERS.
            </p>
          </div>

          {/* Grids Col (7 Cols) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-left text-xs font-poppins font-bold uppercase tracking-wider text-neutral-400">
            <div>
              <h4 className="text-neutral-200 font-black text-[11px] mb-4 tracking-widest">Navigation</h4>
              <ul className="space-y-2.5">
                <li><a href="#install" className="hover:text-purple-400 transition-colors">Install Guide</a></li>
                <li><a href="#matrix" className="hover:text-purple-400 transition-colors">Path Matrix</a></li>
                <li><a href="#checker" className="hover:text-purple-400 transition-colors">Setup Checker</a></li>
                <li><a href="#diagnostics" className="hover:text-purple-400 transition-colors">Fix Problems</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-neutral-200 font-black text-[11px] mb-4 tracking-widest">Guides & Assets</h4>
              <ul className="space-y-2.5">
                <li><a href="#docker-ollama" className="hover:text-purple-400 transition-colors">Docker Setup</a></li>
                <li><a href="#docker-ollama" className="hover:text-purple-400 transition-colors">Ollama Routing</a></li>
                <li><a href="#snippets" className="hover:text-purple-400 transition-colors">Swarms Templates</a></li>
                <li><a href="#diagnostics" className="hover:text-purple-400 transition-colors">Diagnostic Logs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-neutral-200 font-black text-[11px] mb-4 tracking-widest">Trust & Legal</h4>
              <ul className="space-y-2.5">
                <li><Link to="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</Link></li>
                <li><Link to="/about" className="hover:text-purple-400 transition-colors">About Team</Link></li>
                <li><Link to="/contact" className="hover:text-purple-400 transition-colors">Support Center</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-neutral-850 flex flex-col sm:flex-row justify-between items-center text-[10px] font-poppins font-bold text-neutral-600 uppercase tracking-widest gap-4">
          <div>© {new Date().getFullYear()} Odysseus AI Quickstart. Independent Launcher.</div>
          <a href="#top" className="hover:text-purple-500 transition-colors flex items-center gap-1">Back to top <ArrowUpRight size={12} /></a>
        </div>
      </footer>

      {/* --- STICKY FLOATING BOTTOM BAR --- */}
      <div className="fixed bottom-4 left-4 right-4 z-40 max-w-2xl mx-auto bg-neutral-900 border-4 border-black p-3.5 flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(168,85,247,0.7)] text-xs rounded-xl gap-4">
        <div className="text-left font-poppins font-semibold text-neutral-300">
          <span className="text-[10px] bg-red-500 text-white font-black px-1.5 py-0.5 rounded mr-2 inline-block">LIMITED OFFER</span>
          <span className="text-white font-black uppercase">Save one setup night: </span>
          <span className="line-through text-neutral-500 mr-1.5 font-bold">$49.9</span>
          <span className="text-emerald-400 font-black text-sm">$19.9</span>
        </div>
        <a 
          href="#pricing" 
          className="bg-purple-600 hover:bg-purple-500 text-white border-2 border-neutral-100 font-black uppercase text-[10px] px-4 py-2 rounded whitespace-nowrap shadow-[1.5px_1.5px_0px_0px_rgba(255,255,255,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1 shrink-0"
        >
          Lock setup shortcut <ArrowRight size={10} strokeWidth={3} />
        </a>
      </div>
    </div>
  );
};

export default QuickstartPage;
