
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Edit, Trash2, Search, Bot } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';
import AgentForm from '@/components/AgentForm.jsx';

const AgentAdminPage = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('market_agents').getFullList({ sort: '-created', $autoCancel: false });
      setAgents(records);
    } catch (err) {
      toast.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAgents(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this agent?')) return;
    try {
      const res = await apiServerClient.fetch(`/odysseus-agents/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Agent deleted');
      fetchAgents();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filtered = agents.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  if (isEditing) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <AgentForm 
          agent={currentAgent} 
          onSuccess={() => { setIsEditing(false); fetchAgents(); }} 
          onCancel={() => setIsEditing(false)} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet><title>Agent Admin - OdysseusAI</title></Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b-[3px] border-black pb-4 gap-4">
        <h1 className="text-4xl font-black space-grotesk flex items-center gap-3">
          <Bot size={36} /> Market Agents
        </h1>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input type="text" placeholder="Search agents..." value={search} onChange={(e) => setSearch(e.target.value)} className="neo-input pl-10 py-2" />
            <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
          </div>
          <button onClick={() => { setCurrentAgent(null); setIsEditing(true); }} className="neo-button bg-[var(--primary-accent)] text-black whitespace-nowrap">
            <Plus size={20} className="mr-2" /> New Agent
          </button>
        </div>
      </div>

      <div className="neo-card p-0 overflow-x-auto bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[hsl(var(--background))] border-b-[3px] border-black text-sm uppercase tracking-wide">
              <th className="p-4 font-black">Name</th>
              <th className="p-4 font-black">Type</th>
              <th className="p-4 font-black">Price</th>
              <th className="p-4 font-black">Status</th>
              <th className="p-4 font-black text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center font-bold">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center font-bold text-gray-500">No agents found.</td></tr>
            ) : (
              filtered.map(agent => (
                <tr key={agent.id} className="border-b border-dashed border-gray-300 hover:bg-gray-50">
                  <td className="p-4 font-bold">{agent.name}</td>
                  <td className="p-4 font-medium text-sm">{agent.type}</td>
                  <td className="p-4 font-bold">${agent.price}</td>
                  <td className="p-4">
                    <span className={`neo-badge ${agent.status === 'active' ? 'bg-[var(--primary-accent)]' : 'bg-gray-200'}`}>
                      {agent.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setCurrentAgent(agent); setIsEditing(true); }} className="p-2 neo-border bg-white hover:bg-[var(--secondary-accent)]"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(agent.id)} className="p-2 neo-border bg-white hover:bg-red-500 hover:text-white"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentAdminPage;
