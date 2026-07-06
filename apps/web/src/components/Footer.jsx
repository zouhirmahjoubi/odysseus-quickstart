import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, ExternalLink, Heart, Shield, Zap } from 'lucide-react';
import { Chip } from '@heroui/react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#080808] relative overflow-hidden" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.07)' }}>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">

        {/* Top row: Brand + tagline + badges */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 mb-10 md:mb-14 items-start">

          {/* Brand block */}
          <div className="flex-shrink-0 max-w-xs">
            {/* Logo text */}
            <div className="inline-flex items-center mb-4 select-none font-bold text-2xl uppercase tracking-wider">
              <span className="text-white">ODYSSEUSAI</span>
              <span className="text-[#E73A5A]">.AI</span>
            </div>
            <p className="text-sm text-gray-400 font-medium leading-relaxed mb-6">
              The safest, fastest and most beginner-friendly way to install Odysseus AI on your machine. 100% private, zero data tracking.
            </p>
            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              <Chip
                variant="flat"
                startContent={<Shield size={10} className="text-[#E73A5A]" />}
                classNames={{
                  base: 'bg-white/5 border border-white/10 px-3 py-1.5 rounded-full h-auto',
                  content: 'text-[10px] font-bold uppercase tracking-wider text-white/80',
                }}
              >
                Open Source Guides
              </Chip>
              <Chip
                variant="flat"
                startContent={<Zap size={10} className="text-[#E73A5A]" />}
                classNames={{
                  base: 'bg-white/5 border border-white/10 px-3 py-1.5 rounded-full h-auto',
                  content: 'text-[10px] font-bold uppercase tracking-wider text-white/80',
                }}
              >
                Free Forever
              </Chip>
              <Chip
                variant="flat"
                startContent={<Heart size={10} className="text-[#E73A5A]" />}
                classNames={{
                  base: 'bg-white/5 border border-white/10 px-3 py-1.5 rounded-full h-auto',
                  content: 'text-[10px] font-bold uppercase tracking-wider text-white/80',
                }}
              >
                Open Source
              </Chip>
            </div>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 flex-1">

            {/* Install Paths */}
            <div>
              <Chip
                variant="flat"
                classNames={{
                  base: 'bg-[#E73A5A]/10 border border-[#E73A5A]/25 px-3 py-1.5 shadow-[0_0_10px_rgba(231,58,90,0.15)] mb-4 h-auto rounded-full',
                  content: 'font-black text-white text-[10px] tracking-widest uppercase',
                }}
              >
                Install Paths
              </Chip>
              <ul className="space-y-3">
                {[
                  { to: '/odysseus-ai-install', label: 'Install Hub' },
                  { to: '/odysseus-install/docker', label: 'Docker Setup' },
                  { to: '/odysseus-install/ollama', label: 'Ollama Resolver' },
                  { to: '/odysseus-install/windows', label: 'Windows Native' },
                  { to: '/odysseus-install/macbook', label: 'macOS Native' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-xs font-bold text-gray-400 hover:text-[#E73A5A] transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#E73A5A] transition-colors flex-shrink-0" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Troubleshooting */}
            <div>
              <Chip
                variant="flat"
                classNames={{
                  base: 'bg-[#E73A5A]/10 border border-[#E73A5A]/25 px-3 py-1.5 shadow-[0_0_10px_rgba(231,58,90,0.15)] mb-4 h-auto rounded-full',
                  content: 'font-black text-white text-[10px] tracking-widest uppercase',
                }}
              >
                Troubleshoot
              </Chip>
              <ul className="space-y-3">
                {[
                  { to: '/odysseus-fix', label: 'Error Doctor' },
                  { to: '/odysseus-triage-wizard', label: 'Triage Wizard' },
                  { to: '/odysseus-resources', label: 'Resources' },
                  { to: '/odysseus-blog', label: 'Guides & Tutorials' },
                  { to: '/odysseus-llm-directory', label: 'LLM Directory' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-xs font-bold text-gray-400 hover:text-[#E73A5A] transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#E73A5A] transition-colors flex-shrink-0" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <Chip
                variant="flat"
                classNames={{
                  base: 'bg-[#E73A5A]/10 border border-[#E73A5A]/25 px-3 py-1.5 shadow-[0_0_10px_rgba(231,58,90,0.15)] mb-4 h-auto rounded-full',
                  content: 'font-black text-white text-[10px] tracking-widest uppercase',
                }}
              >
                Company
              </Chip>
              <ul className="space-y-3">
                {[
                  { to: '/odysseus-about', label: 'About Us' },
                  { to: '/odysseus-contact', label: 'Contact' },
                  { to: '/odysseus-Launch-Kit', label: 'Marketplace' },
                  { to: '/odysseus-purchase-pro-license', label: 'Pro License' },
                  { to: '/odysseus-privacy', label: 'Privacy Policy' },
                  { to: '/odysseus-terms', label: 'Terms of Service' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-xs font-bold text-gray-400 hover:text-[#E73A5A] transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#E73A5A] transition-colors flex-shrink-0" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          <div className="flex flex-col text-center sm:text-left gap-2 max-w-xl">
            <p className="text-[10px] md:text-[11px] font-semibold text-gray-500 select-none">
              © {year} OdysseusAI.ai. The Odysseus AI project is open-source under the MIT License; the Launch Kit is a separate paid product.
            </p>
            <p className="text-[9px] md:text-[10px] font-semibold text-gray-500 leading-relaxed">
              Disclaimer: OdysseusAI.ai is an independent resource for installing the open-source Odysseus AI project. This site is not affiliated with, sponsored by, or endorsed by the project's creators, and the \"Launch Kit\" is a paid product created and sold by us, not the official Odysseus team.
            </p>
          </div>

          {/* Right side: Domain + links */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-[10px] font-bold text-white/80 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
              odysseusai.ai
            </span>
            <a
              href="https://github.com/pewdiepie-archdaemon/odysseus"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-[#E73A5A]/20 hover:border-[#E73A5A] transition-all group"
              title="GitHub Repository"
            >
              <Github size={14} className="text-gray-400 group-hover:text-[#E73A5A] transition-colors" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
