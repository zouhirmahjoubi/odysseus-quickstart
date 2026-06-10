
export const PROMPT_TEMPLATES = {
  categories: {
    'Model Comparison': [
      {
        id: 'mc-1',
        category: 'Model Comparison',
        title: 'Compare LLMs for RAG',
        description: 'Compare two models for Retrieval-Augmented Generation tasks.',
        fullPrompt: 'Analyze the suitability of Llama 3 8B and Mistral 7B for a local RAG pipeline handling PDF documents. Focus on context window limits, instruction following accuracy, and retrieval formatting capabilities.',
        expectedResponseType: 'text',
        recommendedModel: 'Command R',
        tags: ['RAG', 'Comparison'],
        icon: 'Scale'
      },
      {
        id: 'mc-2',
        category: 'Model Comparison',
        title: 'Coding Task Evaluation',
        description: 'Benchmark models on a Python scripting task.',
        fullPrompt: 'Generate a Python script to perform multithreaded web scraping using BeautifulSoup. Compare the output quality, speed, and standard library usage between DeepSeek Coder 7B and Code Llama 34B based on expected capabilities.',
        expectedResponseType: 'code',
        recommendedModel: 'Mistral Large',
        tags: ['Coding', 'Python', 'Benchmark'],
        icon: 'Code'
      }
    ],
    'Deep Research': [
      {
        id: 'dr-1',
        category: 'Deep Research',
        title: 'State of Open Source AI',
        description: 'Research report on recent open-source model releases.',
        fullPrompt: 'Provide a comprehensive research summary on the progression of sub-10B parameter open-source language models released in the last 12 months. Include specific breakthroughs in quantization and MoE (Mixture of Experts) architecture applied to small models.',
        expectedResponseType: 'text',
        recommendedModel: 'Qwen 32B',
        tags: ['Research', 'Open Source'],
        icon: 'BookOpen'
      },
      {
        id: 'dr-2',
        category: 'Deep Research',
        title: 'Local AI Security Implications',
        description: 'Analyze security benefits of local inference.',
        fullPrompt: 'Draft an executive briefing detailing the data privacy and security advantages of running local AI models on-premises versus using cloud API providers. Cover GDPR compliance, data exfiltration risks, and air-gapped deployments.',
        expectedResponseType: 'text',
        recommendedModel: 'Llama 3 70B',
        tags: ['Security', 'Enterprise'],
        icon: 'Shield'
      }
    ],
    'Email Intelligence': [
      {
        id: 'em-1',
        category: 'Email Intelligence',
        title: 'Executive Summary of Thread',
        description: 'Summarize a long customer support email thread.',
        fullPrompt: 'Summarize the following customer support email thread into three bullet points: the core issue, the steps already taken, and the pending action item required from the engineering team. [Insert Email Thread]',
        expectedResponseType: 'text',
        recommendedModel: 'Gemma 7B',
        tags: ['Email', 'Summarization'],
        icon: 'Mail'
      },
      {
        id: 'em-2',
        category: 'Email Intelligence',
        title: 'Automated Client Follow-up',
        description: 'Draft a professional follow-up email.',
        fullPrompt: 'Draft a polite follow-up email to a client who hasn\'t responded to a project proposal sent a week ago. Emphasize that we are ready to move forward and ask if they need any clarifications on the technical requirements.',
        expectedResponseType: 'text',
        recommendedModel: 'Mistral 7B',
        tags: ['Email', 'Drafting'],
        icon: 'Send'
      }
    ],
    'Hardware Cookbook': [
      {
        id: 'hc-1',
        category: 'Hardware Cookbook',
        title: 'Multi-GPU Setup Guide',
        description: 'Steps to configure multiple consumer GPUs.',
        fullPrompt: 'Provide a step-by-step technical guide for configuring an Ubuntu 22.04 system to utilize two NVIDIA RTX 3090 GPUs for LLM inference using vLLM and Tensor Parallelism. Include required driver versions and docker-compose configurations.',
        expectedResponseType: 'code',
        recommendedModel: 'Qwen 72B',
        tags: ['Hardware', 'Ubuntu', 'vLLM'],
        icon: 'Server'
      },
      {
        id: 'hc-2',
        category: 'Hardware Cookbook',
        title: 'Mac Silicon Optimization',
        description: 'Optimize MLX framework on Apple Silicon.',
        fullPrompt: 'Explain how to compile and run the MLX framework on an M3 Max MacBook Pro for running quantized GGUF models. What are the memory bandwidth considerations compared to standard PCIe GPUs?',
        expectedResponseType: 'text',
        recommendedModel: 'Command R+',
        tags: ['Mac', 'Apple Silicon', 'MLX'],
        icon: 'Cpu'
      }
    ],
    'Autonomous Agents': [
      {
        id: 'aa-1',
        category: 'Autonomous Agents',
        title: 'CrewAI Research Swarm',
        description: 'Configure a multi-agent research team.',
        fullPrompt: 'Write a Python configuration utilizing the CrewAI framework to deploy three agents: a "Senior Researcher", a "Fact Checker", and a "Technical Writer". Their goal is to research recent advancements in solid-state batteries and output a formatted markdown blog post.',
        expectedResponseType: 'code',
        recommendedModel: 'DeepSeek-R1 70B',
        tags: ['Agents', 'CrewAI', 'Python'],
        icon: 'Network'
      }
    ],
    'Code Generation': [
      {
        id: 'cg-1',
        category: 'Code Generation',
        title: 'React Dashboard Component',
        description: 'Create a responsive React dashboard layout.',
        fullPrompt: 'Generate a functional React functional component for an Analytics Dashboard using Tailwind CSS. Include a sidebar, top navigation, and a responsive grid for metric cards. Use the lucide-react library for icons.',
        expectedResponseType: 'code',
        recommendedModel: 'Code Llama 34B',
        tags: ['React', 'Tailwind', 'Frontend'],
        icon: 'Terminal'
      },
      {
        id: 'cg-2',
        category: 'Code Generation',
        title: 'FastAPI REST Endpoint',
        description: 'Build a secure API endpoint for processing data.',
        fullPrompt: 'Write a Python FastAPI application that exposes a secure POST endpoint `/api/v1/process`. It should accept a JSON payload with a text string, validate it using Pydantic, simulate a processing delay, and return the tokenized length of the string.',
        expectedResponseType: 'code',
        recommendedModel: 'DeepSeek 7B',
        tags: ['Python', 'FastAPI', 'Backend'],
        icon: 'Database'
      }
    ],
    'System Administration': [
      {
        id: 'sa-1',
        category: 'System Administration',
        title: 'Docker Compose Local LLM Stack',
        description: 'Compose file for Ollama and Open WebUI.',
        fullPrompt: 'Generate a complete `docker-compose.yml` file that deploys an Ollama container with NVIDIA GPU passthrough enabled, paired with the Open WebUI container. Include persistent volume mounts for model storage and appropriate network bridging.',
        expectedResponseType: 'code',
        recommendedModel: 'Mistral 8x7B',
        tags: ['Docker', 'DevOps', 'Ollama'],
        icon: 'Settings'
      }
    ]
  }
};

export const getPromptsByCategory = (category) => {
  return PROMPT_TEMPLATES.categories[category] || [];
};

export const getAllPrompts = () => {
  return Object.values(PROMPT_TEMPLATES.categories).flat();
};

export const searchPrompts = (query) => {
  const q = query.toLowerCase();
  return getAllPrompts().filter(p => 
    p.title.toLowerCase().includes(q) || 
    p.description.toLowerCase().includes(q) || 
    p.tags.some(t => t.toLowerCase().includes(q))
  );
};

export const getPromptById = (id) => {
  return getAllPrompts().find(p => p.id === id);
};
