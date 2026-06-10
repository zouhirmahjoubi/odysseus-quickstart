
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import BreadcrumbNav from '@/components/BreadcrumbNav.jsx';
import ModelSelector from '@/components/ModelSelector.jsx';
import ModelInfoPanel from '@/components/ModelInfoPanel.jsx';
import { Play, Copy, Trash2, Terminal, AlertCircle } from 'lucide-react';
import { MODELS_LLM } from '@/data/llmModelsDatabase.js';
import { toast } from 'sonner';

const WorkspaceSimulatorPage = () => {
  const [selectedModelId, setSelectedModelId] = useState('gpt-4');
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [stats, setStats] = useState({ tokens: 0, time: 0 });

  const selectedModel = MODELS_LLM.find(m => m.id === selectedModelId) || MODELS_LLM[0];

  const handleSimulate = () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to simulate.');
      return;
    }
    
    setIsSimulating(true);
    setOutput('');
    
    // Simulate delay based on model speed metric
    const baseDelay = 3000;
    const speedFactor = 11 - selectedModel.performanceMetrics.speed; // 1-10 mapped to delay multiplier
    const delay = Math.max(800, baseDelay * (speedFactor / 5));
    
    setTimeout(() => {
      setIsSimulating(false);
      const mockOutput = `[SIMULATED OUTPUT - ${selectedModel.name}]\n\nBased on your prompt, here is the simulated response from the sandbox environment. This text is generated to preview how the API integration flow operates before you commit to production endpoints.\n\nInput Prompt length: ${prompt.length} characters.\nMode: Standard Inference.`;
      setOutput(mockOutput);
      
      // Calculate mock stats
      setStats({
        tokens: Math.floor(prompt.length / 4) + Math.floor(mockOutput.length / 4),
        time: (delay / 1000).toFixed(2)
      });
      
      toast.success('Simulation complete');
    }, delay);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success('Output copied to clipboard');
  };

  const handleClear = () => {
    setPrompt('');
    setOutput('');
    setStats({ tokens: 0, time: 0 });
  };

  return (
    <div className="min-h-screen bg-background pt-12 pb-20">
      <Helmet>
        <title>Workspace Simulator | OdysseusAI</title>
      </Helmet>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BreadcrumbNav />
        
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black bg-primary text-black text-sm font-black mb-4 uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Testing Sandbox
          </div>
          <h1 className="text-5xl md:text-6xl font-black uppercase mb-4 text-balance">Workspace Simulator</h1>
          <p className="text-xl font-medium text-muted-foreground max-w-3xl">
            Test and simulate environments across multiple AI providers before deploying to production infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Controls & Info */}
          <div className="lg:col-span-1 space-y-6 flex flex-col h-full">
            <div className="bg-card border-4 border-black p-5 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <label className="block text-sm font-black uppercase tracking-widest mb-3 border-b-2 border-black pb-1">
                Target Model
              </label>
              <ModelSelector 
                selectedModelId={selectedModelId} 
                onModelSelect={setSelectedModelId} 
              />
            </div>

            <div className="flex-grow">
              <ModelInfoPanel selectedModelId={selectedModelId} />
            </div>
            
            <div className="bg-accent/20 border-4 border-accent p-5 rounded-lg border-dashed">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-accent-foreground shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-accent-foreground leading-relaxed">
                  This is a sandbox environment. Output is mocked for frontend testing purposes. API keys are not billed during simulator runs.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Simulator Input/Output */}
          <div className="lg:col-span-2 space-y-6 flex flex-col">
            
            {/* Input Area */}
            <div className="bg-[#FFFDF0] border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
              <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
                <span className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
                  <Terminal size={16} /> Input Prompt
                </span>
                <button onClick={handleClear} className="text-xs font-bold hover:text-red-400 transition-colors uppercase tracking-widest">
                  Clear
                </button>
              </div>
              <div className="p-4 flex-grow">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your system instructions and user prompt here..."
                  className="w-full h-48 resize-none bg-transparent border-none focus:ring-0 text-black font-medium font-mono p-0 placeholder:text-black/30"
                  spellCheck="false"
                />
              </div>
              <div className="p-4 border-t-4 border-black bg-white flex justify-end">
                <button
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="neo-button bg-primary px-8 py-3 font-black uppercase flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSimulating ? (
                    <>
                      <div className="w-5 h-5 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play size={18} strokeWidth={3} /> Run Simulation
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Output Area */}
            <div className="bg-slate-900 border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full min-h-[300px] overflow-hidden">
              <div className="bg-black border-b-2 border-slate-700 text-white px-4 py-3 flex items-center justify-between">
                <span className="font-black uppercase tracking-widest text-sm text-green-400 flex items-center gap-2">
                  <Terminal size={16} /> Output Terminal
                </span>
                <div className="flex items-center gap-3">
                  <button onClick={handleCopy} className="text-xs font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest">
                    <Copy size={14} /> Copy
                  </button>
                </div>
              </div>
              
              <div className="p-4 flex-grow bg-slate-900 text-green-400 font-mono text-sm leading-relaxed overflow-y-auto">
                {!output && !isSimulating && (
                  <span className="text-slate-600 italic">&gt; Waiting for execution...</span>
                )}
                {isSimulating && (
                  <span className="animate-pulse">&gt; Processing request via {selectedModel.name}...</span>
                )}
                {output && (
                  <div className="whitespace-pre-wrap">{output}</div>
                )}
              </div>
              
              {output && (
                <div className="bg-slate-950 border-t-2 border-slate-800 p-3 text-xs font-mono text-slate-400 flex gap-6">
                  <span>Tokens: {stats.tokens}</span>
                  <span>Time: {stats.time}s</span>
                  <span>Status: 200 OK</span>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default WorkspaceSimulatorPage;
