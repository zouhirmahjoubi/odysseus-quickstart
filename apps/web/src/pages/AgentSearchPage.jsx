
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Filter, Star, Bot, SlidersHorizontal } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import apiServerClient from '@/lib/apiServerClient.js';
import pb from '@/lib/pocketbaseClient.js';

const AgentSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'active',
    sort: 'relevance'
  });

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const q = encodeURIComponent(query);
      const res = await apiServerClient.fetch(`/search/agents?q=${q}&type=${filters.type}&sort=${filters.sort}`);
      const data = await res.json();
      setAgents(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAgents();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(query ? { q: query } : {});
    fetchAgents();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
      <Helmet><title>Advanced Agent Search - OdysseusAI</title></Helmet>
      
      {/* Sidebar Filters */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="neo-card bg-white sticky top-24">
          <h2 className="text-xl font-black space-grotesk mb-6 flex items-center"><SlidersHorizontal size={20} className="mr-2" /> Filters</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block font-bold mb-2 text-sm">Agent Type</label>
              <select value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})} className="neo-input text-sm">
                <option value="all">All Types</option>
                <option value="CrewAI">CrewAI</option>
                <option value="AutoGen">AutoGen</option>
                <option value="OpenHands">OpenHands</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            
            <div>
              <label className="block font-bold mb-2 text-sm">Sort By</label>
              <select value={filters.sort} onChange={e => setFilters({...filters, sort: e.target.value})} className="neo-input text-sm">
                <option value="relevance">Relevance</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
                <option value="price">Price: Low to High</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        <div className="mb-8">
          <h1 className="text-4xl font-black space-grotesk mb-4 flex items-center gap-3">
            <Bot size={36} className="text-[var(--primary-accent)]" /> Agent Directory
          </h1>
          <form onSubmit={handleSearch} className="relative">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search agents by name, capability, or use case..." 
              className="neo-input pl-12 py-4"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
          </form>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-40 bg-white neo-border animate-pulse"></div>)}
          </div>
        ) : agents.length === 0 ? (
          <div className="neo-card bg-white text-center py-20">
            <Bot size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-2xl font-black mb-2">No agents match your criteria</h3>
            <p className="font-bold text-gray-500">Try loosening your filters or search terms.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {agents.map(agent => (
              <div key={agent.id} className="neo-card bg-white p-0 flex flex-col sm:flex-row hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000000] transition-all">
                <div className="w-full sm:w-48 h-48 bg-[var(--background-light)] border-b-[3px] sm:border-b-0 sm:border-r-[3px] border-black flex items-center justify-center p-4">
                  {agent.logo ? (
                    <img src={pb.files.getUrl(agent, agent.logo)} alt={agent.name} className="w-full h-full object-contain" />
                  ) : (
                    <Bot size={64} className="text-black/20" />
                  )}
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-black space-grotesk">{agent.name}</h3>
                      <span className="neo-badge bg-[var(--secondary-accent)]">{agent.type}</span>
                    </div>
                    <p className="font-medium text-gray-600 line-clamp-2 mb-4">{agent.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t-[3px] border-black border-dashed">
                    <div className="flex items-center gap-4 font-bold text-sm">
                      <span className="flex items-center text-yellow-500"><Star size={16} className="fill-current mr-1" /> {agent.rating || 'New'}</span>
                      <span>{agent.price === 0 ? 'Free' : `$${agent.price}`}</span>
                    </div>
                    <Link to={`/market-agents/${agent.id}`} className="neo-button bg-[var(--primary-accent)] py-1.5 px-4 text-sm">View Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentSearchPage;
