
import React, { useState } from 'react';
import { Terminal, Send, Trash2, Download, Share2 } from 'lucide-react';
import TerminalOutput from '@/components/TerminalOutput.jsx';
import { toast } from 'sonner';

const TerminalSimulator = ({ 
  selectedModel, 
  temperature, 
  onSendCommand, 
  output, 
  isLoading,
  onClear,
  onExport
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const cmd = input.trim();
    onSendCommand(cmd);
    
    setHistory(prev => [cmd, ...prev].slice(0, 50));
    setHistoryIndex(-1);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInput(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const prevIdx = historyIndex - 1;
        setHistoryIndex(prevIdx);
        setInput(history[prevIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Conversation link copied to clipboard');
  };

  return (
    <div className="flex flex-col h-full bg-[hsl(var(--workspace-terminal-bg,0_0%_0%))] border-[3px] border-[hsl(var(--workspace-border-color,0_0%_0%))] shadow-[4px_4px_0px_0px_hsl(var(--workspace-border-color,0_0%_0%))] overflow-hidden font-mono-code relative">
      
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b-[3px] border-[hsl(var(--workspace-border-color,0_0%_0%))] bg-[#1A1A1A] text-white select-none">
        <div className="flex items-center gap-2 font-bold tracking-wider">
          <Terminal size={18} className="text-[hsl(var(--workspace-terminal-text,120_100%_50%))]" />
          <span>ODYSSEUS_TERMINAL</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 text-xs bg-black px-3 py-1 border border-gray-700 font-bold text-[hsl(var(--workspace-terminal-text,120_100%_50%))]">
            <span>{selectedModel}</span>
            <span className="w-px h-3 bg-gray-700"></span>
            <span>T:{temperature.toFixed(2)}</span>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleShare}
              title="Share Conversation"
              aria-label="Share Conversation"
              className="p-1.5 hover:bg-[#333] transition-colors border border-transparent hover:border-gray-500 text-gray-300 hover:text-white focus-visible:outline-none focus-visible:border-white"
            >
              <Share2 size={16} />
            </button>
            <button 
              onClick={onExport}
              title="Export Log"
              aria-label="Export Log"
              className="p-1.5 hover:bg-[#333] transition-colors border border-transparent hover:border-gray-500 text-gray-300 hover:text-white focus-visible:outline-none focus-visible:border-white"
            >
              <Download size={16} />
            </button>
            <button 
              onClick={onClear}
              title="Clear Terminal"
              aria-label="Clear Terminal"
              className="p-1.5 hover:bg-[hsl(var(--workspace-error,0_100%_50%))/20] transition-colors border border-transparent hover:border-[hsl(var(--workspace-error,0_100%_50%))] text-gray-300 hover:text-[hsl(var(--workspace-error,0_100%_50%))] focus-visible:outline-none focus-visible:border-[hsl(var(--workspace-error,0_100%_50%))]"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Body */}
      <TerminalOutput 
        output={output} 
        isLoading={isLoading} 
      />

      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t-[3px] border-[hsl(var(--workspace-border-color,0_0%_0%))] bg-[#0A0A0A]">
        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <div className="flex-shrink-0 pt-3 pb-3 text-[hsl(var(--workspace-terminal-text,120_100%_50%))] font-bold text-lg leading-none" aria-hidden="true">
            &gt;
          </div>
          <div className="flex-1 border-[2px] border-[hsl(var(--workspace-terminal-text,120_100%_50%))]/30 bg-black relative focus-within:border-[hsl(var(--workspace-terminal-text,120_100%_50%))] transition-colors">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                } else {
                  handleKeyDown(e);
                }
              }}
              placeholder="Enter command... (Shift+Enter for newline, Up/Down for history)"
              disabled={isLoading}
              rows={Math.min(5, Math.max(1, input.split('\n').length))}
              aria-label="Terminal input"
              className="w-full bg-transparent border-none outline-none text-[hsl(var(--workspace-terminal-text,120_100%_50%))] placeholder:text-green-900/50 p-3 resize-none font-mono-code"
              style={{ minHeight: '48px' }}
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            aria-label="Execute Command"
            className="border-[3px] border-[hsl(var(--workspace-border-color,0_0%_0%))] bg-[hsl(var(--workspace-highlight,142_71%_45%))] text-black font-black px-6 py-3 h-[48px] hover:bg-[hsl(var(--workspace-accent,35_100%_50%))] disabled:opacity-50 disabled:cursor-not-allowed transition-colors uppercase tracking-widest flex items-center gap-2 shadow-[2px_2px_0px_0px_#000000] hover:shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0px_0px_0px_0px_#000000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span className="hidden sm:inline">Execute</span>
            <Send size={18} aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TerminalSimulator;
