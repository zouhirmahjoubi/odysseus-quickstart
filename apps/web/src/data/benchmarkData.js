// ─── AI Model Benchmark Data ───
// Scores: MMLU (%), HumanEval (%), MATH (%), MT-Bench (/10), GPQA (%)
// Pricing: per 1M tokens (input / output) as of 2025
// Speed: approximate tokens/second

export const BENCHMARK_MODELS = [

  // ══════════════════════════════════════
  // OpenAI
  // ══════════════════════════════════════
  { id: 'gpt-5.5', name: 'GPT-5.5', provider: 'OpenAI', providerColor: '#10a37f', category: ['reasoning', 'coding', 'chat', 'vision'], local: false, context: 256, params: null, scores: { mmlu: 97.2, humaneval: 99.0, math: 98.5, mtbench: 9.9, gpqa: 90.0 }, pricing: { input: 15.00, output: 60.00 }, speed: { tokensPerSec: 80, latencyMs: 350 }, description: "OpenAI's most advanced frontier model.", badge: '🥇' },
  { id: 'gpt-5', name: 'GPT-5', provider: 'OpenAI', providerColor: '#10a37f', category: ['reasoning', 'coding', 'chat', 'vision'], local: false, context: 128, params: null, scores: { mmlu: 96.0, humaneval: 98.0, math: 96.0, mtbench: 9.8, gpqa: 87.0 }, pricing: { input: 10.00, output: 40.00 }, speed: { tokensPerSec: 85, latencyMs: 380 }, description: 'Flagship GPT-5 model with breakthrough reasoning.', badge: '🥈' },
  { id: 'gpt-5-mini', name: 'GPT-5 mini', provider: 'OpenAI', providerColor: '#10a37f', category: ['chat', 'coding'], local: false, context: 128, params: null, scores: { mmlu: 90.0, humaneval: 93.0, math: 88.0, mtbench: 9.4, gpqa: 72.0 }, pricing: { input: 1.50, output: 6.00 }, speed: { tokensPerSec: 160, latencyMs: 200 }, description: 'Compact GPT-5 for everyday tasks at lower cost.', badge: '⚡' },
  { id: 'gpt-5.4-mini', name: 'GPT-5.4 mini', provider: 'OpenAI', providerColor: '#10a37f', category: ['chat', 'coding'], local: false, context: 128, params: null, scores: { mmlu: 88.0, humaneval: 92.0, math: 85.0, mtbench: 9.2, gpqa: 70.0 }, pricing: { input: 0.40, output: 1.60 }, speed: { tokensPerSec: 200, latencyMs: 150 }, description: 'Fast, cost-efficient GPT-5 series model.', badge: '⚡' },
  { id: 'o3-pro', name: 'o3-pro', provider: 'OpenAI', providerColor: '#10a37f', category: ['reasoning', 'coding'], local: false, context: 200, params: null, scores: { mmlu: 95.0, humaneval: 99.0, math: 99.0, mtbench: 9.7, gpqa: 90.0 }, pricing: { input: 20.00, output: 80.00 }, speed: { tokensPerSec: 30, latencyMs: 2000 }, description: 'Pro reasoning model for the hardest scientific tasks.', badge: '🧮' },
  { id: 'o3', name: 'o3', provider: 'OpenAI', providerColor: '#10a37f', category: ['reasoning', 'coding'], local: false, context: 200, params: null, scores: { mmlu: 93.5, humaneval: 97.3, math: 97.9, mtbench: 9.5, gpqa: 83.3 }, pricing: { input: 10.00, output: 40.00 }, speed: { tokensPerSec: 40, latencyMs: 1500 }, description: "OpenAI's frontier reasoning model.", badge: '🧮' },
  { id: 'o3-mini', name: 'o3-mini', provider: 'OpenAI', providerColor: '#10a37f', category: ['reasoning', 'coding'], local: false, context: 128, params: null, scores: { mmlu: 86.2, humaneval: 92.5, math: 90.0, mtbench: 8.7, gpqa: 71.3 }, pricing: { input: 1.10, output: 4.40 }, speed: { tokensPerSec: 50, latencyMs: 900 }, description: 'Cost-efficient reasoning model. Near o3 quality.', badge: null },
  { id: 'o4-mini', name: 'o4-mini', provider: 'OpenAI', providerColor: '#10a37f', category: ['reasoning', 'coding'], local: false, context: 128, params: null, scores: { mmlu: 89.5, humaneval: 95.0, math: 93.5, mtbench: 9.0, gpqa: 75.0 }, pricing: { input: 1.10, output: 4.40 }, speed: { tokensPerSec: 55, latencyMs: 850 }, description: 'Next-gen compact reasoning model outperforming o3-mini.', badge: null },
  { id: 'o1', name: 'o1', provider: 'OpenAI', providerColor: '#10a37f', category: ['reasoning', 'coding'], local: false, context: 200, params: null, scores: { mmlu: 92.3, humaneval: 92.4, math: 96.4, mtbench: 9.3, gpqa: 78.3 }, pricing: { input: 15.00, output: 60.00 }, speed: { tokensPerSec: 35, latencyMs: 1800 }, description: 'First-generation OpenAI reasoning model.', badge: null },
  { id: 'gpt-4.1', name: 'GPT-4.1', provider: 'OpenAI', providerColor: '#10a37f', category: ['reasoning', 'coding', 'chat', 'vision'], local: false, context: 1000, params: null, scores: { mmlu: 90.5, humaneval: 94.0, math: 80.0, mtbench: 9.2, gpqa: 66.0 }, pricing: { input: 2.00, output: 8.00 }, speed: { tokensPerSec: 120, latencyMs: 320 }, description: 'Updated GPT-4 with 1M context and improved coding.', badge: null },
  { id: 'gpt-4.1-mini', name: 'GPT-4.1 mini', provider: 'OpenAI', providerColor: '#10a37f', category: ['chat', 'coding'], local: false, context: 1000, params: null, scores: { mmlu: 84.0, humaneval: 90.0, math: 73.0, mtbench: 8.6, gpqa: 46.0 }, pricing: { input: 0.40, output: 1.60 }, speed: { tokensPerSec: 200, latencyMs: 150 }, description: 'Fast, affordable GPT-4.1 with 1M context.', badge: '⚡' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', providerColor: '#10a37f', category: ['reasoning', 'coding', 'chat', 'vision'], local: false, context: 128, params: null, scores: { mmlu: 88.7, humaneval: 90.2, math: 76.6, mtbench: 9.0, gpqa: 53.6 }, pricing: { input: 2.50, output: 10.00 }, speed: { tokensPerSec: 110, latencyMs: 380 }, description: 'Flagship omni model combining text, vision, and audio.', badge: null },
  { id: 'gpt-4o-mini', name: 'GPT-4o mini', provider: 'OpenAI', providerColor: '#10a37f', category: ['chat', 'coding'], local: false, context: 128, params: null, scores: { mmlu: 82.0, humaneval: 87.2, math: 70.2, mtbench: 8.4, gpqa: 40.2 }, pricing: { input: 0.15, output: 0.60 }, speed: { tokensPerSec: 180, latencyMs: 180 }, description: 'Most cost-effective OpenAI model with vision.', badge: '⚡' },

  // ══════════════════════════════════════
  // Anthropic
  // ══════════════════════════════════════
  { id: 'claude-fable-5', name: 'Claude Fable 5', provider: 'Anthropic', providerColor: '#d97706', category: ['reasoning', 'coding', 'chat', 'vision'], local: false, context: 200, params: null, scores: { mmlu: 96.5, humaneval: 99.5, math: 97.0, mtbench: 9.9, gpqa: 91.0 }, pricing: { input: 25.00, output: 100.00 }, speed: { tokensPerSec: 50, latencyMs: 600 }, description: '#1 ranked overall and for coding. Most powerful Claude ever.', badge: '🥇' },
  { id: 'claude-opus-4-5', name: 'Claude Opus 4.5', provider: 'Anthropic', providerColor: '#d97706', category: ['reasoning', 'coding', 'chat'], local: false, context: 200, params: null, scores: { mmlu: 95.0, humaneval: 97.0, math: 92.0, mtbench: 9.8, gpqa: 85.0 }, pricing: { input: 18.00, output: 90.00 }, speed: { tokensPerSec: 45, latencyMs: 700 }, description: 'Updated Claude Opus with best-in-class reasoning.', badge: '🥈' },
  { id: 'claude-opus-4', name: 'Claude Opus 4', provider: 'Anthropic', providerColor: '#d97706', category: ['reasoning', 'coding', 'chat'], local: false, context: 200, params: null, scores: { mmlu: 93.0, humaneval: 96.0, math: 90.0, mtbench: 9.7, gpqa: 82.0 }, pricing: { input: 15.00, output: 75.00 }, speed: { tokensPerSec: 50, latencyMs: 650 }, description: "Anthropic's frontier flagship model.", badge: null },
  { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5', provider: 'Anthropic', providerColor: '#d97706', category: ['reasoning', 'coding', 'chat'], local: false, context: 200, params: null, scores: { mmlu: 91.0, humaneval: 95.0, math: 84.0, mtbench: 9.5, gpqa: 74.0 }, pricing: { input: 3.50, output: 17.50 }, speed: { tokensPerSec: 90, latencyMs: 430 }, description: 'Enhanced Sonnet with stronger coding capabilities.', badge: null },
  { id: 'claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic', providerColor: '#d97706', category: ['reasoning', 'coding', 'chat'], local: false, context: 200, params: null, scores: { mmlu: 90.0, humaneval: 94.0, math: 82.0, mtbench: 9.4, gpqa: 72.0 }, pricing: { input: 3.00, output: 15.00 }, speed: { tokensPerSec: 95, latencyMs: 420 }, description: 'Best balance of intelligence and speed for enterprise apps.', badge: null },
  { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5', provider: 'Anthropic', providerColor: '#d97706', category: ['chat', 'coding'], local: false, context: 200, params: null, scores: { mmlu: 82.0, humaneval: 85.0, math: 71.0, mtbench: 8.9, gpqa: 55.0 }, pricing: { input: 0.80, output: 4.00 }, speed: { tokensPerSec: 220, latencyMs: 130 }, description: 'Fastest Claude 4-generation model for real-time apps.', badge: '⚡' },
  { id: 'claude-35-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', providerColor: '#d97706', category: ['reasoning', 'coding', 'chat', 'vision'], local: false, context: 200, params: null, scores: { mmlu: 88.3, humaneval: 92.0, math: 71.1, mtbench: 9.0, gpqa: 59.4 }, pricing: { input: 3.00, output: 15.00 }, speed: { tokensPerSec: 100, latencyMs: 420 }, description: 'Best-in-class for coding and nuanced reasoning.', badge: '🥉' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', providerColor: '#d97706', category: ['chat', 'coding'], local: false, context: 200, params: null, scores: { mmlu: 75.2, humaneval: 75.9, math: 38.9, mtbench: 8.2, gpqa: 33.3 }, pricing: { input: 0.25, output: 1.25 }, speed: { tokensPerSec: 220, latencyMs: 130 }, description: 'Ultra-fast and cheap for real-time chat.', badge: '⚡' },

  // ══════════════════════════════════════
  // Google
  // ══════════════════════════════════════
  { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro Preview', provider: 'Google', providerColor: '#4285f4', category: ['reasoning', 'coding', 'chat', 'vision'], local: false, context: 2000, params: null, scores: { mmlu: 96.0, humaneval: 96.5, math: 97.0, mtbench: 9.8, gpqa: 89.0 }, pricing: { input: 7.00, output: 21.00 }, speed: { tokensPerSec: 70, latencyMs: 500 }, description: '#1 ranked for reasoning. Google\'s most powerful Gemini.', badge: '🥇' },
  { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash', provider: 'Google', providerColor: '#4285f4', category: ['chat', 'coding'], local: false, context: 1000, params: null, scores: { mmlu: 89.0, humaneval: 91.0, math: 87.0, mtbench: 9.2, gpqa: 70.0 }, pricing: { input: 0.30, output: 1.00 }, speed: { tokensPerSec: 280, latencyMs: 80 }, description: 'Ultra-fast Gemini 3.5 with strong multimodal performance.', badge: '⚡' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google', providerColor: '#4285f4', category: ['reasoning', 'coding', 'chat', 'vision'], local: false, context: 1000, params: null, scores: { mmlu: 90.5, humaneval: 90.0, math: 91.0, mtbench: 9.4, gpqa: 79.7 }, pricing: { input: 1.25, output: 10.00 }, speed: { tokensPerSec: 90, latencyMs: 500 }, description: 'Top-tier Google model with 1M context and deep reasoning.', badge: null },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google', providerColor: '#4285f4', category: ['chat', 'coding'], local: false, context: 1000, params: null, scores: { mmlu: 84.0, humaneval: 83.0, math: 80.0, mtbench: 8.9, gpqa: 62.0 }, pricing: { input: 0.075, output: 0.30 }, speed: { tokensPerSec: 250, latencyMs: 90 }, description: 'Fastest Gemini 2.5 with best throughput in its class.', badge: '⚡' },
  { id: 'gemini-15-pro', name: 'Gemini 1.5 Pro', provider: 'Google', providerColor: '#4285f4', category: ['reasoning', 'coding', 'chat', 'vision'], local: false, context: 1000, params: null, scores: { mmlu: 85.9, humaneval: 84.1, math: 67.7, mtbench: 8.8, gpqa: 46.2 }, pricing: { input: 1.25, output: 5.00 }, speed: { tokensPerSec: 90, latencyMs: 500 }, description: '1M token context. Best for long documents and multimodal tasks.', badge: '📄' },
  { id: 'gemini-15-flash', name: 'Gemini 1.5 Flash', provider: 'Google', providerColor: '#4285f4', category: ['chat', 'coding'], local: false, context: 1000, params: null, scores: { mmlu: 78.9, humaneval: 71.5, math: 58.2, mtbench: 8.3, gpqa: 39.5 }, pricing: { input: 0.075, output: 0.30 }, speed: { tokensPerSec: 250, latencyMs: 90 }, description: 'Fastest model with 1M context for high-throughput pipelines.', badge: '⚡' },

  // ══════════════════════════════════════
  // DeepSeek
  // ══════════════════════════════════════
  { id: 'deepseek-v4-pro', name: 'DeepSeek V4 Pro', provider: 'DeepSeek', providerColor: '#6366f1', category: ['reasoning', 'coding'], local: false, context: 128, params: null, scores: { mmlu: 94.0, humaneval: 97.0, math: 97.5, mtbench: 9.6, gpqa: 82.0 }, pricing: { input: 2.00, output: 8.00 }, speed: { tokensPerSec: 55, latencyMs: 700 }, description: "DeepSeek's most capable frontier model.", badge: null },
  { id: 'deepseek-v4-flash', name: 'DeepSeek V4 Flash', provider: 'DeepSeek', providerColor: '#6366f1', category: ['coding', 'chat'], local: false, context: 128, params: null, scores: { mmlu: 88.0, humaneval: 93.0, math: 91.0, mtbench: 9.2, gpqa: 68.0 }, pricing: { input: 0.27, output: 1.10 }, speed: { tokensPerSec: 130, latencyMs: 300 }, description: 'Fast DeepSeek V4 for high-throughput workloads.', badge: '⚡' },
  { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'DeepSeek', providerColor: '#6366f1', category: ['reasoning', 'coding', 'chat'], local: false, context: 128, params: 671, scores: { mmlu: 88.5, humaneval: 90.2, math: 90.2, mtbench: 9.0, gpqa: 59.1 }, pricing: { input: 0.27, output: 1.10 }, speed: { tokensPerSec: 60, latencyMs: 600 }, description: '671B MoE model matching GPT-4o quality at a fraction of the cost.', badge: null },
  { id: 'deepseek-r1', name: 'DeepSeek R1', provider: 'DeepSeek', providerColor: '#6366f1', category: ['reasoning', 'coding'], local: true, context: 64, params: 671, scores: { mmlu: 90.8, humaneval: 92.3, math: 97.3, mtbench: 9.3, gpqa: 71.5 }, pricing: { input: 0.55, output: 2.19 }, speed: { tokensPerSec: 25, latencyMs: 1200 }, description: 'Reasoning model matching o1. Best for math & hard logic.', badge: '🥉' },
  { id: 'deepseek-r1-turbo', name: 'DeepSeek R1 Turbo', provider: 'DeepSeek', providerColor: '#6366f1', category: ['reasoning', 'coding'], local: false, context: 64, params: null, scores: { mmlu: 89.0, humaneval: 90.0, math: 95.5, mtbench: 9.1, gpqa: 68.0 }, pricing: { input: 0.40, output: 1.60 }, speed: { tokensPerSec: 40, latencyMs: 900 }, description: 'Faster R1 with improved throughput for reasoning tasks.', badge: null },
  { id: 'deepseek-r1-70b', name: 'DeepSeek R1 Distill 70B', provider: 'DeepSeek', providerColor: '#6366f1', category: ['reasoning', 'coding'], local: true, context: 32, params: 70, scores: { mmlu: 82.0, humaneval: 82.0, math: 87.5, mtbench: 8.6, gpqa: 52.0 }, pricing: { input: 0.23, output: 0.69 }, speed: { tokensPerSec: 35, latencyMs: 700 }, description: 'Llama-3 based distillation of R1. Strong reasoning at lower cost.', badge: '🔒' },
  { id: 'deepseek-prover-v2', name: 'DeepSeek Prover V2', provider: 'DeepSeek', providerColor: '#6366f1', category: ['reasoning'], local: false, context: 32, params: 671, scores: { mmlu: 88.0, humaneval: 88.0, math: 99.0, mtbench: 8.8, gpqa: 75.0 }, pricing: { input: 0.55, output: 2.19 }, speed: { tokensPerSec: 25, latencyMs: 1200 }, description: 'Specialized formal math prover. Solves competition-level proofs.', badge: '🧮' },

  // ══════════════════════════════════════
  // Meta Llama
  // ══════════════════════════════════════
  { id: 'llama-4-maverick', name: 'Llama 4 Maverick', provider: 'Meta', providerColor: '#0668e1', category: ['reasoning', 'coding', 'chat', 'vision'], local: true, context: 128, params: 400, scores: { mmlu: 88.5, humaneval: 88.0, math: 85.0, mtbench: 9.0, gpqa: 64.0 }, pricing: { input: 0.20, output: 0.60 }, speed: { tokensPerSec: 100, latencyMs: 400 }, description: 'Meta\'s MoE flagship. 17B active from 400B total. Excellent multimodal.', badge: null },
  { id: 'llama-33-70b', name: 'Llama 3.3 70B', provider: 'Meta (Local)', providerColor: '#0668e1', category: ['reasoning', 'coding', 'chat'], local: true, context: 128, params: 70, scores: { mmlu: 86.0, humaneval: 88.4, math: 77.0, mtbench: 8.7, gpqa: 50.5 }, pricing: { input: 0, output: 0 }, speed: { tokensPerSec: 35, latencyMs: 700 }, description: '100% free & private. Runs locally with Ollama. Near-GPT-4 quality.', badge: '🔒' },
  { id: 'llama-31-405b', name: 'Llama 3.1 405B', provider: 'Meta', providerColor: '#0668e1', category: ['reasoning', 'coding', 'chat'], local: true, context: 128, params: 405, scores: { mmlu: 88.6, humaneval: 89.0, math: 73.8, mtbench: 9.1, gpqa: 51.1 }, pricing: { input: 5.00, output: 15.00 }, speed: { tokensPerSec: 20, latencyMs: 1000 }, description: 'Largest open-weight Llama. Matches GPT-4-class performance.', badge: null },
  { id: 'llama-31-70b', name: 'Llama 3.1 70B', provider: 'Meta', providerColor: '#0668e1', category: ['reasoning', 'coding', 'chat'], local: true, context: 128, params: 70, scores: { mmlu: 83.6, humaneval: 80.5, math: 68.0, mtbench: 8.5, gpqa: 46.7 }, pricing: { input: 0.52, output: 0.75 }, speed: { tokensPerSec: 35, latencyMs: 700 }, description: 'Highly capable 70B open-weight model with 128K context.', badge: null },
  { id: 'llama-32-3b', name: 'Llama 3.2 3B', provider: 'Meta (Local)', providerColor: '#0668e1', category: ['chat', 'coding'], local: true, context: 128, params: 3, scores: { mmlu: 63.4, humaneval: 57.8, math: 48.0, mtbench: 7.4, gpqa: 26.7 }, pricing: { input: 0, output: 0 }, speed: { tokensPerSec: 140, latencyMs: 200 }, description: 'Tiny model runs on any laptop. Great for on-device apps.', badge: '🔒' },

  // ══════════════════════════════════════
  // Qwen
  // ══════════════════════════════════════
  { id: 'qwen3.7-max', name: 'Qwen 3.7 Max', provider: 'Alibaba', providerColor: '#ff6a00', category: ['reasoning', 'coding', 'chat'], local: false, context: 128, params: null, scores: { mmlu: 93.0, humaneval: 95.0, math: 96.0, mtbench: 9.5, gpqa: 80.0 }, pricing: { input: 3.00, output: 12.00 }, speed: { tokensPerSec: 60, latencyMs: 600 }, description: "Qwen's top flagship with extended thinking. Exceptional at math.", badge: null },
  { id: 'qwen3-235b', name: 'Qwen3 235B A22B', provider: 'Alibaba', providerColor: '#ff6a00', category: ['reasoning', 'coding', 'chat'], local: true, context: 128, params: 235, scores: { mmlu: 90.0, humaneval: 91.5, math: 94.0, mtbench: 9.3, gpqa: 74.0 }, pricing: { input: 0.60, output: 2.40 }, speed: { tokensPerSec: 28, latencyMs: 800 }, description: 'Largest Qwen3 MoE. State-of-the-art open-weight reasoning.', badge: '🔒' },
  { id: 'qwen3-32b', name: 'Qwen3 32B', provider: 'Alibaba (Local)', providerColor: '#ff6a00', category: ['reasoning', 'coding', 'chat'], local: true, context: 128, params: 32, scores: { mmlu: 87.0, humaneval: 87.0, math: 89.0, mtbench: 9.0, gpqa: 68.0 }, pricing: { input: 0, output: 0 }, speed: { tokensPerSec: 50, latencyMs: 550 }, description: '32B dense model with hybrid thinking mode. Great local option.', badge: '🔒' },
  { id: 'qwen-25-72b', name: 'Qwen 2.5 72B', provider: 'Alibaba (Local)', providerColor: '#ff6a00', category: ['reasoning', 'coding', 'chat'], local: true, context: 128, params: 72, scores: { mmlu: 86.1, humaneval: 86.7, math: 83.1, mtbench: 8.8, gpqa: 49.5 }, pricing: { input: 0, output: 0 }, speed: { tokensPerSec: 30, latencyMs: 750 }, description: 'Top open-weight 72B model for math/coding. Excellent quality for free.', badge: '🔒' },
  { id: 'qwen-max', name: 'Qwen Max', provider: 'Alibaba', providerColor: '#ff6a00', category: ['reasoning', 'coding', 'chat'], local: false, context: 32, params: null, scores: { mmlu: 88.0, humaneval: 90.0, math: 88.0, mtbench: 9.1, gpqa: 65.0 }, pricing: { input: 2.40, output: 9.60 }, speed: { tokensPerSec: 65, latencyMs: 550 }, description: "Alibaba's flagship proprietary API model.", badge: null },

  // ══════════════════════════════════════
  // Mistral
  // ══════════════════════════════════════
  { id: 'mistral-large', name: 'Mistral Large', provider: 'Mistral AI', providerColor: '#f7931a', category: ['reasoning', 'coding', 'chat'], local: false, context: 128, params: null, scores: { mmlu: 84.0, humaneval: 92.0, math: 70.0, mtbench: 8.9, gpqa: 59.0 }, pricing: { input: 2.00, output: 6.00 }, speed: { tokensPerSec: 80, latencyMs: 450 }, description: "Mistral's top model for complex tasks. Strong multilingual support.", badge: null },
  { id: 'codestral', name: 'Codestral', provider: 'Mistral AI', providerColor: '#f7931a', category: ['coding'], local: false, context: 256, params: null, scores: { mmlu: 75.0, humaneval: 96.0, math: 72.0, mtbench: 8.5, gpqa: 48.0 }, pricing: { input: 0.20, output: 0.60 }, speed: { tokensPerSec: 120, latencyMs: 300 }, description: 'Specialized coding model. Best-in-class for code completion and FIM.', badge: '💻' },
  { id: 'devstral', name: 'Devstral', provider: 'Mistral AI', providerColor: '#f7931a', category: ['coding'], local: false, context: 128, params: null, scores: { mmlu: 74.0, humaneval: 93.0, math: 68.0, mtbench: 8.4, gpqa: 45.0 }, pricing: { input: 0.40, output: 1.60 }, speed: { tokensPerSec: 100, latencyMs: 380 }, description: 'Agentic coding model built for software engineering tasks.', badge: '💻' },
  { id: 'mistral-small', name: 'Mistral Small', provider: 'Mistral AI', providerColor: '#f7931a', category: ['chat', 'coding'], local: false, context: 32, params: null, scores: { mmlu: 72.0, humaneval: 78.0, math: 55.0, mtbench: 8.0, gpqa: 38.0 }, pricing: { input: 0.10, output: 0.30 }, speed: { tokensPerSec: 180, latencyMs: 180 }, description: 'Fast, affordable Mistral for lightweight and high-volume tasks.', badge: '⚡' },
  { id: 'mixtral-8x7b', name: 'Mixtral 8×7B', provider: 'Mistral (Local)', providerColor: '#f7931a', category: ['reasoning', 'coding', 'chat'], local: true, context: 32, params: 47, scores: { mmlu: 70.6, humaneval: 40.2, math: 28.4, mtbench: 8.3, gpqa: 35.6 }, pricing: { input: 0, output: 0 }, speed: { tokensPerSec: 45, latencyMs: 550 }, description: 'MoE architecture: 47B params, acts like 12B. Great local balance.', badge: '🔒' },
  { id: 'mistral-7b', name: 'Mistral 7B', provider: 'Mistral (Local)', providerColor: '#f7931a', category: ['chat', 'coding'], local: true, context: 32, params: 7, scores: { mmlu: 64.2, humaneval: 30.5, math: 28.1, mtbench: 7.6, gpqa: 24.9 }, pricing: { input: 0, output: 0 }, speed: { tokensPerSec: 90, latencyMs: 350 }, description: 'Efficient 7B model with fast inference. Good first step for local AI.', badge: '🔒' },

  // ══════════════════════════════════════
  // xAI Grok
  // ══════════════════════════════════════
  { id: 'grok-4', name: 'Grok 4', provider: 'xAI', providerColor: '#1DA1F2', category: ['reasoning', 'coding', 'chat'], local: false, context: 256, params: null, scores: { mmlu: 95.0, humaneval: 97.0, math: 98.0, mtbench: 9.7, gpqa: 86.0 }, pricing: { input: 3.00, output: 15.00 }, speed: { tokensPerSec: 65, latencyMs: 600 }, description: "xAI's flagship with real-time web access and exceptional reasoning.", badge: null },
  { id: 'grok-4-fast', name: 'Grok 4 Fast', provider: 'xAI', providerColor: '#1DA1F2', category: ['reasoning', 'coding'], local: false, context: 256, params: null, scores: { mmlu: 94.0, humaneval: 96.0, math: 97.0, mtbench: 9.6, gpqa: 84.0 }, pricing: { input: 5.00, output: 25.00 }, speed: { tokensPerSec: 90, latencyMs: 400 }, description: 'High-speed Grok 4 for latency-sensitive reasoning tasks.', badge: '⚡' },
  { id: 'grok-3', name: 'Grok 3', provider: 'xAI', providerColor: '#1DA1F2', category: ['reasoning', 'coding', 'chat'], local: false, context: 131, params: null, scores: { mmlu: 88.0, humaneval: 88.0, math: 93.0, mtbench: 9.3, gpqa: 74.0 }, pricing: { input: 3.00, output: 15.00 }, speed: { tokensPerSec: 70, latencyMs: 550 }, description: 'Previous Grok flagship with strong reasoning and real-time search.', badge: null },
  { id: 'grok-3-mini', name: 'Grok 3 mini', provider: 'xAI', providerColor: '#1DA1F2', category: ['reasoning', 'chat'], local: false, context: 131, params: null, scores: { mmlu: 81.0, humaneval: 78.0, math: 85.0, mtbench: 8.7, gpqa: 60.0 }, pricing: { input: 0.30, output: 0.50 }, speed: { tokensPerSec: 150, latencyMs: 250 }, description: 'Compact, affordable Grok with strong reasoning at lower price.', badge: '⚡' },

  // ══════════════════════════════════════
  // Other notable models
  // ══════════════════════════════════════
  { id: 'sonar-pro', name: 'Sonar Pro', provider: 'Perplexity', providerColor: '#1fb6ff', category: ['reasoning', 'chat'], local: false, context: 200, params: null, scores: { mmlu: 80.0, humaneval: 72.0, math: 65.0, mtbench: 8.7, gpqa: 50.0 }, pricing: { input: 3.00, output: 15.00 }, speed: { tokensPerSec: 85, latencyMs: 450 }, description: "Perplexity's top model with live web search and grounded responses.", badge: '🌐' },
  { id: 'phi-4', name: 'Phi-4', provider: 'Microsoft (Local)', providerColor: '#0078d4', category: ['reasoning', 'coding', 'chat'], local: true, context: 16, params: 14, scores: { mmlu: 84.8, humaneval: 82.6, math: 80.4, mtbench: 8.7, gpqa: 56.1 }, pricing: { input: 0, output: 0 }, speed: { tokensPerSec: 70, latencyMs: 400 }, description: '14B model punches way above its weight. Great local math/coding.', badge: '🔒' },
  { id: 'gemma-2-27b', name: 'Gemma 2 27B', provider: 'Google (Local)', providerColor: '#4285f4', category: ['chat', 'reasoning'], local: true, context: 8, params: 27, scores: { mmlu: 75.2, humaneval: 51.8, math: 46.4, mtbench: 8.4, gpqa: 38.2 }, pricing: { input: 0, output: 0 }, speed: { tokensPerSec: 55, latencyMs: 500 }, description: "Google's open local model. Solid for general chat and reasoning.", badge: '🔒' },
  { id: 'command-r-plus', name: 'Command R+', provider: 'Cohere', providerColor: '#39d3c3', category: ['reasoning', 'chat'], local: false, context: 128, params: null, scores: { mmlu: 75.7, humaneval: 56.2, math: 50.1, mtbench: 8.3, gpqa: 38.5 }, pricing: { input: 2.50, output: 10.00 }, speed: { tokensPerSec: 80, latencyMs: 500 }, description: 'Optimized for RAG and enterprise search. Strong document understanding.', badge: null },
];

// ─── Task Fit Definitions ───
export const TASK_FIT_PROFILES = {
  coding: {
    label: 'Coding & Debugging',
    emoji: '💻',
    description: 'Writing, reviewing, and debugging code',
    topModels: ['claude-fable-5', 'codestral', 'o3', 'gpt-5'],
    localTop: ['llama-33-70b', 'qwen-25-72b', 'deepseek-r1', 'phi-4'],
    reason: 'Claude Fable 5 & Codestral lead on HumanEval. For local: Llama 3.3 70B or Qwen 2.5 72B are unmatched.',
  },
  math: {
    label: 'Math & Reasoning',
    emoji: '🧮',
    description: 'Complex problem-solving, logical reasoning, and math',
    topModels: ['o3-pro', 'deepseek-prover-v2', 'grok-4', 'gemini-3.1-pro-preview'],
    localTop: ['deepseek-r1', 'qwen3-235b', 'qwen3-32b', 'phi-4'],
    reason: 'o3-pro and DeepSeek Prover V2 dominate math benchmarks. DeepSeek R1 is the top free local option.',
  },
  chat: {
    label: 'Conversation & Chat',
    emoji: '💬',
    description: 'Customer support, personal assistants, general chat',
    topModels: ['gpt-5', 'claude-sonnet-4', 'gpt-4.1-mini', 'claude-haiku-4-5'],
    localTop: ['llama-33-70b', 'qwen3-32b', 'gemma-2-27b'],
    reason: 'GPT-5 and Claude Sonnet 4 lead for quality chat. For budget: GPT-4o mini or Claude Haiku 4.5.',
  },
  summarization: {
    label: 'Document Summarization',
    emoji: '📄',
    description: 'Reading and summarizing long documents, reports, PDFs',
    topModels: ['gemini-3.1-pro-preview', 'gpt-4.1', 'claude-opus-4'],
    localTop: ['llama-31-405b', 'qwen3-235b'],
    reason: 'Gemini 3.1 Pro has a 2M token context — best for massive documents. GPT-4.1 also has 1M context.',
  },
  creative: {
    label: 'Creative Writing',
    emoji: '✍️',
    description: 'Stories, blogs, marketing copy, scripts',
    topModels: ['claude-fable-5', 'claude-opus-4', 'gpt-5'],
    localTop: ['llama-33-70b', 'qwen3-32b'],
    reason: 'Claude models are widely praised for creative prose. GPT-5 is a close second.',
  },
  private: {
    label: 'Private / Local Only',
    emoji: '🔒',
    description: 'No cloud, no data sharing — fully offline with Ollama',
    topModels: ['llama-33-70b', 'deepseek-r1', 'qwen3-235b', 'phi-4'],
    localTop: ['llama-33-70b', 'qwen3-235b', 'qwen3-32b', 'deepseek-r1-70b'],
    reason: 'All run 100% locally with Ollama. Llama 3.3 70B is the top pick for quality. Qwen3 235B for best reasoning.',
  },
};

// ─── Benchmark column metadata ───
export const BENCHMARK_COLUMNS = [
  { key: 'mmlu',      label: 'MMLU',      tooltip: 'Massive Multitask Language Understanding — 57 academic subjects',   color: '#6366f1' },
  { key: 'humaneval', label: 'HumanEval', tooltip: 'Code generation benchmark — Python function completion accuracy',       color: '#10b981' },
  { key: 'math',      label: 'MATH',      tooltip: 'Competition-level math problems (AMC/AIME difficulty)',               color: '#f59e0b' },
  { key: 'mtbench',   label: 'MT-Bench',  tooltip: 'Multi-turn chatbot evaluation — rated 1–10 by GPT-4 judge',           color: '#ec4899' },
  { key: 'gpqa',      label: 'GPQA',      tooltip: 'Graduate-level science Q&A — PhD-level difficulty',                    color: '#8b5cf6' },
];
