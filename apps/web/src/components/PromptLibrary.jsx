
import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Play, BookOpen, Code, Database, Network, Cpu, Server, Scale, Shield, Mail, Send, Settings } from 'lucide-react';
import { PROMPT_TEMPLATES, searchPrompts } from '@/data/promptTemplates.js';

const ICON_MAP = {
  BookOpen: <BookOpen size={16} />,
  Code: <Code size={16} />,
  Database: <Database size={16} />,
  Network: <Network size={16} />,
  Cpu: <Cpu size={16} />,
  Server: <Server size={16} />,
  Scale: <Scale size={16} />,
  Shield: <Shield size={16} />,
  Mail: <Mail size={16} />,
  Send: <Send size={16} />,
  Settings: <Settings size={16} />
};

const PromptLibrary = ({ onPromptSelect, selectedPromptId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(
    Object.keys(PROMPT_TEMPLATES.categories).reduce((acc, cat) => ({ ...acc, [cat]: true }), {})
  );

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const categories = Object.entries(PROMPT_TEMPLATES.categories);
  const searchResults = searchQuery ? searchPrompts(searchQuery) : null;

  return (
    <div className="flex flex-col h-full bg-[hsl(var(--workspace-sidebar))] overflow-hidden">
      <div className="p-4 border-b-[3px] border-[hsl(var(--workspace-border-color))] bg-[hsl(var(--card))] shrink-0">
        <h2 className="text-xl font-black mb-4 uppercase tracking-tight text-black flex items-center gap-2">
          <BookOpen size={20} /> Prompt Library
        </h2>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
          <input 
            type="text" 
            placeholder="Filter prompts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Filter prompts"
            className="w-full pl-10 pr-4 py-2 border-[3px] border-[hsl(var(--workspace-border-color))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] font-bold focus:outline-none focus:ring-0 shadow-[2px_2px_0px_0px_#000000] focus:shadow-[4px_4px_0px_0px_#000000] transition-shadow placeholder:text-[hsl(var(--muted-foreground))]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {searchResults ? (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-black/70 uppercase">Search Results ({searchResults.length})</h3>
            {searchResults.map(prompt => (
              <PromptCard 
                key={prompt.id} 
                prompt={prompt} 
                isSelected={selectedPromptId === prompt.id}
                onSelect={() => onPromptSelect(prompt)}
              />
            ))}
            {searchResults.length === 0 && (
              <p className="text-black font-medium opacity-70">No prompts found matching "{searchQuery}"</p>
            )}
          </div>
        ) : (
          categories.map(([categoryName, prompts]) => (
            <div key={categoryName} className="mb-4">
              <button 
                onClick={() => toggleCategory(categoryName)}
                aria-expanded={expandedCategories[categoryName]}
                className="w-full flex items-center justify-between p-2 mb-3 bg-[hsl(var(--workspace-highlight))] border-[3px] border-[hsl(var(--workspace-border-color))] shadow-[2px_2px_0px_0px_#000000] hover:-translate-y-0.5 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                <span className="font-black text-black uppercase tracking-wide text-sm">{categoryName}</span>
                {expandedCategories[categoryName] ? <ChevronDown size={18} className="text-black"/> : <ChevronRight size={18} className="text-black"/>}
              </button>
              
              {expandedCategories[categoryName] && (
                <div className="space-y-3 pl-2 border-l-[3px] border-black ml-2 mt-2">
                  {prompts.map(prompt => (
                    <PromptCard 
                      key={prompt.id} 
                      prompt={prompt} 
                      isSelected={selectedPromptId === prompt.id}
                      onSelect={() => onPromptSelect(prompt)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const PromptCard = ({ prompt, isSelected, onSelect }) => {
  return (
    <button 
      onClick={onSelect}
      aria-label={`Select prompt: ${prompt.title}`}
      className={`w-full text-left p-3 border-[3px] border-[hsl(var(--workspace-border-color))] shadow-[2px_2px_0px_0px_#000000] cursor-pointer transition-all hover:-translate-y-1 hover:border-[hsl(var(--workspace-accent))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${isSelected ? 'bg-[hsl(var(--workspace-highlight))] shadow-[4px_4px_0px_0px_#000000]' : 'bg-[hsl(var(--card))]'}`}
    >
      <div className="flex items-start justify-between mb-1">
        <h4 className="font-bold text-[hsl(var(--foreground))] leading-tight flex items-center gap-1.5">
          {ICON_MAP[prompt.icon] || <BookOpen size={16}/>} 
          {prompt.title}
        </h4>
      </div>
      <p className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-3 line-clamp-2 leading-relaxed">
        {prompt.description}
      </p>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-wrap gap-1">
          {prompt.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[10px] font-bold bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] px-1.5 py-0.5 border border-black">
              {tag}
            </span>
          ))}
        </div>
        <div className="p-1.5 bg-black text-white hover:bg-[hsl(var(--workspace-accent))] hover:text-black transition-colors rounded-none border-2 border-transparent">
          <Play size={14} aria-hidden="true" />
        </div>
      </div>
    </button>
  );
};

export default PromptLibrary;
