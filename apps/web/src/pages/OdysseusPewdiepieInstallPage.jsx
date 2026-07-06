import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, ShieldCheck, CheckCircle2, Play, Cpu, AlertTriangle, 
  Sparkles, Rocket, ArrowRight, Mail, HelpCircle, Terminal, FileCode 
} from 'lucide-react';
import { toast } from 'sonner';
import { Chip, Card, CardHeader, CardBody, Tooltip } from '@heroui/react';
import apiServerClient from '@/lib/apiServerClient';
import { FadeIn, ScaleIn, Reveal } from '@/components/ScrollAnimations.jsx';

export const metadata = {
  title: 'Odysseus AI PewDiePie Installation | Launch in 5 Minutes',
  description: "Deploy PewDiePie's Odysseus AI local workspace in 5 minutes. Get the One-Command Auto-Runner script, Ollama host loopbacks, and Day-One Prompt workflows.",
  keywords: "Odysseus AI, PewDiePie, local LLM, installation, Docker, Ollama, AI workspace, Launch Kit, local deployment",
};

const OdysseusPewdiepieInstallPage = () => {
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const handleLaunchKitCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      const response = await apiServerClient.fetch('/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 19.99,
          productName: 'Odysseus AI Zero-Headache Launch Kit',
          successUrl: window.location.origin + '/odysseus-success?session_id={CHECKOUT_SESSION_ID}',
          cancelUrl: window.location.origin + '/odysseus-cancel',
        }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || 'Checkout failed');
      }
      const data = await response.json();
      if (data.url) {
        window.open(data.url, '_blank');
        toast.success('Redirecting to secure Stripe checkout... 💳');
      } else {
        throw new Error('No checkout url returned');
      }
    } catch (error) {
      console.error(error);
      toast.error(`Checkout error: ${error.message}`);
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 font-rounded text-white select-none relative overflow-hidden">
      <Helmet>
        <title>Odysseus AI PewDiePie Installation | Launch in 5 Minutes</title>
        <meta name="description" content="Deploy PewDiePie's Odysseus AI local workspace in 5 minutes. Get the One-Command Auto-Runner script, Ollama host loopbacks, and Day-One Prompt workflows." />
        <meta name="keywords" content="Odysseus AI, PewDiePie, local LLM, installation, Docker, Ollama, AI workspace, Launch Kit, local deployment" />
        <link rel="canonical" href="https://odysseusai.tech/install-odysseus-pewdiepie" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Odysseus AI PewDiePie Installation | Launch in 5 Minutes" />
        <meta property="og:description" content="Deploy PewDiePie's Odysseus AI local workspace in 5 minutes. Get the One-Command Auto-Runner script, Ollama host loopbacks, and Day-One Prompt workflows." />
        <meta property="og:url" content="https://odysseusai.tech/install-odysseus-pewdiepie" />
        <meta property="og:image" content="https://odysseusai.tech/odysseus_launch_kit_preview.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Odysseus AI PewDiePie Installation | Launch in 5 Minutes" />
        <meta name="twitter:description" content="Deploy PewDiePie's Odysseus AI local workspace in 5 minutes. Get the One-Command Auto-Runner script, Ollama host loopbacks, and Day-One Prompt workflows." />
        <meta name="twitter:image" content="https://odysseusai.tech/odysseus_launch_kit_preview.png" />
      </Helmet>

      {/* Background Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00F0FF]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#E73A5A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto pt-6 relative z-10">
        
        {/* Breadcrumb & Chip */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-block text-xs font-black uppercase tracking-widest text-[#00F0FF] hover:opacity-85 transition-opacity mb-6 hover:scale-105 transform origin-center">
            ← OdysseusAI.ai
          </Link>
          <div>
            <Chip
              variant="flat"
              startContent={<Sparkles className="w-4 h-4 text-[#00F0FF]" />}
              classNames={{
                base: 'bg-[#00F0FF]/10 border border-[#00F0FF]/20 px-5 py-2 shadow-[0_0_15px_rgba(0,240,255,0.2)] mb-6 h-auto',
                content: 'font-black text-white text-xs md:text-sm tracking-wide',
              }}
            >
              PREMIUM INSTALLATION BLUEPRINT
            </Chip>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tight uppercase mb-4">
            The "Zero-Headache" Odysseus <span className="underline decoration-wavy decoration-[#00F0FF]">Launch Kit</span>
          </h1>
          <h2 className="text-lg md:text-xl font-bold text-[#00F0FF] mb-6">
            Skip the terminal loops. Launch in 5 minutes. Save your night.
          </h2>
          <div className="flex justify-center items-center gap-3 mb-8">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-black uppercase text-[10px] tracking-widest px-3 py-1 inline-block">
              100% Offline Compatible
            </span>
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded font-black uppercase text-[10px] tracking-widest px-3 py-1 inline-block">
              Self-Hosted Setup
            </span>
          </div>
          
          <p className="text-sm md:text-base text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed mb-6">
            Odysseus AI is an incredible piece of software—but local deployment is a minefield. One wrong <code>.env</code> edit, a silent port conflict on <code>localhost:7000</code>, or a mismatched Docker-to-host Ollama endpoint, and you’re trapped reading cryptic GitHub issues until 2 AM.
          </p>
          <p className="text-sm md:text-base text-gray-300 max-w-3xl mx-auto font-bold leading-relaxed">
            The Launch Kit turns an unpredictable, fragile installation process into a <span className="text-white border-b-2 border-[#00F0FF]">one-click, bulletproof launch</span>.
          </p>
        </div>

        {/* Feature breakdown with more details */}
        <div className="grid gap-6 md:grid-cols-2 mb-16">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-black/45 border border-[#00F0FF]/30 rounded-2xl flex items-center justify-center mb-4 text-[#00F0FF]">
              <Play className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-black uppercase text-white mb-2">1. The One-Command Auto-Runner</h3>
            <p className="text-sm text-gray-400 font-semibold leading-relaxed mb-4">
              A transparent, secure script that auto-clones the official repository, sets up your local environment, handles preflight checks, and spins up your UI without breaking a sweat.
            </p>
            <div className="border-t border-white/5 pt-4">
              <h4 className="text-xs font-black text-[#00F0FF] uppercase tracking-wider mb-2">Technical Details:</h4>
              <ul className="space-y-1.5 text-xs text-gray-400 font-medium">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 mt-0.5" />
                  Checks local system dependencies (Node.js, Docker, Git) automatically.
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 mt-0.5" />
                  Resolves node modules caching and locks correct package coordinates.
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 mt-0.5" />
                  Launches a double-clickable shortcut file to start your UI instantly.
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-black/45 border border-[#00F0FF]/30 rounded-2xl flex items-center justify-center mb-4 text-[#00F0FF]">
              <Cpu className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-black uppercase text-white mb-2">2. The Ollama Endpoint Matrix</h3>
            <p className="text-sm text-gray-400 font-semibold leading-relaxed mb-4">
              No more guessing games. Instant copy-paste configurations for Docker-to-host routing, native execution, or local LAN sharing.
            </p>
            <div className="border-t border-white/5 pt-4">
              <h4 className="text-xs font-black text-[#00F0FF] uppercase tracking-wider mb-2">Technical Details:</h4>
              <ul className="space-y-1.5 text-xs text-gray-400 font-medium">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 mt-0.5" />
                  Docker bridge coordinates mapping (<code>host.docker.internal</code> resolver).
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 mt-0.5" />
                  Local network server settings (host bind parameters <code>0.0.0.0</code>).
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 mt-0.5" />
                  CORS headers configurations to allow secure connection origins.
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-black/45 border border-[#00F0FF]/30 rounded-2xl flex items-center justify-center mb-4 text-[#00F0FF]">
              <Terminal className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-black uppercase text-white mb-2">3. Port 7000 "First Aid" Diagnostics</h3>
            <p className="text-sm text-gray-400 font-semibold leading-relaxed mb-6">
              If a background process locks your port or your admin password vanishes into background logs, this surgical checklist recovers your system in under 60 seconds.
            </p>
            <div className="border-t border-white/5 pt-4">
              <h4 className="text-xs font-black text-[#00F0FF] uppercase tracking-wider mb-2">Technical Details:</h4>
              <ul className="space-y-1.5 text-xs text-gray-400 font-medium">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 mt-0.5" />
                  Windows PowerShell command helper to find and terminate port 7000 listeners.
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 mt-0.5" />
                  MacOS Terminal commands to free up stuck sockets instantly.
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 mt-0.5" />
                  Clean SQLite DB migrations check to recover your local admin password.
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-black/45 border border-[#00F0FF]/30 rounded-2xl flex items-center justify-center mb-4 text-[#00F0FF]">
              <FileCode className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-black uppercase text-white mb-2">4. The Day-One Workflow Engine</h3>
            <p className="text-sm text-gray-400 font-semibold leading-relaxed mb-6">
              Don't start with a blank screen. Get 5 pre-configured, production-ready workspace prompts ready to drive value immediately.
            </p>
            <div className="border-t border-white/5 pt-4">
              <h4 className="text-xs font-black text-[#00F0FF] uppercase tracking-wider mb-2">Workflow Prompt Templates:</h4>
              <ul className="space-y-1.5 text-xs text-gray-400 font-medium">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 mt-0.5" />
                  <strong>Deep Research</strong>: Optimized prompt parameters to analyze dense PDF files.
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 mt-0.5" />
                  <strong>Code Debugging</strong>: Formats stack traces for fast error resolutions.
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 mt-0.5" />
                  <strong>SEO Strategy</strong>: Audits metadata markup structures.
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 mt-0.5" />
                  <strong>Local Document Q&A & Executive Briefings</strong>: Cuts down video/audio summarization time.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-black text-center text-white mb-8 uppercase">
            Compare Your Options
          </h3>
          <div className="border border-white/10 rounded-3xl overflow-hidden bg-white/5 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.3)]">
            <div className="grid grid-cols-2 border-b border-white/10 text-center select-none">
              <div className="p-4 md:p-6 bg-white/5 font-black uppercase text-xs md:text-sm text-gray-400">
                The Hard Way ($0)
              </div>
              <div className="p-4 md:p-6 bg-[#00F0FF]/15 border-l border-white/10 font-black uppercase text-xs md:text-sm text-[#00F0FF] shadow-[inset_0_0_15px_rgba(0,240,255,0.1)]">
                The Launch Kit ($19.99)
              </div>
            </div>
            
            <div className="divide-y divide-white/5">
              {[
                { hard: '❌ Manually hunting through GitHub issues', easy: '✨ Bulletproof, step-by-step setup wizard' },
                { hard: '❌ Wrestling with Docker network isolation errors', easy: '✨ Instant, pre-mapped host-to-container routing' },
                { hard: '❌ Losing the generated admin password in hidden logs', easy: '✨ Fail-safe credential checklist' },
                { hard: '❌ Staring at a blank UI wondering what to type', easy: '✨ 5 pre-tuned, high-value templates' }
              ].map((row, idx) => (
                <div key={idx} className="grid grid-cols-2 text-center text-xs md:text-sm font-semibold leading-relaxed">
                  <div className="p-4 md:p-6 text-gray-500">{row.hard}</div>
                  <div className="p-4 md:p-6 text-white bg-[#00F0FF]/5 border-l border-white/10">{row.easy}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Double badge layout: Hot Selling & Limited Time Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch mb-16">
          
          {/* Left: Guarantee */}
          <div className="md:col-span-7 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.3)] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,#00F0FF_25%,transparent_25%,transparent_50%,#00F0FF_50%,#00F0FF_75%,transparent_75%,transparent)] bg-[length:24px_24px] opacity-[0.015] pointer-events-none" />
            <div className="absolute right-6 top-6 text-4xl opacity-15">💎</div>
            <div className="relative z-10 space-y-4">
              <h3 className="text-xl font-black uppercase text-white flex items-center gap-2">
                💎 The "Save Your Night" Guarantee
              </h3>
              <p className="text-sm text-gray-400 font-semibold leading-relaxed">
                We don't sell Odysseus AI—it is free, open-source, and always will be. We sell <strong className="text-white">speed, security, and sanity</strong>.
              </p>
              <p className="text-sm text-gray-300 font-medium leading-relaxed">
                If the Launch Kit doesn't save you at least two hours of painful manual debugging, or if your local setup isn't up and running flawlessly on your machine, just send a blank email within 14 days for a <strong className="text-[#00F0FF]">100% no-questions-asked refund</strong>.
              </p>
            </div>
          </div>

          {/* Right: Preview Image */}
          <div className="md:col-span-5 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.3)] flex flex-col justify-center">
            <div className="relative group overflow-hidden rounded-2xl shadow-[0_0_20px_rgba(0,240,255,0.15)] checkout-card">
              <img 
                src="/odysseus_launch_kit_preview.png" 
                alt="Odysseus Workspace Preview" 
                className="w-full h-auto object-cover transform group-hover:scale-[1.03] transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/30 px-3 py-1 rounded-full backdrop-blur-md">
                  Odysseus Dashboard Preview
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Lock in the shortcut CTA Card */}
        <div className="bg-white/5 border border-[#00F0FF]/30 rounded-3xl p-8 md:p-12 text-center select-none backdrop-blur-md shadow-[0_0_25px_rgba(0,240,255,0.15)] relative">
          
          {/* Corner badges */}
          <div className="absolute -top-3 -left-3 bg-[#00F0FF] text-black border border-[#00F0FF]/30 px-4 py-1.5 font-black text-[10px] tracking-widest uppercase transform -rotate-6 rounded-full z-10 shadow-[0_0_12px_rgba(0,240,255,0.4)]">
            🔥 Hot Selling
          </div>
          <div className="absolute -top-3 -right-3 bg-red-600 text-white border border-red-500/30 px-4 py-1.5 font-black text-[10px] tracking-widest uppercase transform rotate-6 rounded-full z-10 shadow-[0_0_12px_rgba(220,38,38,0.5)]">
            ⏰ Limited Time
          </div>

          <h2 className="text-2xl md:text-4xl font-black text-white mb-2 uppercase">
            Get Instant Access Now
          </h2>
          <p className="text-xs md:text-sm text-gray-400 font-bold uppercase tracking-wider mb-6">
            Stop fighting your environment. Start building your vision.
          </p>

          <div className="max-w-md mx-auto checkout-card rounded-2xl p-6 flex flex-col items-center gap-4 mb-8">
            <div className="text-[10px] font-black uppercase tracking-widest text-[#00F0FF] mb-1">ONE-TIME SHORTCUT</div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">$19.99</span>
              <span className="text-lg font-bold text-gray-500 line-through">($49.00)</span>
            </div>
            <span className="text-[9px] font-bold text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/20 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              Save 60% Today
            </span>
          </div>

          <button
            onClick={handleLaunchKitCheckout}
            disabled={isCheckoutLoading}
            className="w-full max-w-lg bg-[#00F0FF] text-black hover:bg-[#00F0FF]/85 py-4 rounded-2xl font-black text-base border border-[#00F0FF]/30 shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mx-auto disabled:opacity-60"
          >
            {isCheckoutLoading ? (
              'Creating secure Stripe checkout...'
            ) : (
              <>
                <Rocket size={18} /> Lock in the Launch Kit Shortcut – $19.99
              </>
            )}
          </button>
          
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-bold text-gray-400">
            <span>✨ Immediate digital download.</span>
            <span>🔒 Secure checkout via Stripe.</span>
            <span>🔑 No API keys or passwords required.</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OdysseusPewdiepieInstallPage;
