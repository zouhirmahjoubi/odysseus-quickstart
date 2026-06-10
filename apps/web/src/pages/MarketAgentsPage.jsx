
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Download, Bot } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';

const MarketAgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        let filterStr = 'status="active"';
        if (typeFilter !== 'all') filterStr += ` && type="${typeFilter}"`;
        if (search) filterStr += ` && (name~"${search}" || description~"${search}")`;

        const records = await pb.collection('market_agents').getList(page, 12, {
          filter: filterStr,
          sort: '-created',
          $autoCancel: false
        });
        
        setAgents(records.items);
        setTotalPages(records.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => fetchAgents(), 300);
    return () => clearTimeout(timeoutId);
  }, [page, typeFilter, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Helmet><title>AI Agent Market - OdysseusAI</title></Helmet>
      
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-black space-grotesk mb-6">Agent <span className="text-[var(--primary-accent)]">Marketplace</span></h1>
        <p className="text-xl font-bold text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover, test, and deploy premium AI agents for your workflows.
        </p>
      </div>

      <div className="neo-card bg-[var(--background-light)] dark:bg-black mb-12 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search agents..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="neo-input pl-10"
          />
          <Search className="absolute left-3 top-3.5 text-gray-500" size={20} />
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <select 
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="neo-input w-full sm:w-48 cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="CrewAI">CrewAI</option>
            <option value="AutoGen">AutoGen</option>
            <option value="OpenHands">OpenHands</option>
            <option value="Custom">Custom</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-80 bg-gray-200 neo-border"></div>)}
        </div>
      ) : agents.length === 0 ? (
        <div className="neo-card text-center py-20 bg-white">
          <Bot size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-2xl font-black space-grotesk mb-2">No agents found</h3>
          <p className="font-bold text-gray-500">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map(agent => (
            <div key={agent.id} className="neo-card flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-[var(--secondary-accent)] neo-border flex items-center justify-center overflow-hidden">
                  {agent.logo ? (
                    <img src={pb.files.getUrl(agent, agent.logo)} alt={agent.name} className="w-full h-full object-cover" />
                  ) : (
                    <Bot size={32} className="text-black" />
                  )}
                </div>
                <span className="neo-badge bg-[var(--primary-accent)] text-black">{agent.type}</span>
              </div>
              
              <h3 className="text-2xl font-black space-grotesk mb-2 line-clamp-1">{agent.name}</h3>
              <p className="font-medium text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-grow">
                {agent.description}
              </p>
              
              <div className="flex items-center justify-between mb-6 font-bold text-sm">
                <div className="flex items-center text-yellow-500">
                  <Star size={16} className="fill-current mr-1" />
                  <span className="text-black dark:text-white">{agent.rating || 'New'}</span>
                </div>
                <div className="text-lg font-black">
                  {agent.price === 0 ? 'Free' : `$${agent.price}`}
                </div>
              </div>
              
              <div className="flex gap-3 mt-auto">
                <Link to={`/market-agents/${agent.id}`} className="neo-button bg-white text-black flex-1 text-center py-2 px-0 text-sm">
                  Details
                </Link>
                <Link to={`/setup-agent/${agent.id}`} className="neo-button bg-[var(--primary-accent)] text-black flex-1 text-center py-2 px-0 text-sm">
                  <Download size={16} className="mr-1" /> Install
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-16">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="neo-button bg-white disabled:opacity-50">Previous</button>
          <span className="font-black space-grotesk text-xl">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="neo-button bg-white disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
};

export default MarketAgentsPage;
