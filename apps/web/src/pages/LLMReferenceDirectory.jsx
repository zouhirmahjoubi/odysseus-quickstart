
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Database, Copy, Check } from 'lucide-react';
import { MODELS } from '@/data/modelDatabase.js';

const TABS = ['All', 'Ultra-Lightweight', 'Lightweight', 'Mid-Range', 'Advanced', 'Enterprise'];
const FAMILIES = ['All', 'Llama', 'Mistral', 'Qwen', 'Phi', 'Gemma', 'Falcon', 'Cohere', 'DeepSeek', 'Other'];

const LLMReferenceDirectory = ({ hideHelmet = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [activeFamily, setActiveFamily] = useState('All');
  const [compareList, setCompareList] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  const handleCopySpecs = (model) => {
    const specs = `${model.name} (${model.family}) - VRAM: ${model.vram}GB | Params: ${model.parameters}B | Use Cases: ${model.recommended_for.join(', ')}`;
    navigator.clipboard.writeText(specs);
    setCopiedId(model.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCompareToggle = (id) => {
    if (compareList.includes(id)) {
      setCompareList(compareList.filter(m => m !== id));
    } else {
      if (compareList.length < 3) {
        setCompareList([...compareList, id]);
      }
    }
  };

  const filteredModels = MODELS.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || model.category === activeTab;
    const matchesFamily = activeFamily === 'All' || model.family === activeFamily || (activeFamily === 'Other' && !FAMILIES.includes(model.family));
    return matchesSearch && matchesTab && matchesFamily;
  });

  return (
    <div className="w-full">
      {!hideHelmet && (
        <Helmet>
          <title>LLM Reference Directory | OdysseusAI</title>
        </Helmet>
      )}

      <div className="mb-10 p-6 bg-white/5 border border-white/10 rounded-3xl relative overflow-hidden backdrop-blur-md">
        <div className="flex items-center gap-3 mb-4">
          <Database size={32} strokeWidth={3} className="text-[#FFB300]" />
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">LLM Reference Directory</h2>
        </div>
        <p className="font-semibold text-gray-400 text-base md:text-lg max-w-3xl leading-relaxed">
          Explore our comprehensive database of over 50 large language models, categorized by tier and capabilities. Perfect for planning your local or enterprise deployment.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8 justify-between items-center">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" strokeWidth={3} />
          <input 
            type="text" 
            placeholder="Search models (e.g. Llama 3)..." 
            className="w-full bg-white/5 border border-white/10 text-white font-bold p-3 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB300] transition-all placeholder:text-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4 w-full lg:w-auto overflow-x-auto pb-2">
          <select 
            className="bg-white/5 border border-white/10 text-white font-bold p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB300] cursor-pointer"
            value={activeFamily}
            onChange={(e) => setActiveFamily(e.target.value)}
          >
            {FAMILIES.map(fam => (
              <option key={fam} value={fam} className="bg-black text-white">{fam === 'All' ? 'All Families' : fam}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-8 pb-2">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 border rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-[#FFB300] text-black border-[#FFB300]/30 shadow-[0_0_10px_rgba(255,179,0,0.25)]' 
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-x-auto shadow-lg backdrop-blur-md">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-black/65 text-white border-b border-white/10">
              <th className="p-4 font-black uppercase tracking-wider text-xs w-16 text-center">Vs</th>
              <th className="p-4 font-black uppercase tracking-wider text-xs border-l border-white/10">Model Name</th>
              <th className="p-4 font-black uppercase tracking-wider text-xs border-l border-white/10">Family</th>
              <th className="p-4 font-black uppercase tracking-wider text-xs border-l border-white/10">Tier</th>
              <th className="p-4 font-black uppercase tracking-wider text-xs border-l border-white/10">VRAM</th>
              <th className="p-4 font-black uppercase tracking-wider text-xs border-l border-white/10">Recommended For</th>
              <th className="p-4 font-black uppercase tracking-wider text-xs border-l border-white/10 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredModels.length > 0 ? (
              filteredModels.map((model) => (
                <tr key={model.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-center">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 cursor-pointer accent-[#FFB300] bg-white/5 border-white/10 rounded"
                      checked={compareList.includes(model.id)}
                      onChange={() => handleCompareToggle(model.id)}
                      disabled={!compareList.includes(model.id) && compareList.length >= 3}
                    />
                  </td>
                  <td className="p-4 font-black text-lg border-l border-white/5 text-white flex items-center gap-3">
                    <span className="text-2xl animate-bounce-hover">{model.cute_icon}</span>
                    {model.name}
                    {model.is_new && <span className="bg-[#FFB300]/15 text-[#FFB300] border border-[#FFB300]/25 text-[9px] font-black uppercase px-2 py-0.5 rounded-full ml-2">NEW</span>}
                    {model.is_popular && <span className="bg-[#E73A5A]/15 text-[#E73A5A] border border-[#E73A5A]/25 text-[9px] font-black uppercase px-2 py-0.5 rounded-full ml-2">HOT</span>}
                  </td>
                  <td className="p-4 font-bold border-l border-white/5 text-gray-300">{model.family}</td>
                  <td className="p-4 font-bold border-l border-white/5 text-gray-300">{model.category}</td>
                  <td className="p-4 font-black border-l border-white/5">
                    <span className="bg-white/5 border border-white/10 text-white px-2.5 py-1 rounded-lg text-xs font-black shadow-sm">
                      {model.vram} GB
                    </span>
                  </td>
                  <td className="p-4 border-l border-white/5">
                    <div className="flex flex-wrap gap-2">
                      {model.recommended_for.map(tag => (
                        <span key={tag} className="bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded text-xs font-semibold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 border-l border-white/5 text-center">
                    <button 
                      onClick={() => handleCopySpecs(model)}
                      className="p-2.5 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-lg shadow-sm hover:scale-105 active:scale-95 transition-all"
                      title="Copy Specs"
                    >
                      {copiedId === model.id ? <Check size={16} className="text-[#FFB300]" /> : <Copy size={16} />}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-12 text-center font-bold text-lg text-gray-500">
                  No adorable models found matching your criteria. 😢
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {compareList.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-black/95 text-white border border-[#FFB300]/30 rounded-2xl p-4 flex items-center gap-6 shadow-[0_0_25px_rgba(255,179,0,0.15)] animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
            <span className="bg-[#FFB300] text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-[0_0_8px_rgba(255,179,0,0.3)]">
              {compareList.length}
            </span>
            Models Selected
          </span>
          <button className="bg-[#FFB300] text-black border border-[#FFB300]/30 font-black px-6 py-2 rounded-xl text-xs uppercase shadow-[0_0_10px_rgba(255,179,0,0.2)] hover:scale-105 transition-transform">
            COMPARE
          </button>
        </div>
      )}
    </div>
  );
};

export default LLMReferenceDirectory;
