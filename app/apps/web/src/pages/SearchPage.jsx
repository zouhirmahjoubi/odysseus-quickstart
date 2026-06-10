
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Filter, Clock, ArrowRight, Bot, BookOpen, Package, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import apiServerClient from '@/lib/apiServerClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const SearchPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (user) {
      apiServerClient.fetch('/search/history')
        .then(res => res.json())
        .then(data => setHistory(data.items || []))
        .catch(console.error);
    }
  }, [user]);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const typeParam = activeTab !== 'all' ? `&type=${activeTab}` : '';
      const res = await apiServerClient.fetch(`/search?q=${encodeURIComponent(query)}${typeParam}`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setResults(data.results);
      
      // Refresh history
      if (user) {
        apiServerClient.fetch('/search/history').then(r => r.json()).then(d => setHistory(d.items || []));
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!user) return;
    try {
      await apiServerClient.fetch('/search/history', { method: 'DELETE' });
      setHistory([]);
      toast.success('Search history cleared');
    } catch (err) {
      toast.error('Failed to clear history');
    }
  };

  const renderResultIcon = (type) => {
    switch(type) {
      case 'agents': return <Bot size={20} />;
      case 'blog': return <BookOpen size={20} />;
      case 'products': return <Package size={20} />;
      case 'users': return <Users size={20} />;
      default: return <Search size={20} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Helmet><title>Global Search - OdysseusAI</title></Helmet>
      
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-black space-grotesk mb-6 tracking-tight">
          Explore <span className="text-[var(--primary-accent)]">Everything</span>
        </h1>
        <p className="text-xl font-bold text-gray-600 max-w-2xl mx-auto">
          Search across agents, workflows, knowledge base, and assets in one place.
        </p>
      </div>

      <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?" 
              className="neo-input text-lg pl-12 py-4 h-full"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
          </div>
          <button type="submit" disabled={loading} className="neo-button bg-[var(--primary-accent)] text-black text-lg px-8">
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {['all', 'agents', 'blog', 'products'].map(tab => (
          <button 
            key={tab}
            onClick={() => { setActiveTab(tab); if(query) handleSearch(); }}
            className={`neo-badge text-sm py-2 px-4 cursor-pointer transition-colors ${activeTab === tab ? 'bg-black text-white' : 'bg-white hover:bg-[var(--secondary-accent)]'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {results ? (
        <div className="space-y-12">
          {Object.entries(results).map(([type, data]) => {
            if (!data.items || data.items.length === 0) return null;
            return (
              <div key={type} className="neo-card bg-white p-0 overflow-hidden">
                <div className="bg-[hsl(var(--background))] border-b-[3px] border-black p-4 flex justify-between items-center">
                  <h2 className="text-2xl font-black space-grotesk flex items-center gap-2 capitalize">
                    {renderResultIcon(type)} {type}
                  </h2>
                  <Link to={`/${type}/search?q=${query}`} className="font-bold text-sm hover:underline flex items-center">
                    View all {data.count} <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
                <div className="divide-y-[3px] divide-black">
                  {data.items.map(item => (
                    <div key={item.id} className="p-6 hover:bg-[var(--background-light)] transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold">{item.name || item.title}</h3>
                        {item.type && <span className="neo-badge bg-[var(--tertiary-accent)]">{item.type}</span>}
                      </div>
                      <p className="text-gray-600 font-medium line-clamp-2">{item.description || item.excerpt || item.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {Object.values(results).every(d => !d.items || d.items.length === 0) && (
            <div className="text-center py-12 neo-card bg-white">
              <Search size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-2xl font-black mb-2">No results found</h3>
              <p className="font-bold text-gray-500">Try adjusting your search terms.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Recent Searches */}
          <div className="neo-card bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black space-grotesk flex items-center"><Clock size={20} className="mr-2" /> Recent Searches</h3>
              {history.length > 0 && <button onClick={clearHistory} className="text-sm font-bold text-gray-500 hover:text-black">Clear</button>}
            </div>
            {history.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {history.map(h => (
                  <button key={h.id} onClick={() => { setQuery(h.search_query); handleSearch(); }} className="neo-badge bg-[var(--background-light)] hover:bg-[var(--secondary-accent)] cursor-pointer">
                    {h.search_query}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm font-bold text-gray-400">No recent searches.</p>
            )}
          </div>

          {/* Trending Searches */}
          <div className="neo-card bg-white">
            <h3 className="text-xl font-black space-grotesk flex items-center mb-6"><Filter size={20} className="mr-2" /> Trending Topics</h3>
            <div className="flex flex-wrap gap-2">
              {['CrewAI Agents', 'OpenAI Integration', 'Data Scraping', 'Automation Workflows', 'Custom LLMs'].map(term => (
                <button key={term} onClick={() => { setQuery(term); handleSearch(); }} className="neo-badge bg-black text-white hover:bg-[var(--primary-accent)] hover:text-black cursor-pointer">
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
