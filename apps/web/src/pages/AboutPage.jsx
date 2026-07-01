import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, Tab, Tooltip } from '@heroui/react';
import { 
  ShieldAlert, Mail, BookOpen, Layers, CheckCircle2, 
  Compass, ShieldCheck 
} from 'lucide-react';

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState("all");

  const coreSections = [
    {
      id: "why",
      title: "Why we built this",
      icon: <Compass className="h-6 w-6 text-[#00F0FF]" />,
      desc: "Most setup failures are not caused by one big mistake. They come from small mismatches: the wrong endpoint, a port already in use, a Docker volume that still has old state, an admin login that was never saved, or an Ollama route that looks right but is not reachable. This site turns those fuzzy setup problems into clearer decisions: which route to choose first, what command to run, what to check before changing more settings, and when a local security boundary matters.",
      bgColor: "bg-white/5",
      borderColor: "border-white/10"
    },
    {
      id: "independent",
      title: "Independent, not official",
      icon: <ShieldCheck className="h-6 w-6 text-[#38BDF8]" />,
      desc: "OdysseusAI.ai is independent and unofficial. We do not own Odysseus AI, we do not speak for its maintainers, and we do not want you to trust this site instead of the official source. The official pewdiepie-archdaemon/odysseus repository should remain your source of truth. Our role is to explain the setup path around that source more clearly, especially for people who are new to local AI tooling.",
      bgColor: "bg-white/5",
      borderColor: "border-white/10"
    },
    {
      id: "philosophy",
      title: "How we write guidance",
      icon: <BookOpen className="h-6 w-6 text-[#34D399]" />,
      desc: "We prefer visible commands, plain-language tradeoffs, and localhost-first explanations. If a setup choice can expose credentials, private files, model endpoints, or logs, the page should slow down and explain the risk. We also avoid pretending that one command works for every machine. Windows, macOS, Docker Desktop, native Ollama, and API-backed routes have different failure modes, and trust starts with saying that clearly.",
      bgColor: "bg-white/5",
      borderColor: "border-white/10"
    },
    {
      id: "kit",
      title: "Free guides & Launch Kit",
      icon: <Layers className="h-6 w-6 text-[#A855F7]" />,
      desc: "The free pages are written as self-serve setup guides. They should help you make better decisions before you run commands, but they do not include one-to-one troubleshooting for every local machine. The paid Launch Kit is for users who want the shortcut: organized setup files, checklists, templates, repair paths, workflow starters, and support for paid-kit issues, purchase questions, download problems, and refund requests.",
      bgColor: "bg-white/5",
      borderColor: "border-white/10"
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 font-rounded text-white select-none">
      <Helmet>
        <title>About Us | Odysseus AI</title>
        <meta name="description" content="Learn about OdysseusAI.ai. Why we build local-first installation blueprints, how we write guidance, and our paid support boundaries." />
      </Helmet>

      <div className="max-w-4xl mx-auto pt-2">
        
        {/* Header */}
        <div className="mb-12">
          <Link to="/" className="inline-block text-xs font-black uppercase tracking-widest text-[#00F0FF] hover:opacity-85 transition-opacity duration-200 hover:scale-105 transform origin-left">
            ← OdysseusAI.ai
          </Link>
          <p className="mt-8 text-xs font-black uppercase tracking-widest text-gray-500">
            About
          </p>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-3 text-4xl md:text-6xl font-black uppercase tracking-tight text-white leading-none"
          >
            About <span className="underline decoration-wavy decoration-[#00F0FF]">OdysseusAI.ai</span>
          </motion.h1>
          <p className="mt-6 text-base md:text-lg font-semibold leading-relaxed text-gray-400 border-l-4 border-[#00F0FF] pl-4">
            OdysseusAI.ai is built for people who want to run Odysseus AI locally without turning setup into a long night of Docker, Ollama, ports, passwords, and conflicting advice.
          </p>
        </div>

        {/* Categories Banner */}
        <div className="grid gap-4 sm:grid-cols-3 mb-12">
          <div className="flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-3 rounded-[16px] text-xs font-black uppercase tracking-wider text-white backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-200">
            <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0" />
            Independent & Unofficial
          </div>
          <div className="flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-3 rounded-[16px] text-xs font-black uppercase tracking-wider text-white backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-200">
            <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0" />
            Launch Kit Support
          </div>
          <div className="flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-3 rounded-[16px] text-xs font-black uppercase tracking-wider text-white backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-200">
            <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0" />
            Zero Raw Credentials
          </div>
        </div>

        {/* Paid Support Boundary Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="border border-white/10 bg-white/5 p-6 md:p-8 mb-12 rounded-[24px] backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
        >
          {/* Subtle warning stripes pattern inside card for that tech theme */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,#00F0FF_25%,transparent_25%,transparent_50%,#00F0FF_50%,#00F0FF_75%,transparent_75%,transparent)] bg-[length:24px_24px] opacity-[0.02] pointer-events-none" />

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between relative z-10">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#00F0FF]">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00F0FF]"></span>
                </span>
                <ShieldAlert className="h-5 w-5 shrink-0" />
                Paid support boundary
              </div>
              <p className="text-sm font-bold leading-relaxed text-gray-400">
                admin@odysseusai.ai is for paid Launch Kit customers, purchase and download issues, refund questions, privacy requests, and clear public-page corrections. Free install pages are self-serve, and we will not ask for API keys, passwords, full .env files, or private logs.
              </p>
            </div>
            
            <Tooltip content="Reach out to support - Responses in 24 hours" placement="top" color="warning" closeDelay={100} offset={10}>
              <a 
                href="mailto:admin@odysseusai.ai" 
                className="inline-flex shrink-0 items-center justify-center gap-2 bg-[#00F0FF] text-black rounded-full px-6 py-3.5 text-xs font-black uppercase tracking-widest transition-all hover:bg-[#00F0FF]/85 hover:-translate-y-0.5 active:translate-y-0.5"
              >
                <Mail className="h-4 w-4 animate-bounce" />
                Paid support email
              </a>
            </Tooltip>
          </div>
        </motion.div>

        {/* Section Tabs Switcher */}
        <div className="mb-8 flex justify-center">
          <Tabs 
            aria-label="Core Philosophy Sections"
            color="primary"
            variant="solid"
            selectedKey={activeTab}
            onSelectionChange={setActiveTab}
            classNames={{
              tabList: "border border-white/10 rounded-[16px] p-1 bg-white/5 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.2)]",
              cursor: "rounded-[12px] bg-[#00F0FF]",
              tab: "font-black text-xs uppercase tracking-wider text-gray-400 px-4 hover:text-white",
              tabContent: "group-data-[selected=true]:text-black font-black"
            }}
          >
            <Tab key="all" title="View All" />
            <Tab key="why" title="Why" />
            <Tab key="independent" title="Independent" />
            <Tab key="philosophy" title="Guidance" />
            <Tab key="kit" title="Launch Kit" />
          </Tabs>
        </div>

        {/* Core Content Grid */}
        <div className="relative min-h-[300px]">
          <div className="grid gap-6 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {coreSections
                .filter(section => activeTab === "all" || section.id === activeTab)
                .map((section, idx) => (
                  <motion.div
                    key={section.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className={`border ${section.borderColor} ${section.bgColor} p-6 rounded-[20px] shadow-[0_0_20px_rgba(0,0,0,0.3)] backdrop-blur-md hover:-translate-x-1.5 hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden`}
                  >
                    {/* Visual accent background stripe */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-white/5 rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                    
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 border border-white/10 bg-black/25 rounded-[12px] shadow-[0_0_10px_rgba(0,0,0,0.2)] group-hover:rotate-6 transition-transform duration-300">
                        {section.icon}
                      </div>
                      <h3 className="text-xl font-black uppercase tracking-tight text-white">
                        {section.title}
                      </h3>
                    </div>
                    <p className="text-sm font-semibold leading-relaxed text-gray-400">
                      {section.desc}
                    </p>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Support Info */}
        <div className="relative mt-16 border-t border-white/10 pt-8 mb-12">
          <a 
            href="mailto:admin@odysseusai.ai" 
            className="inline-flex items-center gap-2 text-base font-black text-[#00F0FF] hover:opacity-85 transition-colors duration-200"
          >
            <Mail className="h-5 w-5 shrink-0" />
            admin@odysseusai.ai
          </a>
          <p className="mt-3 text-xs font-semibold leading-relaxed text-gray-500 max-w-2xl">
            If you are a paid Launch Kit customer, include your order email, Gumroad receipt context, and the specific kit file or step involved. For public-page corrections, include the page URL and section. Keep keys, passwords, private paths, and unredacted logs out of the email.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
