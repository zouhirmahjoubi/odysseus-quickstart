
import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const modelTiers = [
  {
    id: 'tier-1',
    title: 'Ultra-Lightweight',
    description: 'Highly efficient models designed for edge computing and mobile deployment.',
    models: [
      {
        id: 'tinyllama-1b',
        name: 'TinyLlama 1.1B',
        company: 'Open Source',
        description: 'Extremely small and fast baseline model for constrained environments.',
        vram: '0.6 GB',
        recommended: false,
      },
      {
        id: 'phi-2',
        name: 'Phi 2.7B',
        company: 'Microsoft',
        description: 'Punches above its weight class with strong reasoning capabilities.',
        vram: '1.4 GB',
        recommended: true,
      },
      {
        id: 'mobilellm-1.5b',
        name: 'MobileLLM 1.5B',
        company: 'Meta',
        description: 'Specifically optimized for mobile platform architecture.',
        vram: '0.8 GB',
        recommended: false,
      },
    ]
  },
  {
    id: 'tier-2',
    title: 'Lightweight',
    description: 'Capable small models for local execution on consumer hardware.',
    models: [
      {
        id: 'qwen-3b',
        name: 'Qwen 3B',
        company: 'Alibaba',
        description: 'Strong multilingual performance in a compact footprint.',
        vram: '1.8 GB',
        recommended: false,
      },
      {
        id: 'gemma-2b',
        name: 'Gemma 2B',
        company: 'Google',
        description: 'Built on the same research and technology as Gemini.',
        vram: '1.2 GB',
        recommended: true,
      },
      {
        id: 'mistral-3b',
        name: 'Mistral 3B',
        company: 'Mistral AI',
        description: 'Efficient instruct-tuned model for quick reasoning.',
        vram: '1.9 GB',
        recommended: false,
      },
    ]
  },
  {
    id: 'tier-3',
    title: 'Standard',
    description: 'The sweet spot for general purpose local AI and agent operations.',
    models: [
      {
        id: 'mistral-7b',
        name: 'Mistral 7B',
        company: 'Mistral AI',
        description: 'Industry standard for the 7B class with exceptional instruction following.',
        vram: '3.6 GB',
        recommended: true,
      },
      {
        id: 'llama-2-7b',
        name: 'Llama 2 7B',
        company: 'Meta',
        description: 'Solid foundational model with vast ecosystem support.',
        vram: '3.8 GB',
        recommended: false,
      },
      {
        id: 'qwen-7b',
        name: 'Qwen 7B',
        company: 'Alibaba',
        description: 'Excels at coding and complex multilingual tasks.',
        vram: '3.5 GB',
        recommended: false,
      },
      {
        id: 'zephyr-7b',
        name: 'Zephyr 7B',
        company: 'Hugging Face',
        description: 'Fine-tuned specifically for natural chat interactions.',
        vram: '3.7 GB',
        recommended: false,
      },
      {
        id: 'neural-chat-7b',
        name: 'Neural Chat 7B',
        company: 'Intel',
        description: 'Optimized for Intel architectures and general chat.',
        vram: '3.6 GB',
        recommended: false,
      },
      {
        id: 'openchat-3.5-7b',
        name: 'Openchat 3.5 7B',
        company: 'Openchat',
        description: 'Achieves high benchmarks using conditioned RLHF.',
        vram: '3.5 GB',
        recommended: false,
      },
    ]
  },
  {
    id: 'tier-4',
    title: 'Advanced',
    description: 'Higher parameter count for robust analytical and generation tasks.',
    models: [
      {
        id: 'llama-2-13b',
        name: 'Llama 2 13B',
        company: 'Meta',
        description: 'Noticeable step up in reasoning capability over 7B class.',
        vram: '6.5 GB',
        recommended: true,
      },
      {
        id: 'mistral-medium',
        name: 'Mistral Medium',
        company: 'Mistral AI',
        description: 'Highly capable reasoning model for enterprise tasks.',
        vram: '7.2 GB',
        recommended: false,
      },
      {
        id: 'qwen-14b',
        name: 'Qwen 14B',
        company: 'Alibaba',
        description: 'Exceptional math and coding performance.',
        vram: '7.1 GB',
        recommended: false,
      },
      {
        id: 'falcon-40b',
        name: 'Falcon 40B',
        company: 'TII',
        description: 'Massive open source foundational model.',
        vram: '20.5 GB',
        recommended: false,
      },
      {
        id: 'mpt-30b',
        name: 'MPT 30B',
        company: 'MosaicML',
        description: 'Trained with longer context length support.',
        vram: '15.3 GB',
        recommended: false,
      },
    ]
  },
  {
    id: 'tier-5',
    title: 'Enterprise',
    description: 'State-of-the-art foundation models requiring server-grade hardware or cloud access.',
    models: [
      {
        id: 'llama-2-70b',
        name: 'Llama 2 70B',
        company: 'Meta',
        description: 'The heavyweight open source champion for offline use.',
        vram: '35.2 GB',
        recommended: true,
      },
      {
        id: 'qwen-72b',
        name: 'Qwen 72B',
        company: 'Alibaba',
        description: 'Competes directly with proprietary frontier models.',
        vram: '36.8 GB',
        recommended: false,
      },
      {
        id: 'falcon-180b',
        name: 'Falcon 180B',
        company: 'TII',
        description: 'Colossal open-access model for extreme analytical needs.',
        vram: '92.5 GB',
        recommended: false,
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        company: 'OpenAI',
        description: 'Fast, cost-effective cloud-based standard.',
        vram: 'Cloud-based',
        recommended: false,
      },
      {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        company: 'Anthropic',
        description: 'Frontier model with incredible cognitive capabilities.',
        vram: 'Cloud-based',
        recommended: true,
      },
    ]
  }
];

const LLMModelDirectory = () => {
  return (
    <section className="py-16">
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-black uppercase mb-4 border-b-4 border-border pb-4 inline-block shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))]">
          LLM Model Directory
        </h2>
        <p className="text-xl font-bold text-foreground/80 max-w-3xl mt-4">
          Compare models across parameters, context length, and infrastructure requirements. Select the perfect intelligence backbone for your deployment.
        </p>
      </div>

      <div className="space-y-24">
        {modelTiers.map((tier) => (
          <div key={tier.id} className="scroll-mt-24">
            <div className="mb-8">
              <h3 className="text-3xl font-black uppercase inline-block bg-foreground text-background px-6 py-2 border-4 border-border shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))]">
                {tier.title}
              </h3>
              <p className="font-bold text-lg mt-4 max-w-2xl text-foreground/80">
                {tier.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tier.models.map((model) => (
                <div key={model.id} className="bg-card flex flex-col relative border-4 border-border shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_hsl(var(--shadow-color))] transition-all duration-300 p-6">
                  {/* Top Tags */}
                  <div className="flex flex-col items-end absolute top-6 right-6 gap-2">
                    <span className="bg-primary text-primary-foreground border-4 border-border px-3 py-1 text-sm font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_hsl(var(--shadow-color))]">
                      LLM
                    </span>
                    {model.recommended && (
                      <span className="bg-secondary text-secondary-foreground border-4 border-border px-2 py-0.5 text-xs font-bold flex items-center gap-1 shadow-[2px_2px_0px_0px_hsl(var(--shadow-color))]">
                        <Check size={12} strokeWidth={3} /> Recommended
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="pr-24 mb-6">
                    <h4 className="text-2xl font-black uppercase mb-1 leading-tight">{model.name}</h4>
                    <p className="font-bold text-foreground/60 uppercase tracking-wide text-sm mb-4">{model.company}</p>
                    <p className="font-bold text-foreground/90">{model.description}</p>
                  </div>

                  <hr className="border-t-4 border-border my-4" />

                  {/* Footer Metrics & Action */}
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-foreground/60 mb-1">Req. VRAM</p>
                      <p className="text-xl font-black leading-none">{model.vram}</p>
                    </div>
                    <Link 
                      to={`/calculator?model=${model.id}`} 
                      className="bg-accent text-accent-foreground border-4 border-border shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))] hover:shadow-[6px_6px_0px_0px_hsl(var(--shadow-color))] hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all px-6 py-2 font-black uppercase"
                    >
                      Compare
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LLMModelDirectory;
