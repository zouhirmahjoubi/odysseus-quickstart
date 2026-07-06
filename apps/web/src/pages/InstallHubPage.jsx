import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Monitor, Laptop, Container, Settings, Sparkles, ChevronRight, CheckCircle2, RefreshCw, Terminal, Info, Copy, Check } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Accordion,
  AccordionItem,
  Code,
  Snippet,
  Chip,
  Tabs,
  Tab,
  Tooltip
} from '@heroui/react';

/* ─── Per-platform visual config ─────────────────────────────────── */
const PLATFORM_STYLES = {
  windows: {
    gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    glow: 'shadow-[0_0_24px_rgba(245,158,11,0.15)]',
    accent: 'text-amber-400',
  },
  macbook: {
    gradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
    iconBg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    glow: 'shadow-[0_0_24px_rgba(168,85,247,0.15)]',
    accent: 'text-purple-400',
  },
  docker: {
    gradient: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
    iconBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    glow: 'shadow-[0_0_24px_rgba(6,182,212,0.15)]',
    accent: 'text-cyan-400',
  },
  ollama: {
    gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    glow: 'shadow-[0_0_24px_rgba(16,185,129,0.15)]',
    accent: 'text-emerald-400',
  },
};

const INSTALL_METHODS = [
  {
    id: 'windows',
    title: 'Windows Native',
    desc: 'Run natively on Windows with full NVIDIA GPU acceleration (CUDA).',
    icon: Monitor,
    path: '/odysseus-install/windows',
    badge: 'NVIDIA GPU Support'
  },
  {
    id: 'macbook',
    title: 'macOS Native',
    desc: 'Optimized for Apple Silicon M1/M2/M3/M4 using Metal Acceleration (MPS).',
    icon: Laptop,
    path: '/odysseus-install/macbook',
    badge: 'Metal Acceleration'
  },
  {
    id: 'docker',
    title: 'Docker Compose',
    desc: 'Deploy inside isolated containers for clean setup and easy database linking.',
    icon: Container,
    path: '/odysseus-install/docker',
    badge: 'Container Isolated'
  },
  {
    id: 'ollama',
    title: 'Ollama Integration',
    desc: 'Set up Ollama, pull recommendations (Llama 3.2, Qwen 2.5), and hook up API coordinates.',
    icon: Settings,
    path: '/odysseus-install/ollama',
    badge: 'Local LLM Engine'
  }
];

/* ─── Step-number badge colours for the accordion ────────────────── */
const STEP_COLORS = [
  'bg-[#A855F7]/10 border-[#A855F7]/20 text-[#A855F7]',
  'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
  'bg-purple-500/10 border-purple-500/20 text-purple-400',
  'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  'bg-amber-500/10 border-amber-500/20 text-amber-400',
];

const InstallHubPage = () => {
  // Pre-flight quiz states
  const [os, setOs] = useState('windows');
  const [method, setMethod] = useState('native');
  const [provider, setProvider] = useState('ollama');

  // Generate dynamic checklist
  const getChecklist = () => {
    const steps = [];

    // Step 1: Base Prerequisites
    if (method === 'docker') {
      steps.push({
        title: 'Install Docker Desktop',
        desc: 'Download and install Docker Desktop for your OS. Ensure hyper-V/WSL2 backend is enabled on Windows.',
        code: os === 'windows' ? 'winget install Docker.DockerDesktop' : os === 'macbook' ? 'brew install --cask docker' : 'sudo apt install docker-compose'
      });
    } else {
      steps.push({
        title: 'Install Python & Git',
        desc: 'Ensure Python 3.10+ and Git are installed and available in your environment PATH.',
        code: os === 'windows' ? 'winget install Python.Python.3.11 Git.Git' : os === 'macbook' ? 'brew install python@3.11 git' : 'sudo apt update && sudo apt install python3.11 git'
      });
    }

    // Step 2: Provider Setup
    if (provider === 'ollama') {
      steps.push({
        title: 'Install Ollama & Pull Llama 3.2',
        desc: 'Download Ollama, start it in the background, and pull the recommended lightweight model.',
        code: 'ollama pull llama3.2'
      });
    } else if (provider === 'openrouter') {
      steps.push({
        title: 'Create OpenRouter API Key',
        desc: 'Visit OpenRouter.ai, register, generate an API key, and prepare it for workspace environment variables.',
        code: 'OPENROUTER_API_KEY=sk-or-...'
      });
    } else {
      steps.push({
        title: 'Gather Cloud API Credentials',
        desc: 'Retrieve your OpenAI, Anthropic, or Mistral API keys from their respective developer dashboards.',
        code: 'OPENAI_API_KEY=sk-...'
      });
    }

    // Step 3: Clone Repository
    steps.push({
      title: 'Clone Odysseus AI Repository',
      desc: 'Retrieve the verified source files from the official Github repository.',
      code: 'git clone https://github.com/pewdiepie-archdaemon/odysseus.git\ncd odysseus'
    });

    // Step 4: Execution commands
    if (method === 'docker') {
      steps.push({
        title: 'Start Container Cluster',
        desc: 'Run Docker Compose to build the node services and SQLite DB (PocketBase) in background daemon mode.',
        code: 'docker compose up -d --build'
      });
    } else {
      if (os === 'windows') {
        steps.push({
          title: 'Run Windows Launch Script',
          desc: 'Trigger the local PowerShell script. It configures virtual environments and initializes uvicorn.',
          code: 'powershell -ExecutionPolicy Bypass -File .\\launch-windows.ps1'
        });
      } else {
        steps.push({
          title: 'Run macOS/Linux Shell Hook',
          desc: 'Make the launch script executable and start the environment.',
          code: 'chmod +x start-macos.sh\n./start-macos.sh'
        });
      }
    }

    // Step 5: Verification coords
    steps.push({
      title: 'Access Web Workspace Dashboard',
      desc: `Open your browser and navigate to the local interface. Login with credentials found in logs.`,
      code: method === 'docker' ? 'URL: http://localhost:7000' : 'URL: http://localhost:7860'
    });

    return steps;
  };

  const checklist = getChecklist();

  /* ─── Card hover animation variant ──────────────────────────────── */
  const cardMotion = {
    rest: { scale: 1 },
    hover: {
      scale: 1.02,
      transition: { type: 'spring', stiffness: 350, damping: 18 },
    },
  };

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 md:px-8 font-sans">
      <Helmet>
        <title>Odysseus AI Platform Setup Guides | Windows, Mac, Docker & Ollama</title>
        <meta name="description" content="Compare deployment paths for Odysseus AI. Platform-specific setup guides for Windows CUDA, macOS Metal, Docker containers, and Ollama model integration." />
      </Helmet>

      {/* ════════════════════════════════════════════════════════════
          HERO BANNER
          ════════════════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto text-center mb-16 pt-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Chip
            variant="flat"
            startContent={<Sparkles className="w-4 h-4 text-[#A855F7]" />}
            classNames={{
              base: 'bg-[#A855F7]/10 border border-[#A855F7]/20 px-5 py-2 shadow-[0_0_15px_rgba(168, 85, 247,0.2)] mb-6 h-auto',
              content: 'font-black text-white text-xs md:text-sm tracking-wide',
            }}
          >
            100% OFFLINE &amp; PRIVATE AI SETUPS
          </Chip>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-6 font-heading"
        >
          INSTALLATION{' '}
          <span className="bg-[#A855F7]/10 text-white px-4 py-1 border border-[#A855F7]/30 rounded-3xl inline-block transform -rotate-1 shadow-[0_0_20px_rgba(168, 85, 247,0.2)]">
            HUB
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-lg md:text-xl text-white/60 font-medium max-w-3xl mx-auto"
        >
          Deploy PewDiePie's Odysseus AI local-first workspace on your hardware.
          Select an operating system or container method to get started.
        </motion.p>
      </div>

      {/* ════════════════════════════════════════════════════════════
          PLATFORM CARDS
          ════════════════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {INSTALL_METHODS.map((m, i) => {
          const IconComponent = m.icon;
          const style = PLATFORM_STYLES[m.id];

          return (
            <Link key={m.id} to={m.path} className="block">
              <motion.div
                variants={cardMotion}
                initial="rest"
                whileHover="hover"
                whileTap={{ scale: 0.98 }}
                className="h-full"
              >
                <Card
                  isPressable
                  classNames={{
                    base: `border border-white/10 bg-white/5 ${style.glow} h-full rounded-[16px] overflow-hidden relative backdrop-blur-md transition-all duration-300 hover:border-white/20`,
                    body: 'p-0',
                  }}
                >
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} pointer-events-none z-0`} />

                  <CardHeader className="relative z-10 flex items-center justify-between p-6 pb-0">
                    <Tooltip
                      content={m.title}
                      classNames={{
                        content: 'font-black text-white bg-black border border-white/10',
                      }}
                    >
                      <div className={`p-4 rounded-[16px] border ${style.iconBg} shadow-sm transition-shadow`}>
                        <IconComponent className="w-8 h-8" />
                      </div>
                    </Tooltip>

                    <Chip
                      variant="bordered"
                      size="sm"
                      classNames={{
                        base: 'border border-white/10 bg-white/5 backdrop-blur-sm',
                        content: 'text-xs font-black text-white/60 tracking-wide',
                      }}
                    >
                      {m.badge}
                    </Chip>
                  </CardHeader>

                  <CardBody className="relative z-10 px-6 pt-5 pb-2 text-left">
                    <h3 className="text-2xl font-black text-white mb-3 group-hover:text-[#E73A5A] transition-colors font-heading text-left">
                      {m.title}
                    </h3>
                    <p className="text-sm md:text-base text-white/60 font-medium leading-relaxed text-left">
                      {m.desc}
                    </p>
                  </CardBody>

                  <CardFooter className="relative z-10 px-6 pb-6 pt-4 flex justify-end">
                    <Button
                      variant="light"
                      size="sm"
                      endContent={<ChevronRight className="w-4 h-4" />}
                      className="font-black text-xs uppercase tracking-widest text-[#A855F7] hover:text-[#A855F7]/80 px-0"
                    >
                      Read Full Setup Guide
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════════════════════
          PRE-FLIGHT PATH CHECKER
          ════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Card
          classNames={{
            base: 'max-w-4xl mx-auto border border-white/10 bg-white/5 rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] mb-16 overflow-visible backdrop-blur-md',
            body: 'p-8 relative overflow-hidden',
          }}
        >
          <CardBody>
            {/* Background watermark */}
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
              <Terminal className="w-36 h-36 text-white" />
            </div>

            <div className="relative z-10 text-left">
              <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3 font-heading text-left">
                <div className="p-2 rounded-[12px] bg-white/5 border border-white/10">
                  <Settings className="w-6 h-6 text-[#A855F7]" />
                </div>
                PRE-FLIGHT PATH CHECKER
              </h2>
              <p className="text-white/60 font-medium mb-8 text-left">
                Not sure which path fits your machine? Adjust the settings below to generate your personalized command line checklist.
              </p>

              {/* ── Tabs-based config selectors ──────────────────────── */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* OS Selector */}
                <div className="bg-white/[0.02] p-4 rounded-[16px] border border-white/10">
                  <label className="block text-xs font-black uppercase tracking-widest text-[#A855F7] mb-3">
                    1. Operating System
                  </label>
                  <Tabs
                    aria-label="Operating System"
                    selectedKey={os}
                    onSelectionChange={setOs}
                    variant="light"
                    size="sm"
                    classNames={{
                      tabList: 'gap-1 flex-wrap bg-white/5 border border-white/10 p-1 rounded-xl',
                      cursor: 'bg-[#A855F7] rounded-lg shadow-[0_0_10px_rgba(168, 85, 247,0.3)]',
                      tab: 'font-bold text-xs px-2',
                      tabContent: 'group-data-[selected=true]:text-white text-white/50 font-black',
                    }}
                  >
                    <Tab key="windows" title="Windows" />
                    <Tab key="macbook" title="macOS" />
                    <Tab key="linux" title="Linux" />
                  </Tabs>
                </div>

                {/* Deployment Method */}
                <div className="bg-white/[0.02] p-4 rounded-[16px] border border-white/10">
                  <label className="block text-xs font-black uppercase tracking-widest text-cyan-400 mb-3">
                    2. Deployment Style
                  </label>
                  <Tabs
                    aria-label="Deployment Style"
                    selectedKey={method}
                    onSelectionChange={setMethod}
                    variant="light"
                    size="sm"
                    classNames={{
                      tabList: 'gap-1 bg-white/5 border border-white/10 p-1 rounded-xl',
                      cursor: 'bg-cyan-500 rounded-lg shadow-[0_0_10px_rgba(6,182,212,0.3)]',
                      tab: 'font-bold text-xs px-2',
                      tabContent: 'group-data-[selected=true]:text-white text-white/50 font-black',
                    }}
                  >
                    <Tab key="native" title="Native" />
                    <Tab key="docker" title="Docker" />
                  </Tabs>
                </div>

                {/* LLM Engine */}
                <div className="bg-white/[0.02] p-4 rounded-[16px] border border-white/10">
                  <label className="block text-xs font-black uppercase tracking-widest text-emerald-400 mb-3">
                    3. Model Provider
                  </label>
                  <Tabs
                    aria-label="Model Provider"
                    selectedKey={provider}
                    onSelectionChange={setProvider}
                    variant="light"
                    size="sm"
                    classNames={{
                      tabList: 'gap-1 flex-wrap bg-white/5 border border-white/10 p-1 rounded-xl',
                      cursor: 'bg-emerald-500 rounded-lg shadow-[0_0_10px_rgba(16,185,129,0.3)]',
                      tab: 'font-bold text-xs px-2',
                      tabContent: 'group-data-[selected=true]:text-white text-white/50 font-black',
                    }}
                  >
                    <Tab key="ollama" title="Ollama" />
                    <Tab key="openrouter" title="OpenRouter" />
                    <Tab key="cloud" title="Cloud API" />
                  </Tabs>
                </div>
              </div>

              {/* ── Dynamic Checklist with Accordion ──────────────────── */}
              <Card
                classNames={{
                  base: 'bg-transparent border border-white/10 rounded-[20px] overflow-hidden',
                  body: 'p-6 bg-white/[0.01]',
                }}
              >
                <CardBody>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                    <h3 className="text-xl font-black text-white font-heading">
                      Your Dynamic Installation Checklist
                    </h3>
                    <Chip
                      size="sm"
                      classNames={{
                        base: 'bg-[#A855F7] border border-[#A855F7] shadow-[0_0_10px_rgba(168, 85, 247,0.3)]',
                        content: 'text-xs font-black text-white uppercase tracking-wider',
                      }}
                    >
                      {os.toUpperCase()} + {method.toUpperCase()}
                    </Chip>
                  </div>

                  <Accordion
                    variant="splitted"
                    selectionMode="multiple"
                    defaultExpandedKeys={['0']}
                    className="px-0 gap-4"
                    itemClasses={{
                      base: 'border border-white/10 rounded-[14px] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 overflow-hidden !px-0',
                      title: 'font-black text-white text-base text-left',
                      subtitle: 'text-white/50 text-sm font-medium text-left',
                      trigger: 'px-5 py-4 data-[hover=true]:bg-white/5',
                      content: 'px-5 pb-5 pt-0 text-left',
                      indicator: 'text-white/60',
                    }}
                  >
                    {checklist.map((step, idx) => (
                      <AccordionItem
                        key={String(idx)}
                        aria-label={step.title}
                        startContent={
                          <div
                            className={`${STEP_COLORS[idx % STEP_COLORS.length]} border rounded-full w-8 h-8 flex items-center justify-center font-black flex-shrink-0 text-sm shadow-sm`}
                          >
                            {idx + 1}
                          </div>
                        }
                        title={step.title}
                        subtitle={step.desc}
                      >
                        <div className="mt-2 text-left">
                          <Snippet
                            symbol=""
                            variant="flat"
                            classNames={{
                              base: 'bg-black/60 border border-white/10 rounded-[12px] w-full max-w-full text-left',
                              pre: 'font-mono text-xs md:text-sm whitespace-pre-wrap text-emerald-400 text-left',
                              copyButton: 'text-white/60 hover:text-white min-w-8',
                            }}
                          >
                            {step.code}
                          </Snippet>
                        </div>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardBody>
              </Card>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* ════════════════════════════════════════════════════════════
          SAFETY NOTICE BANNER
          ════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <Card
          classNames={{
            base: 'max-w-4xl mx-auto border border-[#A855F7]/20 bg-[#A855F7]/5 rounded-[16px] shadow-[0_4px_24px_rgba(168, 85, 247,0.05)] mb-12',
            body: 'p-6',
          }}
        >
          <CardBody className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-[#A855F7]/10 p-3 rounded-[16px] border border-[#A855F7]/20 flex-shrink-0">
              <Info className="w-8 h-8 text-[#A855F7]" />
            </div>
            <div className="text-left">
              <h4 className="text-lg font-black text-[#A855F7] mb-2 uppercase font-heading tracking-wide text-left">
                Official Security Alert
              </h4>
              <p className="text-sm text-white/70 font-medium leading-relaxed text-left">
                Never download compiled installer packages (
                <Code size="sm" className="font-bold border border-white/10 bg-white/5 text-[#A855F7]">.exe</Code>
                {' '}or{' '}
                <Code size="sm" className="font-bold border border-white/10 bg-white/5 text-[#A855F7]">.dmg</Code>
                ) from third-party hosts. Odysseus is a modular Python/React application designed to be cloned and audited directly from the verified developer source code.
              </p>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default InstallHubPage;
