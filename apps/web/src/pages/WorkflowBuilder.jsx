
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Save, Plus, GitMerge, Settings, Play, ArrowLeft } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const WorkflowBuilder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');

  const [formData, setFormData] = useState({
    name: 'New Workflow',
    description: '',
    trigger_type: 'manual',
    status: 'active',
    steps: []
  });
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editId && user) {
      apiServerClient.fetch(`/workflows/${editId}`, { headers: { 'x-user-id': user.id } })
        .then(res => res.json())
        .then(data => setFormData(data))
        .catch(() => toast.error('Failed to load workflow'));
    }
  }, [editId, user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const url = editId ? `/workflows/${editId}` : '/workflows';
      const method = editId ? 'PUT' : 'POST';
      
      const res = await apiServerClient.fetch(url, {
        method,
        headers: { 'x-user-id': user.id, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      toast.success('Workflow saved successfully');
      navigate('/workflows');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, { id: Date.now(), type: 'run_agent', config: {} }]
    }));
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-[hsl(var(--background))]">
      <Helmet><title>Workflow Builder - OdysseusAI</title></Helmet>

      {/* Top Bar */}
      <div className="bg-white border-b-[3px] border-black p-4 flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/workflows')} className="p-2 neo-border bg-[var(--background-light)] hover:bg-gray-200">
            <ArrowLeft size={20} />
          </button>
          <div>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="text-2xl font-black space-grotesk bg-transparent border-none outline-none focus:ring-0 w-64"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button className="neo-button bg-[var(--tertiary-accent)] py-2 text-sm"><Play size={16} className="mr-2"/> Test Run</button>
          <button onClick={handleSave} disabled={saving} className="neo-button bg-[var(--primary-accent)] py-2 text-sm">
            <Save size={16} className="mr-2"/> {saving ? 'Saving...' : 'Save Workflow'}
          </button>
        </div>
      </div>

      {/* Builder Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Settings Panel */}
        <div className="w-80 bg-white border-r-[3px] border-black p-6 overflow-y-auto shrink-0 hidden md:block">
          <h3 className="font-black text-xl space-grotesk mb-6 flex items-center"><Settings size={20} className="mr-2"/> Settings</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block font-bold mb-2 text-sm">Description</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="neo-input text-sm resize-none" rows="3"
                placeholder="What does this workflow do?"
              />
            </div>
            <div>
              <label className="block font-bold mb-2 text-sm">Trigger Type</label>
              <select 
                value={formData.trigger_type}
                onChange={e => setFormData({...formData, trigger_type: e.target.value})}
                className="neo-input text-sm"
              >
                <option value="manual">Manual Trigger</option>
                <option value="schedule">Scheduled Cron</option>
                <option value="webhook">Webhook Event</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-2 text-sm">Status</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="neo-input text-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Visual Canvas (Simplified List View for React without heavy canvas libs) */}
        <div className="flex-1 p-8 overflow-y-auto bg-[var(--background-light)] relative" style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '20px 20px', backgroundPosition: '0 0' }}>
          
          <div className="max-w-2xl mx-auto space-y-6 relative pb-24">
            {/* Trigger Node */}
            <div className="neo-card bg-black text-white p-6 relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-[var(--primary-accent)] text-black p-2 neo-border"><GitMerge size={20} /></div>
                <h3 className="font-black text-xl space-grotesk">Trigger: {formData.trigger_type.toUpperCase()}</h3>
              </div>
              <p className="text-sm text-gray-300 font-bold">Initiates the workflow sequence.</p>
            </div>

            {/* Connection Line */}
            <div className="w-1 bg-black absolute left-1/2 -translate-x-1/2 top-20 bottom-10 -z-0 border-l-[3px] border-r-[3px] border-dashed border-gray-400 bg-transparent"></div>

            {/* Action Nodes */}
            {formData.steps.map((step, index) => (
              <div key={step.id} className="neo-card bg-white p-6 relative z-10">
                <div className="absolute -top-3 -left-3 bg-[var(--secondary-accent)] w-8 h-8 flex items-center justify-center font-black neo-border">
                  {index + 1}
                </div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-lg space-grotesk">Action Step</h3>
                  <button 
                    onClick={() => setFormData(prev => ({...prev, steps: prev.steps.filter(s => s.id !== step.id)}))}
                    className="text-red-500 font-bold text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <div>
                  <label className="block font-bold mb-2 text-sm">Action Type</label>
                  <select 
                    value={step.type}
                    onChange={e => {
                      const newSteps = [...formData.steps];
                      newSteps[index].type = e.target.value;
                      setFormData({...formData, steps: newSteps});
                    }}
                    className="neo-input py-2 text-sm"
                  >
                    <option value="run_agent">Execute AI Agent</option>
                    <option value="http_request">HTTP Webhook</option>
                    <option value="send_email">Send Email</option>
                    <option value="conditional">Logic: If/Else</option>
                  </select>
                </div>
              </div>
            ))}

            {/* Add Node Button */}
            <div className="text-center relative z-10 pt-4">
              <button onClick={addStep} className="neo-button bg-[var(--secondary-accent)] rounded-full px-6 py-4 shadow-[4px_4px_0px_0px_#000000]">
                <Plus size={24} className="mr-2" /> Add Step
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
