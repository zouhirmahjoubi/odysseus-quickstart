import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { CheckCircle, ShieldAlert, Sparkles, Terminal, ArrowRight, ArrowLeft } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';
import { toast } from 'sonner';

export default function PurchaseProPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await apiServerClient.fetch('/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 49.00,
          productName: 'Odysseus AI Pro License - Premium Support & Custom Setup',
          successUrl: window.location.origin + '/success?session_id={CHECKOUT_SESSION_ID}',
          cancelUrl: window.location.origin + '/cancel',
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || 'Checkout failed');
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
        toast.success('Redirecting to secure Stripe checkout... 💳');
      } else {
        throw new Error('Failed to retrieve checkout session URL.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      title: '1-on-1 Dedicated Support',
      desc: 'Direct troubleshooting access via email/Slack for port collisions, Docker setups, or environment quirks.',
    },
    {
      title: 'Custom Deployment Setup',
      desc: 'Expert help configuring Cloudflare tunnels, Tailscale configurations, SSL certificates, or tricky network port forwarding.',
    },
    {
      title: 'Bespoke Workflow Templates',
      desc: 'Creation of tailored custom system prompt pipelines and tools engineered specifically for your business.',
    },
  ];

  // Motion variants for glassmorphic stagger entry
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <>
      <Helmet>
        <title>Purchase Pro License | Odysseus AI</title>
        <meta name="description" content="Unlock Premium Support, Custom Deployment Setup, and Bespoke Workflow Templates for Odysseus AI." />
      </Helmet>

      <div className="relative min-h-[80vh] text-gray-900 dark:text-gray-100 flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8 overflow-hidden font-rounded">
        {/* Premium background glowing radial gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00F0FF]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-[#E73A5A]/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div 
          className="max-w-4xl w-full grid md:grid-cols-12 gap-8 items-stretch relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Info Column */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-8 text-left">
            <motion.div variants={itemVariants} className="space-y-4">
              <Link to="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#E73A5A] dark:text-[#00F0FF] hover:opacity-85 transition-opacity mb-4">
                <ArrowLeft size={14} /> Back to Hub
              </Link>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E73A5A]/10 border border-[#E73A5A]/20 text-[#E73A5A] text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                Premium Tier
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent sm:text-5xl uppercase font-black">
                Purchase Pro License
              </h1>
              <p className="text-lg font-medium text-gray-700 dark:text-slate-300">
                Unlock Premium Support & Custom Setup
              </p>
              <div className="flex gap-3 p-4 rounded-xl bg-black/5 dark:bg-black/40 border border-black/5 dark:border-white/10 text-sm text-gray-700 dark:text-gray-400 max-w-xl">
                <ShieldAlert className="w-5 h-5 text-[#00F0FF] shrink-0 mt-0.5" />
                <p className="font-medium">
                  Need professional installation assistance or custom workflow templates built for your company? We've got you covered.
                </p>
              </div>
            </motion.div>

            {/* Feature List */}
            <motion.div variants={itemVariants} className="space-y-4">
              {features.map((feat, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-950 dark:text-gray-200 text-sm">{feat.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed font-semibold">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Pricing Glassmorphic Card Column */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-5 flex flex-col justify-center"
          >
            <div className="checkout-card rounded-2xl p-8 flex flex-col justify-between h-full min-h-[340px] group transition-all duration-300 hover:border-[#E73A5A]/30">
              {/* Outer card glow ornament */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#E73A5A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="text-left">
                <span className="text-xs font-bold uppercase tracking-widest text-[#00F0FF]">One-Time Pass</span>
                <div className="mt-4 flex items-baseline text-gray-950 dark:text-white">
                  <span className="text-5xl font-extrabold tracking-tight">$49</span>
                  <span className="ml-1 text-sm font-semibold text-gray-500 dark:text-slate-400">/one-time purchase</span>
                </div>
                <p className="mt-4 text-xs text-gray-600 dark:text-slate-400 leading-relaxed font-semibold">
                  Lifetime access to your deployment's configuration assurance. No recurring subscriptions.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#E73A5A] text-white font-black text-sm transition-all duration-200 hover:bg-[#E73A5A]/90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-[#E73A5A]/20"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Secure Checkout 
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                
                <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 dark:text-slate-400 font-bold">
                  <Terminal className="w-3.5 h-3.5 text-gray-500" />
                  <span>Processed securely via Stripe encryption</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
