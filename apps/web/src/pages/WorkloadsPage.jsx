
import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Briefcase, Settings2, Clock, Zap, Target, BookOpen, Layers } from 'lucide-react';
import BreadcrumbNav from '@/components/BreadcrumbNav.jsx';
import FeaturedLaunchKitCard from '@/components/FeaturedLaunchKitCard.jsx';

// Mock Workloads Data
const WORKLOADS_DATA = [
  {
    id: 1,
    type: 'Content Generation',
    name: 'At-Scale SEO Blogging',
    description: 'Generate highly optimized, long-form blog content at scale using automated research and multi-step drafting pipelines.',
    recommended_models: ['GPT-4 Turbo', 'Claude 3 Opus', 'Mistral Large'],
    cost_estimation: '$0.02 - $0.08 per article',
    performance_metrics: '100+ articles/hr',
    difficulty: 'Intermediate',
    time_to_implement: '2-4 days',
    required_skills: ['Prompt Engineering', 'API Integration', 'Content Strategy'],
    examples: ['Automated Tech News Summaries', 'Local SEO City Pages'],
    best_practices: 'Use a multi-agent approach: one model researches, one drafts, and one critiques and edits for SEO density.'
  },
  {
    id: 2,
    type: 'Code Generation',
    name: 'Legacy Code Migration',
    description: 'Automate the translation of legacy codebases (e.g., COBOL, old PHP) into modern stacks (e.g., React, Go, Rust).',
    recommended_models: ['Claude 3 Opus', 'GPT-4', 'DeepSeek Coder'],
    cost_estimation: '$5.00 - $15.00 per module',
    performance_metrics: '85% automated test pass rate',
    difficulty: 'Advanced',
    time_to_implement: '2-4 weeks',
    required_skills: ['Software Architecture', 'Test-Driven Development', 'Advanced Prompting'],
    examples: ['AngularJS to React 18', 'Python 2 to Python 3 with type hints'],
    best_practices: 'Always provide comprehensive unit tests in the prompt context to ensure logical parity in the output.'
  },
  {
    id: 3,
    type: 'Data Analysis',
    name: 'Unstructured Data Extraction',
    description: 'Extract structured JSON entities from messy PDFs, emails, or scanned documents for database ingestion.',
    recommended_models: ['GPT-3.5 Turbo', 'Claude 3 Haiku', 'Gemini Pro'],
    cost_estimation: '$0.001 - $0.005 per document',
    performance_metrics: '99.2% extraction accuracy',
    difficulty: 'Beginner',
    time_to_implement: '1 day',
    required_skills: ['JSON Schema', 'Basic Scripting'],
    examples: ['Invoice Processing', 'Resume/CV Parsing'],
    best_practices: 'Force JSON output modes and provide a strict JSON schema in the system prompt.'
  },
  {
    id: 4,
    type: 'Customer Support',
    name: 'Tier 1 Support Copilot',
    description: 'Augment support agents by automatically drafting replies based on internal documentation and previous ticket history.',
    recommended_models: ['Claude 3 Sonnet', 'GPT-4 Turbo', 'Command R'],
    cost_estimation: '$0.01 per ticket',
    performance_metrics: 'Sub-2s latency, 40% reduction in handle time',
    difficulty: 'Intermediate',
    time_to_implement: '1-2 weeks',
    required_skills: ['RAG Pipeline Setup', 'Vector Databases'],
    examples: ['Zendesk Auto-Drafting', 'Intercom Resolution Bot'],
    best_practices: 'Implement RAG (Retrieval-Augmented Generation) to ground the model in your specific product knowledge base.'
  },
  {
    id: 5,
    type: 'Autonomous Agents',
    name: 'Competitive Analysis Swarm',
    description: 'Deploy a swarm of agents to scrape competitor websites, summarize feature changes, and generate executive reports.',
    recommended_models: ['GPT-4 Turbo', 'Mixtral 8x7B'],
    cost_estimation: '$0.50 - $2.00 per full report',
    performance_metrics: 'Highly comprehensive analysis',
    difficulty: 'Advanced',
    time_to_implement: '3-4 weeks',
    required_skills: ['CrewAI / AutoGen', 'Web Scraping', 'Orchestration'],
    examples: ['Weekly Competitor Feature Matrix', 'Pricing Change Alerts'],
    best_practices: 'Assign strict roles to each agent (e.g., "Web Scraper", "Data Synthesizer", "Executive Editor") to prevent hallucination loops.'
  },
  {
    id: 6,
    type: 'Vision & Image',
    name: 'Visual QA for Inventory',
    description: 'Process images of warehouse shelves or store layouts to automatically count items or identify misplaced stock.',
    recommended_models: ['GPT-4 Vision', 'Claude 3 Opus', 'Gemini Ultra'],
    cost_estimation: '$0.01 - $0.03 per image',
    performance_metrics: '92% object identification rate',
    difficulty: 'Intermediate',
    time_to_implement: '1-2 weeks',
    required_skills: ['Computer Vision Prompting', 'Image preprocessing'],
    examples: ['Retail Shelf Auditing', 'Manufacturing Defect Detection'],
    best_practices: 'Downscale images appropriately before sending to APIs to save significantly on token costs without losing macro details.'
  }
];

const WorkloadsPage = () => {
  const [typeFilter, setTypeFilter] = useState('All');
  const [diffFilter, setDiffFilter] = useState('All');

  const types = ['All', ...new Set(WORKLOADS_DATA.map(w => w.type))];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredWorkloads = useMemo(() => {
    return WORKLOADS_DATA.filter(w => {
      const matchType = typeFilter === 'All' || w.type === typeFilter;
      const matchDiff = diffFilter === 'All' || w.difficulty === diffFilter;
      return matchType && matchDiff;
    });
  }, [typeFilter, diffFilter]);

  const getDifficultyColor = (diff) => {
    switch(diff) {
      case 'Beginner': return 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/25';
      case 'Intermediate': return 'bg-[#FFB300]/15 text-[#FFB300] border border-[#FFB300]/25';
      case 'Advanced': return 'bg-[#FF2A85]/15 text-[#FF2A85] border border-[#FF2A85]/25';
      default: return 'bg-white/5 text-gray-300 border border-white/10';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-12 pb-32 font-rounded text-left">
      <Helmet>
        <title>AI Workloads & Use Cases | OdysseusAI</title>
        <meta name="description" content="Explore production-ready AI workloads, implementation guides, and model recommendations for your specific use cases." />
      </Helmet>

      <div className="container mx-auto">
        <BreadcrumbNav />

        {/* Page Header */}
        <div className="mb-16 select-none">
          <div className="flex items-center gap-2 bg-[#FF2A85]/10 px-4 py-1.5 rounded-full border border-[#FF2A85]/20 text-sm font-bold mb-6 inline-flex">
            <Briefcase size={14} strokeWidth={3} className="text-[#FF2A85]" />
            <span className="text-gray-300">AI Workloads & Use Cases</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            AI{' '}
            <span className="text-[#FF2A85] bg-[#FF2A85]/10 px-4 py-1 border border-[#FF2A85]/20 rounded-3xl inline-block transform -rotate-1 shadow-[0_0_15px_rgba(255,42,133,0.2)]">
              Workloads
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl font-medium leading-relaxed">
            Stop experimenting. Start shipping. Browse production-tested architectures mapped to specific business outcomes and required skillsets.
          </p>
        </div>

        {/* Featured Launch Kit Promo */}
        <div className="mb-12">
          <FeaturedLaunchKitCard />
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
          <div className="flex-1">
            <label className="block text-xs font-black uppercase tracking-widest mb-2 text-[#FF2A85]">Filter by Category</label>
            <div className="flex flex-wrap gap-2">
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-4 py-2 border rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                    typeFilter === type 
                      ? 'bg-[#FF2A85] text-white border-[#FF2A85]/30 shadow-[0_0_10px_rgba(255,42,133,0.25)]' 
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          <div className="w-full md:w-64 shrink-0">
            <label className="block text-xs font-black uppercase tracking-widest mb-2 text-[#FF2A85]">Difficulty Level</label>
            <select
              value={diffFilter}
              onChange={(e) => setDiffFilter(e.target.value)}
              className="w-full border border-white/10 rounded-xl text-white font-bold p-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#FF2A85] transition-all cursor-pointer"
            >
              {difficulties.map(d => (
                <option key={d} value={d} className="bg-[#0a0a0a] text-white">{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Workloads Grid */}
        {filteredWorkloads.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredWorkloads.map(workload => (
              <div 
                key={workload.id}
                className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col hover:-translate-y-1 hover:border-[#FF2A85]/40 hover:shadow-[0_4px_20px_rgba(255,42,133,0.15)] transition-all duration-300 backdrop-blur-md text-left"
              >
                {/* Card Header */}
                <div className="bg-white/5 border-b border-white/10 p-6 relative">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <span className="bg-[#FF2A85]/10 border border-[#FF2A85]/20 text-[#FF2A85] px-2.5 py-0.5 text-xs font-black uppercase tracking-wider rounded-full">
                      {workload.type}
                    </span>
                    <span className={`px-2.5 py-0.5 text-xs font-black uppercase tracking-wider rounded-full ${getDifficultyColor(workload.difficulty)}`}>
                      {workload.difficulty}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase leading-tight text-white">{workload.name}</h3>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-grow">
                  <p className="font-bold text-base text-gray-300 mb-8 leading-relaxed">
                    {workload.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#FF2A85] mb-1.5">
                        <Settings2 size={14} /> Models
                      </div>
                      <div className="font-black text-sm leading-tight text-white">
                        {workload.recommended_models.join(', ')}
                      </div>
                    </div>
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#FF2A85] mb-1.5">
                        <Zap size={14} /> Cost Est.
                      </div>
                      <div className="font-black text-sm leading-tight text-white">
                        {workload.cost_estimation}
                      </div>
                    </div>
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#FF2A85] mb-1.5">
                        <Target size={14} /> Output
                      </div>
                      <div className="font-black text-sm leading-tight text-white">
                        {workload.performance_metrics}
                      </div>
                    </div>
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#FF2A85] mb-1.5">
                        <Clock size={14} /> Timeline
                      </div>
                      <div className="font-black text-sm leading-tight text-white">
                        {workload.time_to_implement}
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-3 border-b border-white/10 pb-1.5 text-gray-400">
                      <Layers size={14} className="text-[#FF2A85]" /> Required Skills
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {workload.required_skills.map((skill, idx) => (
                        <span key={idx} className="bg-white/5 border border-white/10 text-gray-300 px-2.5 py-1 rounded-xl text-xs font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto bg-[#FF2A85]/5 border border-[#FF2A85]/20 p-5 rounded-2xl relative">
                    <div className="absolute -top-2.5 left-4 bg-[#FF2A85] text-white px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full">
                      Best Practice
                    </div>
                    <div className="flex gap-3 items-start mt-2">
                      <BookOpen size={18} strokeWidth={2.5} className="text-[#FF2A85] shrink-0 mt-0.5" />
                      <p className="font-semibold text-sm text-white/80 italic">"{workload.best_practices}"</p>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
            <h3 className="text-3xl font-black uppercase mb-4 text-white">No Workloads Found</h3>
            <p className="font-bold text-lg text-gray-400 mb-8">We couldn't find any workloads matching your selected criteria.</p>
            <button 
              onClick={() => { setTypeFilter('All'); setDiffFilter('All'); }}
              className="bg-[#FF2A85] text-white border border-[#FF2A85]/30 font-black uppercase tracking-widest px-8 py-4 rounded-xl shadow-[0_0_15px_rgba(255,42,133,0.2)] hover:scale-[1.02] transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkloadsPage;
