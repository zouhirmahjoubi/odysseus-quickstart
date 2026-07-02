
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search, ShoppingCart, Zap, Cpu, MessageSquare, Brain,
  Rocket, CheckCircle, Lock, Star, ArrowRight, Filter, X
} from 'lucide-react';
import { useCart } from '@/hooks/useCart.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { formatCurrency } from '@/api/EcommerceApi.js';
import { MODELS } from '@/data/modelDatabase.js';
import { toast } from 'sonner';
import apiServerClient from '@/lib/apiServerClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn, Reveal } from '@/components/ScrollAnimations.jsx';
import FeaturedLaunchKitCard from '@/components/FeaturedLaunchKitCard.jsx';

// ─── Bundle definitions ───
const BUNDLES = [
  {
    id: 'b-rag',
    name: 'RAG Specialist Bundle',
    icon: <Zap size={22} />,
    emoji: '⚡',
    desc: 'Optimized setup for Retrieval-Augmented Generation workflows.',
    price: 49900,
    bg: 'bg-wiggle-blue',
    tag: 'RAG',
  },
  {
    id: 'b-code',
    name: 'Code Master Bundle',
    icon: <Cpu size={22} />,
    emoji: '💻',
    desc: 'Elite code generation and review architecture blueprints.',
    price: 59900,
    bg: 'bg-wiggle-yellow',
    tag: 'Coding',
  },
  {
    id: 'b-chat',
    name: 'Chat Expert Bundle',
    icon: <MessageSquare size={22} />,
    emoji: '💬',
    desc: 'High-throughput conversational AI configurations.',
    price: 39900,
    bg: 'bg-wiggle-pink',
    tag: 'Chat',
  },
  {
    id: 'b-reason',
    name: 'Reasoning Pro Bundle',
    icon: <Brain size={22} />,
    emoji: '🧠',
    desc: 'Heavyweight models for complex logic and math tasks.',
    price: 89900,
    bg: 'bg-wiggle-green',
    tag: 'Reasoning',
  },
];

const ProductsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || searchParams.get('search') || '');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const records = await pb.collection('products').getList(1, 20, {
          filter: 'status="active"',
          $autoCancel: false,
        });
        setDbProducts(records.items);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const displayModels = MODELS.filter((m) => m.price).slice(0, 24);

  const filteredModels = displayModels.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.family.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter =
      activeFilter === 'all' ||
      (activeFilter === 'popular' && p.is_popular) ||
      (activeFilter === 'new' && p.is_new) ||
      p.recommended_for?.some((r) => r.toLowerCase().includes(activeFilter));
    return matchSearch && matchFilter;
  });

  const handleAddToCart = (item, type = 'model') => {
    const cartProduct = { id: item.id, title: item.name, image_url: null };
    const variant = {
      id: `${item.id}-default`,
      price_in_cents: item.price || 0,
      title: type === 'bundle' ? 'Bundle' : 'Preset Config',
      currency_info: { code: 'USD', symbol: '$' },
    };
    addToCart(cartProduct, variant, 1, 999);
    toast.success(`${item.name} added to cart! 🛍️`);
  };

  const handleLaunchKitCheckout = () => {
    navigate('/install-odysseus-pewdiepie');
  };

  const FILTER_PILLS = ['all', 'popular', 'new', 'coding', 'reasoning', 'chat'];

  return (
    <div className="max-w-7xl mx-auto px-4 pt-12 pb-24 font-rounded">
      <Helmet>
        <title>Marketplace — LLM Presets & AI Bundles | OdysseusAI</title>
        <meta
          name="description"
          content="Premium LLM presets, agent blueprints, and infrastructure configurations. Verified and ready for immediate deployment with Odysseus AI."
        />
      </Helmet>

      {/* ── Hero ── */}
      <div className="text-center mb-14 select-none">
        <FadeIn direction="down" distance={20} delay={0.05}>
          <div className="inline-flex items-center gap-2 bg-[#00F0FF]/10 px-4 py-1.5 rounded-full border border-[#00F0FF]/20 text-sm font-bold mb-6">
            <span className="bg-[#00F0FF] px-2 py-0.5 rounded-full text-xs text-black font-black">
              STORE
            </span>
            <span className="text-gray-300">Premium AI Assets — Presets, Bundles & Blueprints</span>
          </div>
        </FadeIn>

        <FadeIn direction="up" distance={30} delay={0.1}>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Digital{' '}
            <span className="text-[#00F0FF] bg-[#00F0FF]/10 px-4 py-1 border border-[#00F0FF]/20 rounded-3xl inline-block transform -rotate-1 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              Marketplace
            </span>
          </h1>
        </FadeIn>

        <FadeIn direction="up" distance={20} delay={0.2}>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Premium LLM presets, agent blueprints, and infrastructure configurations. Verified and ready for immediate deployment.
          </p>
        </FadeIn>

        {/* Stats strip */}
        <FadeIn direction="up" distance={16} delay={0.3}>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { icon: '🎁', val: `${BUNDLES.length}`, label: 'Bundles' },
              { icon: '🤖', val: `${displayModels.length}+`, label: 'Presets' },
              { icon: '⭐', val: '5/5', label: 'Rating' },
              { icon: '🔒', val: '100%', label: 'Secure' },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 shadow-md flex items-center gap-3 backdrop-blur-md"
              >
                <span className="text-xl">{s.icon}</span>
                <div className="text-left">
                  <div className="text-lg font-black text-white leading-none">{s.val}</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* ── Featured Launch Kit ── */}
      <ScaleIn delay={0.1}>
        <div className="mb-16">
          <FeaturedLaunchKitCard />
        </div>
      </ScaleIn>

      {/* ── Bundles Section ── */}
      <section className="mb-16">
        <FadeIn direction="up" distance={20}>
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-white">🎁 Model Starter Packs</h2>
            <span className="text-xs font-black uppercase tracking-widest bg-[#00F0FF]/10 border border-[#00F0FF]/25 px-3 py-1 rounded-full text-[#00F0FF]">
              {BUNDLES.length} bundles
            </span>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.08}>
          {BUNDLES.map((bundle) => (
            <StaggerItem key={bundle.id}>
              <motion.div
                whileHover={{ 
                  y: -6,
                  scale: 1.02,
                  borderColor: 'rgba(0, 240, 255, 0.45)',
                  boxShadow: '0 15px 30px rgba(0, 240, 255, 0.15)'
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="w-full h-full bg-white/5 border border-white/10 rounded-2xl p-6 shadow-md text-left flex flex-col gap-4 backdrop-blur-md group cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-[#00F0FF] group-hover:scale-110 transition-transform">
                    {bundle.icon}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest bg-white/5 border border-white/10 px-2 py-1 rounded-full text-gray-400 group-hover:border-[#00F0FF]/30 transition-colors">
                    {bundle.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-black text-white leading-tight mb-1 group-hover:text-[#00F0FF] transition-colors">{bundle.name}</h3>
                  <p className="text-xs font-semibold text-gray-400 leading-relaxed">{bundle.desc}</p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ── Model Presets Section ── */}
      <section>
        <FadeIn direction="up" distance={20}>
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#00F0FF]/25 bg-[#00F0FF]/10 text-[#00F0FF] font-black text-sm uppercase tracking-widest rounded-xl">
              <Cpu size={14} /> Model Directory
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">Individual Model Presets</h2>
            <span className="text-xs font-black uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[#00F0FF]">
              {filteredModels.length} results
            </span>
          </div>
        </FadeIn>

        {/* Search + Filter bar */}
        <FadeIn direction="up" distance={16} delay={0.1}>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md mb-8 flex flex-col sm:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2.5} />
              <input
                type="text"
                placeholder="Search models or families..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 border border-white/10 rounded-xl bg-white/5 font-bold text-xs text-white outline-none focus:ring-2 focus:ring-[#00F0FF] placeholder:text-gray-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {/* Filter pills */}
            <div className="flex flex-wrap gap-2">
              {FILTER_PILLS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1.5 border rounded-xl text-[10px] font-black uppercase tracking-wide transition-all ${
                    activeFilter === f
                      ? 'bg-[#00F0FF] text-black border-[#00F0FF]/30 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Products grid */}
        <AnimatePresence mode="wait">
          {filteredModels.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {filteredModels.map((model, index) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="bg-white/5 border border-white/10 rounded-2xl shadow-md hover:-translate-y-1 hover:border-[#00F0FF]/35 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] transition-all flex flex-col overflow-hidden group backdrop-blur-md"
                >
                  {/* Card top accent */}
                  <div className="h-1 bg-[#00F0FF]" />

                  <div className="p-5 flex flex-col flex-1">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-3xl group-hover:scale-110 transition-transform inline-block">
                        {model.cute_icon}
                      </span>
                      <div className="flex flex-col gap-1 items-end">
                        {model.is_popular && (
                          <span className="text-[9px] font-black uppercase tracking-widest bg-[#E73A5A]/10 text-[#E73A5A] px-2 py-0.5 rounded-full border border-[#E73A5A]/20">
                            🔥 Popular
                          </span>
                        )}
                        {model.is_new && (
                          <span className="text-[9px] font-black uppercase tracking-widest bg-[#00F0FF]/15 text-[#00F0FF] px-2 py-0.5 rounded-full border border-[#00F0FF]/25">
                            ✨ New
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Model info */}
                    <h3 className="text-base font-black text-white uppercase leading-tight mb-0.5">{model.name}</h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">{model.family} Family</p>

                    {/* Specs grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4 py-3 border-y border-white/10 flex-1">
                      <div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-0.5">VRAM</div>
                        <div className="text-sm font-black text-white">{model.vram} GB</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-0.5">PARAMS</div>
                        <div className="text-sm font-black text-white">{model.parameters}B</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Best For</div>
                        <div className="flex gap-1 flex-wrap">
                          {model.recommended_for?.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>


                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-16 text-center backdrop-blur-md"
            >
              <span className="text-5xl mb-4 block">🔍</span>
              <h3 className="text-xl font-black text-white uppercase mb-2">No Models Found</h3>
              <p className="text-sm font-semibold text-gray-400">Try searching for a different family or capability.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
                className="mt-6 bg-[#00F0FF] text-black border border-[#00F0FF]/30 px-6 py-2.5 rounded-xl font-black text-sm shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Bottom CTA ── */}
      <Reveal delay={0.1}>
        <div className="mt-20 bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 text-center select-none backdrop-blur-md">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
            Need a custom setup?
          </h2>
          <p className="text-sm text-gray-400 font-semibold max-w-lg mx-auto mb-6">
            The Launch Kit includes everything you need. Or browse our install guides to run Odysseus AI for free with Ollama.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleLaunchKitCheckout}
              disabled={isCheckoutLoading}
              className="bg-[#00F0FF] text-black px-8 py-4 rounded-2xl font-black text-base border border-[#00F0FF]/30 shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Rocket size={18} /> Get Launch Kit — $19.99
            </button>
            <a
              href="/odysseus-ai-install"
              className="bg-white/5 text-white px-8 py-4 rounded-2xl font-black text-base border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              Free Install Guide <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  );
};

export default ProductsPage;
