import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Cpu, Database, Shield, Zap, Terminal, Box, BookOpen, AlertCircle,
  LayoutGrid, ShoppingBag, Calculator, Monitor, MonitorPlay, FileText, Copy, Check, ChevronDown,
  HelpCircle, CheckCircle, Laptop, ShieldAlert, ExternalLink, Mail, ArrowUpRight,
  DollarSign, FileCode, AlertTriangle, Play, Settings, Server, RefreshCw, Rocket
} from 'lucide-react';
import BlogCard from '@/components/BlogCard.jsx';
import pb from '@/lib/pocketbaseClient';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { fallbackBlogs } from '@/data/fallbackBlogs.js';
import { SquigglyText } from '@/components/ui/squiggly-text';

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

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [blogError, setBlogError] = useState(null);
  const location = useLocation();

  // Quiz Selections
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

  // Workflow tab states
  const [activeWorkflowTab, setActiveWorkflowTab] = useState('research');

  // UI interaction copy statuses
  const [copiedState, setCopiedState] = useState({});

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoadingBlogs(true);
        setBlogError(null);
        let items = [];
        try {
          const records = await pb.collection('blog_articles').getList(1, 4, {
            filter: 'status="published"',
            sort: '-created_at,-created',
            $autoCancel: false
          });
          items = records.items || [];
        } catch (pbErr) {
          console.warn("Pocketbase homepage blog fetch failed, utilizing fallback:", pbErr);
        }

        if (items.length === 0) {
          setBlogs(fallbackBlogs.slice(0, 4));
        } else {
          setBlogs(items);
        }
      } catch (error) {
        console.error("Error fetching blogs for homepage:", error);
        setBlogs(fallbackBlogs.slice(0, 4));
      } finally {
        setLoadingBlogs(false);
      }
    };
    
    fetchBlogs();
  }, []);

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

  const mobileNavItems = [
    { name: 'HOME', icon: LayoutGrid, path: '/' },
    { name: 'MARKETPLACE', icon: ShoppingBag, path: '/products' },
    { name: 'CALCULATOR', icon: Calculator, path: '/calculator' },
    { name: 'SIMULATOR', icon: MonitorPlay, path: '/workspace-simulator' },
    { name: 'BLOG', icon: FileText, path: '/blog' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-16 md:space-y-24 pt-6 md:pt-12 px-4 sm:px-6 pb-[120px] md:pb-24">
      <Helmet>
        <title>OdysseusAI | Local AI Installation Launch Kit</title>
        <meta name="description" content="The easiest way to configure and deploy Odysseus AI locally. One strong Toolkit offer to get started instantly." />
      </Helmet>

      {/* --- 1. HERO SECTION --- */}
      <section className="relative w-full">
        <div className="neo-card bg-[hsl(var(--white))] p-8 md:p-[60px_40px] flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden min-h-[450px]">
          {/* Left Column */}
          <div className="flex-1 flex flex-col items-start text-left z-10">
            <div className="inline-block bg-[hsl(var(--accent))] text-black border-4 border-black px-[16px] py-[8px] font-black uppercase tracking-widest mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs md:text-sm">
              Odysseus AI Quickstart — Install Without Fighting
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase leading-[1.1] mb-6 text-black dark:text-white">
              The safest, <SquigglyText stepDuration={70} scale={[4, 6]} className="text-primary">fastest</SquigglyText>, and most beginner-friendly way to run Odysseus locally.
            </h1>
            
            <p className="text-base sm:text-lg font-bold text-muted-foreground max-w-2xl mb-8 leading-relaxed">
              Odysseus AI is a free, open-source AI interface created by PewDiePie. This independent Launch Kit eliminates terminal errors and configuration loops.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-8">
              <Link to="/products" className="neo-button bg-primary text-black font-black uppercase text-sm px-6 py-4 flex items-center justify-center gap-2">
                Get Odysseus Launch Kit – $19 <Rocket size={16} strokeWidth={2.5} />
              </Link>
              <a href="#checker" className="neo-button bg-[hsl(var(--white))] text-black font-black uppercase text-sm px-6 py-4 text-center">
                Check My Setup Path – Free
              </a>
            </div>

            {/* Grid of 4 Feature Badges */}
            <div className="grid grid-cols-2 gap-3 w-full border-t-2 border-black/10 pt-6">
              {[
                { title: 'Windows • Mac • Linux', desc: 'Cross-platform support' },
                { title: 'Docker & Ollama Ready', desc: 'Optimized containers' },
                { title: 'Beginner Friendly', desc: 'No terminal friction' },
                { title: 'Secure & Localhost-First', desc: '100% private vectors' }
              ].map((b, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-xs font-black uppercase text-black dark:text-white">{b.title}</span>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">{b.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-[40%] flex-shrink-0 z-10">
            <div className="neo-card bg-card p-4 relative shadow-[6px_6px_0px_0px_hsl(var(--shadow-color))] cute-wiggle-hover">
              <div className="flex items-center gap-1.5 mb-3 border-b-2 border-black/10 pb-3">
                <span className="w-3 h-3 rounded-full bg-red-500/85"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/85"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/85"></span>
                <span className="text-[9px] text-muted-foreground font-mono ml-2">pewdiepie-archdaemon/odysseus</span>
              </div>
              <div className="aspect-video w-full bg-black/5 dark:bg-black/60 rounded border-2 border-black border-dashed flex flex-col items-center justify-center p-6 text-center">
                <Terminal size={36} className="text-primary mb-2 cute-float" strokeWidth={2.5} />
                <span className="text-xs font-black uppercase text-black dark:text-white leading-tight">Official Workspace Blueprint</span>
                <span className="text-[9px] font-mono text-muted-foreground mt-1">Ref: Github Repository Source</span>
              </div>
              <div className="absolute -bottom-3 -right-3 bg-[hsl(var(--accent))] text-black border-2 border-black px-2 py-0.5 font-black text-[9px] uppercase shadow">
                WORKSPACE ACTIVE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. CORE SEGMENTATION --- */}
      <section id="install">
        <h2 className="text-2xl md:text-4xl font-black uppercase mb-2 inline-block border-b-4 border-black pb-2">What is the Odysseus AI Quickstart?</h2>
        <p className="text-muted-foreground font-bold text-sm md:text-base mb-8">Choose your current status to inspect setup commands and targeted checklists.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Col 1 */}
          <div className="neo-card p-6 flex flex-col justify-between h-full bg-card cute-wiggle-hover">
            <div>
              <div className="w-10 h-10 bg-primary/20 text-black border-2 border-black rounded-[8px] flex items-center justify-center mb-4">
                <BookOpen size={20} className="cute-float" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg md:text-xl font-black uppercase mb-2">I haven't installed Odysseus AI yet</h3>
              <p className="font-poppins text-xs md:text-sm text-muted-foreground mb-4 leading-relaxed">
                Start by verifying the official GitHub repository, then choose Docker, Windows native, macOS native, or API-backed setup.
              </p>
              <div className="relative bg-black/5 dark:bg-black/40 border-2 border-black p-3 rounded font-mono text-[11px] text-emerald-600 dark:text-emerald-400 mb-6">
                <code>git clone https://github.com/pewdiepie-archdaemon/odysseus.git</code>
                <button 
                  onClick={() => handleCopy('git clone https://github.com/pewdiepie-archdaemon/odysseus.git', 'clone')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white dark:bg-neutral-800 hover:bg-neutral-100 border border-black p-1 rounded transition-all"
                >
                  {copiedState['clone'] ? <Check size={10} className="text-green-600" /> : <Copy size={10} />}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-4 border-t-2 border-black/5">
              <a href="#checker" className="neo-button bg-primary text-black text-xs uppercase py-2 text-center">Check My Install Path</a>
              <a href="https://github.com/pewdiepie-archdaemon/odysseus" target="_blank" rel="noopener noreferrer" className="neo-button bg-[hsl(var(--white))] text-black text-xs uppercase py-2 text-center">Read full install hub</a>
            </div>
          </div>

          {/* Col 2 */}
          <div className="neo-card p-6 flex flex-col justify-between h-full bg-card cute-wiggle-hover">
            <div>
              <div className="w-10 h-10 bg-secondary/20 text-black border-2 border-black rounded-[8px] flex items-center justify-center mb-4">
                <Laptop size={20} className="cute-float-delay" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg md:text-xl font-black uppercase mb-2">I need Docker or Ollama setup</h3>
              <p className="font-poppins text-xs md:text-sm text-muted-foreground mb-4 leading-relaxed">
                Most Docker problems are not Odysseus problems. They are port, .env, container health, or Ollama endpoint mapping problems.
              </p>
              <div className="relative bg-black/5 dark:bg-black/40 border-2 border-black p-3 rounded font-mono text-[11px] text-emerald-600 dark:text-emerald-400 mb-6">
                <code>http://host.docker.internal:11434/v1</code>
                <button 
                  onClick={() => handleCopy('http://host.docker.internal:11434/v1', 'docker-endpoint')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white dark:bg-neutral-800 hover:bg-neutral-100 border border-black p-1 rounded transition-all"
                >
                  {copiedState['docker-endpoint'] ? <Check size={10} className="text-green-600" /> : <Copy size={10} />}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-4 border-t-2 border-black/5">
              <a href="#docker-ollama" className="neo-button bg-primary text-black text-xs uppercase py-2 text-center">Resolve My Ollama Endpoint</a>
              <a href="#matrix" className="neo-button bg-[hsl(var(--white))] text-black text-xs uppercase py-2 text-center">Open Docker setup guide</a>
            </div>
          </div>

          {/* Col 3 */}
          <div className="neo-card p-6 flex flex-col justify-between h-full bg-card cute-wiggle-hover">
            <div>
              <div className="w-10 h-10 bg-accent/20 text-black border-2 border-black rounded-[8px] flex items-center justify-center mb-4">
                <ShieldAlert size={20} className="cute-float" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg md:text-xl font-black uppercase mb-2">Odysseus AI is already not working</h3>
              <p className="font-poppins text-xs md:text-sm text-muted-foreground mb-4 leading-relaxed">
                Do not delete folders or disable auth. First classify the error: admin password, localhost:7000, Docker Compose, or GPU.
              </p>
              <div className="relative bg-black/5 dark:bg-black/40 border-2 border-black p-3 rounded font-mono text-[11px] text-emerald-600 dark:text-emerald-400 mb-6">
                <code>docker compose ps</code>
                <button 
                  onClick={() => handleCopy('docker compose ps', 'ps-cmd')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white dark:bg-neutral-800 hover:bg-neutral-100 border border-black p-1 rounded transition-all"
                >
                  {copiedState['ps-cmd'] ? <Check size={10} className="text-green-600" /> : <Copy size={10} />}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-4 border-t-2 border-black/5">
              <a href="#diagnostics" className="neo-button bg-primary text-black text-xs uppercase py-2 text-center">Diagnose My Error</a>
              <a href="#diagnostics" className="neo-button bg-[hsl(var(--white))] text-black text-xs uppercase py-2 text-center">Open Error Doctor</a>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. INTERACTIVE SETUP PATH CHECKER --- */}
      <section id="checker">
        <h2 className="text-2xl md:text-4xl font-black uppercase mb-2 inline-block border-b-4 border-black pb-2">Interactive Setup Path Checker</h2>
        <p className="text-muted-foreground font-bold text-sm md:text-base mb-8">Answer these questions to compile your recommended local setup instructions.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 bg-card border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-6">
            {/* Q1 */}
            <div>
              <span className="block text-xs font-black uppercase tracking-wider text-black dark:text-white mb-2.5">
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
                        ? 'bg-primary text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-0.5' 
                        : 'bg-white dark:bg-neutral-800 text-black dark:text-neutral-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Q2 */}
            <div>
              <span className="block text-xs font-black uppercase tracking-wider text-black dark:text-white mb-2.5">
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
                        ? 'bg-primary text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-0.5' 
                        : 'bg-white dark:bg-neutral-800 text-black dark:text-neutral-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Q3 */}
            <div>
              <span className="block text-xs font-black uppercase tracking-wider text-black dark:text-white mb-2.5">
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
                        ? 'bg-primary text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-0.5' 
                        : 'bg-white dark:bg-neutral-800 text-black dark:text-neutral-300'
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
              <span className="block text-xs font-black uppercase tracking-wider text-black dark:text-white mb-2.5">
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
                        ? 'bg-primary text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-0.5' 
                        : 'bg-white dark:bg-neutral-800 text-black dark:text-neutral-300'
                    }`}
                  >
                    {opt.label}
                    {quizSelections.state === opt.value && <CheckCircle size={14} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Output */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!isQuizComplete ? (
                <div className="neo-card p-8 bg-card border-dashed flex flex-col items-center justify-center text-center h-full min-h-[350px]">
                  <HelpCircle size={40} className="text-muted-foreground mb-4 animate-bounce" />
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
                  className="neo-card bg-card p-6 md:p-8 flex flex-col justify-between h-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div>
                    <span className="bg-secondary text-black border-2 border-black font-black uppercase text-[10px] px-2.5 py-1 rounded inline-block mb-4 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                      Recommended install recipe
                    </span>
                    <h3 className="text-xl md:text-3xl font-black uppercase mb-1 text-black dark:text-white">
                      {recommendation.title}
                    </h3>
                    <p className="text-xs font-poppins font-black text-muted-foreground mb-6 uppercase tracking-wider">
                      {recommendation.subtitle}
                    </p>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xs font-black uppercase text-primary mb-1 tracking-wider">Why this path:</h4>
                        <p className="text-xs font-poppins font-semibold text-foreground/80 leading-relaxed">{recommendation.why}</p>
                      </div>

                      <div>
                        <h4 className="text-xs font-black uppercase text-primary mb-1 tracking-wider">Prerequisites:</h4>
                        <p className="text-xs font-poppins font-semibold text-foreground/80 leading-relaxed">{recommendation.prereqs}</p>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-xs font-black uppercase text-primary tracking-wider">First commands:</h4>
                          <button 
                            onClick={() => handleCopy(recommendation.commands, 'quiz-code')}
                            className="bg-white dark:bg-neutral-800 hover:bg-slate-55 text-black dark:text-white font-black uppercase text-[10px] px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all"
                          >
                            {copiedState['quiz-code'] ? <Check size={10} className="text-green-600" /> : <Copy size={10} />}
                            Copy
                          </button>
                        </div>
                        <pre className="bg-black/5 dark:bg-black/50 border-2 border-black p-4 rounded text-left font-mono text-xs text-emerald-600 dark:text-emerald-400 overflow-x-auto leading-relaxed">
                          <code>{recommendation.commands}</code>
                        </pre>
                      </div>

                      <div className="bg-red-500/10 border-2 border-red-500 p-4 rounded text-left flex gap-3 items-start">
                        <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={16} />
                        <div>
                          <div className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-wide mb-1">Avoid this mistake:</div>
                          <p className="text-[11px] text-black dark:text-red-100 font-poppins font-semibold leading-relaxed">{recommendation.avoid}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleEmailSubmit} className="mt-8 pt-6 border-t-2 border-black/10 flex flex-col sm:flex-row gap-2">
                    <input 
                      type="email" 
                      placeholder="Enter your email to receive this plan..." 
                      className="bg-white dark:bg-neutral-800 text-black dark:text-white border-2 border-black text-xs px-4 py-3 rounded outline-none placeholder:text-neutral-500 font-black uppercase flex-1 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                    />
                    <button 
                      type="submit" 
                      className="neo-button bg-primary text-black text-xs px-6 py-3"
                    >
                      Email Plan <Mail size={12} className="ml-1.5" />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* --- 4. INSTALL PATH DECISION MATRIX --- */}
      <section id="matrix">
        <h2 className="text-2xl md:text-4xl font-black uppercase mb-2 inline-block border-b-4 border-black pb-2">Install Path Decision Matrix</h2>
        <p className="text-muted-foreground font-bold text-sm md:text-base mb-8">Compare local deployment options, first instructions, and failure traps.</p>
        
        <div className="neo-card bg-card overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-full">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-primary/20 border-b-4 border-black font-black uppercase text-xs tracking-wider text-black dark:text-white">
                  <th className="p-4 border-r-2 border-black">Path Name</th>
                  <th className="p-4 border-r-2 border-black">Choose This If</th>
                  <th className="p-4 border-r-2 border-black">Do Not Choose This If</th>
                  <th className="p-4 border-r-2 border-black">First Command / Endpoint</th>
                  <th className="p-4 border-r-2 border-black text-red-500">Common Trap</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/10 font-poppins text-xs font-semibold text-foreground/80">
                {PATH_MATRIX.map((row, idx) => (
                  <tr key={idx} className={`hover:bg-black/5 transition-colors ${row.highlighted ? 'bg-[hsl(var(--primary))]/5' : ''}`}>
                    <td className="p-4 font-black uppercase tracking-wide border-r-2 border-black/10 text-black dark:text-white">
                      {row.path}
                      {row.highlighted && <span className="block text-[8px] bg-secondary text-black font-black px-1.5 py-0.5 rounded w-fit mt-1 shadow-sm">RECOMMENDED</span>}
                    </td>
                    <td className="p-4 border-r-2 border-black/10 leading-relaxed">{row.chooseIf}</td>
                    <td className="p-4 border-r-2 border-black/10 text-muted-foreground leading-relaxed">{row.doNotChooseIf}</td>
                    <td className="p-4 border-r-2 border-black/10 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                      <code>{row.command}</code>
                    </td>
                    <td className="p-4 border-r-2 border-black/10 text-red-600 dark:text-red-400 bg-red-500/5 leading-relaxed">{row.trap}</td>
                    <td className="p-4 text-center">
                      <a href="#offer" className="bg-white dark:bg-neutral-850 hover:bg-slate-50 text-black dark:text-white font-black uppercase text-[10px] px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded transition-all inline-block whitespace-nowrap">
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

      {/* --- 5. DOCKER QUICK PATH & OLLAMA ROUTING --- */}
      <section id="docker-ollama">
        <h2 className="text-2xl md:text-4xl font-black uppercase mb-2 inline-block border-b-4 border-black pb-2">Docker Quick Path & Ollama Routing</h2>
        <p className="text-muted-foreground font-bold text-sm md:text-base mb-8">Cheat sheet configurations for Docker container building and Ollama daemon endpoints.</p>

        {/* Tab Controls */}
        <div className="flex gap-3 mb-6 border-b-2 border-black/10 pb-3">
          <button
            onClick={() => setActiveTab('docker')}
            className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider border-2 border-black rounded transition-all ${
              activeTab === 'docker' 
                ? 'bg-primary text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-0.5' 
                : 'bg-white dark:bg-neutral-900 text-black dark:text-neutral-400'
            }`}
          >
            🐳 Docker Quick Path
          </button>
          <button
            onClick={() => setActiveTab('ollama')}
            className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider border-2 border-black rounded transition-all ${
              activeTab === 'ollama' 
                ? 'bg-primary text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-0.5' 
                : 'bg-white dark:bg-neutral-900 text-black dark:text-neutral-400'
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
              <div className="lg:col-span-6 bg-card border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black uppercase text-black dark:text-white mb-2">Build and Start Docker Swarm</h3>
                  <p className="text-xs font-poppins text-muted-foreground mb-6 leading-relaxed">
                    Instantly compile individual front/back containers within the workspace using the default configuration file.
                  </p>
                  
                  <div className="space-y-4">
                    {[
                      { label: 'Step 1: Check Docker state', cmd: 'docker info' },
                      { label: 'Step 2: Start compose bundle', cmd: 'docker compose up -d --build' },
                      { label: 'Step 3: Verify container statuses', cmd: 'docker compose ps' }
                    ].map((step, idx) => (
                      <div key={idx} className="bg-black/5 dark:bg-black/40 border-2 border-black/10 rounded p-3 text-left">
                        <div className="text-[10px] font-black uppercase text-primary mb-1">{step.label}</div>
                        <div className="font-mono text-xs text-emerald-600 dark:text-emerald-400 flex justify-between items-center">
                          <code>{step.cmd}</code>
                          <button 
                            onClick={() => handleCopy(step.cmd, `docker-cmd-${idx}`)}
                            className="bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-black p-1 rounded transition-colors"
                          >
                            {copiedState[`docker-cmd-${idx}`] ? <Check size={10} className="text-green-600" /> : <Copy size={10} />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-card border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black uppercase text-black dark:text-white mb-2">Clean Container Cache</h3>
                  <p className="text-xs font-poppins text-muted-foreground mb-6 leading-relaxed">
                    Prune dangling layers, delete unlinked volumes, and force rebuild containers to resolve lockfile and package issues.
                  </p>

                  <div className="space-y-4">
                    {[
                      { label: 'Stop and prune containers', cmd: 'docker compose down --v' },
                      { label: 'Prune unused build caching layers', cmd: 'docker builder prune -f' },
                      { label: 'Force build clean workspace', cmd: 'docker compose build --no-cache' }
                    ].map((step, idx) => (
                      <div key={idx} className="bg-black/5 dark:bg-black/40 border-2 border-black/10 rounded p-3 text-left">
                        <div className="text-[10px] font-black uppercase text-primary mb-1">{step.label}</div>
                        <div className="font-mono text-xs text-emerald-600 dark:text-emerald-400 flex justify-between items-center">
                          <code>{step.cmd}</code>
                          <button 
                            onClick={() => handleCopy(step.cmd, `docker-clean-${idx}`)}
                            className="bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-black p-1 rounded transition-colors"
                          >
                            {copiedState[`docker-clean-${idx}`] ? <Check size={10} className="text-green-600" /> : <Copy size={10} />}
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
              <div className="lg:col-span-12 bg-card border-4 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-primary/20 border-b-2 border-black font-black uppercase text-xs tracking-wider text-black dark:text-white">
                        <th className="p-4 border-r-2 border-black">Run Mode</th>
                        <th className="p-4 border-r-2 border-black">Endpoint URL Base</th>
                        <th className="p-4 border-r-2 border-black">Ollama Env Variable binding</th>
                        <th className="p-4 text-center">Diagnostics Ping</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10 font-poppins text-xs font-semibold text-foreground/80">
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
                        <tr key={i} className="hover:bg-black/5">
                          <td className="p-4 border-r border-black/10 font-black uppercase text-black dark:text-white">{item.mode}</td>
                          <td className="p-4 border-r border-black/10 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">{item.url}</td>
                          <td className="p-4 border-r border-black/10 font-mono text-muted-foreground">{item.binding}</td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => handleCopy(item.ping, `ping-cmd-${i}`)}
                              className="bg-white dark:bg-neutral-800 hover:bg-slate-50 text-black dark:text-white font-black uppercase text-[10px] px-3 py-1.5 border-2 border-black rounded transition-all inline-flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95"
                            >
                              {copiedState[`ping-cmd-${i}`] ? <Check size={10} className="text-green-600" /> : <Copy size={10} />}
                              Copy
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

      {/* --- 6. INTERACTIVE DIAGNOSTIC HUB & FAQ ACCORDION --- */}
      <section id="diagnostics">
        <h2 className="text-2xl md:text-4xl font-black uppercase mb-2 inline-block border-b-4 border-black pb-2">Diagnostics Hub & FAQ</h2>
        <p className="text-muted-foreground font-bold text-sm md:text-base mb-8">Inspect common local developer errors and run immediate diagnostic shell check commands.</p>
        
        {/* Direct Answers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
          {[
            {
              title: "Where is the admin password?",
              ans: "When first running Odysseus, check container logs or startup stdout. Look for lines containing 'Temporary Admin Password'. Do not restart the container, or it will generate a new one.",
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
            <div key={i} className="neo-card p-6 bg-card">
              <h3 className="text-lg font-black uppercase mb-2 text-black dark:text-white">{card.title}</h3>
              <p className="text-xs font-poppins text-muted-foreground mb-4 leading-relaxed font-semibold">{card.ans}</p>
              
              <div className="bg-black/5 dark:bg-black/40 border-2 border-black p-2.5 flex justify-between items-center">
                <code className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">{card.cmd}</code>
                <button 
                  onClick={() => handleCopy(card.cmd, `faq-cmd-${i}`)}
                  className="bg-white dark:bg-neutral-800 hover:bg-neutral-100 border border-black p-1 rounded transition-colors"
                >
                  {copiedState[`faq-cmd-${i}`] ? <Check size={10} className="text-green-600" /> : <Copy size={10} />}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Collapsible Accordion Errors */}
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
              title: 'Local Ollama not detected (502 / 504 Gateway)',
              desc: 'Docker containers resolve localhost internally. You must bind the API server to look at host.docker.internal inside container networks.',
              solution: 'export OLLAMA_HOST="0.0.0.0:11434"'
            },
            {
              id: 'err3',
              title: 'CUDA out-of-memory / Offloading failure',
              desc: 'If model size exceeds GPU RAM, execution collapses. Force partial CPU offloading or load Q4 GGUF models.',
              solution: 'ollama run llama3:8b-instruct-q4_K_M'
            }
          ].map(err => {
            const isOpen = activeError === err.id;
            return (
              <div 
                key={err.id} 
                className="border-4 border-black bg-card rounded-xl overflow-hidden transition-all duration-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <button
                  onClick={() => setActiveError(isOpen ? null : err.id)}
                  className="w-full p-4 flex justify-between items-center text-left hover:bg-black/5 text-black dark:text-white"
                >
                  <span className="font-black text-sm uppercase tracking-wide flex items-center gap-2">
                    <span className="text-red-500 font-bold">⚠️</span> {err.title}
                  </span>
                  <ChevronDown className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} size={16} strokeWidth={2.5} />
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden border-t-2 border-black"
                    >
                      <div className="p-4 bg-black/5 dark:bg-black/50 text-xs font-semibold leading-relaxed space-y-4 font-poppins text-muted-foreground">
                        <p>{err.desc}</p>
                        
                        <div className="bg-black/5 dark:bg-black/80 border-2 border-black p-3 rounded flex justify-between items-center font-mono text-emerald-600 dark:text-emerald-400">
                          <code>{err.solution}</code>
                          <button 
                            onClick={() => handleCopy(err.solution, `err-sol-${err.id}`)}
                            className="bg-white dark:bg-neutral-800 hover:bg-neutral-100 border border-black p-1 rounded transition-colors"
                          >
                            {copiedState[`err-sol-${err.id}`] ? <Check size={10} className="text-green-600" /> : <Copy size={10} />}
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

      {/* --- 7. TIERED PRICING - ONE STRONG TOOLKIT OFFER --- */}
      <section id="offer" className="flex justify-center">
        <div className="neo-card bg-[hsl(var(--primary))] p-8 md:p-12 border-4 border-black max-w-3xl w-full text-center relative overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cute-wiggle-hover">
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-[hsl(var(--accent))] opacity-25"></div>
          
          <span className="bg-secondary text-black border-4 border-black px-4 py-1.5 font-black uppercase tracking-widest mb-6 rounded-lg inline-block shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs cute-float">
            🌟 Special Early Access Bundle
          </span>
          
          <h2 className="text-3xl md:text-5xl font-black uppercase text-black mb-3">
            Odysseus AI <SquigglyText stepDuration={70} scale={[5, 7]} className="text-[hsl(var(--accent))]">Launch Kit</SquigglyText> & Toolkit
          </h2>
          <p className="text-sm font-black uppercase tracking-wide text-black/70 mb-8 max-w-xl mx-auto">
            The ultimate local deployment template bundle, startup scripts, and configurations to run Odysseus locally without fighting errors.
          </p>

          <div className="flex justify-center items-baseline gap-3 mb-8">
            <span className="text-5xl md:text-7xl font-black text-black">$19</span>
            <span className="text-lg md:text-2xl line-through text-black/40 font-black">$49.99</span>
          </div>

          <div className="max-w-md mx-auto text-left space-y-4 mb-8 bg-card border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-poppins text-xs font-semibold text-foreground/80">
            <div className="flex gap-2.5 items-start">
              <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
              <span><strong>Pre-configured Compose:</strong> Error-free Docker Compose YAML linking back, front, and database.</span>
            </div>
            <div className="flex gap-2.5 items-start">
              <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
              <span><strong>Optimized Environments:</strong> Pre-built .env templates ready for instant model mapping.</span>
            </div>
            <div className="flex gap-2.5 items-start">
              <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
              <span><strong>1-Click Scripts:</strong> Execution shell scripts (run.sh / batch files) bypassing Python path errors.</span>
            </div>
            <div className="flex gap-2.5 items-start">
              <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
              <span><strong>Diagnostic Manual PDF:</strong> Full guide resolving SQLite locks, VRAM, and Docker permissions.</span>
            </div>
            <div className="flex gap-2.5 items-start">
              <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
              <span><strong>Workflow Starters:</strong> CrewAI and AutoGen code presets to launch specialist agents.</span>
            </div>
          </div>

          <Link 
            to="/products"
            className="neo-button bg-black text-white hover:bg-[hsl(var(--accent))] hover:text-black font-black uppercase text-base md:text-xl px-10 py-5 w-full max-w-md hover:no-underline"
          >
            Unlock Launch Kit Now ($19)
          </Link>
          
          <div className="text-[10px] font-black uppercase text-black/60 tracking-wider mt-4">
            🔒 Secure Stripe checkout • Instant Delivery • 100% Satisfaction Guarantee
          </div>
        </div>
      </section>

      {/* --- 8. WORKFLOW STARTER CODE SNIPPETS --- */}
      <section id="snippets">
        <h2 className="text-2xl md:text-4xl font-black uppercase mb-2 inline-block border-b-4 border-black pb-2">Workflow Starter Code Snippets</h2>
        <p className="text-muted-foreground font-bold text-sm md:text-base mb-8">Copy configured code blocks to initialize specialized CrewAI agents inside your workspace.</p>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {WORKFLOWS.map(w => (
            <button
              key={w.id}
              onClick={() => setActiveWorkflowTab(w.id)}
              className={`p-3 text-xs font-black uppercase border-2 border-black rounded transition-all text-center ${
                activeWorkflowTab === w.id 
                  ? 'bg-primary text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-0.5' 
                  : 'bg-white dark:bg-neutral-900 text-black dark:text-neutral-400'
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
                className="neo-card bg-card p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative"
              >
                <div className="flex justify-between items-start mb-4 border-b border-black/10 pb-4">
                  <div>
                    <h3 className="text-lg font-black uppercase text-black dark:text-white">{w.title}</h3>
                    <p className="text-xs font-poppins text-muted-foreground mt-1 font-semibold">{w.desc}</p>
                  </div>
                  <button 
                    onClick={() => handleCopy(w.code, `workflow-snippet-${w.id}`)}
                    className="bg-primary text-black border-2 border-black font-black uppercase text-xs px-4 py-2 flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all rounded"
                  >
                    {copiedState[`workflow-snippet-${w.id}`] ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                    Copy Code
                  </button>
                </div>
                <pre className="bg-black/5 dark:bg-black/60 border-2 border-black p-5 rounded-lg font-mono text-xs text-emerald-600 dark:text-emerald-400 overflow-x-auto leading-relaxed">
                  <code>{w.code}</code>
                </pre>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </section>

      {/* --- 9. LATEST INSIGHTS (BLOGS) --- */}
      <section>
        <div className="flex items-center justify-between mb-6 md:mb-10 border-b-4 border-black pb-2">
          <h2 className="text-2xl md:text-4xl font-black uppercase inline-block">Latest Insights</h2>
          <Link to="/blog" className="hidden sm:flex items-center text-sm md:text-base font-black uppercase tracking-widest hover:text-primary transition-colors">
            View All <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
        
        {blogError ? (
          <div className="neo-card bg-destructive/10 border-destructive p-8 flex items-center gap-4 text-destructive font-bold">
            <AlertCircle size={32} />
            <p>{blogError}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {loadingBlogs ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border-4 border-black rounded-lg overflow-hidden h-[400px] flex flex-col">
                  <Skeleton className="h-48 w-full rounded-none" />
                  <div className="p-6 flex flex-col flex-grow bg-card gap-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              ))
            ) : blogs.length > 0 ? (
              blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  title={blog.title}
                  category={blog.category || 'Engineering'}
                  description={blog.excerpt || blog.content?.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'}
                  author={blog.author || 'Odysseus Team'}
                  date={blog.created_at || blog.created}
                  slug={blog.slug}
                  imageRecord={blog}
                />
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 neo-card bg-muted p-12 flex flex-col items-center justify-center text-center">
                <BookOpen className="w-16 h-16 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-xl font-black uppercase text-muted-foreground">No publications found</h3>
                <p className="text-muted-foreground font-medium mt-2">Check back soon for new insights and engineering updates.</p>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-8 sm:hidden text-center">
          <Link to="/blog" className="neo-button w-full bg-[hsl(var(--white))] text-black">
            View All Articles
          </Link>
        </div>
      </section>

      {/* --- 10. KNOWLEDGE BASE RESOURCES SECTION --- */}
      <section>
        <Link to="/resources" className="block group focus:outline-none">
          <div className="w-full bg-[hsl(var(--background))] border-y-4 md:border-4 border-black py-10 md:py-16 px-6 md:px-12 flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-12 transition-all duration-300 group-hover:bg-primary/10 group-focus-visible:bg-primary/10 cursor-pointer overflow-hidden relative md:rounded-xl md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -mx-4 sm:mx-0">
            
            <div className="flex-1 flex flex-col items-start z-10 w-full md:w-auto text-center md:text-left">
              <div className="mb-6 md:mb-8 self-center md:self-start">
                <span className="bg-primary text-black border-4 border-black rounded-lg font-black uppercase text-xs md:text-sm tracking-[0.2em] px-4 py-2 inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  Knowledge Base
                </span>
              </div>
              
              <h2 className="text-[32px] md:text-[48px] leading-[1.1] font-black uppercase mb-6 mx-auto md:mx-0">
                <span className="text-black block">Engineering</span>
                <span className="text-primary block">Transmissions</span>
              </h2>
              
              <p className="text-muted-foreground font-medium text-base md:text-xl max-w-2xl mx-auto md:mx-0 mb-8 md:mb-0">
                Access our comprehensive library of technical documentation, architectural blueprints, and deep-dive research papers on local AI deployment.
              </p>
              
              <div className="mt-8 flex md:hidden items-center justify-center w-full">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform">
                  <ArrowRight className="text-white w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 relative z-10">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 group-hover:border-primary">
                <BookOpen className="w-20 h-20 md:w-28 md:h-28 text-primary drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]" strokeWidth={1.5} />
              </div>
              <div className="hidden md:flex absolute -bottom-4 -left-4 w-14 h-14 bg-black rounded-full items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                <ArrowRight className="text-white w-7 h-7 group-hover:text-black" />
              </div>
            </div>
            
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
          </div>
        </Link>
      </section>

      {/* --- 11. CTA BANNER --- */}
      <section className="neo-card bg-accent p-8 md:p-12 lg:p-20 text-center rounded-xl">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase mb-4 md:mb-8 text-black text-balance">Ready to Deploy?</h2>
        <p className="text-lg md:text-2xl font-bold mb-8 md:mb-12 max-w-3xl mx-auto text-black/90 text-balance">
          Save terminal configuration hours. Get the Odysseus Launch Kit & Toolkit and launch local models instantly.
        </p>
        <a href="#offer" className="neo-button bg-[hsl(var(--white))] text-black text-lg md:text-2xl px-8 py-4 md:px-12 md:py-6 w-full sm:w-auto">
          Get Instant Toolkit ($19)
        </a>
      </section>

      {/* --- 12. STICKY FLOATING BOTTOM BAR --- */}
      <div className="fixed bottom-4 left-4 right-4 z-40 max-w-2xl mx-auto bg-card border-4 border-black p-3.5 flex items-center justify-between shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))] text-xs rounded-xl gap-4">
        <div className="text-left font-poppins font-semibold text-foreground/80">
          <span className="text-[10px] bg-red-500 text-white font-black px-1.5 py-0.5 rounded mr-2 inline-block">LIMITED OFFER</span>
          <span className="text-black dark:text-white font-black uppercase">Save one setup night: </span>
          <span className="line-through text-muted-foreground mr-1.5 font-bold">$49.9</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm">$19.9</span>
        </div>
        <a 
          href="#offer" 
          className="bg-primary text-black border-2 border-black font-black uppercase text-[10px] px-4 py-2 rounded whitespace-nowrap shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all flex items-center gap-1 shrink-0"
        >
          Lock setup shortcut <ArrowRight size={10} strokeWidth={3} />
        </a>
      </div>

      {/* Mobile Bottom Navigation (Visible only <= 768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-[80px] bg-[hsl(var(--background))] border-t-4 border-black flex items-center justify-between z-50 px-1 shadow-[0px_-4px_10px_rgba(0,0,0,0.05)]">
        {mobileNavItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <Link 
              key={item.name}
              to={item.path}
              className={`flex-1 flex flex-col items-center justify-center min-h-[60px] h-full gap-1 transition-colors hover:bg-black/5 active:bg-black/10 rounded-lg mx-1 ${isActive ? 'text-black' : 'text-muted-foreground'}`}
            >
              <item.icon 
                size={24} 
                strokeWidth={isActive ? 2.5 : 2} 
                className={isActive ? 'text-primary' : 'text-primary/70'} 
              />
              <span className={`text-[10px] sm:text-[12px] uppercase ${isActive ? 'font-black' : 'font-bold'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default HomePage;
