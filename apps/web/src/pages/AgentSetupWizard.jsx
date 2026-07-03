
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CheckCircle, ArrowRight, ArrowLeft, Key, Settings, Play, Rocket } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';

const AgentSetupWizard = () => {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [agent, setAgent] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [installing, setInstalling] = useState(false);

  const [config, setConfig] = useState({
    apiKey: '',
    environment: 'production',
    customPrompt: ''
  });

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const record = await pb.collection('market_agents').getOne(agentId, { $autoCancel: false });
        setAgent(record);
      } catch (err) {
        toast.error('Agent not found');
        navigate('/market-agents');
      } finally {
        setLoading(false);
      }
    };
    fetchAgent();
  }, [agentId, navigate]);

  const handleInstall = async () => {
    if (!user) {
      toast.error('Please login to install agents');
      navigate('/odysseus-login');
      return;
    }
    setInstalling(true);
    try {
      const res = await apiServerClient.fetch(`/odysseus-agents/${agentId}/install`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Installation failed');
      
      toast.success('Agent installed successfully!');
      navigate('/my-agents');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setInstalling(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-2xl">Initializing Wizard...</div>;

  const steps = [
    { id: 1, title: 'Confirm', icon: <CheckCircle size={20} /> },
    { id: 2, title: 'Credentials', icon: <Key size={20} /> },
    { id: 3, title: 'Settings', icon: <Settings size={20} /> },
    { id: 4, title: 'Test', icon: <Play size={20} /> },
    { id: 5, title: 'Deploy', icon: <Rocket size={20} /> }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-[80vh] flex flex-col">
      <Helmet><title>Setup {agent?.name} - OdysseusAI</title></Helmet>
      
      <div className="mb-12">
        <h1 className="text-4xl font-black space-grotesk mb-8 text-center">Agent Setup Wizard</h1>
        
        {/* Progress Bar */}
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-300 -z-10"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-black -z-10 transition-all duration-300" style={{ width: `${((step - 1) / 4) * 100}%` }}></div>
          
          {steps.map(s => (
            <div key={s.id} className="flex flex-col items-center gap-2 bg-[hsl(var(--background))] px-2">
              <div className={`w-10 h-10 rounded-none neo-border flex items-center justify-center font-bold transition-colors ${step >= s.id ? 'bg-[var(--primary-accent)] text-black' : 'bg-white text-gray-400'}`}>
                {s.icon}
              </div>
              <span className={`text-xs font-bold ${step >= s.id ? 'text-black dark:text-white' : 'text-gray-400'}`}>{s.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="neo-card bg-white flex-grow flex flex-col">
        {step === 1 && (
          <div className="flex-grow">
            <h2 className="text-2xl font-black space-grotesk mb-4">Confirm Installation</h2>
            <p className="font-bold text-gray-600 mb-6">You are about to install <strong>{agent.name}</strong> into your workspace.</p>
            <div className="p-4 bg-[var(--background-light)] neo-border mb-6">
              <h3 className="font-black mb-2">Agent Details</h3>
              <p className="font-medium text-sm mb-1">Type: {agent.type}</p>
              <p className="font-medium text-sm mb-1">Category: {agent.category}</p>
              <p className="font-medium text-sm">Price: {agent.price === 0 ? 'Free' : `$${agent.price}`}</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex-grow">
            <h2 className="text-2xl font-black space-grotesk mb-4">API Credentials</h2>
            <p className="font-bold text-gray-600 mb-6">Provide the necessary API keys for this agent to function.</p>
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-2">Provider API Key *</label>
                <input type="password" value={config.apiKey} onChange={e=>setConfig({...config, apiKey: e.target.value})} className="neo-input" placeholder="sk-..." />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex-grow">
            <h2 className="text-2xl font-black space-grotesk mb-4">Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-2">Environment</label>
                <select value={config.environment} onChange={e=>setConfig({...config, environment: e.target.value})} className="neo-input">
                  <option value="development">Development</option>
                  <option value="production">Production</option>
                </select>
              </div>
              <div>
                <label className="block font-bold mb-2">System Prompt Override (Optional)</label>
                <textarea rows="4" value={config.customPrompt} onChange={e=>setConfig({...config, customPrompt: e.target.value})} className="neo-input resize-none" placeholder="You are a helpful assistant..."></textarea>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex-grow">
            <h2 className="text-2xl font-black space-grotesk mb-4">Connection Test</h2>
            <p className="font-bold text-gray-600 mb-6">Let's verify your configuration before deployment.</p>
            <div className="p-8 border-2 border-dashed border-gray-300 text-center">
              <button className="neo-button bg-[var(--secondary-accent)] text-black">Run Diagnostic Test</button>
              <p className="text-sm font-bold text-gray-500 mt-4">This will send a ping to the provider API.</p>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="flex-grow text-center py-8">
            <Rocket size={64} className="mx-auto mb-6 text-[var(--primary-accent)]" />
            <h2 className="text-3xl font-black space-grotesk mb-4">Ready for Deployment</h2>
            <p className="font-bold text-gray-600 mb-8">All configurations are set. Click below to finalize installation.</p>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t-[3px] border-black">
          <button 
            onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/market-agents')} 
            className="neo-button bg-white text-black"
          >
            {step === 1 ? 'Cancel' : <><ArrowLeft size={18} className="mr-2" /> Back</>}
          </button>
          
          {step < 5 ? (
            <button onClick={() => setStep(s => s + 1)} className="neo-button bg-black text-white hover:bg-[var(--primary-accent)] hover:text-black">
              Next <ArrowRight size={18} className="ml-2" />
            </button>
          ) : (
            <button onClick={handleInstall} disabled={installing} className="neo-button bg-[var(--primary-accent)] text-black">
              {installing ? 'Deploying...' : 'Deploy Agent'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentSetupWizard;
