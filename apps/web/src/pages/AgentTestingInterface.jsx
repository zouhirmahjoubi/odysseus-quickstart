
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Play, Terminal, Clock, Activity, ArrowLeft } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import apiServerClient from '@/lib/apiServerClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const AgentTestingInterface = () => {
  const { agentId } = useParams();
  const { user } = useAuth();
  const [agent, setAgent] = useState(null);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [testing, setTesting] = useState(false);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    pb.collection('market_agents').getOne(agentId, { $autoCancel: false }).then(setAgent).catch(console.error);
  }, [agentId]);

  const handleTest = async () => {
    if (!input.trim() || !user) return;
    setTesting(true);
    setOutput('Initializing agent...\nConnecting to provider...\nProcessing input...\n');
    
    try {
      const res = await apiServerClient.fetch(`/odysseus-agents/${agentId}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, testInput: input })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Test failed');
      
      setOutput(prev => prev + `\n[SUCCESS] Response received:\n\n${data.output}`);
      setMetrics({ time: data.executionTime, tokens: data.tokenUsage });
    } catch (err) {
      setOutput(prev => prev + `\n[ERROR] ${err.message}`);
      toast.error('Test execution failed');
    } finally {
      setTesting(false);
    }
  };

  if (!agent) return <div className="p-8 font-black">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-64px)] flex flex-col">
      <Helmet><title>Test {agent.name} - OdysseusAI</title></Helmet>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to={`/market-agents/${agentId}`} className="p-2 neo-border bg-white hover:bg-gray-100"><ArrowLeft size={20} /></Link>
          <h1 className="text-3xl font-black space-grotesk">Testing: {agent.name}</h1>
        </div>
        <div className="flex gap-4 font-bold text-sm">
          {metrics && (
            <>
              <span className="flex items-center neo-badge bg-[var(--background-light)]"><Clock size={14} className="mr-1"/> {metrics.time}ms</span>
              <span className="flex items-center neo-badge bg-[var(--background-light)]"><Activity size={14} className="mr-1"/> {metrics.tokens} tokens</span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-grow min-h-0">
        {/* Input Area */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="neo-card bg-white flex-grow flex flex-col p-4">
            <h3 className="font-black mb-2 flex items-center"><Terminal size={18} className="mr-2"/> Input Prompt</h3>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="neo-input flex-grow resize-none font-jetbrains-mono text-sm"
              placeholder="Enter test prompt here..."
            ></textarea>
            <button 
              onClick={handleTest} 
              disabled={testing || !input.trim()} 
              className="neo-button bg-[var(--primary-accent)] text-black w-full mt-4"
            >
              {testing ? 'Executing...' : <><Play size={18} className="mr-2"/> Run Test</>}
            </button>
          </div>
        </div>

        {/* Output Area */}
        <div className="w-full lg:w-2/3 flex flex-col">
          <div className="neo-card bg-black text-[var(--primary-accent)] flex-grow flex flex-col p-0 overflow-hidden">
            <div className="bg-gray-900 p-3 border-b-[3px] border-black flex justify-between items-center">
              <span className="font-bold text-white text-sm">Execution Output</span>
            </div>
            <div className="p-4 overflow-y-auto flex-grow font-jetbrains-mono text-sm whitespace-pre-wrap">
              {output || 'Ready for input...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentTestingInterface;
