
import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Filter, ArrowUpDown, Check, Plus, X, ArrowRightLeft } from 'lucide-react';
import { MODELS_LLM } from '@/data/llmModelsDatabase.js';
import BreadcrumbNav from '@/components/BreadcrumbNav.jsx';

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
    <div className="min-h-screen bg-[#FFFDF0] pt-12 pb-32">
      <Helmet>
        <title>LLM Directory | OdysseusAI</title>
        <meta name="description" content="Comprehensive directory of Large Language Models including GPT-4, Claude 3, and open-weight models." />
      </Helmet>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BreadcrumbNav />

        {/* Page Header */}
        <div className="mb-12 border-b-8 border-black pb-8">
          <div className="inline-block bg-[#FF9F00] border-4 border-black px-3 py-1 text-sm font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-6">
            Database
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-black mb-6 leading-none">
            LLM Directory
          </h1>
          <p className="text-xl md:text-2xl font-bold text-black/70 max-w-3xl leading-relaxed">
            Discover, filter, and compare the world's leading language models. Find the perfect balance of reasoning, speed, and cost for your workload.
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="bg-[#B3DDF2] border-4 border-black p-6 rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2 relative">
              <label className="block text-xs font-black uppercase tracking-widest mb-2">Search Models</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" strokeWidth={3} />
                <input
                  type="text"
                  placeholder="e.g. GPT-4, Claude..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white border-4 border-black text-black font-bold p-3 pl-12 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#90EE90] focus:border-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] placeholder:text-black/40"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                <Filter size={14} /> Provider
              </label>
              <select
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
                className="w-full bg-white border-4 border-black text-black font-bold p-3 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#90EE90] appearance-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
              >
                {providers.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                <ArrowUpDown size={14} /> Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-white border-4 border-black text-black font-bold p-3 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#90EE90] appearance-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
              >
                <option value="name">Name (A-Z)</option>
                <option value="performance">Performance Score</option>
                <option value="price">Price (Low to High)</option>
                <option value="date">Release Date</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t-4 border-black/20">
            <label className="block text-xs font-black uppercase tracking-widest mb-3">Filter by Capability</label>
            <div className="flex flex-wrap gap-3">
              {capabilities.map(cap => (
                <button
                  key={cap}
                  onClick={() => setCapabilityFilter(cap)}
                  className={`px-4 py-2 border-4 border-black text-sm font-black uppercase tracking-widest rounded-lg transition-all active:translate-y-1 active:translate-x-1 active:shadow-none ${
                    capabilityFilter === cap 
                      ? 'bg-[#90EE90] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-0.5 translate-x-0.5' 
                      : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FF9F00] hover:-translate-y-0.5 hover:-translate-x-0.5'
                  }`}
                >
                  {cap}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Model Grid */}
        {filteredAndSortedModels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedModels.map(model => (
              <div 
                key={model.id} 
                className="bg-white border-4 border-black rounded-xl p-6 flex flex-col h-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 relative overflow-hidden group"
              >
                {/* Provider Badge */}
                <div className="absolute top-0 right-0 bg-black text-white px-3 py-1 border-b-4 border-l-4 border-black font-black text-xs uppercase tracking-widest rounded-bl-lg z-10">
                  {model.provider}
                </div>

                <div className="mb-4 pr-16">
                  <h3 className="text-2xl font-black uppercase leading-tight mb-2 group-hover:text-[#FF9F00] transition-colors">{model.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#B3DDF2] border-2 border-black text-black text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      {model.type}
                    </span>
                    <span className="bg-[#FFFDF0] border-2 border-black text-black text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
                      Ctx: {model.contextWindow}
                    </span>
                  </div>
                </div>

                <p className="font-bold text-black/70 text-sm mb-6 flex-grow">
                  {model.description}
                </p>

                <div className="bg-[#FFFDF0] border-4 border-black rounded-lg p-3 mb-6">
                  <div className="text-xs font-black uppercase tracking-widest mb-2 border-b-2 border-black/20 pb-1">Cost per 1K Tokens</div>
                  <div className="flex justify-between items-center font-bold text-sm">
                    <span className="text-black/60">Input:</span>
                    <span>${model.inputTokenPrice}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-sm">
                    <span className="text-black/60">Output:</span>
                    <span>${model.outputTokenPrice}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {model.capabilities.slice(0, 3).map((cap, i) => (
                    <span key={i} className="text-xs font-bold bg-black text-white px-2 py-1 rounded">
                      {cap}
                    </span>
                  ))}
                  {model.capabilities.length > 3 && (
                    <span className="text-xs font-bold border-2 border-black text-black px-2 py-1 rounded">
                      +{model.capabilities.length - 3}
                    </span>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t-4 border-black/10">
                  <button
                    onClick={() => toggleCompare(model.id)}
                    className={`w-full py-3 px-4 border-4 border-black font-black uppercase tracking-widest text-sm rounded-lg transition-all flex items-center justify-center gap-2 ${
                      compareList.includes(model.id)
                        ? 'bg-[#90EE90] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-1 translate-x-1'
                        : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#B3DDF2] active:translate-y-1 active:translate-x-1 active:shadow-none'
                    }`}
                  >
                    {compareList.includes(model.id) ? (
                      <><Check size={18} strokeWidth={3} /> Selected</>
                    ) : (
                      <><Plus size={18} strokeWidth={3} /> Compare</>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border-4 border-black p-16 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
            <h3 className="text-3xl font-black uppercase mb-4">No Models Found</h3>
            <p className="text-xl font-bold text-black/60">Try adjusting your filters or search query.</p>
            <button 
              onClick={() => { setSearch(''); setProviderFilter('All'); setCapabilityFilter('All'); }}
              className="mt-8 bg-[#FF9F00] text-black border-4 border-black font-black uppercase tracking-widest px-8 py-4 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}

      </div>

      {/* Floating Comparison Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
          <div className="max-w-5xl mx-auto bg-black text-white border-4 border-black rounded-xl p-4 md:p-6 shadow-[0px_0px_0px_4px_rgba(255,253,240,1),_8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-center justify-between gap-6 pointer-events-auto">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="bg-[#90EE90] text-black w-10 h-10 rounded flex items-center justify-center font-black text-xl border-2 border-black">
                {compareList.length}
              </div>
              <span className="font-black uppercase tracking-widest text-lg">Models Selected</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {compareList.map(id => {
                const m = MODELS_LLM.find(mod => mod.id === id);
                return (
                  <div key={id} className="bg-white/10 border-2 border-white/30 px-3 py-1.5 rounded flex items-center gap-2">
                    <span className="font-bold text-sm truncate max-w-[100px]">{m?.name}</span>
                    <button onClick={() => toggleCompare(id)} className="hover:text-[#FF9F00] transition-colors">
                      <X size={14} strokeWidth={3} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 w-full sm:w-auto">
              <button 
                onClick={() => setCompareList([])}
                className="px-4 py-3 text-white font-black uppercase tracking-widest text-sm hover:text-red-400 transition-colors"
              >
                Clear
              </button>
              <button 
                disabled={compareList.length < 2}
                className="flex-grow sm:flex-grow-0 bg-[#FF9F00] text-black border-4 border-black font-black uppercase tracking-widest px-8 py-3 rounded-lg shadow-[4px_4px_0px_0px_rgba(255,253,240,1)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ArrowRightLeft size={18} strokeWidth={3} /> Evaluate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LLMDirectoryPage;
