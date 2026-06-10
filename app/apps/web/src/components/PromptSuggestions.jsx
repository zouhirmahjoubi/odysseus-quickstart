
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const PROMPTS = [
  { category: 'Model Comparison', text: 'Compare Llama 3 8B vs Mistral 7B for coding' },
  { category: 'Model Comparison', text: 'Which model is best for 24GB VRAM?' },
  { category: 'Deep Research', text: 'Summarize recent papers on AWQ quantization' },
  { category: 'Deep Research', text: 'Analyze trends in local SLMs for edge devices' },
  { category: 'Email Intelligence', text: 'Extract action items from this client thread' },
  { category: 'Email Intelligence', text: 'Draft a polite decline to a vendor pitch' },
  { category: 'Hardware Cookbook', text: 'Optimize Ubuntu 22.04 for AI inference' },
  { category: 'Hardware Cookbook', text: 'Docker compose setup for SearXNG' },
  { category: 'Autonomous Agents', text: 'Create a research agent swarm plan' },
  { category: 'Code Generation', text: 'Write a Python FastAPI server with Pydantic' },
  { category: 'Code Generation', text: 'React component for a terminal UI' },
  { category: 'System Administration', text: 'Bash script to monitor GPU temps' }
];

const PromptSuggestions = ({ onSelect }) => {
  const [search, setSearch] = useState('');

  const filtered = PROMPTS.filter(p => 
    p.text.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="neo-card bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] p-4 flex flex-col h-full">
      <h3 className="font-bold mb-4 text-lg">Sample Prompts</h3>
      <div className="relative mb-4">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 opacity-50" size={16} />
        <input 
          type="text" 
          placeholder="Filter prompts..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="neo-input w-full pl-8 py-2 text-sm"
        />
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-2">
        {filtered.map((p, i) => (
          <motion.button
            key={i}
            whileHover={{ x: 2 }}
            onClick={() => onSelect(p.text)}
            className="text-left p-2 bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] neo-border text-sm hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] transition-colors"
          >
            <div className="text-xs opacity-60 mb-1">{p.category}</div>
            {p.text}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default PromptSuggestions;
