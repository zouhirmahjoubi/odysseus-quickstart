
import React from 'react';
import { Helmet } from 'react-helmet';
import { Info, Briefcase } from 'lucide-react';

const taskCategories = [
  {
    title: 'EVALUATION & DEEP RESEARCH',
    emoji: '📊',
    tasks: [
      { name: 'Model Comparison for RAG', desc: 'Evaluate two models specifically for Retrieval-Augmented Generation tasks' },
      { name: 'Coding Task Evaluation', desc: 'Benchmark model capabilities on a Python scripting task' },
      { name: 'State of Open Source AI', desc: 'Generate research reports on recent open-source model releases' },
      { name: 'Local AI Security Implications', desc: 'Analyze the security and privacy benefits of local inference for enterprise' }
    ]
  },
  {
    title: 'EMAIL INTELLIGENCE & AUTOMATION',
    emoji: '✉️',
    tasks: [
      { name: 'Executive Summary of Thread', desc: 'Summarize dense, multi-layered customer support email threads' },
      { name: 'Automated Client Follow-up', desc: 'Draft professional, contextual follow-up emails' }
    ]
  },
  {
    title: 'HARDWARE COOKBOOK & SYSADMIN',
    emoji: '🛠️',
    tasks: [
      { name: 'Multi-GPU Setup Guide', desc: 'Step-by-step configuration for running multiple consumer GPUs on Ubuntu' },
      { name: 'Mac Silicon Optimization', desc: 'Tune and optimize execution using the MLX framework on Apple Silicon' },
      { name: 'Docker Compose Local LLM Stack', desc: 'Configure a seamless local environment using Ollama and Open WebUI' }
    ]
  },
  {
    title: 'CODE GENERATION & AUTONOMOUS AGENTS',
    emoji: '💻',
    tasks: [
      { name: 'CrewAI Research Swarm', desc: 'Configure and orchestrate a multi-agent research team' },
      { name: 'React Dashboard Component', desc: 'Create responsive frontend layouts using React and Tailwind CSS' },
      { name: 'FastAPI REST Endpoint', desc: 'Build secure Python API endpoints for backend data processing' }
    ]
  }
];

const TaskWorkloadFramework = ({ hideHelmet = false }) => {
  return (
    <div className="w-full">
      {!hideHelmet && (
        <Helmet>
          <title>Task Workload Framework | OdysseusAI</title>
        </Helmet>
      )}

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <Briefcase size={32} strokeWidth={3} className="text-secondary" />
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Task & Workload Framework</h2>
        </div>
        
        <div className="bg-secondary/20 border-4 border-border p-5 mb-10 flex items-start gap-4">
          <Info size={28} strokeWidth={3} className="text-secondary shrink-0 mt-0.5" />
          <p className="font-bold text-lg text-foreground">
            <span className="font-black uppercase block mb-1">Contextual Note:</span>
            If you're building out RAG task or CrewAI Research Swarm, prioritize models with at least a 32k context window (like Command R, DeepSeek-R1, or Qwen). Trying to feed dense data into older 2k or 4k models (like Llama 2 or Falcon) will cause them to drop context entirely.
          </p>
        </div>

        <div className="space-y-12">
          {taskCategories.map((category, idx) => (
            <section key={idx}>
              <div className="flex items-center gap-3 mb-6 border-b-4 border-border pb-3">
                <span className="text-3xl">{category.emoji}</span>
                <h3 className="text-2xl font-black uppercase tracking-tight bg-card px-2">{category.title}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.tasks.map((task, taskIdx) => (
                  <div 
                    key={taskIdx} 
                    className="border-4 border-border bg-card p-6 flex flex-col h-full cursor-pointer shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))] transition-all duration-200 hover:-translate-y-1 hover:border-secondary hover:shadow-[6px_6px_0px_0px_hsl(var(--secondary))]"
                  >
                    <div className="mb-4">
                      <span className="text-3xl mb-4 block">{category.emoji}</span>
                      <h4 className="text-xl font-black uppercase leading-tight mb-2">{task.name}</h4>
                    </div>
                    <p className="font-bold text-muted-foreground mt-auto pt-4 border-t-4 border-border/10">
                      {task.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskWorkloadFramework;
