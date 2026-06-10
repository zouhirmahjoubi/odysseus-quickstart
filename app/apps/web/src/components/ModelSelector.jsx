
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { MODELS_LLM } from '@/data/llmModelsDatabase.js';

const ModelSelector = ({ selectedModelId, onModelSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedModel = MODELS_LLM.find(m => m.id === selectedModelId) || MODELS_LLM[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const providers = [...new Set(MODELS_LLM.map(m => m.provider))];

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#FFFDF0] border-4 border-black rounded-[8px] px-4 py-3 flex items-center justify-between font-black text-black text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#B3DDF2] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate pr-4 flex items-center gap-2">
          <span className="text-xs px-2 py-1 bg-black text-white rounded-md tracking-widest uppercase">{selectedModel.provider}</span>
          <span className="text-sm md:text-base">{selectedModel.name}</span>
        </span>
        <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} strokeWidth={3} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#FFFDF0] border-4 border-black rounded-[8px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 max-h-[60vh] overflow-y-auto">
          {providers.map(provider => {
            const providerModels = MODELS_LLM.filter(m => m.provider === provider);
            return (
              <div key={provider} className="border-b-4 border-black last:border-b-0">
                <div className="px-4 py-2 bg-black text-white text-xs font-black uppercase tracking-widest sticky top-0 z-10">
                  {provider}
                </div>
                <div>
                  {providerModels.map(model => (
                    <button
                      key={model.id}
                      onClick={() => {
                        onModelSelect(model.id);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 border-b-2 border-black/10 last:border-b-0 hover:bg-[#B3DDF2] transition-colors flex items-center justify-between group"
                      role="option"
                      aria-selected={selectedModelId === model.id}
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-black text-sm group-hover:underline decoration-2">{model.name}</span>
                        <span className="text-xs text-muted-foreground font-medium mt-0.5 max-w-[250px] truncate">{model.description}</span>
                      </div>
                      {selectedModelId === model.id && (
                        <Check className="w-5 h-5 text-black" strokeWidth={3} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
