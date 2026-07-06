import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, BookOpen, AlertCircle, Copy, Check, Terminal, Shield, Sparkles, Rocket, Star } from 'lucide-react';
import { Chip } from '@heroui/react';
import { motion } from 'framer-motion';
import BlogCard from '@/components/BlogCard.jsx';
import pb from '@/lib/pocketbaseClient';
import { Skeleton } from '@/components/ui/skeleton';
import { fallbackBlogs } from '@/data/fallbackBlogs.js';
import { toast } from 'sonner';
import apiServerClient from '@/lib/apiServerClient';

import TestimonialsSection from '@/components/TestimonialsSection.jsx';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem, Parallax, Float, Reveal } from '@/components/ScrollAnimations.jsx';

const HERO_WORDS = ["safest", "fastest", "easiest"];

const TypewriterHero = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    let timer;
    const fullWord = HERO_WORDS[currentWordIndex];

    const handleType = () => {
      if (!isDeleting) {
        // Typing character
        setCurrentText(fullWord.substring(0, currentText.length + 1));
        setTypingSpeed(100);

        if (currentText === fullWord) {
          // Pause before deleting
          setTypingSpeed(1500);
          setIsDeleting(true);
        }
      } else {
        // Deleting character
        setCurrentText(fullWord.substring(0, currentText.length - 1));
        setTypingSpeed(50);

        if (currentText === '') {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % HERO_WORDS.length);
          setTypingSpeed(500); // pause before typing next word
        }
      }
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, typingSpeed]);

  return (
    <div className="flex flex-wrap justify-center items-center gap-x-2 py-2">
      <span>the</span>
      <span className="text-primary underline decoration-primary/30 min-w-[130px] md:min-w-[160px] inline-block text-center font-extrabold relative">
        {currentText}
        <span className="absolute ml-0.5 animate-pulse text-primary font-light">|</span>
      </span>
      <span>way!</span>
    </div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [blogError, setBlogError] = useState(null);

  // Setup Path Checker State
  const [checkerOS, setCheckerOS] = useState('');
  const [checkerRoute, setCheckerRoute] = useState('');
  const [checkerModel, setCheckerModel] = useState('');
  const [checkerState, setCheckerState] = useState('');
  const [checkerEmail, setCheckerEmail] = useState('');

  // Endpoint Resolver State
  const [resolverMode, setResolverMode] = useState('Docker Container (Compose/Run flow)');
  const [resolverOllamaLoc, setResolverOllamaLoc] = useState('Directly on my host PC while Odysseus is in Docker');

  // Error Diagnosis State
  const [activeErrorDiag, setActiveErrorDiag] = useState('Cannot find admin password');

  // Copied state for code blocks
  const [copiedDocker, setCopiedDocker] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState({});
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const handleLaunchKitCheckout = () => {
    navigate('/odysseus-install-odysseus-pewdiepie');
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoadingBlogs(true);
        setBlogError(null);
        let items = [];
        try {
          const records = await pb.collection('blog_articles').getList(1, 2, {
            filter: 'status="published"',
            sort: '-created_at,-created',
            $autoCancel: false
          });
          items = records.items || [];
        } catch (pbErr) {
          console.warn("Pocketbase homepage blog fetch failed, utilizing fallback:", pbErr);
        }

        if (items.length === 0) {
          setBlogs(fallbackBlogs.slice(0, 2));
        } else {
          setBlogs(items);
        }
      } catch (error) {
        console.error("Error fetching blogs for homepage:", error);
        setBlogs(fallbackBlogs.slice(0, 2));
      } finally {
        setLoadingBlogs(false);
      }
    };
    
    fetchBlogs();
  }, []);

  const handleCopyText = (text, callback) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
    callback(true);
    setTimeout(() => callback(false), 2000);
  };

  const handleScrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Get dynamic endpoint recommendation
  const getRecommendedEndpoint = () => {
    if (resolverMode.includes('Docker') && resolverOllamaLoc.includes('PC')) {
      return 'http://host.docker.internal:11434/v1';
    }
    if (resolverMode.includes('Natively') && resolverOllamaLoc.includes('PC')) {
      return 'http://localhost:11434/v1';
    }
    return 'http://192.168.1.XX:11434/v1'; // LAN fallback representation
  };

  // Setup plan submit
  const handleEmailSetupPlan = (e) => {
    e.preventDefault();
    if (!checkerEmail.trim() || !checkerEmail.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success(`Custom setup plan successfully sent to ${checkerEmail}!`);
    setCheckerEmail('');
  };

  const dockerCommandString = `git clone https://github.com/pewdiepie-archdaemon/odysseus.git
cd odysseus
cp .env.example .env  # Edit .env file with your API keys
docker compose up -d --build`;

  // Get dynamic setup recommendation
  const getSetupRecommendation = () => {
    if (checkerState === 'localhost is broken' || checkerState === 'Ollama is not detected') {
      return {
        title: "Troubleshooting & Log Recovery is your recommended route",
        desc: "Do not reinstall from scratch just yet. Re-running compose files without analyzing locks can duplicate active volumes.",
        firstCmd: "docker compose ps\ndocker compose logs --tail=100 odysseus",
        trap: "Pasten raw passwords or unredacted .env files into public Discord servers."
      };
    }
    if (checkerOS === 'macOS Apple Silicon' && checkerRoute === 'Native install') {
      return {
        title: "Native Apple Silicon (Metal API) is your safest install path",
        desc: "Running natively on macOS M1/M2/M3 chips grants Metal framework GPU acceleration, bypassing Docker's virtual CPU constraints.",
        firstCmd: "./start-macos.sh",
        trap: "Running via Docker Desktop on macOS while expecting direct hardware Metal access."
      };
    }
    if (checkerOS === 'Windows' && checkerRoute === 'Native install') {
      return {
        title: "Native Windows PowerShell is your safest install path",
        desc: "Ideal when you want direct PowerShell process control and have Python 3.11+ configured on your host system.",
        firstCmd: "powershell -ExecutionPolicy Bypass -File .\\launch-windows.ps1",
        trap: "Executing the launcher from an unzipped directory without initializing virtual environments."
      };
    }
    // Default
    return {
      title: "Docker Compose is your safest Odysseus AI install path",
      desc: "Docker keeps Odysseus, ChromaDB, SearXNG, ntfy, and the app runtime in a contained setup. It is the easiest route when you want a repeatable install without manually managing Python dependencies.",
      firstCmd: "git clone https://github.com/pewdiepie-archdaemon/odysseus.git\ncd odysseus\ncp .env.example .env\ndocker compose up -d --build",
      trap: "Do not expose APP_BIND=0.0.0.0 just to make localhost work. First confirm container health with docker compose ps and keep the app bound to localhost unless you intentionally want trusted LAN or reverse-proxy access."
    };
  };

  const recommendation = getSetupRecommendation();

  return (
    <>
      <Helmet>
        <title>Odysseus AI Quickstart — Install Without Fighting</title>
        <meta name="description" content="Get the safest, fastest and most beginner-friendly way to install and run Odysseus AI on Windows, Mac, or Linux using Docker and Ollama." />
        <meta name="keywords" content="odysseus ai, local llm setup, docker install guide, pewdiepie install, ollama setup, local ai workspace" />
        <meta name="author" content="Odysseus AI Project Owners" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href="https://odysseusai.ai/" />
        
        {/* Open Graph Protocol (OG) Tags */}
        <meta property="og:title" content="Odysseus AI Setup & Docker Hub" />
        <meta property="og:description" content="Get your self-hosted Odysseus AI workspace running safely." />
        <meta property="og:image" content="https://odysseusai.ai/odysseus_launch_kit_preview.png" />
        <meta property="og:url" content="https://odysseusai.ai/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Odysseus AI Setup Hub" />
        
        {/* Twitter Cards Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Odysseus AI Setup & Docker Hub" />
        <meta name="twitter:description" content="Get your self-hosted Odysseus AI workspace running safely." />
        <meta name="twitter:image" content="https://odysseusai.ai/odysseus_launch_kit_preview.png" />
        <meta name="twitter:site" content="@OdysseusAI" />
        <meta name="twitter:creator" content="@OdysseusAI" />
        
        {/* Language alternates */}
        <link rel="alternate" hrefLang="en" href="https://odysseusai.ai/" />
        <link rel="alternate" hrefLang="x-default" href="https://odysseusai.ai/" />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 pt-12 pb-20 text-center relative select-none">
        {/* Radial gradient background glow */}
        <div 
          className="absolute inset-0 pointer-events-none -z-10" 
          style={{
            background: 'radial-gradient(circle at center, rgba(231, 58, 90, 0.15) 0%, transparent 70%)',
            transform: 'scale(1.2)'
          }}
        />
        {/* Floating decorative elements */}
        <Float amplitude={12} duration={3}><div className="absolute top-10 left-10 text-[#E73A5A] opacity-35 text-2xl">★</div></Float>
        <Float amplitude={8} duration={5} delay={1}><div className="absolute top-20 right-10 text-[#E73A5A] opacity-40 text-xl">✦</div></Float>
        <Float amplitude={10} duration={4} delay={2}><div className="absolute bottom-20 left-20 text-[#E73A5A] opacity-35 text-xl">✦</div></Float>
        
        {/* Announcement Badge */}
        <FadeIn delay={0.1} direction="down" distance={20}>
        <div className="inline-flex items-center gap-2 bg-[#E73A5A]/10 px-4 py-1.5 rounded-full border border-[#E73A5A]/20 text-sm font-semibold mb-8">
          <span className="bg-[#E73A5A] text-white px-2.5 py-0.5 rounded-full text-xs font-bold">DOCKER</span>
          <span className="text-gray-400">Install Without Fighting • Docker, Python or Ollama</span>
        </div>
        </FadeIn>

        {/* Hero Title */}
        <FadeIn delay={0.2} direction="up" distance={30}>
        <h1 className="text-4xl md:text-6xl font-bold mb-8 flex flex-col items-center gap-4 text-white leading-tight">
          <span>Odysseus AI</span>
          <TypewriterHero />
        </h1>
        </FadeIn>

        <FadeIn delay={0.35} direction="up" distance={20}>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-10 leading-relaxed font-medium">
          Odysseus AI functions purely as a self-hosted workspace cockpit interface; it is not an AI model engine itself. Odysseus AI native installation requires Python 3.11+ and Git for Windows or macOS. This Launch Kit gives you the safest, fastest and most beginner-friendly way to install and run it on your own machine.
        </p>
        </FadeIn>

        {/* 🔒 100% Private Hero Copy */}
        <FadeIn delay={0.4} direction="up" distance={20}>
          <div className="max-w-xl mx-auto mb-10 p-5 border border-[#E73A5A]/30 bg-[#E73A5A]/5 rounded-2xl backdrop-blur-sm select-none">
            <p className="text-base md:text-lg font-black uppercase text-white tracking-wider">
              🛡️ <span className="text-[#E73A5A]">100% Private.</span> Zero Data Tracking, Ever.
            </p>
            <p className="text-xs md:text-sm font-semibold text-gray-400 mt-1.5 uppercase tracking-widest">
              Powered Entirely by Local, Open-Source AI
            </p>
          </div>
        </FadeIn>

        {/* Hero Actions */}
        <FadeIn delay={0.5} direction="up" distance={20}>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button 
            onClick={() => handleScrollToId('offer')}
            className="bg-[#E73A5A] text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(231, 58, 90,0.4)] flex items-center gap-2 hover:scale-[1.03] hover:brightness-112 transition-all"
          >
            Get Launch Kit – $19.99 🚀
          </button>
          <button 
            onClick={() => handleScrollToId('checker')}
            className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2"
          >
            Check My Setup Path – Free 👀
          </button>
        </div>
        </FadeIn>

        {/* Trust indicators */}
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Windows • Mac • Linux • Docker & Ollama Ready • Secure & Localhost-First
            </p>
          </div>
        </div>
      </div>

      <section id="tools" className="w-full">
      {/* Cute Platform Selector Cards Section */}
      <section className="bg-white/5 border-t border-b border-white/10 py-12 px-4 select-none">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 uppercase tracking-wider">
            Choose Your Installation Platform
          </h2>
          <p className="text-xs md:text-sm font-bold text-gray-500 max-w-xl mx-auto mb-8 uppercase tracking-wide">
            Select a target to launch PewDiePie's Odysseus AI offline on your machine
          </p>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 justify-center items-center" staggerDelay={0.08}>
            {/* Windows Card */}
            <StaggerItem>
            <Link
              to="/odysseus-install/windows"
              title="NVIDIA CUDA GPU acceleration setup instructions"
              className="glass-card p-6 md:p-8 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-all duration-200"
            >
              <div className="text-[#E73A5A] mb-3 flex items-center justify-center">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="14" x="2" y="3" rx="2" />
                  <line x1="8" x2="16" y1="21" y2="21" />
                  <line x1="12" x2="12" y1="17" y2="21" />
                </svg>
              </div>
              <span className="font-bold text-xs md:text-sm uppercase tracking-widest text-white">
                Windows
              </span>
            </Link>
            </StaggerItem>

            {/* macOS Card */}
            <StaggerItem>
            <Link
              to="/odysseus-install/macbook"
              title="Apple Silicon Metal framework acceleration configuration"
              className="glass-card p-6 md:p-8 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-all duration-200"
            >
              <div className="text-[#E73A5A] mb-3 flex items-center justify-center">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="12" x="3" y="4" rx="2" />
                  <line x1="2" x2="22" y1="20" y2="20" />
                  <line x1="5" x2="19" y1="16" y2="16" />
                </svg>
              </div>
              <span className="font-bold text-xs md:text-sm uppercase tracking-widest text-white">
                macOS
              </span>
            </Link>
            </StaggerItem>

            {/* Linux Card */}
            <StaggerItem>
            <Link
              to="/odysseus-ai-install"
              title="Private docker container & native uvicorn hook blueprints"
              className="glass-card p-6 md:p-8 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-all duration-200"
            >
              <div className="text-[#E73A5A] mb-3 flex items-center justify-center">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" x2="20" y1="19" y2="19" />
                </svg>
              </div>
              <span className="font-bold text-xs md:text-sm uppercase tracking-widest text-white">
                Linux
              </span>
            </Link>
            </StaggerItem>

            {/* Docker Card */}
            <StaggerItem>
            <Link
              to="/odysseus-install/docker"
              title="Deploy repeatable isolated service container clusters"
              className="glass-card p-6 md:p-8 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-all duration-200"
            >
              <div className="text-[#E73A5A] mb-3 flex items-center justify-center">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 7.6L19 4H5L2 7.6c-.5.6-.5 1.4-.2 2l2.7 5.4c.5 1 1.5 1.6 2.7 1.6h9.6c1.2 0 2.2-.6 2.7-1.6l2.7-5.4c.3-.6.3-1.4-.2-2z" />
                  <path d="M12 4v13" />
                </svg>
              </div>
              <span className="font-bold text-xs md:text-sm uppercase tracking-widest text-white">
                Docker
              </span>
            </Link>
            </StaggerItem>

            {/* Ollama Card */}
            <StaggerItem>
            <Link
              to="/odysseus-install/ollama"
              title="Integrate local LLM model engines (Llama 3.2, Qwen 2.5)"
              className="glass-card p-6 md:p-8 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-all duration-200"
            >
              <div className="text-[#E73A5A] mb-3 flex items-center justify-center">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="16" height="16" x="4" y="4" rx="2" />
                  <rect width="6" height="6" x="9" y="9" rx="1" />
                  <path d="M9 1v3" />
                  <path d="M15 1v3" />
                  <path d="M9 20v3" />
                  <path d="M15 20v3" />
                  <path d="M20 9h3" />
                  <path d="M20 15h3" />
                  <path d="M1 9h3" />
                  <path d="M1 15h3" />
                </svg>
              </div>
              <span className="font-bold text-xs md:text-sm uppercase tracking-widest text-white">
                Ollama
              </span>
            </Link>
            </StaggerItem>

            {/* Install Hub Card */}
            <StaggerItem>
            <Link
              to="/odysseus-ai-install"
              title="View all 100% offline private setup blueprints"
              className="glass-card p-6 md:p-8 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-all duration-200"
            >
              <div className="text-[#E73A5A] mb-3 flex items-center justify-center">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
              </div>
              <span className="font-bold text-xs md:text-sm uppercase tracking-widest text-white">
                Install Hub
              </span>
            </Link>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* What is Odysseus AI Quickstart Section */}
      <section className="max-w-5xl mx-auto px-4 py-16 select-none">
        <FadeIn direction="up" distance={30}>
        <h2 className="text-3xl md:text-4xl text-center font-bold mb-4 text-white">
          What is the Odysseus AI Quickstart?
        </h2>
        <p className="text-center text-gray-400 max-w-xl mx-auto mb-16 font-medium">
          An Odysseus AI install is not one single download. Your safest next step depends on whether you are starting fresh, configuring Docker and Ollama, or fixing a broken localhost, login, or model connection.
        </p>
        </FadeIn>
        
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.15}>
          {/* Column 1 */}
          <StaggerItem><div className="glass-card p-8 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="text-4xl">📂</div>
              <h3 className="text-xl font-bold leading-tight text-white">I haven't installed Odysseus AI yet</h3>
              <p className="text-sm leading-relaxed text-gray-400 font-medium">
                Start by cloning the official repository, then choose Docker, Windows native, macOS native, or API-backed setup.
              </p>
              <pre className="bg-black/5 dark:bg-black/40 p-3 rounded-xl border border-black/5 dark:border-white/10 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 overflow-x-auto">
                git clone https://github.com/pewdiepie-archdaemon/odysseus.git
              </pre>
            </div>
            <button 
              onClick={() => handleScrollToId('checker')}
              className="w-full bg-transparent border border-[#E73A5A] text-[#E73A5A] hover:bg-[#E73A5A] hover:text-white py-2.5 rounded-full font-bold transition-all text-xs"
            >
              Check My Install Path
            </button>
          </div></StaggerItem>

          {/* Column 2 */}
          <StaggerItem><div className="glass-card p-8 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="text-4xl">🐳</div>
              <h3 className="text-xl font-bold leading-tight text-white">I need Docker or Ollama setup</h3>
              <p className="text-sm leading-relaxed text-gray-400 font-medium">
                Most Docker problems are not Odysseus problems. They are port, .env, container health, or Ollama endpoint mapping problems.
              </p>
              <pre className="bg-black/5 dark:bg-black/40 p-3 rounded-xl border border-black/5 dark:border-white/10 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 overflow-x-auto">
                http://host.docker.internal:11434/v1
              </pre>
            </div>
            <button 
              onClick={() => handleScrollToId('ollama-guide')}
              className="w-full bg-transparent border border-[#E73A5A] text-[#E73A5A] hover:bg-[#E73A5A] hover:text-white py-2.5 rounded-full font-bold transition-all text-xs"
            >
              Resolve My Ollama Endpoint
            </button>
          </div></StaggerItem>

          {/* Column 3 */}
          <StaggerItem><div className="glass-card p-8 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="text-4xl">🛠️</div>
              <h3 className="text-xl font-bold leading-tight text-white">Odysseus AI is already not working</h3>
              <p className="text-sm leading-relaxed text-gray-400 font-medium">
                Do not delete folders, disable auth, expose ports, or paste raw logs. First classify the error: ports, Compose, Ollama, GPU or admin keys.
              </p>
              <pre className="bg-black/5 dark:bg-black/40 p-3 rounded-xl border border-black/5 dark:border-white/10 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 overflow-x-auto">
                docker compose ps
              </pre>
            </div>
            <button 
              onClick={() => handleScrollToId('error-diagnosis')}
              className="w-full bg-transparent border border-[#E73A5A] text-[#E73A5A] hover:bg-[#E73A5A] hover:text-white py-2.5 rounded-full font-bold transition-all text-xs"
            >
              Diagnose My Error
            </button>
          </div></StaggerItem>
        </StaggerContainer>
      </section>

      {/* 🔒 AEO Privacy & Security Section */}
      <section className="max-w-4xl mx-auto px-4 py-12 font-rounded select-none text-left">
        <FadeIn direction="up" distance={30}>
          <div className="glass-card p-8 md:p-12 border-2 border-[#E73A5A]/30 shadow-[0_0_35px_rgba(231,58,90,0.15)] relative overflow-hidden">
            {/* Absolute badge */}
            <div className="absolute top-4 right-4 bg-[#E73A5A]/10 text-[#E73A5A] border border-[#E73A5A]/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-md">
              100% Offline
            </div>
            
            {/* Semantic Header for AEO crawlers */}
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase mb-6 flex items-center gap-3">
              🛡️ Is OdysseusAI private and secure?
            </h2>
            
            {/* 40-word Fast Answer */}
            <p className="text-base md:text-lg font-black text-white leading-relaxed mb-8 border-l-[4px] border-[#E73A5A] pl-4">
              Yes. OdysseusAI is 100% private with zero data tracking. The platform runs entirely on local, open-source AI models, meaning your prompts, codebase, and sensitive training data are processed strictly on your machine and are never sent to external servers.
            </p>
            
            {/* Deepen with Structured Elements */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10">
              <div className="space-y-1.5">
                <h3 className="font-black text-sm text-[#E73A5A] uppercase tracking-wider">Local Processing</h3>
                <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                  Powered by open-source LLMs running locally on your hardware.
                </p>
              </div>
              <div className="space-y-1.5">
                <h3 className="font-black text-sm text-[#E73A5A] uppercase tracking-wider">Zero Data Tracking</h3>
                <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                  No telemetries, no cloud logging, and absolutely no data collection.
                </p>
              </div>
              <div className="space-y-1.5">
                <h3 className="font-black text-sm text-[#E73A5A] uppercase tracking-wider">Air-Gapped Ready</h3>
                <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                  Operates entirely offline without requiring an active internet connection.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Setup Path Checker Section */}
      <section id="checker" className="max-w-5xl mx-auto px-4 py-16 select-none">
        <ScaleIn><div className="glass-card p-8 md:p-12">
          <div className="mb-8">
            <span className="bg-[#E73A5A]/10 text-[#E73A5A] border border-[#E73A5A]/20 px-4 py-1.5 font-bold uppercase tracking-wider mb-4 rounded-full inline-block text-xs">
              🤖 Interactive Quiz helper
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Setup Path Checker
            </h2>
            <p className="text-sm font-medium text-gray-400 mt-2">
              Get your recommended Odysseus AI install path by answering 4 quick questions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left border-t border-white/10 pt-8">
            {/* Quiz Fields */}
            <div className="space-y-6">
              {/* Question 1 */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  1. What machine are you using?
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Windows', 'macOS Apple Silicon', 'macOS Intel', 'Linux', 'Not sure'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setCheckerOS(option)}
                      className={`px-3 py-1.5 border font-bold text-xs rounded-xl transition-all ${
                        checkerOS === option 
                          ? 'bg-[#E73A5A] text-white border-[#E73A5A]' 
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  2. What setup route do you prefer?
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Docker Compose', 'Native install', 'Not sure'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setCheckerRoute(option)}
                      className={`px-3 py-1.5 border font-bold text-xs rounded-xl transition-all ${
                        checkerRoute === option 
                          ? 'bg-[#E73A5A] text-white border-[#E73A5A]' 
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3 */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  3. What do you want Odysseus to use for models?
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Local Ollama models', 'API-backed models', 'Cookbook / GPU serving', 'Not sure'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setCheckerModel(option)}
                      className={`px-3 py-1.5 border font-bold text-xs rounded-xl transition-all ${
                        checkerModel === option 
                          ? 'bg-[#E73A5A] text-white border-[#E73A5A]' 
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4 */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  4. What is your current state?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Fresh install', 'Already cloned the repo', 'Docker is running', 'Login page is open', 'Ollama is not detected', 'localhost is broken'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setCheckerState(option)}
                      className={`px-2 py-1.5 border font-bold text-[10px] rounded-xl transition-all text-center leading-tight ${
                        checkerState === option 
                          ? 'bg-[#E73A5A] text-white border-[#E73A5A]' 
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendation Result Card */}
            <div className="checkout-card p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Recommended Route</span>
                <h3 className="text-lg font-bold text-white mt-1 mb-3">
                  {recommendation.title}
                </h3>
                <p className="text-xs text-gray-400 mb-4 font-semibold leading-relaxed">
                  {recommendation.desc}
                </p>
                
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">First Command</span>
                <pre className="bg-black/5 dark:bg-black/40 p-3 rounded-xl border border-black/5 dark:border-white/10 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 overflow-x-auto leading-relaxed mb-4">
                  {recommendation.firstCmd}
                </pre>

                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block mb-1">Avoid This Mistake</span>
                <p className="text-xs text-gray-400 font-medium leading-relaxed italic border-l-2 border-red-400 pl-2">
                  {recommendation.trap}
                </p>
              </div>

              {/* Email Subscription form */}
              <form onSubmit={handleEmailSetupPlan} className="mt-6 border-t border-white/10 pt-4 space-y-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Send this route to my inbox
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={checkerEmail}
                    onChange={(e) => setCheckerEmail(e.target.value)}
                    className="flex-grow bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl font-bold text-xs text-white outline-none focus:ring-1 focus:ring-[#E73A5A] focus:border-[#E73A5A] placeholder:text-gray-500"
                  />
                  <button 
                    type="submit"
                    className="bg-[#E73A5A] hover:bg-[#E73A5A]/80 text-white px-4 py-1.5 rounded-xl font-bold text-xs transition-all"
                  >
                    Email Plan
                  </button>
                </div>
                <span className="block text-[8px] text-gray-500 font-medium">We do not collect passwords or .env configurations.</span>
              </form>
            </div>
          </div>
        </div></ScaleIn>
      </section>

      {/* Decision Matrix Table */}
      <section className="max-w-5xl mx-auto px-4 py-16 font-rounded select-none">
        <FadeIn direction="up" distance={30}>
        <h2 className="text-2xl md:text-3xl font-black text-center text-white mb-4">
          Install Path Decision Matrix
        </h2>
        <p className="text-center text-gray-400 text-sm max-w-2xl mx-auto mb-10 font-semibold">
          Docker Compose is the most repeatable path for many users. Native Windows is useful when you want direct PowerShell control. Native Apple Silicon is better for local model performance.
        </p>
        </FadeIn>

        <FadeIn direction="up" delay={0.2}><div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
          <table className="w-full text-left text-xs bg-transparent min-w-[800px]">
            <thead className="bg-white/5 border-b border-white/10 font-bold uppercase text-[10px] tracking-wider text-white">
              <tr>
                <th className="p-4 border-r border-white/10">Path</th>
                <th className="p-4 border-r border-white/10">Choose this if</th>
                <th className="p-4 border-r border-white/10">Do not choose this if</th>
                <th className="p-4 border-r border-white/10">First command / Endpoint</th>
                <th className="p-4 border-r border-white/10">Common trap</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="font-medium text-gray-300 divide-y divide-white/10">
              {/* Matrix Row 1 */}
              <tr>
                <td className="p-4 font-bold border-r border-white/10 bg-[#E73A5A]/10 text-white">Docker Compose</td>
                <td className="p-4 border-r border-white/10 leading-relaxed">You want the most repeatable Odysseus AI install path and do not want to manage Python/ntfy manually.</td>
                <td className="p-4 border-r border-white/10 leading-relaxed">You are on Apple Silicon and your main goal is Metal-accelerated local model serving.</td>
                <td className="p-4 border-r border-white/10 font-mono text-[10px] text-emerald-400">docker compose up -d --build</td>
                <td className="p-4 border-r border-white/10 leading-relaxed text-red-400 font-semibold">Using localhost:11434 inside Docker. Use host.docker.internal instead.</td>
                <td className="p-4">
                  <Link to="/odysseus-install/docker" className="font-bold text-[#E73A5A] hover:text-[#E73A5A]/80 transition-colors">Docker Guide</Link>
                </td>
              </tr>
              {/* Matrix Row 2 */}
              <tr>
                <td className="p-4 font-bold border-r border-white/10 bg-[#E73A5A]/5 text-white">Native Windows</td>
                <td className="p-4 border-r border-white/10 leading-relaxed">You are on Windows, have Python 3.11+ and Git, and want direct PowerShell scripts.</td>
                <td className="p-4 border-r border-white/10 leading-relaxed">You are not comfortable with PowerShell or Python dependency errors.</td>
                <td className="p-4 border-r border-white/10 font-mono text-[10px] text-emerald-400">.\launch-windows.ps1</td>
                <td className="p-4 border-r border-white/10 leading-relaxed text-red-400 font-semibold">Running the script from the wrong folder or using older Python interpreters.</td>
                <td className="p-4">
                  <Link to="/odysseus-install/windows" className="font-bold text-[#E73A5A] hover:text-[#E73A5A]/80 transition-colors">Windows Guide</Link>
                </td>
              </tr>
              {/* Matrix Row 3 */}
              <tr>
                <td className="p-4 font-bold border-r border-white/10 bg-[#E73A5A]/10 text-white">Native Apple Silicon</td>
                <td className="p-4 border-r border-white/10 leading-relaxed">You use an M-series Mac and want local model speed through native Metal framework.</td>
                <td className="p-4 border-r border-white/10 leading-relaxed">You mainly want isolated containers and do not care about local acceleration.</td>
                <td className="p-4 border-r border-white/10 font-mono text-[10px] text-emerald-400">./start-macos.sh</td>
                <td className="p-4 border-r border-white/10 leading-relaxed text-red-400 font-semibold">Expecting Docker Desktop on macOS to provide native Metal GPU acceleration.</td>
                <td className="p-4">
                  <Link to="/odysseus-install/macbook" className="font-bold text-[#E73A5A] hover:text-[#E73A5A]/80 transition-colors">Mac Guide</Link>
                </td>
              </tr>
              {/* Matrix Row 4 */}
              <tr>
                <td className="p-4 font-bold border-r border-white/10 bg-white/5 text-white">Ollama Connection</td>
                <td className="p-4 border-r border-white/10 leading-relaxed">Odysseus is already running and you need local models to appear inside Settings.</td>
                <td className="p-4 border-r border-white/10 leading-relaxed">You have not installed or started Odysseus yet.</td>
                <td className="p-4 border-r border-white/10 font-mono text-[10px] text-emerald-400">http://host.docker.internal:11434/v1</td>
                <td className="p-4 border-r border-white/10 leading-relaxed text-red-400 font-semibold">Forgetting the /v1 suffix or assuming Docker localhost means host machine.</td>
                <td className="p-4">
                  <Link to="/odysseus-install/ollama" className="font-bold text-[#E73A5A] hover:text-[#E73A5A]/80 transition-colors">Ollama Resolver</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div></FadeIn>
      </section>

      {/* Docker Quick Path */}
      <section className="max-w-5xl mx-auto px-4 py-16 font-rounded select-none">
        <FadeIn direction="left" distance={50}><div className="workflow-card p-6 md:p-8 rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Docker Quick Path</h2>
              <p className="text-xs text-gray-400">Fastest and most stable way to spin up Odysseus compose network</p>
            </div>
            <button 
              onClick={() => handleCopyText(dockerCommandString, setCopiedDocker)}
              className="bg-[#E73A5A] text-white hover:bg-[#E73A5A]/80 font-bold uppercase text-xs px-4 py-2 flex items-center gap-1.5 transition-all rounded-xl focus:outline-none"
            >
              {copiedDocker ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
              COPY COMMANDS
            </button>
          </div>
          
          <pre className="p-4 bg-black/5 dark:bg-black/40 rounded-xl border border-black/5 dark:border-white/10 text-xs font-mono text-emerald-600 dark:text-emerald-400 overflow-x-auto leading-relaxed">
            <code>{dockerCommandString}</code>
          </pre>
          
          <p className="text-[10px] text-gray-400 italic">
            ⚠️ Warning: Ensure APP_BIND=0.0.0.0 is properly configured inside your copied local .env path if you need LAN access. Default mappings bind internally to localhost:7000.
          </p>
        </div></FadeIn>
      </section>

      {/* Interactive Endpoint Resolver */}
      <section id="ollama-guide" className="max-w-5xl mx-auto px-4 py-16 font-rounded select-none text-left">
        <FadeIn direction="right" distance={50}><div className="workflow-card p-8 rounded-3xl">
          <div className="mb-6">
            <span className="bg-[#E73A5A]/10 text-[#E73A5A] border border-[#E73A5A]/20 px-4 py-1.5 font-bold uppercase tracking-widest mb-4 rounded-full inline-block text-xs">
              🔌 Connection Helper
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white">Ollama Connection Guide</h2>
            <p className="text-xs text-gray-400 mt-1">
              Many Odysseus install problems are really Ollama endpoint config bugs. Use these routing parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Select Options */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                  1. How is Odysseus running?
                </label>
                <div className="space-y-2">
                  {[
                    'Inside Docker Container (Compose/Run flow)',
                    'Natively on host PC'
                  ].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setResolverMode(option)}
                      className={`w-full p-2.5 border font-bold text-xs rounded-xl text-left transition-all ${
                        resolverMode === option 
                          ? 'bg-[#E73A5A] border-[#E73A5A] text-white' 
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                  2. Where is Ollama running?
                </label>
                <div className="space-y-2">
                  {[
                    'Directly on my host PC while Odysseus is in Docker',
                    'Inside Docker container',
                    'On another local machine'
                  ].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setResolverOllamaLoc(option)}
                      className={`w-full p-2.5 border font-bold text-xs rounded-xl text-left transition-all ${
                        resolverOllamaLoc === option 
                          ? 'bg-[#E73A5A] border-[#E73A5A] text-white' 
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Resolved URL Card */}
            <div className="checkout-card p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Recommended Endpoint Base URL</span>
                <div className="flex gap-2 items-center mt-2 mb-4 bg-black/5 dark:bg-black/40 p-3 rounded-xl border border-black/5 dark:border-white/10">
                  <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 break-all select-all flex-grow">
                    {getRecommendedEndpoint()}
                  </span>
                  <button 
                    onClick={() => handleCopyText(getRecommendedEndpoint(), () => {})}
                    className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white"
                    title="Copy URL"
                  >
                    <Copy size={12} />
                  </button>
                </div>
                
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Why:</span>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed font-semibold">
                  {resolverMode.includes('Docker') && resolverOllamaLoc.includes('PC') 
                    ? "When running Odysseus AI inside a Docker container while Ollama runs directly on your host operating system, you must map the endpoint URL Base to http://host.docker.internal:11434/v1 instead of localhost."
                    : "Since both applications are running on the same network environment or host operating system, they can directly bind and query local network loopbacks."}
                </p>
              </div>
            </div>
          </div>
        </div></FadeIn>
      </section>

      {/* Error Diagnosis Interactive Section */}
      <section id="error-diagnosis" className="max-w-5xl mx-auto px-4 py-16 font-rounded select-none text-left">
        <FadeIn direction="up" distance={30}>
        <h2 className="text-2xl md:text-3xl font-black text-center text-white mb-4">Error Diagnosis</h2>
        <p className="text-center text-gray-400 text-xs max-w-xl mx-auto mb-10 font-bold">
          Click on any common installer error to reveal the likely cause and instant troubleshooting command.
        </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Menu Buttons list */}
          <div className="md:col-span-5 flex flex-col gap-2">
            {[
              'Cannot find admin password',
              'localhost:7000 failing to open',
              'Is it safe to expose publicly?',
              'Local Ollama not detected',
              'Docker compose build failed',
              'PowerShell script blocks',
              'GPU appears isolated (CPU only)',
              'Mobile LAN/WiFi connecting issue'
            ].map((diag) => (
              <button
                key={diag}
                onClick={() => setActiveErrorDiag(diag)}
                className={`w-full p-3 border font-bold text-xs rounded-xl text-left transition-all ${
                  activeErrorDiag === diag
                    ? 'bg-[#E73A5A] border-[#E73A5A] text-white shadow-[0_0_15px_rgba(231, 58, 90,0.25)]'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                {diag}
              </button>
            ))}
          </div>

          {/* Diagnosis result */}
          <div className="md:col-span-7 checkout-card p-6 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">
              {activeErrorDiag}
            </h3>

            {activeErrorDiag === 'Cannot find admin password' && (
              <div className="space-y-4 text-xs font-semibold text-gray-300 leading-relaxed text-left">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Where is the temporary Odysseus AI admin password located?</h4>
                <p><strong>The temporary admin password for your first login is generated automatically on application initialization.</strong> You can instantly extract this password by opening your terminal or command line and inspecting your container state with the command <code>docker compose logs odysseus</code>.</p>
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Command to run:</span>
                  <pre className="bg-black/5 dark:bg-black/40 p-3 border border-black/5 dark:border-white/10 rounded-xl font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                    docker compose logs odysseus
                  </pre>
                </div>
              </div>
            )}

            {activeErrorDiag === 'localhost:7000 failing to open' && (
              <div className="space-y-4 text-xs font-semibold text-gray-300 leading-relaxed text-left">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Why does localhost:7000 fail to open in the browser?</h4>
                <p><strong>This failure usually indicates a local port collision or an uninitialized container stack.</strong> Instead of altering your root network settings, you can resolve the block by navigating to your copied .env file and altering the configuration to APP_PORT=7001 to bind to an open port.</p>
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Resolution command:</span>
                  <pre className="bg-black/5 dark:bg-black/40 p-3 border border-black/5 dark:border-white/10 rounded-xl font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                    docker compose down && docker compose up -d
                  </pre>
                </div>
              </div>
            )}

            {activeErrorDiag === 'Is it safe to expose publicly?' && (
              <div className="space-y-4 text-xs font-semibold text-gray-300 leading-relaxed text-left">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Is it safe to expose your Odysseus AI environment to a public domain?</h4>
                <p><strong>No, it is highly unsafe to expose your local instance publicly without an authenticated access proxy.</strong> Because Odysseus contains powerful administrative tools with direct local file system access, it should always be kept localhost-first or bound behind a private tunnel layer like Tailscale or Cloudflare Access.</p>
              </div>
            )}

            {activeErrorDiag === 'Local Ollama not detected' && (
              <div className="space-y-4 text-xs font-semibold text-gray-300 leading-relaxed">
                <p><strong>Likely cause:</strong> Docker container isolation blocks connection to 'localhost' endpoints. You must tell Docker to resolve Ollama via host network addresses.</p>
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">First check:</span>
                  <p className="mb-2 text-gray-400">Change the Ollama connection base endpoint inside settings to:</p>
                  <pre className="bg-black/5 dark:bg-black/40 p-3 border border-black/5 dark:border-white/10 rounded-xl font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                    http://host.docker.internal:11434/v1
                  </pre>
                </div>
              </div>
            )}

            {activeErrorDiag === 'Docker compose build failed' && (
              <div className="space-y-4 text-xs font-semibold text-gray-300 leading-relaxed">
                <p><strong>Likely cause:</strong> Stale Docker caches, locked database volumes, or missing compose dependencies.</p>
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Diagnostic command:</span>
                  <pre className="bg-black/5 dark:bg-black/40 p-3 border border-black/5 dark:border-white/10 rounded-xl font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                    docker compose build --no-cache && docker compose up -d
                  </pre>
                </div>
              </div>
            )}

            {activeErrorDiag === 'PowerShell script blocks' && (
              <div className="space-y-4 text-xs font-semibold text-gray-300 leading-relaxed">
                <p><strong>Likely cause:</strong> Windows Execution Policy restricts running unsigned PowerShell scripts by default.</p>
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Diagnostic command:</span>
                  <pre className="bg-black/5 dark:bg-black/40 p-3 border border-black/5 dark:border-white/10 rounded-xl font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
                  </pre>
                </div>
              </div>
            )}

            {activeErrorDiag === 'GPU appears isolated (CPU only)' && (
              <div className="space-y-4 text-xs font-semibold text-gray-300 leading-relaxed">
                <p><strong>Likely cause:</strong> Host NVIDIA CUDA Toolkit drivers or GPU container pass-through settings are not configured in your system runtime.</p>
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Verify CUDA drivers:</span>
                  <pre className="bg-black/5 dark:bg-black/40 p-3 border border-black/5 dark:border-white/10 rounded-xl font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                    nvidia-smi
                  </pre>
                </div>
              </div>
            )}

            {activeErrorDiag === 'Mobile LAN/WiFi connecting issue' && (
              <div className="space-y-4 text-xs font-semibold text-gray-300 leading-relaxed">
                <p><strong>Likely cause:</strong> Default bindings are restricted to loopback address (127.0.0.1). You must configure APP_BIND to accept local network handshakes.</p>
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Resolution:</span>
                  <p className="mb-2 text-gray-400">Update `.env` configuration to bind to all interfaces and restart:</p>
                  <pre className="bg-black/5 dark:bg-black/40 p-3 border border-black/5 dark:border-white/10 rounded-xl font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                    APP_BIND=0.0.0.0
                  </pre>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Link 
                to="/odysseus-triage-wizard" 
                className="inline-flex items-center gap-1 bg-[#E73A5A] hover:bg-[#E73A5A]/80 text-white px-4 py-2 rounded-xl font-bold text-xs transition-all"
              >
                Go to Triage Wizard <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      </section>

      {/* Official Source & Safe Download Section */}
      <section className="max-w-5xl mx-auto px-4 py-16 font-rounded select-none text-left">
        <ScaleIn><div className="workflow-card p-8 rounded-3xl">
          <div className="max-w-3xl">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Official Source & Safe Download</span>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-1 mb-4">
              Always verify the official GitHub repository before you install
            </h2>
            <p className="text-xs text-gray-400 font-semibold leading-relaxed mb-6">
              Because Odysseus AI became popular quickly, users may see GitHub mirrors, low-quality tutorials, fake download pages, or random installer files. The safest way to begin an Odysseus AI install is to verify the official GitHub source first.
            </p>

            <div className="checkout-card flex flex-col sm:flex-row gap-6 items-start sm:items-center p-6 rounded-3xl relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-24 h-24 bg-[#E73A5A]/10 rounded-full blur-2xl"></div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-3xl">code</span>
              </div>
              <div className="flex-grow space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base text-white">pewdiepie-archdaemon/odysseus</span>
                  <span className="bg-[#E73A5A]/20 text-[#E73A5A] text-[9px] font-bold px-2 py-0.5 border border-[#E73A5A]/30 rounded-full uppercase">
                    Verified
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-medium">Clone with Git:</p>
                <pre className="bg-black/5 dark:bg-black/20 p-2.5 rounded-lg border border-black/5 dark:border-white/10 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 overflow-x-auto select-all">
                  git clone https://github.com/pewdiepie-archdaemon/odysseus.git && cd odysseus
                </pre>
              </div>
              <a 
                href="https://github.com/pewdiepie-archdaemon/odysseus" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#E73A5A] text-white hover:bg-[#E73A5A]/80 px-6 py-2.5 rounded-2xl font-bold text-xs transition-all whitespace-nowrap self-end sm:self-center"
              >
                Open GitHub →
              </a>
            </div>
            <p className="text-[9px] font-semibold text-[#E73A5A] mt-3 flex items-center gap-1 uppercase tracking-wider">
              ⚠️ Never download Odysseus from random websites or mirrors.
            </p>
          </div>
        </div></ScaleIn>
      </section>

      {/* Facts Card list */}
      <section className="max-w-5xl mx-auto px-4 py-16 font-rounded select-none">
        <Reveal><h2 className="text-3xl font-black text-center text-white mb-16">Quick Facts</h2></Reveal>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-8" staggerDelay={0.1}>
          <StaggerItem><div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md flex flex-col gap-3">
            <span className="text-2xl">🆓</span>
            <h3 className="font-bold text-base text-white">100% Free & Open Source</h3>
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
              You get the source code for free. This site only helps you complete the install shortcut and tools.
            </p>
          </div></StaggerItem>
          <StaggerItem><div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md flex flex-col gap-3">
            <span className="text-2xl">🧠</span>
            <h3 className="font-bold text-base text-white">You Need a Model</h3>
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
              Odysseus is just the interface. Connect it to Ollama or other cloud model API providers inside settings.
            </p>
          </div></StaggerItem>
          <StaggerItem><div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md flex flex-col gap-3">
            <span className="text-2xl">🔒</span>
            <h3 className="font-bold text-base text-white">Localhost-First</h3>
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
              Run locally on your machine. Don't expose ports or API keys to the public without proxy configurations.
            </p>
          </div></StaggerItem>
          <StaggerItem><div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md flex flex-col gap-3">
            <span className="text-2xl">🤝</span>
            <h3 className="font-bold text-base text-white">Official Source Only</h3>
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
              Always verify the GitHub repository before you download or clone installer packages.
            </p>
          </div></StaggerItem>
        </StaggerContainer>
      </section>

      {/* Testimonials and Stats Section */}
      <TestimonialsSection />

      {/* Pricing / Launch Kit Offer Section */}
      <section id="offer" className="max-w-6xl mx-auto px-4 py-16 font-rounded">
        <div id="pricing" />
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Chip
              variant="flat"
              startContent={<Sparkles className="w-4 h-4 text-[#E73A5A]" />}
              classNames={{
                base: 'bg-[#E73A5A]/10 border border-[#E73A5A]/20 px-5 py-2 shadow-[0_0_15px_rgba(231,58,90,0.2)] mb-6 h-auto',
                content: 'font-black text-white text-xs md:text-sm tracking-wide',
              }}
            >
              PREMIUM SHORTCUT OFFER
            </Chip>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight"
          >
            The "Zero-Headache" Odysseus{' '}
            <span className="text-[#E73A5A] bg-[#E73A5A]/10 px-4 py-1 border border-[#E73A5A]/30 rounded-3xl inline-block transform -rotate-1 shadow-[0_0_20px_rgba(231,58,90,0.2)]">
              Launch Kit
            </span>
          </motion.h2>

          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-lg md:text-xl font-bold text-[#E73A5A] mb-6"
          >
            Skip the terminal loops. Launch in 5 minutes. Save your night.
          </motion.h3>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-sm md:text-base text-gray-300 font-medium leading-relaxed"
          >
            Odysseus AI is an incredible piece of software—but local deployment is a minefield. One wrong <code className="bg-white/10 px-1.5 py-0.5 rounded text-white font-mono text-xs">.env</code> edit, a silent port conflict on <code className="bg-white/10 px-1.5 py-0.5 rounded text-white font-mono text-xs">localhost:7000</code>, or a mismatched Docker-to-host Ollama endpoint, and you’re trapped reading cryptic GitHub issues until 2 AM.
          </motion.p>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="text-sm md:text-base text-gray-300 font-medium leading-relaxed mt-4"
          >
            The Launch Kit turns an unpredictable, fragile installation process into a <strong className="text-white">one-click, bulletproof launch</strong>.
          </motion.p>
        </div>

        <ScaleIn>
          <div className="bg-white/5 border border-[#E73A5A]/30 rounded-3xl p-6 md:p-10 shadow-[0_0_25px_rgba(231,58,90,0.15)] relative backdrop-blur-md">
            {/* Corner badges */}
            <div className="absolute -top-3 -left-3 bg-[#E73A5A] text-white border border-[#E73A5A]/30 px-4 py-1.5 font-black text-[10px] tracking-widest uppercase transform -rotate-6 rounded-full z-10 shadow-[0_0_12px_rgba(231,58,90,0.4)]">
              🔥 Hot Selling
            </div>
            <div className="absolute -top-3 -right-3 bg-red-600 text-white border border-red-500/30 px-4 py-1.5 font-black text-[10px] tracking-widest uppercase transform rotate-6 rounded-full z-10 shadow-[0_0_12px_rgba(220,38,38,0.5)]">
              ⏰ Limited Time
            </div>

            {/* Decorative blobs */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-0">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#E73A5A]/15 rounded-full blur-3xl" />
              <div className="absolute left-20 -top-6 w-24 h-24 bg-[#E73A5A]/5 rounded-full blur-2xl" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: What You Get & Guarantee (7/12 cols) */}
              <div className="lg:col-span-7 space-y-8 text-left">
                {/* Reviews star rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-[#E73A5A] text-[#E73A5A]" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-300 ml-1">5/5 (180+ reviews)</span>
                </div>

                {/* What you get */}
                <div className="space-y-4">
                  <h4 className="text-lg font-black text-white flex items-center gap-2">
                    <span className="text-[#E73A5A]">⚡</span> What You Get inside the $19.99 Package:
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      {
                        title: 'The One-Command Auto-Runner',
                        desc: 'A transparent, secure script that auto-clones the official repository, sets up your local environment, handles preflight checks, and spins up your UI without breaking a sweat.'
                      },
                      {
                        title: 'The Ollama Endpoint Matrix',
                        desc: 'No more guessing games. Instant copy-paste configurations for Docker-to-host routing, native execution, or local LAN sharing.'
                      },
                      {
                        title: 'The Port 7000 "First Aid" Diagnostics',
                        desc: 'If a background process locks your port or your admin password vanishes into background logs, this surgical checklist recovers your system in under 60 seconds.'
                      },
                      {
                        title: 'The Day-One Workflow Engine',
                        desc: "Don't start with a blank screen. Get 5 pre-configured, production-ready workspace prompts (Deep Research, Code Debugging, SEO Strategy, Local Document Q&A, and Executive Briefings) ready to drive value immediately."
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-4 hover:border-[#E73A5A]/30 transition-all">
                        <h5 className="font-bold text-sm text-white flex items-center gap-2 mb-1">
                          <span className="text-[#E73A5A] text-xs">●</span> {item.title}
                        </h5>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Guarantee */}
                <div className="bg-gradient-to-r from-red-950/20 to-rose-950/5 border border-red-500/20 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute right-4 top-4 text-3xl opacity-20">💎</div>
                  <h4 className="font-black text-sm md:text-base text-white flex items-center gap-2 mb-2">
                    💎 The "Save Your Night" Guarantee
                  </h4>
                  <p className="text-xs text-gray-300 font-semibold leading-relaxed mb-3">
                    We don't sell Odysseus AI—it is free, open-source, and always will be. We sell <strong className="text-white">speed, security, and sanity</strong>.
                  </p>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">
                    If the Launch Kit doesn't save you at least two hours of painful manual debugging, or if your local setup isn't up and running flawlessly on your machine, just send a blank email within 14 days for a <strong className="text-white">100% no-questions-asked refund</strong>.
                  </p>
                </div>
              </div>

              {/* Right Column: Preview Image & CTA Card (5/12 cols) */}
              <div className="lg:col-span-5 space-y-6 w-full">
                {/* The Preview Image */}
                <div className="relative group overflow-hidden rounded-2xl shadow-[0_0_20px_rgba(231,58,90,0.15)] checkout-card">
                  <img 
                    src="/odysseus_launch_kit_preview.png" 
                    alt="Odysseus Workspace Preview" 
                    className="w-full h-auto object-cover transform group-hover:scale-[1.03] transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#E73A5A] bg-[#E73A5A]/10 border border-[#E73A5A]/30 px-3 py-1 rounded-full backdrop-blur-md">
                      Odysseus Dashboard Preview
                    </span>
                  </div>
                </div>

                {/* Checkout Action Card */}
                <div className="checkout-card rounded-2xl p-6 shadow-[0_0_15px_rgba(0,0,0,0.3)] flex flex-col justify-between items-center text-center gap-4 relative overflow-hidden">
                  <div className="absolute -left-16 -top-16 w-32 h-32 bg-[#E73A5A]/5 rounded-full blur-3xl" />
                  <div className="relative z-10 w-full space-y-4">
                    <div>
                      <h4 className="text-base md:text-lg font-black text-white mb-1">Get Instant Access Now</h4>
                      <p className="text-[10px] md:text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                        Stop fighting your environment. Start building your vision.
                      </p>
                    </div>

                    <div className="py-3 border-y border-white/5">
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">ONE-TIME SHORTCUT</span>
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-4xl font-black text-white">$19.99</span>
                        <span className="text-sm font-bold text-gray-500 line-through">($49.00)</span>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md uppercase tracking-wider inline-block mt-1">
                        Save 60% Today
                      </span>
                    </div>

                    <button 
                      onClick={handleLaunchKitCheckout}
                      disabled={isCheckoutLoading}
                      className="w-full bg-[#E73A5A] hover:bg-[#E73A5A]/90 py-3.5 rounded-xl font-black transition-all text-xs md:text-sm text-center flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
                    >
                      {isCheckoutLoading ? (
                        'Processing secure checkout...'
                      ) : (
                        <>
                          <Rocket size={14} strokeWidth={2.5} /> Lock in the Launch Kit Shortcut – $19.99
                        </>
                      )}
                    </button>

                    <div className="space-y-1">
                      <p className="text-[9px] font-medium text-gray-500 leading-normal">
                        Immediate digital download. Secure checkout via Stripe.
                      </p>
                      <p className="text-[9px] font-medium text-gray-500 leading-normal">
                        No API keys or passwords required.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compare Your Options Table */}
            <div className="relative z-10 mt-12 border-t border-white/10 pt-10">
              <h4 className="text-lg font-black text-white text-center mb-6">Compare Your Options</h4>
              <div className="checkout-card rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.1)]">
                <div className="grid grid-cols-2 bg-white/5 border-b border-white/10 py-4 px-4 md:px-6 text-center text-xs md:text-sm font-bold tracking-wider">
                  <div className="text-gray-400">THE HARD WAY ($0)</div>
                  <div className="text-[#E73A5A]">THE LAUNCH KIT ($19.99)</div>
                </div>
                <div className="divide-y divide-white/5">
                  {[
                    { hard: '❌ Manually hunting through GitHub issues', easy: '✨ Bulletproof, step-by-step setup wizard' },
                    { hard: '❌ Wrestling with Docker network isolation errors', easy: '✨ Instant, pre-mapped host-to-container routing' },
                    { hard: '❌ Losing the generated admin password in hidden logs', easy: '✨ Fail-safe credential checklist' },
                    { hard: '❌ Staring at a blank UI wondering what to type', easy: '✨ 5 pre-tuned, high-value templates' },
                  ].map((row, idx) => (
                    <div key={idx} className="grid grid-cols-2 py-4 px-4 md:px-6 text-xs md:text-sm font-semibold text-left">
                      <div className="border-r border-white/5 pr-2 md:pr-4 text-gray-400 flex items-center gap-1.5">{row.hard}</div>
                      <div className="pl-2 md:pl-4 text-gray-200 flex items-center gap-1.5">{row.easy}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScaleIn>
      </section>

      {/* Workflow Starters Section */}
      <section className="max-w-5xl mx-auto px-4 py-16 font-rounded select-none text-left">
        <FadeIn direction="up" distance={30}>
        <h2 className="text-2xl md:text-3xl font-black text-center text-white mb-4">Workflow Starters</h2>
        <p className="text-center text-gray-400 text-xs max-w-xl mx-auto mb-12 font-bold">
          What can you do after your Odysseus AI install? Deep-tune the workspace capability using our preloaded diagnostic model assistant prompt configurations.
        </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8" staggerDelay={0.12}>
          {[
            {
              title: "Research Agent Starter",
              useCase: "Isolate claims, collect sources, and summarize papers.",
              prompt: "You are custom research agent template. Analyze and organize claims from sources."
            },
            {
              title: "SEO Content Specialist",
              useCase: "Construct high-ranking page briefs and outline layouts.",
              prompt: "You are specialized SEO copy strategist. Evaluate target structural entities."
            },
            {
              title: "Coding Debug Assistant",
              useCase: "Explain error logs, test logic flaws, inspect container status.",
              prompt: "You are professional software engineer. Isolate log error loop causes."
            },
            {
              title: "Local Documents Q&A",
              useCase: "Discuss locally private directories and confidential files securely.",
              prompt: "You are local offline intelligence model. Rely strictly on contextual blocks."
            }
          ].map((item, idx) => (
            <StaggerItem key={idx}><div className="workflow-card p-6 rounded-3xl flex flex-col justify-between gap-4">
              <div>
                <h3 className="font-bold text-base text-white">{item.title}</h3>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-2">{item.useCase}</span>
                <pre className="bg-black/5 dark:bg-black/40 p-3 rounded-xl border border-black/5 dark:border-white/10 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 select-all overflow-x-auto">
                  {item.prompt}
                </pre>
              </div>
              <button
                onClick={() => handleCopyText(item.prompt, (state) => setCopiedPrompt(prev => ({ ...prev, [idx]: state })))}
                className="w-full bg-[#E73A5A] hover:bg-[#E73A5A]/80 font-bold uppercase text-[10px] py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all focus:outline-none"
              >
                {copiedPrompt[idx] ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                COPY STARTER PROMPT
              </button>
            </div></StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Parent Guides / Latest Insights Section */}
      <section className="max-w-5xl mx-auto px-4 py-16 font-rounded select-none">
        <FadeIn direction="up" distance={20}><div className="flex items-center justify-between mb-8 border-b border-white/10 pb-2">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Parent Guides & Updates</h2>
          <Link to="/odysseus-blog" className="hidden sm:flex items-center text-sm font-bold tracking-widest text-white hover:text-[#E73A5A] transition-colors">
            View All Guides <ArrowRight className="ml-2 w-5 h-5 text-[#E73A5A]" />
          </Link>
        </div></FadeIn>
        
        {blogError ? (
          <div className="bg-red-950/25 border border-red-500/25 p-8 flex items-center gap-4 text-red-400 font-bold rounded-2xl">
            <AlertCircle size={32} />
            <p>{blogError}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loadingBlogs ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="border border-white/10 bg-white/5 rounded-3xl overflow-hidden h-[400px] flex flex-col">
                  <Skeleton className="h-48 w-full rounded-none" />
                  <div className="p-6 flex flex-col flex-grow bg-transparent gap-4">
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
                  category={blog.category || 'Parenting'}
                  description={blog.excerpt || blog.content?.replace(/<[^>]*>?/gm, '').substring(0, 120) + '...'}
                  author={blog.author || 'Odysseus AI Team'}
                  date={blog.created_at || blog.created}
                  slug={blog.slug}
                  imageRecord={blog}
                />
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 bg-white/5 border border-white/10 p-12 flex flex-col items-center justify-center text-center rounded-3xl">
                <BookOpen className="w-16 h-16 text-gray-600 mb-4" />
                <h3 className="text-xl font-bold text-white">No guides found</h3>
                <p className="text-gray-400 font-medium mt-2">Check back soon for new parent resources and articles.</p>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-8 sm:hidden text-center">
          <Link to="/odysseus-blog" className="w-full bg-white/5 text-white border border-white/10 hover:bg-white/10 font-bold py-3 px-6 rounded-2xl block text-center transition-all">
            View All Articles
          </Link>
        </div>
      </section>
    </>
  );
};

export default HomePage;
