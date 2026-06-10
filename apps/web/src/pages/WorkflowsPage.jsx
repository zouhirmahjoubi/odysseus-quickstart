
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { GitMerge, Plus, Play, Settings, Activity, Trash2 } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const WorkflowsPage = () => {
  const { user } = useAuth();
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkflows = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await apiServerClient.fetch('/workflows', { headers: { 'x-user-id': user.id } });
      const data = await res.json();
      setWorkflows(data.items || []);
    } catch (err) {
      toast.error('Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWorkflows(); }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this workflow?')) return;
    try {
      await apiServerClient.fetch(`/workflows/${id}`, { method: 'DELETE', headers: { 'x-user-id': user.id } });
      toast.success('Workflow deleted');
      fetchWorkflows();
    } catch (err) {
      toast.error('Failed to delete workflow');
    }
  };

  const handleRun = async (id) => {
    try {
      const res = await apiServerClient.fetch(`/workflows/${id}/run`, { 
        method: 'POST',
        headers: { 'x-user-id': user.id, 'Content-Type': 'application/json' },
        body: JSON.stringify({ input_data: {} })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('Workflow executed successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Helmet><title>Automation Workflows - OdysseusAI</title></Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b-[3px] border-black pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-black space-grotesk flex items-center gap-3">
            <GitMerge size={36} className="text-[var(--primary-accent)]" /> Workflows
          </h1>
          <p className="font-bold text-gray-600 mt-2">Design and execute automated agent pipelines.</p>
        </div>
        <Link to="/workflows/builder" className="neo-button bg-black text-white whitespace-nowrap">
          <Plus size={20} className="mr-2" /> Create Workflow
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-white neo-border"></div>)}
        </div>
      ) : workflows.length === 0 ? (
        <div className="neo-card bg-white text-center py-24">
          <GitMerge size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-2xl font-black mb-2">No workflows found</h3>
          <p className="font-bold text-gray-500 mb-6">Create your first automated workflow to connect agents and tasks.</p>
          <Link to="/workflows/builder" className="neo-button bg-[var(--primary-accent)] text-black">Start Building</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map(wf => (
            <div key={wf.id} className="neo-card bg-white flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <span className={`neo-badge ${wf.status === 'active' ? 'bg-[var(--secondary-accent)]' : 'bg-gray-200'}`}>
                  {wf.status.toUpperCase()}
                </span>
                <span className="neo-badge bg-[var(--background-light)] border-dashed border-gray-400">
                  Trigger: {wf.trigger_type}
                </span>
              </div>
              
              <h3 className="text-2xl font-black space-grotesk mb-2">{wf.name}</h3>
              <p className="font-medium text-gray-600 mb-6 flex-grow">{wf.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-auto border-t-[3px] border-black pt-4">
                <button onClick={() => handleRun(wf.id)} className="neo-button bg-[var(--primary-accent)] py-1.5 px-3 flex-1 text-sm"><Play size={16} className="mr-1"/> Run</button>
                <Link to={`/workflows/builder?id=${wf.id}`} className="neo-button bg-white py-1.5 px-3 flex-1 text-sm"><Settings size={16} className="mr-1"/> Edit</Link>
                <Link to={`/workflows/${wf.id}/logs`} className="neo-button bg-[var(--tertiary-accent)] py-1.5 px-3 flex-1 text-sm"><Activity size={16} className="mr-1"/> Logs</Link>
                <button onClick={() => handleDelete(wf.id)} className="neo-button bg-[hsl(var(--destructive))] text-white py-1.5 px-3 text-sm"><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkflowsPage;
