
import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Briefcase, Settings2, Clock, Zap, Target, BookOpen, Layers } from 'lucide-react';
import BreadcrumbNav from '@/components/BreadcrumbNav.jsx';

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
      case 'Beginner': return 'bg-[#90EE90] text-black';
      case 'Intermediate': return 'bg-[#FF9F00] text-black';
      case 'Advanced': return 'bg-black text-white';
      default: return 'bg-gray-200 text-black';
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF0] pt-12 pb-32">
      <Helmet>
        <title>AI Workloads & Use Cases | OdysseusAI</title>
        <meta name="description" content="Explore production-ready AI workloads, implementation guides, and model recommendations for your specific use cases." />
      </Helmet>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BreadcrumbNav />

        {/* Page Header */}
        <div className="mb-12 border-b-8 border-black pb-8">
          <div className="inline-flex items-center gap-2 bg-[#90EE90] border-4 border-black px-3 py-1 text-sm font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-6">
            <Briefcase size={16} strokeWidth={3} /> Implementation
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-black mb-6 leading-none">
            AI Workloads
          </h1>
          <p className="text-xl md:text-2xl font-bold text-black/70 max-w-3xl leading-relaxed">
            Stop experimenting. Start shipping. Browse production-tested architectures mapped to specific business outcomes and required skillsets.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 bg-white border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex-1">
            <label className="block text-xs font-black uppercase tracking-widest mb-2 text-black/60">Filter by Category</label>
            <div className="flex flex-wrap gap-2">
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-4 py-2 border-2 border-black font-black uppercase tracking-widest text-xs rounded-md transition-colors ${
                    typeFilter === type ? 'bg-black text-white' : 'bg-transparent text-black hover:bg-black/5'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          <div className="w-full md:w-64 shrink-0">
            <label className="block text-xs font-black uppercase tracking-widest mb-2 text-black/60">Difficulty Level</label>
            <select
              value={diffFilter}
              onChange={(e) => setDiffFilter(e.target.value)}
              className="w-full bg-[#FFFDF0] border-4 border-black text-black font-bold p-3 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#B3DDF2] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer appearance-none"
            >
              {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Workloads Grid */}
        {filteredWorkloads.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredWorkloads.map(workload => (
              <div 
                key={workload.id}
                className="bg-white border-4 border-black rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col group"
              >
                {/* Card Header */}
                <div className="bg-[#B3DDF2] border-b-4 border-black p-6 relative">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <span className="bg-white border-2 border-black text-black px-2 py-1 text-xs font-black uppercase tracking-widest rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {workload.type}
                    </span>
                    <span className={`border-2 border-black px-2 py-1 text-xs font-black uppercase tracking-widest rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${getDifficultyColor(workload.difficulty)}`}>
                      {workload.difficulty}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black uppercase leading-tight">{workload.name}</h3>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-grow bg-white">
                  <p className="font-bold text-lg text-black/80 mb-8 leading-relaxed">
                    {workload.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-[#FFFDF0] border-2 border-black rounded-lg p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-black/50 mb-1">
                        <Settings2 size={14} /> Models
                      </div>
                      <div className="font-bold text-sm leading-tight">
                        {workload.recommended_models.join(', ')}
                      </div>
                    </div>
                    <div className="bg-[#FFFDF0] border-2 border-black rounded-lg p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-black/50 mb-1">
                        <Zap size={14} /> Cost Est.
                      </div>
                      <div className="font-bold text-sm leading-tight">
                        {workload.cost_estimation}
                      </div>
                    </div>
                    <div className="bg-[#FFFDF0] border-2 border-black rounded-lg p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-black/50 mb-1">
                        <Target size={14} /> Output
                      </div>
                      <div className="font-bold text-sm leading-tight">
                        {workload.performance_metrics}
                      </div>
                    </div>
                    <div className="bg-[#FFFDF0] border-2 border-black rounded-lg p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-black/50 mb-1">
                        <Clock size={14} /> Timeline
                      </div>
                      <div className="font-bold text-sm leading-tight">
                        {workload.time_to_implement}
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest mb-3 border-b-2 border-black pb-1">
                      <Layers size={16} /> Required Skills
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {workload.required_skills.map((skill, idx) => (
                        <span key={idx} className="bg-black text-white px-2.5 py-1 rounded text-xs font-bold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto bg-[#FFFDF0] border-4 border-black p-4 rounded-xl relative">
                    <div className="absolute -top-3 left-4 bg-[#FF9F00] text-black border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">
                      Best Practice
                    </div>
                    <div className="flex gap-3 items-start mt-2">
                      <BookOpen size={20} strokeWidth={2.5} className="text-[#FF9F00] shrink-0 mt-0.5" />
                      <p className="font-bold text-sm italic">"{workload.best_practices}"</p>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-3xl font-black uppercase mb-4">No Workloads Found</h3>
            <p className="font-bold text-xl text-black/60 mb-8">We couldn't find any workloads matching your selected criteria.</p>
            <button 
              onClick={() => { setTypeFilter('All'); setDiffFilter('All'); }}
              className="bg-black text-white font-black uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-black/80 transition-colors"
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
