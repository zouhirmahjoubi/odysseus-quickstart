
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Users, Plus, Settings } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await apiServerClient.fetch('/teams');
        const data = await res.json();
        if (res.ok) setTeams(data.items || []);
      } catch (err) {
        toast.error('Failed to load teams');
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Helmet><title>Teams - OdysseusAI</title></Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b-[3px] border-black pb-4 gap-4">
        <h1 className="text-4xl font-black space-grotesk flex items-center gap-3">
          <Users size={36} /> Workspaces & Teams
        </h1>
        <button className="neo-button bg-[var(--primary-accent)] text-black" onClick={() => toast.info('Create team coming soon')}>
          <Plus size={20} className="mr-2" /> Create Team
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-gray-200 neo-border"></div>)}
        </div>
      ) : teams.length === 0 ? (
        <div className="neo-card bg-white text-center py-16">
          <Users size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-2xl font-black space-grotesk mb-2">No Teams Found</h3>
          <p className="font-bold text-gray-500 mb-6">Create a team to collaborate on agents and share resources.</p>
          <button className="neo-button bg-black text-white">Create Your First Team</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map(team => (
            <div key={team.id} className="neo-card bg-white flex flex-col h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[var(--secondary-accent)] neo-border flex items-center justify-center font-black text-xl">
                  {team.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-black space-grotesk text-xl">{team.name}</h3>
                  <span className="text-xs font-bold text-gray-500">Created {new Date(team.created).toLocaleDateString()}</span>
                </div>
              </div>
              <p className="font-medium text-gray-600 mb-6 flex-grow">{team.description || 'No description provided.'}</p>
              <div className="flex gap-2 mt-auto pt-4 border-t-[3px] border-black">
                <button className="neo-button bg-[var(--background-light)] text-black flex-1 px-0 py-2 text-sm">
                  View Workspace
                </button>
                <button className="neo-button bg-white text-black px-3 py-2" title="Settings">
                  <Settings size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
