export const fallbackBlogs = [
  {
    id: "static-post-1",
    title: "Odysseus AI Local Install Tutorial: The Definitive Step-by-Step Guide",
    slug: "odysseus-ai-local-install-tutorial",
    excerpt: "Learn how to deploy Odysseus AI locally on Windows, macOS, and Linux without encountering common terminal errors. Target keywords: local AI install, run Odysseus locally, deploy open-source LLM.",
    category: "Installations",
    author: "Zouhir Mahjoubi",
    publication_date: "2026-06-11T00:00:00.000Z",
    read_time: 8,
    tags: ["Odysseus", "Ollama", "Local Setup"],
    content: `
      <h2>Why Deploy Odysseus AI Locally?</h2>
      <p>Running your autonomous agents and LLMs on local hardware is the ultimate way to guarantee <strong>100% data privacy</strong> and eliminate recurring subscription costs. Odysseus AI is a state-of-the-art interface that makes this easy. In this tutorial, we walk through the exact steps to configure it on your system.</p>
      
      <h2>Step 1: Check System Prerequisites</h2>
      <p>Before cloning the repository, ensure your machine meets these baseline specifications:</p>
      <ul>
        <li><strong>RAM:</strong> Minimum 16GB (32GB recommended for larger models).</li>
        <li><strong>GPU:</strong> NVIDIA GPU with 8GB+ VRAM (or Apple Silicon M1/M2/M3).</li>
        <li><strong>Software:</strong> Git, Node.js v18+, and Docker Desktop.</li>
      </ul>

      <h2>Step 2: Clone the Repository</h2>
      <p>Open your terminal and run the following command to download the workspace:</p>
      <pre><code>git clone https://github.com/pewdiepie-archdaemon/odysseus.git
cd odysseus</code></pre>

      <h2>Step 3: Choose Your Deployment Route</h2>
      <h3>Option A: Docker Compose (Recommended)</h3>
      <p>Using Docker ensures an isolated environment with zero system pollution:</p>
      <pre><code>docker compose up -d --build</code></pre>
      
      <h3>Option B: Native Setup</h3>
      <p>If you prefer a native installation for maximum GPU performance, install dependencies at the root directory:</p>
      <pre><code>npm install
npm run dev</code></pre>

      <blockquote>
        <strong>Pro-Tip:</strong> Always map port 11434 to host.docker.internal if running Ollama natively and Odysseus inside a Docker container.
      </blockquote>
    `
  },
  {
    id: "static-post-2",
    title: "How to Run DeepSeek Coder Locally via Ollama Integration",
    slug: "run-deepseek-coder-locally-ollama",
    excerpt: "Unlock coding autonomy by running DeepSeek Coder locally. We explain setup command, model pulling, and integration with Odysseus workspace. Target keywords: DeepSeek Ollama, local coding LLM, offline programmer.",
    category: "LLM Models",
    author: "Zouhir Mahjoubi",
    publication_date: "2026-06-10T10:00:00.000Z",
    read_time: 6,
    tags: ["DeepSeek", "Coding", "Ollama"],
    content: `
      <h2>The Rise of Offline Coding Assistants</h2>
      <p>Modern software development is shifting towards offline coding assistants that respect intellectual property. <strong>DeepSeek Coder</strong> is one of the most powerful coding models available, surpassing many proprietary endpoints. Running it locally using Ollama is simple.</p>

      <h2>Setting Up DeepSeek Coder</h2>
      <p>First, ensure you have Ollama running in the background. Pull the appropriate parameter model using the following terminal command:</p>
      <pre><code>ollama pull deepseek-coder:6.7b</code></pre>
      <p>If you have a high-spec GPU with over 16GB of VRAM, we recommend pulling the 33B version for more complex software engineering tasks:</p>
      <pre><code>ollama pull deepseek-coder:33b</code></pre>

      <h2>Integrating with Odysseus AI</h2>
      <p>Launch your Odysseus workspace, navigate to the Settings tab, and change the model name option to <code>deepseek-coder:6.7b</code>. Odysseus will automatically route your prompts and workspace files directly to the Ollama local backend, providing low-latency completions and autonomous debugging cycles.</p>
    `
  },
  {
    id: "static-post-3",
    title: "Resolving CUDA Out of Memory (OOM) Errors in Local LLMs",
    slug: "resolve-cuda-out-of-memory-local-llm",
    excerpt: "A complete guide to resolving CUDA Out of Memory errors on Windows and Linux when serving open-source models. Target keywords: CUDA OOM error, GPU memory optimization, run LLM low VRAM.",
    category: "GPU Tuning",
    author: "Odysseus Team",
    publication_date: "2026-06-09T08:30:00.000Z",
    read_time: 10,
    tags: ["CUDA", "GPU", "Optimization"],
    content: `
      <h2>Understanding VRAM Constraints</h2>
      <p>One of the most common blockers when running local LLMs is the notorious <code>RuntimeError: CUDA out of memory</code>. This occurs when the model weights, KV cache, and context window exceed the available physical RAM on your graphics card.</p>

      <h2>Key Strategies to Mitigate OOM Errors</h2>
      <h3>1. Leverage GGUF Quantization</h3>
      <p>Do not attempt to run unquantized FP16 models. Quantizations like <code>Q4_K_M</code> reduce model size by up to 70% with negligible quality loss. An 8B parameter model fits easily in 6GB of VRAM under Q4 quantization.</p>

      <h3>2. Reduce Context Windows</h3>
      <p>By default, models may reserve memory for 8k or 16k tokens. Reducing the context limit in your config down to <code>2048</code> or <code>4096</code> tokens dramatically frees up active GPU memory:</p>
      <pre><code># Inside config.json
"context_length": 4096</code></pre>

      <h3>3. Configure GPU Layer Offloading</h3>
      <p>If your model is slightly too large, offload some layers to the system CPU (RAM). While slower, it prevents OOM crashes entirely:</p>
      <pre><code>ollama run llama3 --gpu-layers 24</code></pre>
    `
  },
  {
    id: "static-post-4",
    title: "Best GPUs for Running LLMs at Home: 2026 Buyer's Guide",
    slug: "best-gpus-for-running-llms-at-home",
    excerpt: "Looking for the ultimate GPU setup for running offline AI? Compare VRAM bandwidth, memory size, and cost across NVIDIA and Apple Silicon. Target keywords: best GPU for LLM, run AI at home, VRAM comparison.",
    category: "Hardware",
    author: "Odysseus Team",
    publication_date: "2026-06-08T14:00:00.000Z",
    read_time: 12,
    tags: ["Hardware", "GPU", "Buying Guide"],
    content: `
      <h2>The VRAM Hierarchy</h2>
      <p>When it comes to executing local AI models, <strong>memory capacity (VRAM) is king</strong>. Processing speed (TFLOPS) dictates how fast tokens are generated, but VRAM size determines whether you can load the model at all.</p>

      <h2>Top GPU Recommendations for 2026</h2>
      <table>
        <thead>
          <tr>
            <th>Hardware Model</th>
            <th>VRAM</th>
            <th>Memory Bandwidth</th>
            <th>Best For</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>NVIDIA RTX 4090</td>
            <td>24 GB</td>
            <td>1008 GB/s</td>
            <td>Maximum speed / 30B Models</td>
          </tr>
          <tr>
            <td>NVIDIA RTX 4060 Ti</td>
            <td>16 GB</td>
            <td>288 GB/s</td>
            <td>Budget 16GB Entry point</td>
          </tr>
          <tr>
            <td>Apple Mac Studio M3 Max</td>
            <td>128 GB (Unified)</td>
            <td>400 GB/s</td>
            <td>Serving huge 70B+ Models</td>
          </tr>
        </tbody>
      </table>

      <h2>Should You Choose NVIDIA or Apple Silicon?</h2>
      <p>For raw speed, NVIDIA's CUDA cores are unmatched. However, Apple Silicon's unified memory architecture allows you to share up to 192GB of RAM between the CPU and GPU, making it the most cost-effective way to run giant models like Llama-3-70B locally.</p>
    `
  },
  {
    id: "static-post-5",
    title: "Docker Compose Ollama GPU Pass-Through Configuration Tutorial",
    slug: "docker-compose-ollama-gpu-pass-through",
    excerpt: "Step-by-step instructions to configure GPU acceleration inside Docker containers for Ollama workflows. Target keywords: Docker GPU pass-through, nvidia docker compose, containerized ollama accelerator.",
    category: "Installations",
    author: "Zouhir Mahjoubi",
    publication_date: "2026-06-07T09:00:00.000Z",
    read_time: 7,
    tags: ["Docker", "GPU", "Ollama"],
    content: `
      <h2>Unlocking GPU Power inside Containers</h2>
      <p>Running Ollama inside Docker is incredibly neat, but by default, containers only have access to your system CPU. To get hardware acceleration, you must pass your NVIDIA graphics card to the container workspace.</p>

      <h2>Prerequisites</h2>
      <p>Ensure you have installed the <strong>NVIDIA Container Toolkit</strong> on your Linux or WSL2 host machine before proceeding.</p>

      <h2>The Docker Compose Configuration File</h2>
      <p>Create or update your <code>docker-compose.yml</code> file to match the setup block below:</p>
      <pre><code>version: "3.8"
services:
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama:/root/.ollama
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]

volumes:
  ollama:</code></pre>

      <p>Run <code>docker compose up -d</code>. Your containerized Ollama instance will now utilize all available CUDA cores for processing requests.</p>
    `
  },
  {
    id: "static-post-6",
    title: "How to Build an AI Agent Crew with Odysseus Framework",
    slug: "how-to-build-ai-agent-crew-odysseus",
    excerpt: "Discover the power of multi-agent architectures. Create researchers, writers, and debugging specialists that collaborate autonomously. Target keywords: AI agent crew, multi-agent framework, Odysseus RAG.",
    category: "Agentic AI",
    author: "Odysseus Team",
    publication_date: "2026-06-06T11:15:00.000Z",
    read_time: 9,
    tags: ["Agents", "Crew", "Odysseus"],
    content: `
      <h2>Collaborative Intelligence</h2>
      <p>Single agent loops are useful, but true automation shines when you deploy <strong>multiple specialized agents</strong> that pass tasks to each other. In Odysseus, we call this coordination group a <em>Crew</em>.</p>

      <h2>Sample Crew Definition</h2>
      <p>Here is how to structure a researcher and writer agent crew using JavaScript:</p>
      <pre><code>import { Agent, Crew, Task } from 'odysseus-swarms';

const researcher = new Agent({
  role: 'Information Harvester',
  goal: 'Query local vector db for competitive analysis.',
  verbose: true
});

const editor = new Agent({
  role: 'Copy Editor',
  goal: 'Synthesize raw research notes into a clean report.',
  verbose: true
});

const crew = new Crew({
  agents: [researcher, editor],
  tasks: [
    new Task({ desc: 'Extract Q3 performance parameters', agent: researcher }),
    new Task({ desc: 'Draft executive summary', agent: editor })
  ]
});

await crew.kickoff();</code></pre>

      <p>By splitting responsibilities, each agent uses a different custom prompt and focused tool list, resulting in far cleaner outputs and fewer hallucinations.</p>
    `
  },
  {
    id: "static-post-7",
    title: "PocketBase Local AI User Management Configuration Guide",
    slug: "pocketbase-local-ai-user-management",
    excerpt: "Learn how PocketBase integrates with Odysseus frontend for secure user auth, session caching, and database logs. Target keywords: PocketBase AI auth, local DB user admin, SQLite encryption.",
    category: "Database",
    author: "Zouhir Mahjoubi",
    publication_date: "2026-06-05T15:30:00.000Z",
    read_time: 5,
    tags: ["PocketBase", "Database", "Auth"],
    content: `
      <h2>Why PocketBase?</h2>
      <p>Odysseus AI requires a lightweight, rapid, single-file database for storing settings, chat histories, and vector metadata. <strong>PocketBase</strong> uses SQLite under the hood and fits perfectly in docker containers, providing real-time subscription support via WebSockets.</p>

      <h2>Initializing the Client Connection</h2>
      <p>Import PocketBase into your frontend utility wrapper as follows:</p>
      <pre><code>import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
export default pb;</code></pre>

      <h2>Managing Admin Access Control</h2>
      <p>You can securely restrict API requests using PocketBase's API Rules. For instance, to ensure only authenticated users can read prompt templates, write this filter rule inside the admin dashboard:</p>
      <pre><code>@request.auth.id != ""</code></pre>
    `
  },
  {
    id: "static-post-8",
    title: "Quantization Levels Explained: Q4_K_M vs Q8_0 GGUF Models",
    slug: "quantization-levels-explained-gguf",
    excerpt: "Confused by quantization tags? Learn the difference in performance, memory size, and perplexity for local GGUF models. Target keywords: GGUF quantization levels, Q4_K_M vs Q8_0, LLM perplexity.",
    category: "GPU Tuning",
    author: "Odysseus Team",
    publication_date: "2026-06-04T12:00:00.000Z",
    read_time: 8,
    tags: ["GGUF", "Quantization", "Llama"],
    content: `
      <h2>The Quantization Spectrum</h2>
      <p>Quantization compresses floating point weights (FP16/FP32) into lower-precision integers (4-bit, 8-bit). This enables consumer GPUs to fit model graphs that are technically larger than their memory buffers.</p>

      <h2>Comparing Q4_K_M and Q8_0</h2>
      <ul>
        <li><strong>Q4_K_M (4-bit Medium):</strong> Uses 4-bit quantization for most weights, but keeps key attention layers at higher precision. It is the sweet spot of size vs accuracy.</li>
        <li><strong>Q8_0 (8-bit Standard):</strong> Offers near-identical output compared to the original FP16 weights. However, it takes up double the space of Q4 models.</li>
      </ul>

      <h2>Perplexity and Degradation</h2>
      <p>Perplexity measures model confusion. Standard tests show that Q4_K_M increases perplexity by less than 0.05 points compared to baseline FP16, making it virtually identical in real-world dialogue and code generation.</p>
    `
  },
  {
    id: "static-post-9",
    title: "Offline RAG Pipeline with High-Speed GGUF Embeddings",
    slug: "offline-rag-pipeline-gguf-embeddings",
    excerpt: "Build a secure local document retrieval pipeline using vector DBs and local embeddings. Target keywords: offline RAG tutorial, local embedding model, GGUF retrieval generator.",
    category: "Agentic AI",
    author: "Zouhir Mahjoubi",
    publication_date: "2026-06-03T10:45:00.000Z",
    read_time: 11,
    tags: ["RAG", "Embeddings", "Vector DB"],
    content: `
      <h2>The Privacy Advantage of Local RAG</h2>
      <p>Retrieval-Augmented Generation (RAG) lets you feed local documentation folders to your LLM. Running this fully offline prevents corporate document leaks while guaranteeing instant lookup indexes.</p>

      <h2>Ingestion Phase</h2>
      <p>To calculate vectors, load a lightweight local embedding model such as <code>all-minilm-l6-v2</code> through your local framework:</p>
      <pre><code>import { VectorStore } from 'odysseus-rag';

const store = new VectorStore({
  embeddingModel: 'nomic-embed-text',
  dbPath: './vector_store.db'
});

await store.ingest('./documents');</code></pre>

      <h2>Generating Grounded Answers</h2>
      <p>When you query the interface, Odysseus fetches the top-3 matching document paragraphs and inserts them straight into the system context before calling the generation model, ensuring accurate references without hallucinations.</p>
    `
  },
  {
    id: "static-post-10",
    title: "Setting Up Custom LLM System Prompts for Coding Agents",
    slug: "setting-up-custom-llm-system-prompts",
    excerpt: "Instruct your coding assistants to write clean, maintainable code without excessive commentary. Target keywords: system prompt engineering, custom coding agent instructions, LLM template.",
    category: "LLM Models",
    author: "Odysseus Team",
    publication_date: "2026-06-02T16:10:00.000Z",
    read_time: 7,
    tags: ["Prompts", "System Instructions", "Coding"],
    content: `
      <h2>The Power of the System Prompt</h2>
      <p>Coding LLMs are notorious for including massive conversational greetings, code explanations, and redundant comments. A well-crafted system prompt forces the model to act as a precise compiler-focused machine.</p>

      <h2>The Optimal Coding Prompt Template</h2>
      <p>Use the system prompt below inside Odysseus AI to get drop-in code patches with zero conversational overhead:</p>
      <pre><code>You are an elite, senior software engineer.
Provide ONLY valid, compile-ready code snippets.
Do NOT explain your logic unless explicitly asked.
Do NOT write introductory or concluding conversational lines.
Format code using markdown syntax blocks with exact filenames.</code></pre>

      <p>This setup reduces token usage by up to 40% and speeds up automated workspace modification pipelines.</p>
    `
  }
];
