
import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Filter, ArrowUpDown, Check, Plus, X, ArrowRightLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MODELS_LLM } from '@/data/llmModelsDatabase.js';
import BreadcrumbNav from '@/components/BreadcrumbNav.jsx';
import FeaturedLaunchKitCard from '@/components/FeaturedLaunchKitCard.jsx';

const LLMDirectoryPage = () => {
  const [search, setSearch] = useState('');
  const [providerFilter, setProviderFilter] = useState('All');
  const [capabilityFilter, setCapabilityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [compareList, setCompareList] = useState([]);

  // Extract unique providers and capabilities
  const providers = ['All', ...new Set(MODELS_LLM.map(m => m.provider))];
  const capabilities = ['All', ...new Set(MODELS_LLM.flatMap(m => m.capabilities))];

  const filteredAndSortedModels = useMemo(() => {
    let result = MODELS_LLM.filter(model => {
      const matchesSearch = model.name.toLowerCase().includes(search.toLowerCase()) || 
                            model.description.toLowerCase().includes(search.toLowerCase());
      const matchesProvider = providerFilter === 'All' || model.provider === providerFilter;
      const matchesCapability = capabilityFilter === 'All' || model.capabilities.includes(capabilityFilter);
      return matchesSearch && matchesProvider && matchesCapability;
    });

    result.sort((a, b) => {
      if (sortBy === 'price') {
        return (a.inputTokenPrice + a.outputTokenPrice) - (b.inputTokenPrice + b.outputTokenPrice);
      }
      if (sortBy === 'performance') {
        const perfA = a.performanceMetrics.speed + a.performanceMetrics.accuracy + a.performanceMetrics.reasoning;
        const perfB = b.performanceMetrics.speed + b.performanceMetrics.accuracy + b.performanceMetrics.reasoning;
        return perfB - perfA; // Descending
      }
      if (sortBy === 'date') {
        return new Date(b.releaseDate) - new Date(a.releaseDate); // Simplified sorting, assume desc
      }
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [search, providerFilter, capabilityFilter, sortBy]);

  const toggleCompare = (id) => {
    if (compareList.includes(id)) {
      setCompareList(compareList.filter(itemId => itemId !== id));
    } else {
      if (compareList.length < 3) {
        setCompareList([...compareList, id]);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-12 pb-32 font-rounded text-left">
      <Helmet>
        <title>LLM Directory | OdysseusAI</title>
        <meta name="description" content="Comprehensive directory of Large Language Models including GPT-4, Claude 3, and open-weight models." />
      </Helmet>

      <div className="container mx-auto">
        <BreadcrumbNav />

        {/* Page Header */}
        <div className="mb-16 select-none">
          <div className="flex items-center gap-2 bg-[#00F5D4]/10 px-4 py-1.5 rounded-full border border-[#00F5D4]/20 text-sm font-bold mb-6 inline-flex">
            <span className="bg-[#00F5D4] px-2 py-0.5 rounded-full text-xs text-black font-black">
              DATABASE
            </span>
            <span className="text-gray-300">LLM Directory Hub</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            LLM{' '}
            <span className="text-[#00F5D4] bg-[#00F5D4]/10 px-4 py-1 border border-[#00F5D4]/20 rounded-3xl inline-block transform -rotate-1 shadow-[0_0_15px_rgba(0,245,212,0.2)]">
              Directory
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl font-medium leading-relaxed">
            Discover, filter, and compare the world's leading language models. Find the perfect balance of reasoning, speed, and cost for your workload.
          </p>
        </div>

        {/* Featured Launch Kit Promo */}
        <div className="mb-12">
          <FeaturedLaunchKitCard />
        </div>

        {/* Filters and Controls */}
        <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-md mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2 relative">
              <label className="block text-xs font-black uppercase tracking-widest text-[#00F5D4] mb-2">Search Models</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={3} />
                <input
                  type="text"
                  placeholder="e.g. GPT-4, Claude..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border border-white/10 rounded-xl p-3 pl-12 font-bold text-sm text-white bg-white/5 outline-none focus:ring-2 focus:ring-[#00F5D4] transition-all placeholder:text-gray-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[#00F5D4] mb-2 flex items-center gap-2">
                <Filter size={14} /> Provider
              </label>
              <select
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
                className="w-full border border-white/10 rounded-xl text-white font-bold p-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#00F5D4] transition-all cursor-pointer"
              >
                {providers.map(p => (
                  <option key={p} value={p} className="bg-[#0a0a0a] text-white">{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[#00F5D4] mb-2 flex items-center gap-2">
                <ArrowUpDown size={14} /> Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-white/10 rounded-xl text-white font-bold p-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#00F5D4] transition-all cursor-pointer"
              >
                <option value="name" className="bg-[#0a0a0a] text-white">Name (A-Z)</option>
                <option value="performance" className="bg-[#0a0a0a] text-white">Performance Score</option>
                <option value="price" className="bg-[#0a0a0a] text-white">Price (Low to High)</option>
                <option value="date" className="bg-[#0a0a0a] text-white">Release Date</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/10">
            <label className="block text-xs font-black uppercase tracking-widest text-[#00F5D4] mb-3">Filter by Capability</label>
            <div className="flex flex-wrap gap-2">
              {capabilities.map(cap => (
                <button
                  key={cap}
                  onClick={() => setCapabilityFilter(cap)}
                  className={`px-4 py-2 border rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                    capabilityFilter === cap 
                      ? 'bg-[#00F5D4] text-black border-[#00F5D4]/30 shadow-[0_0_10px_rgba(0,245,212,0.25)]' 
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  {cap}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Model Grid */}
        <AnimatePresence mode="wait">
          {filteredAndSortedModels.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredAndSortedModels.map((model, index) => (
                <motion.div 
                  key={model.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col h-full hover:border-[#00F5D4]/40 hover:shadow-[0_12px_32px_rgba(0,245,212,0.18)] transition-all duration-300 relative overflow-hidden group backdrop-blur-md"
                >
                  {/* Provider Badge */}
                  <div className="absolute top-0 right-0 bg-[#00F5D4]/10 text-[#00F5D4] px-3 py-1 border-b border-l border-white/10 font-black text-xs uppercase tracking-widest rounded-bl-2xl z-10">
                    {model.provider}
                  </div>

                  <div className="mb-4 pr-16">
                    <h3 className="text-2xl font-black uppercase leading-tight mb-2 text-white group-hover:text-[#00F5D4] transition-colors">
                      {model.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#00F5D4]/10 border border-[#00F5D4]/20 text-[#00F5D4] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                        {model.type}
                      </span>
                      <span className="bg-white/5 border border-white/10 text-gray-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        Ctx: {model.contextWindow}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-400 font-semibold text-sm mb-6 flex-grow leading-relaxed">
                    {model.description}
                  </p>

                  <div className="bg-black/40 border border-white/10 rounded-2xl p-4 mb-6">
                    <div className="text-xs font-black uppercase tracking-widest mb-2 border-b border-white/10 pb-1.5 text-gray-400">Cost per 1K Tokens</div>
                    <div className="flex justify-between items-center font-bold text-sm mb-1">
                      <span className="text-gray-500">Input:</span>
                      <span className="font-mono text-white">${model.inputTokenPrice}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-sm">
                      <span className="text-gray-500">Output:</span>
                      <span className="font-mono text-white">${model.outputTokenPrice}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {model.capabilities.slice(0, 3).map((cap, i) => (
                      <span key={i} className="text-xs font-semibold bg-white/5 border border-white/10 text-gray-300 px-2.5 py-0.5 rounded-full">
                        {cap}
                      </span>
                    ))}
                    {model.capabilities.length > 3 && (
                      <span className="text-xs font-bold bg-white/5 border border-white/10 text-gray-400 px-2.5 py-0.5 rounded-full">
                        +{model.capabilities.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/10">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleCompare(model.id)}
                      className={`w-full py-3 px-4 border font-black uppercase tracking-widest text-xs rounded-xl transition-all flex items-center justify-center gap-2 ${
                        compareList.includes(model.id)
                          ? 'bg-[#00F5D4] text-black border-[#00F5D4]/30 shadow-[0_0_12px_rgba(0,245,212,0.3)]'
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      {compareList.includes(model.id) ? (
                        <><Check size={18} strokeWidth={3} /> Selected</>
                      ) : (
                        <><Plus size={18} strokeWidth={3} /> Compare</>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white/5 border border-white/10 p-16 rounded-3xl backdrop-blur-md text-center"
            >
              <h3 className="text-3xl font-black uppercase mb-4 text-white">No Models Found</h3>
              <p className="text-xl font-bold text-gray-400">Try adjusting your filters or search query.</p>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setSearch(''); setProviderFilter('All'); setCapabilityFilter('All'); }}
                className="mt-8 bg-[#00F5D4] text-black border border-[#00F5D4]/30 font-black uppercase tracking-widest px-8 py-4 rounded-xl shadow-[0_0_15px_rgba(0,245,212,0.2)] cursor-pointer"
              >
                Clear Filters
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Floating Comparison Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl bg-black/95 text-white border border-[#00F5D4]/30 rounded-2xl p-4 md:p-6 shadow-[0_0_25px_rgba(0,245,212,0.15)] animate-in fade-in slide-in-from-bottom-4 duration-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="bg-[#00F5D4] text-black w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-[0_0_8px_rgba(0,245,212,0.3)]">
              {compareList.length}
            </div>
            <span className="font-black uppercase tracking-widest text-sm">Models Selected</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {compareList.map(id => {
              const m = MODELS_LLM.find(mod => mod.id === id);
              return (
                <div key={id} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs">
                  <span className="font-bold text-gray-300 truncate max-w-[100px]">{m?.name}</span>
                  <button onClick={() => toggleCompare(id)} className="hover:text-[#00F5D4] transition-colors">
                    <X size={12} strokeWidth={3} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 w-full sm:w-auto justify-end">
            <button 
              onClick={() => setCompareList([])}
              className="px-4 py-2 text-white/60 hover:text-white font-black uppercase tracking-wider text-xs transition-colors"
            >
              Clear
            </button>
            <button 
              disabled={compareList.length < 2}
              className="bg-[#00F5D4] text-black border border-[#00F5D4]/30 font-black px-6 py-2 rounded-xl text-xs uppercase shadow-[0_0_10px_rgba(0,245,212,0.25)] hover:scale-105 transition-all disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ArrowRightLeft size={14} strokeWidth={3} /> Evaluate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LLMDirectoryPage;
