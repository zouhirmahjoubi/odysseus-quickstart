import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Copy, Play, RotateCcw, ChevronDown, Check, AlertTriangle, Lock, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn } from '@/components/ScrollAnimations.jsx';

const mk = (name, provider, type, providerColor, contextWindow, dataCutoff, inputCost, outputCost, speed, accuracy, reasoning, capabilities, mockResponse) => ({ name, provider, type, providerColor, contextWindow, dataCutoff, inputCost, outputCost, speed, accuracy, reasoning, capabilities, mockResponse });
const mockOK = (label, note = '') => `[MOCK — ${label}]\nInitializing inference environment...\n${note ? note + '\n' : ''}\n{\n  "status": "success",\n  "response": "Hello! This is a mock response from ${label}. Sandbox execution complete.",\n  "metrics": { "tokens": 128, "latency_ms": 320 }\n}`;
const mockLocal = (label, model) => `[MOCK — ${label}]\nAccessing local Ollama endpoint...\nModel: ${model}\n\n{\n  "status": "success",\n  "response": "${label} running locally. Fully private — zero data leaves your machine.",\n  "metrics": { "total_duration_ms": 110, "eval_count": 92 }\n}`;

const modelsData = {
  // ── OpenAI ──────────────────────────────────────────────
  'gpt-5.5':        mk('GPT-5.5',        'OpenAI','Proprietary','#10a37f','256K','2025',  '$15.00','$60.00',5,10.0,10.0,['Text','Code','Vision','Reasoning'], mockOK('GPT-5.5', 'Frontier model — highest capability tier')),
  'gpt-5':          mk('GPT-5',          'OpenAI','Proprietary','#10a37f','128K','2025',  '$10.00','$40.00',6,9.9,9.9, ['Text','Code','Vision','Agent'],      mockOK('GPT-5', 'Breakthrough reasoning — AGI-grade performance')),
  'gpt-5-mini':     mk('GPT-5 mini',     'OpenAI','Proprietary','#10a37f','128K','2025',  '$1.50', '$6.00', 8,9.3,9.1, ['Text','Code','Chat'],               mockOK('GPT-5 mini')),
  'gpt-5.4-mini':   mk('GPT-5.4 mini',   'OpenAI','Proprietary','#10a37f','128K','2025',  '$0.40', '$1.60', 9,9.2,9.0, ['Text','Code','Chat'],               mockOK('GPT-5.4 mini', 'High-speed compact GPT-5 series')),
  'gpt-5.4-nano':   mk('GPT-5.4 nano',   'OpenAI','Proprietary','#10a37f','64K', '2025',  '$0.10', '$0.40', 10,8.5,8.0,['Text','Fast Inference'],            mockOK('GPT-5.4 nano', 'Ultra-fast nano inference')),
  'o3-pro':         mk('o3-pro',         'OpenAI','Proprietary','#10a37f','200K','2024',  '$20.00','$80.00',3,9.9,9.9, ['Reasoning','Math','Research','Code'],mockOK('o3-pro', 'Maximum reasoning effort — slowest but best')),
  'o3':             mk('o3',             'OpenAI','Proprietary','#10a37f','200K','2024',  '$10.00','$40.00',4,9.8,9.8, ['Reasoning','Math','Code'],          mockOK('o3', 'Frontier reasoning model')),
  'o3-mini':        mk('o3-mini',        'OpenAI','Proprietary','#10a37f','128K','2024',  '$1.10', '$4.40', 5,9.5,9.6, ['Reasoning','Math','Code'],          mockOK('o3-mini', 'Compact reasoning — near o3 quality')),
  'o4-mini':        mk('o4-mini',        'OpenAI','Proprietary','#10a37f','128K','2024',  '$1.10', '$4.40', 6,9.6,9.7, ['Reasoning','Math','Code'],          mockOK('o4-mini', 'Next-gen compact reasoning')),
  'o1':             mk('o1',             'OpenAI','Proprietary','#10a37f','200K','Oct 2023','$15.00','$60.00',4,9.7,9.8,['Reasoning','Math','Science'],      mockOK('o1', 'First-generation reasoning — thinks before answering')),
  'gpt-4.1':        mk('GPT-4.1',        'OpenAI','Proprietary','#10a37f','1M',  'Jun 2024','$2.00','$8.00', 8,9.3,9.2, ['Text','Code','Vision','Agent'],    mockOK('GPT-4.1', '1M token context window')),
  'gpt-4.1-mini':   mk('GPT-4.1 mini',   'OpenAI','Proprietary','#10a37f','1M',  'Jun 2024','$0.40','$1.60', 9,8.8,8.7, ['Text','Code','Vision'],           mockOK('GPT-4.1 mini', 'Fast GPT-4.1 with 1M context')),
  'gpt-4o':         mk('GPT-4o',         'OpenAI','Proprietary','#10a37f','128K','Oct 2023','$2.50','$10.00',9,9.5,9.3, ['Text','Code','Vision','Audio'],    mockOK('GPT-4o', 'Omni model — text, vision, audio')),
  'gpt-4o-mini':    mk('GPT-4o mini',    'OpenAI','Proprietary','#10a37f','128K','Oct 2023','$0.15','$0.60',10,8.5,8.3, ['Text','Code','Vision'],           mockOK('GPT-4o mini', 'Most affordable OpenAI model with vision')),
  'gpt-4-turbo':    mk('GPT-4 Turbo',    'OpenAI','Proprietary','#10a37f','128K','Dec 2023','$0.01','$0.03', 7,9.5,9.5, ['Text','Code','Vision'],           mockOK('GPT-4 Turbo')),
  'gpt-4':          mk('GPT-4',          'OpenAI','Proprietary','#10a37f','32K', 'Sep 2021','$0.03','$0.06', 6,9.5,9.5, ['Text','Code','Reasoning'],        mockOK('GPT-4')),
  'gpt-3-5-turbo':  mk('GPT-3.5 Turbo',  'OpenAI','Proprietary','#10a37f','16K', 'Sep 2021','$0.0005','$0.0015',9,8.0,7.5,['Text','Code'],                  mockOK('GPT-3.5 Turbo', 'Fast and affordable chat model')),

  // ── Anthropic ────────────────────────────────────────────
  'claude-fable-5':    mk('Claude Fable 5',    'Anthropic','Proprietary','#d97706','200K','2025','$25.00','$100.00',4,10.0,10.0,['Text','Code','Vision','Reasoning','Agent'], mockOK('CLAUDE FABLE 5', '#1 ranked overall and coding — most powerful Claude')),
  'claude-opus-4-5':   mk('Claude Opus 4.5',   'Anthropic','Proprietary','#d97706','200K','2025','$18.00','$90.00', 4,9.95,9.95,['Text','Code','Vision','Reasoning'],      mockOK('CLAUDE OPUS 4.5', 'Enhanced flagship Opus — improved all tasks')),
  'claude-opus-4':     mk('Claude Opus 4',     'Anthropic','Proprietary','#d97706','200K','2025','$15.00','$75.00', 5,9.9, 9.9, ['Text','Code','Vision','Agent'],             mockOK('CLAUDE OPUS 4', 'Frontier Anthropic flagship')),
  'claude-sonnet-4-5': mk('Claude Sonnet 4.5', 'Anthropic','Proprietary','#d97706','200K','2025','$3.50', '$17.50', 7,9.6, 9.5, ['Text','Code','Vision','Enterprise'],         mockOK('CLAUDE SONNET 4.5', 'Enhanced Sonnet with stronger coding')),
  'claude-sonnet-4':   mk('Claude Sonnet 4',   'Anthropic','Proprietary','#d97706','200K','2025','$3.00', '$15.00', 8,9.5, 9.4, ['Text','Code','Vision','Enterprise'],         mockOK('CLAUDE SONNET 4', 'Best balance intelligence + speed')),
  'claude-haiku-4-5':  mk('Claude Haiku 4.5',  'Anthropic','Proprietary','#d97706','200K','2025','$0.80', '$4.00', 10,8.8, 8.6, ['Text','Code','Vision','Real-time'],         mockOK('CLAUDE HAIKU 4.5', 'Fastest Claude 4-gen for real-time apps')),
  'claude-3-opus':     mk('Claude 3 Opus',     'Anthropic','Proprietary','#d97706','200K','Aug 2023','$0.015','$0.075',5,9.8,9.8,['Text','Code','Reasoning'],                  mockOK('CLAUDE 3 OPUS', 'Deep reasoning — 18 thinking steps')),
  'claude-3-sonnet':   mk('Claude 3 Sonnet',   'Anthropic','Proprietary','#d97706','200K','Aug 2023','$0.003','$0.015', 8,9.4,9.0,['Text','Code','Enterprise'],              mockOK('CLAUDE 3 SONNET', 'Balanced workhorse for enterprise')),
  'claude-3-haiku':    mk('Claude 3 Haiku',    'Anthropic','Proprietary','#d97706','200K','Aug 2023','$0.00025','$0.00125',10,8.5,8.0,['Text','Vision','Chat'],             mockOK('CLAUDE 3 HAIKU', '125 tokens/sec instant inference')),

  // ── Google ───────────────────────────────────────────────
  'gemini-3.1-pro':    mk('Gemini 3.1 Pro Preview','Google','Proprietary','#4285f4','2M',  '2025','$7.00','$21.00', 6,9.9,10.0,['Text','Code','Vision','Reasoning'],         mockOK('GEMINI 3.1 PRO', '#1 for reasoning — 2M token context')),
  'gemini-3.5-flash':  mk('Gemini 3.5 Flash',      'Google','Proprietary','#4285f4','1M',  '2025','$0.30','$1.00', 10,9.2,9.0, ['Text','Code','Vision','Fast'],              mockOK('GEMINI 3.5 FLASH', 'Ultra-fast Gemini 3.5 multimodal')),
  'gemini-3.1-flash':  mk('Gemini 3.1 Flash Lite',  'Google','Proprietary','#4285f4','1M',  '2025','$0.075','$0.30',10,8.8,8.5,['Text','Vision','Fast','Low Cost'],          mockOK('GEMINI 3.1 FLASH LITE', 'Most affordable Gemini 3 model')),
  'gemini-2.5-pro':    mk('Gemini 2.5 Pro',         'Google','Proprietary','#4285f4','1M',  'Jan 2025','$1.25','$10.00',7,9.7,9.6,['Text','Code','Vision','Long Context'],    mockOK('GEMINI 2.5 PRO', '1M context — deep reasoning')),
  'gemini-2.5-flash':  mk('Gemini 2.5 Flash',       'Google','Proprietary','#4285f4','1M',  'Jan 2025','$0.075','$0.30',9,8.8,8.6,['Text','Code','Vision','Fast'],           mockOK('GEMINI 2.5 FLASH', 'Fastest Gemini 2.5 variant')),
  'gemini-ultra':      mk('Gemini Ultra',            'Google','Proprietary','#4285f4','1M',  'Jan 2024','$0.007','$0.021',6,9.6,9.6,['Text','Code','Multimodal'],            mockOK('GEMINI ULTRA', 'Multimodal semantic grid active')),
  'gemini-pro':        mk('Gemini Pro',              'Google','Proprietary','#4285f4','2M',  'Jan 2024','$0.003','$0.009',8,9.2,9.0,['Text','Code','Multimodal'],            mockOK('GEMINI PRO', 'Analyzing 2M token context')),

  // ── DeepSeek ─────────────────────────────────────────────
  'deepseek-v4-pro':   mk('DeepSeek V4 Pro',   'DeepSeek','Open Weight','#6366f1','128K','2025','$2.00','$8.00',  5,9.8,9.8,['Text','Code','Reasoning','Math'], mockOK('DEEPSEEK V4 PRO', 'Top frontier reasoning + coding model')),
  'deepseek-v4-flash': mk('DeepSeek V4 Flash',  'DeepSeek','Open Weight','#6366f1','128K','2025','$0.27','$1.10',  9,9.0,8.9,['Text','Code','Fast'],           mockOK('DEEPSEEK V4 FLASH', 'High-throughput production workload')),
  'deepseek-v3':       mk('DeepSeek V3',        'DeepSeek','Open Weight','#6366f1','128K','Dec 2024','$0.27','$1.10',7,9.4,9.2,['Text','Code','Math'],           mockOK('DEEPSEEK V3', '671B MoE — GPT-4o quality at fraction of cost')),
  'deepseek-r1':       mk('DeepSeek R1',        'DeepSeek','Open Weight','#6366f1','64K', 'Dec 2024','$0.55','$2.19',4,9.8,9.9,['Reasoning','Math','Code'],       mockOK('DEEPSEEK R1', 'Reasoning model matching o1 — MATH: 97.3%')),
  'deepseek-r1-turbo': mk('DeepSeek R1 Turbo',  'DeepSeek','Open Weight','#6366f1','64K', '2025','$0.40','$1.60',  5,9.6,9.7,['Reasoning','Math','Code'],       mockOK('DEEPSEEK R1 TURBO', 'Faster R1 with improved throughput')),
  'deepseek-r1-70b':   mk('R1 Distill 70B',     'DeepSeek','Open Weight','#6366f1','32K', 'Jan 2025','$0.23','$0.69', 7,9.0,9.1,['Reasoning','Code'],          mockOK('DEEPSEEK R1 DISTILL 70B', 'Llama-3 distillation of R1')),
  'deepseek-chat':     mk('DeepSeek Chat',      'DeepSeek','Open Weight','#6366f1','128K','Oct 2024','$0.14','$0.28', 9,8.5,8.2,['Text','Code','Chat'],          mockOK('DEEPSEEK CHAT', 'Efficient V2 chat model')),

  // ── Meta Llama ───────────────────────────────────────────
  'llama-4-maverick':  mk('Llama 4 Maverick',  'Meta','Open Weight','#0668e1','128K','2025','$0.20','$0.60',  9,9.0,8.8,['Text','Code','Vision','MoE'],      mockOK('LLAMA 4 MAVERICK', '17B active params from 400B MoE — multimodal')),
  'llama-3.3-70b':     mk('Llama 3.3 70B',     'Meta','Open Weight','#0668e1','128K','Dec 2024','$0.23','$0.40', 7,9.0,9.0,['Text','Code','Reasoning'],       mockOK('LLAMA 3.3 70B', 'Best open-weight 70B — near GPT-4 quality')),
  'llama-3.1-405b':    mk('Llama 3.1 405B',    'Meta','Open Weight','#0668e1','128K','Dec 2023','$5.00','$15.00',3,9.2,9.0,['Text','Code','Reasoning'],        mockOK('LLAMA 3.1 405B', 'Largest open-weight Llama — GPT-4 class')),
  'llama-3.1-70b':     mk('Llama 3.1 70B',     'Meta','Open Weight','#0668e1','128K','Dec 2023','$0.52','$0.75', 7,8.7,8.5,['Text','Code','Reasoning'],       mockOK('LLAMA 3.1 70B', '128K context open-weight model')),
  'llama-3.1-8b':      mk('Llama 3.1 8B',      'Meta','Open Weight','#0668e1','128K','Dec 2023','$0.10','$0.10',10,7.8,7.5,['Text','Code','Fast'],             mockOK('LLAMA 3.1 8B', 'Efficient 8B with 128K context')),
  'llama-2-70b':       mk('Llama 2 70B',       'Meta','Open Source','#0668e1','4K',  'Sep 2022','FREE','FREE',    7,8.5,8.2,['Text','Code','Self-Host'],        mockOK('LLAMA 2 70B', 'Self-hosted 70B weights executing locally')),

  // ── Qwen ─────────────────────────────────────────────────
  'qwen3.7-max':       mk('Qwen 3.7 Max',     'Alibaba','Open Weight','#ff6a00','128K','2025','$3.00','$12.00', 6,9.7,9.7,['Text','Code','Reasoning','Thinking'], mockOK('QWEN 3.7 MAX', 'Extended thinking mode — MATH leader')),
  'qwen3-235b':        mk('Qwen3 235B A22B',  'Alibaba','Open Weight','#ff6a00','128K','2025','$0.60','$2.40',  5,9.5,9.6,['Text','Code','Reasoning','MoE'],     mockOK('QWEN3 235B', 'Largest Qwen3 MoE — state-of-the-art open reasoning')),
  'qwen3-32b':         mk('Qwen3 32B',        'Alibaba','Open Weight','#ff6a00','128K','2025','FREE','FREE',     7,9.0,9.1,['Text','Code','Reasoning','Thinking'], mockOK('QWEN3 32B', '32B dense with hybrid thinking — great local model')),
  'qwen-2.5-72b':      mk('Qwen 2.5 72B',     'Alibaba','Open Weight','#ff6a00','128K','Sep 2024','FREE','FREE', 6,8.8,8.9,['Text','Code','Math'],               mockOK('QWEN 2.5 72B', 'Top open-weight 72B for math and coding')),
  'qwen-max':          mk('Qwen Max',         'Alibaba','Proprietary','#ff6a00','32K', '2025','$2.40','$9.60',  7,9.2,9.1,['Text','Code','Reasoning'],           mockOK('QWEN MAX', "Alibaba's flagship proprietary API")),
  'qwen-plus':         mk('Qwen Plus',        'Alibaba','Proprietary','#ff6a00','128K','2025','$0.80','$3.20',  8,8.5,8.3,['Text','Code','Chat'],               mockOK('QWEN PLUS', 'Balanced Qwen with large context')),
  'qwen-turbo':        mk('Qwen Turbo',       'Alibaba','Proprietary','#ff6a00','128K','2025','$0.05','$0.20', 10,7.8,7.5,['Text','Chat','Fast'],               mockOK('QWEN TURBO', 'Ultra-fast affordable Qwen')),

  // ── Mistral ──────────────────────────────────────────────
  'mistral-large':     mk('Mistral Large',    'Mistral AI','Proprietary','#f7931a','128K','2025','$2.00','$6.00',  8,9.2,9.0,['Text','Code','Multilingual','Function Calling'], mockOK('MISTRAL LARGE', 'Top Mistral — multilingual + code')),
  'codestral':         mk('Codestral',        'Mistral AI','Proprietary','#f7931a','256K','2025','$0.20','$0.60',  9,9.2,8.5,['Code','FIM','Completion','Debug'],  mockOK('CODESTRAL', 'Specialized coding — FIM and completion active')),
  'devstral':          mk('Devstral',         'Mistral AI','Proprietary','#f7931a','128K','2025','$0.40','$1.60',  8,9.0,8.7,['Code','Agent','Software Eng'],      mockOK('DEVSTRAL', 'Agentic software engineering model')),
  'mistral-small':     mk('Mistral Small',    'Mistral AI','Proprietary','#f7931a','32K', '2025','$0.10','$0.30', 10,8.2,8.0,['Text','Code','Chat'],               mockOK('MISTRAL SMALL', 'Fast affordable Mistral')),
  'mixtral-8x7b':      mk('Mixtral 8x7B',     'Mistral AI','Open Source','#f7931a','32K', 'Dec 2023','FREE','FREE', 9,8.5,8.5,['Text','Code','MoE'],              mockOK('MIXTRAL 8X7B', 'Sparse MoE routing — 12B equivalent active')),
  'mistral-7b':        mk('Mistral 7B',       'Mistral AI','Open Source','#f7931a','8K',  'Sep 2023','FREE','FREE',10,8.0,7.5,['Text','Code'],                      mockOK('MISTRAL 7B', '105 tokens/sec local inference')),

  // ── xAI Grok ─────────────────────────────────────────────
  'grok-4':            mk('Grok 4',     'xAI','Proprietary','#1DA1F2','256K','2025','$3.00','$15.00',  6,9.8,9.8,['Text','Code','Reasoning','Web Search'], mockOK('GROK 4', 'Real-time web access + exceptional reasoning')),
  'grok-4-fast':       mk('Grok 4 Fast','xAI','Proprietary','#1DA1F2','256K','2025','$5.00','$25.00',  8,9.7,9.7,['Text','Code','Reasoning','Fast'],        mockOK('GROK 4 FAST', 'High-speed Grok 4 for latency-sensitive tasks')),
  'grok-3':            mk('Grok 3',     'xAI','Proprietary','#1DA1F2','131K','Oct 2024','$3.00','$15.00',7,9.4,9.5,['Text','Code','Reasoning','Web Search'], mockOK('GROK 3', 'Previous Grok flagship + real-time search')),
  'grok-3-mini':       mk('Grok 3 mini','xAI','Proprietary','#1DA1F2','131K','Oct 2024','$0.30','$0.50',  9,8.8,9.0,['Text','Reasoning','Low Cost'],         mockOK('GROK 3 MINI', 'Affordable Grok with strong reasoning')),

  // ── Perplexity / Other ───────────────────────────────────
  'sonar-pro':         mk('Sonar Pro',  'Perplexity','Proprietary','#1fb6ff','200K','Live','$3.00','$15.00', 7,9.0,8.8,['Text','Web Search','RAG'],           mockOK('SONAR PRO', 'Live web search grounded responses')),
  'sonar':             mk('Sonar',      'Perplexity','Proprietary','#1fb6ff','127K','Live','$1.00','$1.00',   9,8.5,8.0,['Text','Web Search'],                 mockOK('SONAR', 'Fast real-time search grounding')),
  'phi-4':             mk('Phi-4',      'Microsoft','Open Weight','#0078d4','16K', 'Jun 2024','FREE','FREE',    7,8.8,9.0,['Text','Code','Reasoning','Math'],   mockOK('PHI-4', '14B model punching above its weight class')),
  'cohere-command':    mk('Cohere Command','Cohere','Proprietary','#39d3c3','128K','Ongoing','$0.001','$0.002', 8,8.8,8.5,['Text','RAG','Tool Use'],           mockOK('COHERE COMMAND', 'RAG query optimization + tool grounding')),

  // ── Local / Ollama ───────────────────────────────────────
  'llama-3-8b-ollama':    mk('Llama 3 8B (Ollama)',      'Ollama','Local','#ec4899','8K',  'Dec 2023','FREE','FREE',9,8.5,8.2, ['Text','Code','Local Host'],  mockLocal('LLAMA 3 8B','llama3:8b')),
  'llama-33-70b-ollama':  mk('Llama 3.3 70B (Ollama)',   'Ollama','Local','#ec4899','128K','Dec 2024','FREE','FREE',7,9.0,9.0, ['Text','Code','Local Host'],  mockLocal('LLAMA 3.3 70B','llama3.3:70b')),
  'deepseek-r1-ollama':   mk('DeepSeek R1 (Ollama)',     'Ollama','Local','#ec4899','64K', 'Jan 2025','FREE','FREE',4,9.8,9.9, ['Reasoning','Math','Code'],   mockLocal('DEEPSEEK R1','deepseek-r1:671b')),
  'qwen3-32b-ollama':     mk('Qwen3 32B (Ollama)',       'Ollama','Local','#ec4899','128K','Apr 2025','FREE','FREE',7,9.0,9.1, ['Text','Code','Thinking'],    mockLocal('QWEN3 32B','qwen3:32b')),
  'qwen-2.5-72b-ollama':  mk('Qwen 2.5 72B (Ollama)',   'Ollama','Local','#ec4899','128K','Sep 2024','FREE','FREE',6,8.8,8.9, ['Text','Code','Math'],        mockLocal('QWEN 2.5 72B','qwen2.5:72b')),
  'phi-4-ollama':         mk('Phi-4 (Ollama)',           'Ollama','Local','#ec4899','16K', 'Dec 2024','FREE','FREE',7,8.8,9.0, ['Text','Code','Math'],        mockLocal('PHI-4','phi4:latest')),
  'mistral-7b-ollama':    mk('Mistral 7B (Ollama)',      'Ollama','Local','#ec4899','8K',  'Sep 2023','FREE','FREE',9,8.0,7.8, ['Text','Code','Local Host'],  mockLocal('MISTRAL 7B','mistral:7b')),
  'phi-3-mini-ollama':    mk('Phi 3 Mini (Ollama)',      'Ollama','Local','#ec4899','128K','Oct 2023','FREE','FREE',10,8.2,8.0,['Text','Code','Local Host'],  mockLocal('PHI 3 MINI','phi3:mini')),
  'gemma-2-9b-ollama':    mk('Gemma 2 9B (Ollama)',      'Ollama','Local','#ec4899','8K',  'Jun 2024','FREE','FREE',9,8.6,8.4, ['Text','Code','Local Host'],  mockLocal('GEMMA 2 9B','gemma2:9b')),
};

const providers = [
  { name: 'OpenAI',           models: ['gpt-5.5','gpt-5','gpt-5-mini','gpt-5.4-mini','gpt-5.4-nano','o3-pro','o3','o3-mini','o4-mini','o1','gpt-4.1','gpt-4.1-mini','gpt-4o','gpt-4o-mini','gpt-4-turbo','gpt-4','gpt-3-5-turbo'] },
  { name: 'Anthropic',        models: ['claude-fable-5','claude-opus-4-5','claude-opus-4','claude-sonnet-4-5','claude-sonnet-4','claude-haiku-4-5','claude-3-opus','claude-3-sonnet','claude-3-haiku'] },
  { name: 'Google',           models: ['gemini-3.1-pro','gemini-3.5-flash','gemini-3.1-flash','gemini-2.5-pro','gemini-2.5-flash','gemini-ultra','gemini-pro'] },
  { name: 'DeepSeek',         models: ['deepseek-v4-pro','deepseek-v4-flash','deepseek-v3','deepseek-r1','deepseek-r1-turbo','deepseek-r1-70b','deepseek-chat'] },
  { name: 'Meta',             models: ['llama-4-maverick','llama-3.3-70b','llama-3.1-405b','llama-3.1-70b','llama-3.1-8b','llama-2-70b'] },
  { name: 'Alibaba (Qwen)',   models: ['qwen3.7-max','qwen3-235b','qwen3-32b','qwen-2.5-72b','qwen-max','qwen-plus','qwen-turbo'] },
  { name: 'Mistral AI',       models: ['mistral-large','codestral','devstral','mistral-small','mixtral-8x7b','mistral-7b'] },
  { name: 'xAI (Grok)',       models: ['grok-4','grok-4-fast','grok-3','grok-3-mini'] },
  { name: 'Perplexity',       models: ['sonar-pro','sonar'] },
  { name: 'Other',            models: ['phi-4','cohere-command'] },
  { name: '🔒 Ollama (Local)', models: ['llama-3-8b-ollama','llama-33-70b-ollama','deepseek-r1-ollama','qwen3-32b-ollama','qwen-2.5-72b-ollama','phi-4-ollama','mistral-7b-ollama','phi-3-mini-ollama','gemma-2-9b-ollama'] },
];

// ─── Score bar ───
const PerfBar = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
      <span className="text-gray-400">{label}</span>
      <span className="text-white">{value}/10</span>
    </div>
    <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${value * 10}%` }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  </div>
);

const WorkspaceSimulatorPage = () => {
  const [selectedModelKey, setSelectedModelKey] = useState('gpt-4');
  const [promptInput, setPromptInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState('> Waiting for execution...');
  const [isRunning, setIsRunning] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef(null);
  const currentModel = modelsData[selectedModelKey];

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleClearPrompt = () => { setPromptInput(''); toast.info('Prompt cleared'); };

  const handleRunSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setTerminalOutput(`> Initializing environment for ${currentModel.provider} — ${currentModel.name}...`);
    setTimeout(() => {
      setTerminalOutput(prev => prev + '\n> Connecting to mock endpoint...');
      setTimeout(() => {
        const snippet = promptInput ? `"${promptInput.substring(0, 40)}..."` : '"(Empty Prompt)"';
        setTerminalOutput(prev => prev + `\n> Sending prompt payload: ${snippet}`);
        setTimeout(() => {
          setTerminalOutput(prev => prev + `\n> Response received from ${currentModel.name}.\n\n` + currentModel.mockResponse);
          setIsRunning(false);
          toast.success('Simulation completed!');
        }, 1000);
      }, 600);
    }, 500);
  };

  const handleCopyTerminal = () => {
    navigator.clipboard.writeText(terminalOutput);
    setCopied(true);
    toast.success('Terminal output copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const totalModels = Object.keys(modelsData).length;
  const localModels = Object.values(modelsData).filter(m => m.type === 'Local').length;

  return (
    <>
      <Helmet>
        <title>Workspace Simulator — AI Model Sandbox | OdysseusAI</title>
        <meta name="description" content="Test and simulate AI model responses across 15+ providers before deploying to production. Mock inference sandbox for GPT-4, Claude, Gemini, Llama, and local Ollama models." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 pt-12 pb-24 font-rounded">

        {/* ── Hero ── */}
        <div className="text-center mb-14 select-none">
          <FadeIn direction="down" distance={20} delay={0.05}>
            <div className="inline-flex items-center gap-2 bg-[#E73A5A]/10 px-4 py-1.5 rounded-full border border-[#E73A5A]/20 text-sm font-bold mb-6">
              <span className="bg-[#E73A5A] px-2 py-0.5 rounded-full text-xs text-white font-black">SANDBOX</span>
              <span className="text-gray-300">Zero-cost mock inference — no API keys billed</span>
            </div>
          </FadeIn>

          <FadeIn direction="up" distance={30} delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Workspace{' '}
              <span className="text-[#E73A5A] bg-[#E73A5A]/10 px-4 py-1 border border-[#E73A5A]/20 rounded-3xl inline-block transform rotate-1 shadow-[0_0_15px_rgba(231, 58, 90,0.2)]">
                Simulator
              </span>
            </h1>
          </FadeIn>

          <FadeIn direction="up" distance={20} delay={0.2}>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
              Test and simulate AI model responses across {totalModels}+ providers before deploying to production infrastructure.
            </p>
          </FadeIn>

          {/* Stats strip */}
          <FadeIn direction="up" distance={16} delay={0.3}>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {[
                { icon: '🤖', val: `${totalModels}+`, label: 'Models' },
                { icon: '🔒', val: `${localModels}`, label: 'Local / Ollama' },
                { icon: '⚡', val: 'Mock', label: 'Inference' },
                { icon: '🆓', val: '$0', label: 'API Cost' },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-3 backdrop-blur-md">
                  <span className="text-xl">{s.icon}</span>
                  <div className="text-left">
                    <div className="text-lg font-black text-white leading-none">{s.val}</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* ── Main simulator grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT: Model config (5 cols) */}
          <div className="lg:col-span-5 space-y-4">

            {/* Model selector */}
            <FadeIn direction="left" distance={30}>
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md" ref={dropdownRef}>
                <div className="bg-white/5 px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-white">🎯 Target Model</span>
                  <span className="text-[9px] font-bold text-white/50">{providers.length} providers</span>
                </div>
                <div className="p-3">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(o => !o)}
                    className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl font-black text-sm text-white flex items-center justify-between hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: currentModel.providerColor }} />
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">{currentModel.provider}</span>
                      <span className="font-black text-white">{currentModel.name}</span>
                    </div>
                    <ChevronDown size={14} className={`transition-transform text-gray-400 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
                        animate={{ opacity: 1, y: 0, scaleY: 1 }}
                        exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden max-h-56 overflow-y-auto z-50 relative shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                      >
                        {providers.map((provider) => (
                          <div key={provider.name}>
                            <div className="bg-white/5 border-b border-white/10 px-3 py-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                              {provider.name}
                            </div>
                            {provider.models.map((modelKey) => {
                              const m = modelsData[modelKey];
                              const isSelected = selectedModelKey === modelKey;
                              return (
                                <button
                                  key={modelKey}
                                  type="button"
                                  onClick={() => { setSelectedModelKey(modelKey); setIsDropdownOpen(false); }}
                                  className={`w-full text-left px-3 py-2 flex items-center justify-between border-b border-white/5 last:border-0 transition-colors text-xs font-bold ${isSelected ? 'bg-[#E73A5A]/20 text-white' : 'hover:bg-white/5 text-gray-300'}`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: m.providerColor }} />
                                    {m.name}
                                    {m.type === 'Local' && <Lock size={9} className="text-emerald-400" />}
                                  </div>
                                  {isSelected && <Check size={12} className="text-[#E73A5A]" />}
                                </button>
                              );
                            })}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </FadeIn>

            {/* Model details card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedModelKey}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md overflow-hidden">
                  {/* Card header accent */}
                  <div className="h-2 bg-[#E73A5A]" />
                  <div className="p-5 space-y-4">
                    {/* Model identity */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl border border-white/10 bg-[#E73A5A]/10 flex items-center justify-center font-mono font-black text-[#E73A5A] shrink-0">
                        {'{}'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-white text-base leading-tight">{currentModel.name}</h3>
                        <div className="flex gap-1.5 mt-1 flex-wrap">
                          <span className="text-[9px] font-black uppercase tracking-widest bg-[#E73A5A]/20 text-[#E73A5A] border border-[#E73A5A]/30 px-2 py-0.5 rounded-full">{currentModel.provider}</span>
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-gray-300`}>
                            {currentModel.type === 'Local' ? '🔒 Local' : `☁️ ${currentModel.type}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs font-semibold text-gray-400 leading-relaxed">{
                      {
                        'gpt-4-turbo': "Latest generation OpenAI model with 128K context, updated knowledge, and improved efficiency.",
                        'gpt-4': "OpenAI's flagship model known for unprecedented reasoning and complex instruction following.",
                        'gpt-3-5-turbo': "Fast, cost-effective model optimized for chat and standard generation tasks.",
                        'claude-3-opus': "Anthropic's most powerful model for highly complex reasoning and nuanced tasks.",
                        'claude-3-sonnet': "The balanced workhorse for scaled enterprise deployments and robust performance.",
                        'claude-3-haiku': "Anthropic's fastest, most compact model for near-instant responsiveness.",
                        'gemini-ultra': "Google's largest model for highly complex tasks with 1M token context.",
                        'gemini-pro': "Versatile Google model with 2M context window for long document tasks.",
                        'llama-2-70b': "Meta's open-weight flagship, offering proprietary-level performance for self-hosting.",
                        'mixtral-8x7b': "Sparse MoE open-weight model with 70B-class performance at 12B-class speed.",
                        'mistral-7b': "Best-in-class 7B model, often outperforming much larger legacy models.",
                        'cohere-command': "Specialized for RAG and tool use in enterprise pipelines.",
                        'llama-3-8b-ollama': "Meta's Llama 3 8B running locally. Fully private, zero latency, zero cost.",
                        'mistral-7b-ollama': "Mistral 7B served locally by Ollama. Highly customizable and responsive.",
                        'phi-3-mini-ollama': "Microsoft's ultra-compact 3.8B model. Extremely fast with broad context.",
                      }[selectedModelKey] || 'A powerful AI model available for simulation.'
                    }</p>

                    {/* Specs grid */}
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: 'Context', val: currentModel.contextWindow },
                        { label: 'Cutoff', val: currentModel.dataCutoff },
                        { label: 'In/1K', val: currentModel.inputCost },
                        { label: 'Out/1K', val: currentModel.outputCost },
                      ].map(s => (
                        <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-2 text-center">
                          <div className="text-[8px] font-black uppercase tracking-wider text-gray-500 mb-0.5">{s.label}</div>
                          <div className="text-[10px] font-black text-white leading-tight">{s.val}</div>
                        </div>
                      ))}
                    </div>

                    {/* Performance bars */}
                    <div className="space-y-2.5 pt-2 border-t border-white/10">
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Performance Specs</span>
                      <PerfBar label="Speed" value={currentModel.speed} color="#FFD700" />
                      <PerfBar label="Accuracy" value={currentModel.accuracy} color="#A7F3D0" />
                      <PerfBar label="Reasoning" value={currentModel.reasoning} color="#FF4D6D" />
                    </div>

                    {/* Capabilities */}
                    <div className="pt-2 border-t border-white/10">
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-2">Capabilities</span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentModel.capabilities.map(cap => (
                          <span key={cap} className="bg-white/5 text-gray-300 border border-white/10 px-2 py-0.5 rounded-lg text-[9px] font-black">
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Sandbox warning */}
            <FadeIn direction="up" distance={12} delay={0.2}>
              <div className="bg-[#E73A5A]/5 border border-dashed border-[#E73A5A]/30 rounded-xl p-3 flex items-start gap-2">
                <AlertTriangle size={14} className="text-[#E73A5A] shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-[#E73A5A] leading-relaxed">
                  Sandbox environment. Output is mocked for testing. API keys are <strong>never billed</strong> during simulator runs.
                </p>
              </div>
            </FadeIn>
          </div>

          {/* RIGHT: Prompt + Terminal (7 cols) */}
          <div className="lg:col-span-7 space-y-4">

            {/* Prompt input card */}
            <FadeIn direction="right" distance={30}>
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
                <div className="bg-white/5 px-4 py-3 flex items-center justify-between border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#E73A5A] font-black text-sm">&gt;</span>
                    <span className="text-xs font-black uppercase tracking-widest text-white">Input Prompt</span>
                  </div>
                  <button onClick={handleClearPrompt} className="text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-[#E73A5A] transition-colors">
                    Clear
                  </button>
                </div>
                <div className="bg-transparent p-1">
                  <textarea
                    rows={4}
                    value={promptInput}
                    onChange={e => setPromptInput(e.target.value)}
                    placeholder="Enter your system instructions and user prompt here..."
                    className="w-full p-3 text-xs font-mono text-white outline-none resize-none bg-transparent placeholder:text-gray-500 leading-relaxed"
                  />
                </div>
              </div>
            </FadeIn>

            {/* Run button */}
            <FadeIn direction="up" distance={12} delay={0.1}>
              <button
                type="button"
                onClick={handleRunSimulation}
                disabled={isRunning}
                className="w-full bg-[#E73A5A] text-white hover:bg-[#E73A5A]/80 py-4 rounded-2xl font-black text-base tracking-wider transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(231, 58, 90,0.3)]"
              >
                {isRunning ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    RUNNING INFERENCE...
                  </>
                ) : (
                  <>
                    <Play size={18} strokeWidth={2.5} />
                    Run Simulation — {currentModel.name}
                  </>
                )}
              </button>
            </FadeIn>

            {/* Terminal output */}
            <FadeIn direction="right" distance={20} delay={0.15}>
              <div className="bg-black/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
                <div className="bg-white/5 px-4 py-3 flex items-center justify-between border-b border-white/10">
                  {/* Fake traffic lights */}
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-700/50" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400/80 border border-yellow-600/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-700/50" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 ml-2">Output Terminal</span>
                  </div>
                  <button
                    onClick={handleCopyTerminal}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-emerald-400 transition-colors"
                  >
                    {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-emerald-400 overflow-y-auto min-h-[180px] max-h-[280px] leading-relaxed whitespace-pre-wrap select-text">
                  <code>{terminalOutput}</code>
                </pre>
              </div>
            </FadeIn>

            {/* Quick-pick model chips */}
            <FadeIn direction="up" distance={12} delay={0.2}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-3">Quick Switch</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(modelsData).map(([key, m]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedModelKey(key)}
                      className={`text-[10px] font-bold px-2.5 py-1.5 rounded-xl border transition-all ${
                        selectedModelKey === key
                          ? 'bg-[#E73A5A] border-[#E73A5A] text-white shadow-[0_0_10px_rgba(231, 58, 90,0.3)]'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: m.providerColor }} />
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkspaceSimulatorPage;
