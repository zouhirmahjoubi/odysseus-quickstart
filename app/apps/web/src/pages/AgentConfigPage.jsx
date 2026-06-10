
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Save, ArrowLeft, Activity } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const AgentConfigPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userAgent, setUserAgent] = useState(null);
  const [config, setConfig] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const record = await pb.collection('user_agents').getOne(id, { expand: 'agent_id', $autoCancel: false });
        setUserAgent(record);
        setConfig(record.configuration || { environment: 'production', customPrompt: '' });
      } catch (err) {
        toast.error('Configuration not found');
        navigate('/my-agents');
      }
    };
    fetchAgent();
  }, [id, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await pb.collection('user_agents').update(id, { configuration: config }, { $autoCancel: false });
      toast.success('Configuration saved');
    } catch (err) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (!userAgent) return <div className="p-12 font-black">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet><title>Configure {userAgent.expand?.agent_id?.name}</title></Helmet>
      
      <Link to="/my-agents" className="inline-flex items-center font-bold mb-8 hover:underline">
        <ArrowLeft size={16} className="mr-2" /> Back to My Agents
      </Link>

      <div className="flex items-center justify-between mb-8 border-b-[3px] border-black pb-4">
        <h1 className="text-4xl font-black space-grotesk">{userAgent.expand?.agent_id?.name} Settings</h1>
        <span className={`neo-badge ${userAgent.status === 'active' ? 'bg-[var(--primary-accent)]' : 'bg-gray-200'}`}>
          {userAgent.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSave} className="neo-card bg-white space-y-6">
            <h2 className="text-2xl font-black space-grotesk border-b-[3px] border-black pb-2">Configuration</h2>
            
            <div>
              <label className="block font-bold mb-2">Environment</label>
              <select 
                value={config.environment || 'production'} 
                onChange={e => setConfig({...config, environment: e.target.value})} 
                className="neo-input"
              >
                <option value="development">Development</option>
                <option value="production">Production</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-2">Custom System Prompt</label>
              <textarea 
                rows="6" 
                value={config.customPrompt || ''} 
                onChange={e => setConfig({...config, customPrompt: e.target.value})} 
                className="neo-input resize-none font-jetbrains-mono text-sm"
                placeholder="Override default agent behavior..."
              ></textarea>
            </div>

            <button type="submit" disabled={saving} className="neo-button bg-[var(--primary-accent)] text-black w-full">
              {saving ? 'Saving...' : <><Save size={20} className="mr-2"/> Save Changes</>}
            </button>
          </form>
        </div>

        <div>
          <div className="neo-card bg-[var(--background-light)]">
            <h3 className="text-xl font-black space-grotesk mb-4 flex items-center"><Activity size={20} className="mr-2"/> Usage Stats</h3>
            <div className="space-y-4 font-bold text-sm">
              <div className="flex justify-between border-b border-black pb-2">
                <span className="text-gray-600">Status</span>
                <span>{userAgent.status}</span>
              </div>
              <div className="flex justify-between border-b border-black pb-2">
                <span className="text-gray-600">Installed</span>
                <span>{new Date(userAgent.created).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between border-b border-black pb-2">
                <span className="text-gray-600">Last Used</span>
                <span>{userAgent.last_used_date ? new Date(userAgent.last_used_date).toLocaleDateString() : 'Never'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentConfigPage;
