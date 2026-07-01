import React, { useState } from 'react';
import { Rocket, CheckCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import apiServerClient from '@/lib/apiServerClient';

const FeaturedLaunchKitCard = () => {
  const navigate = useNavigate();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const handleLaunchKitCheckout = () => {
    navigate('/install-odysseus-pewdiepie');
  };

  return (
    <div className="relative checkout-card-cyan rounded-3xl p-8 md:p-10 shadow-[0_0_25px_rgba(0,240,255,0.1)] backdrop-blur-md">
      {/* Corner badges */}
      <div className="absolute -top-3 -left-3 bg-[#00F0FF] text-black border border-[#00F0FF]/30 px-4 py-1.5 font-black text-[10px] tracking-widest uppercase transform -rotate-6 rounded-full z-10 shadow-[0_0_12px_rgba(0,240,255,0.4)]">
        🔥 Hot Selling
      </div>
      <div 
        className="absolute -top-3 -right-3 bg-red-600 border border-red-500/30 px-4 py-1.5 font-black text-[10px] tracking-widest uppercase transform rotate-6 rounded-full z-10 shadow-[0_0_12px_rgba(220,38,38,0.5)]"
        style={{ color: '#ffffff' }}
      >
        ⏰ Limited Time
      </div>

      {/* Decorative blobs */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-0">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#00F0FF]/15 rounded-full blur-3xl" />
        <div className="absolute left-20 -top-6 w-24 h-24 bg-[#00F0FF]/5 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-center justify-between">
        {/* Left content */}
        <div className="flex-1 text-left max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 px-4 py-1.5 font-black uppercase tracking-widest rounded-full text-xs inline-flex items-center gap-1 shadow-[0_0_10px_rgba(0,240,255,0.1)]">
              🚀 Complete Launch Kit
            </span>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-[#00F0FF] text-[#00F0FF]" />
              ))}
              <span className="text-xs font-bold text-gray-300 ml-1">5/5 (180+ reviews)</span>
            </div>
          </div>

          <h2 className="text-2xl md:text-4xl font-black text-white mb-3 leading-tight font-rounded">
            The "Zero-Headache" Odysseus Launch Kit
          </h2>
          <h3 className="text-sm md:text-base font-bold text-[#00F0FF] mb-4">
            Skip the terminal loops. Launch in 5 minutes. Save your night.
          </h3>
          <p className="text-xs md:text-sm font-semibold text-gray-400 mb-6 leading-relaxed">
            Odysseus AI is free, but local setup is a minefield of port conflicts, environment issues, and isolated containers. The Launch Kit turns manual troubleshooting into a bulletproof shortcut.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm font-bold text-gray-300">
            {[
              'One-Command Auto-Runner script',
              'Ollama docker-host routing configurations',
              'Port 7000 "First Aid" check list',
              '5 pre-configured workflow templates',
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-2">
                <CheckCircle size={15} className="text-[#00F0FF] shrink-0" strokeWidth={2.5} />
                {feat}
              </div>
            ))}
          </div>
        </div>

        {/* Right Pricing column */}
        <div className="w-full lg:w-auto min-w-[260px] shrink-0">
          <div className="bg-black/5 dark:bg-black/40 border border-black/5 dark:border-white/10 rounded-2xl p-6 shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(0,0,0,0.3)] flex flex-col items-center text-center gap-4 relative overflow-hidden">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#00F0FF] mb-1">ONE-TIME PAYMENT</div>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-black text-white">$19.99</span>
                <span className="text-lg font-bold text-gray-500 line-through">$49.99</span>
              </div>
              <span className="text-[9px] font-bold text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/20 px-2 py-0.5 rounded-md uppercase tracking-wider inline-block mt-1">
                Save 60% Today
              </span>
            </div>
            <button
              onClick={handleLaunchKitCheckout}
              disabled={isCheckoutLoading}
              className="w-full bg-[#00F0FF] text-black hover:bg-[#00F0FF]/85 py-3.5 rounded-2xl font-black border border-[#00F0FF]/30 shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isCheckoutLoading ? (
                'Processing...'
              ) : (
                <>
                  <Rocket size={16} strokeWidth={2.5} /> Buy Launch Kit — $19.99
                </>
              )}
            </button>
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">
              Instant Access · Secure Stripe Checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedLaunchKitCard;
