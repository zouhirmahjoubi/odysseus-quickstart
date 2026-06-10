
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

      <div className="mb-10 p-6 neo-border bg-card gradient-bg-cute shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))]">
        <div className="flex items-center gap-3 mb-4">
          <Database size={32} strokeWidth={3} className="text-foreground" />
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">LLM Reference Directory</h2>
        </div>
        <p className="font-poppins font-medium text-foreground/80 text-lg max-w-3xl">
          Explore our comprehensive database of over 50 large language models, categorized by tier and capabilities. Perfect for planning your local or enterprise deployment.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8 justify-between items-center">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" strokeWidth={3} />
          <input 
            type="text" 
            placeholder="Search models (e.g. Llama 3)..." 
            className="neo-input pl-12 rounded-[var(--radius-md)]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4 w-full lg:w-auto overflow-x-auto pb-2">
          <select 
            className="neo-input py-2 px-4 rounded-[var(--radius-md)] cursor-pointer w-auto"
            value={activeFamily}
            onChange={(e) => setActiveFamily(e.target.value)}
          >
            {FAMILIES.map(fam => (
              <option key={fam} value={fam}>{fam === 'All' ? 'All Families' : fam}</option>
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
            className={`font-black uppercase tracking-wide px-4 py-2 border-2 border-border whitespace-nowrap transition-all duration-300 rounded-[var(--radius-sm)] ${
              activeTab === tab 
                ? 'bg-secondary text-secondary-foreground shadow-[2px_2px_0px_0px_hsl(var(--shadow-color))] translate-x-0.5 translate-y-0.5' 
                : 'bg-card hover:bg-muted shadow-[2px_2px_0px_0px_hsl(var(--shadow-color))]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="neo-border bg-card overflow-x-auto shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))]">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-primary text-primary-foreground border-b-4 border-border">
              <th className="p-4 font-black uppercase tracking-wider whitespace-nowrap w-16 text-center">Vs</th>
              <th className="p-4 font-black uppercase tracking-wider whitespace-nowrap border-l-4 border-border">Model Name</th>
              <th className="p-4 font-black uppercase tracking-wider whitespace-nowrap border-l-4 border-border">Family</th>
              <th className="p-4 font-black uppercase tracking-wider whitespace-nowrap border-l-4 border-border">Tier</th>
              <th className="p-4 font-black uppercase tracking-wider whitespace-nowrap border-l-4 border-border">VRAM</th>
              <th className="p-4 font-black uppercase tracking-wider whitespace-nowrap border-l-4 border-border">Recommended For</th>
              <th className="p-4 font-black uppercase tracking-wider whitespace-nowrap border-l-4 border-border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredModels.length > 0 ? (
              filteredModels.map((model) => (
                <tr key={model.id} className="border-b-2 border-border last:border-b-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4 text-center">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 cursor-pointer accent-accent"
                      checked={compareList.includes(model.id)}
                      onChange={() => handleCompareToggle(model.id)}
                      disabled={!compareList.includes(model.id) && compareList.length >= 3}
                    />
                  </td>
                  <td className="p-4 font-black text-lg border-l-4 border-border flex items-center gap-3">
                    <span className="text-2xl animate-bounce-hover">{model.cute_icon}</span>
                    {model.name}
                    {model.is_new && <span className="cute-badge bg-accent text-accent-foreground text-xs ml-2">NEW</span>}
                    {model.is_popular && <span className="cute-badge bg-secondary text-secondary-foreground text-xs ml-2">HOT</span>}
                  </td>
                  <td className="p-4 font-bold border-l-4 border-border text-foreground/80">{model.family}</td>
                  <td className="p-4 font-bold border-l-4 border-border text-foreground/80">{model.category}</td>
                  <td className="p-4 font-black border-l-4 border-border">
                    <span className="bg-background border-2 border-border px-2 py-1 rounded-[var(--radius-sm)] shadow-sm">
                      {model.vram} GB
                    </span>
                  </td>
                  <td className="p-4 border-l-4 border-border">
                    <div className="flex flex-wrap gap-2">
                      {model.recommended_for.map(tag => (
                        <span key={tag} className="cute-badge bg-muted text-muted-foreground text-xs font-semibold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 border-l-4 border-border text-center">
                    <button 
                      onClick={() => handleCopySpecs(model)}
                      className="p-2 border-2 border-border bg-card rounded-[var(--radius-sm)] shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all active:translate-y-0 active:shadow-none"
                      title="Copy Specs"
                    >
                      {copiedId === model.id ? <Check size={18} className="text-secondary" /> : <Copy size={18} />}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-12 text-center font-bold text-lg text-muted-foreground">
                  No adorable models found matching your criteria. 😢
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {compareList.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 cute-card bg-foreground text-background p-4 flex items-center gap-6 animate-scale-hover">
          <span className="font-black uppercase tracking-wider">{compareList.length} Models Selected</span>
          <button className="bg-accent text-accent-foreground font-black px-6 py-2 rounded-[var(--radius-md)] border-2 border-border shadow-sm hover:scale-105 transition-transform">
            COMPARE
          </button>
        </div>
      )}
    </div>
  );
};

export default LLMReferenceDirectory;
