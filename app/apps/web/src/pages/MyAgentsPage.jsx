
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Bot, Settings, Play, Trash2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

const MyAgentsPage = () => {
  const { user } = useAuth();
  const [userAgents, setUserAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchAgents = async () => {
      try {
        const records = await pb.collection('user_agents').getFullList({
          filter: `user_id="${user.id}"`,
          expand: 'agent_id',
          sort: '-created',
          $autoCancel: false
        });
        setUserAgents(records);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, [user]);

  if (loading) return <div className="p-12 font-black text-center text-2xl">Loading your agents...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Helmet><title>My Agents - OdysseusAI</title></Helmet>
      
      <div className="flex justify-between items-end mb-12 border-b-[3px] border-black pb-4">
        <div>
          <h1 className="text-5xl font-black space-grotesk mb-2">My Agents</h1>
          <p className="font-bold text-gray-600">Manage and configure your installed AI agents.</p>
        </div>
        <Link to="/market-agents" className="neo-button bg-[var(--primary-accent)] text-black hidden md:flex">
          Browse Market
        </Link>
      </div>

      {userAgents.length === 0 ? (
        <div className="neo-card text-center py-20 bg-white">
          <Bot size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-2xl font-black space-grotesk mb-2">No agents installed</h3>
          <p className="font-bold text-gray-500 mb-6">Visit the marketplace to find and install agents.</p>
          <Link to="/market-agents" className="neo-button bg-black text-white">Go to Marketplace</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {userAgents.map(ua => {
            const agent = ua.expand?.agent_id;
            if (!agent) return null;
            return (
              <div key={ua.id} className="neo-card flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-[var(--secondary-accent)] neo-border flex items-center justify-center">
                    <Bot size={24} className="text-black" />
                  </div>
                  <span className={`neo-badge ${ua.status === 'active' ? 'bg-[var(--primary-accent)]' : 'bg-gray-200'}`}>
                    {ua.status.toUpperCase()}
                  </span>
                </div>
                
                <h3 className="text-2xl font-black space-grotesk mb-1">{agent.name}</h3>
                <p className="text-sm font-bold text-gray-500 mb-6">Installed: {new Date(ua.created).toLocaleDateString()}</p>
                
                <div className="flex gap-2 mt-auto">
                  <Link to={`/my-agents/${ua.id}/config`} className="neo-button bg-white text-black flex-1 px-0 py-2 text-sm">
                    <Settings size={16} className="mr-1" /> Config
                  </Link>
                  <Link to={`/test-agent/${agent.id}`} className="neo-button bg-black text-white flex-1 px-0 py-2 text-sm">
                    <Play size={16} className="mr-1" /> Test
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyAgentsPage;
