
import React, { useState } from 'react';
import { Copy, Check, Cpu } from 'lucide-react';

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 neo-border neo-shadow bg-black text-[#00FF00] font-mono-code text-sm">
      <div className="flex justify-between items-center px-4 py-2 border-b-[3px] border-[#00FF00] bg-[#1a1a1a]">
        <span className="font-bold">{language}</span>
        <button onClick={handleCopy} className="hover:text-white transition-colors">
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const APIIntegrationManuals = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Cpu size={32} className="text-[hsl(var(--highlight))]" />
        <h2 className="text-3xl font-black">API Pipeline Integration</h2>
      </div>

      <div className="neo-card">
        <div className="inline-block px-3 py-1 bg-[#FF9000] text-black font-bold text-sm neo-border mb-4">
          OpenRouter
        </div>
        <h3 className="text-2xl font-bold mb-2">Universal API Bridge</h3>
        <p className="mb-4 font-medium">
          Use OpenRouter to access multiple models (Claude, GPT-4, Llama) through a single unified API endpoint. Implement fallback logic to ensure high availability.
        </p>

        <CodeBlock 
          language="javascript"
          code={`import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://odysseus.ai",
    "X-Title": "Odysseus Core",
  }
});

async function generateWithFallback(prompt) {
  try {
    // Primary: Claude 3 Opus
    return await openai.chat.completions.create({
      model: "anthropic/claude-3-opus",
      messages: [{ role: "user", content: prompt }]
    });
  } catch (error) {
    console.warn("Claude failed, falling back to GPT-4o");
    // Fallback: GPT-4o
    return await openai.chat.completions.create({
      model: "openai/gpt-4o",
      messages: [{ role: "user", content: prompt }]
    });
  }
}`}
        />
      </div>
    </div>
  );
};

export default APIIntegrationManuals;
