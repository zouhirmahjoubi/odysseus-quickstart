
import React, { useState } from 'react';
import { Copy, Check, Search } from 'lucide-react';

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

const SearXNGConfigGuide = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Search size={32} className="text-[hsl(var(--highlight))]" />
        <h2 className="text-3xl font-black">SearXNG Meta-Search Config</h2>
      </div>

      <div className="neo-card">
        <div className="inline-block px-3 py-1 bg-[#FF9000] text-black font-bold text-sm neo-border mb-4">
          Privacy-First
        </div>
        <h3 className="text-2xl font-bold mb-2">Local Deployment</h3>
        <p className="mb-4 font-medium">
          Deploy SearXNG locally to provide Odysseus Deep Research agents with anonymous, rate-limit-free search capabilities across 70+ engines.
        </p>

        <CodeBlock 
          language="docker-compose.yml"
          code={`version: '3.7'
services:
  searxng:
    image: searxng/searxng:latest
    ports:
      - "8080:8080"
    volumes:
      - ./searxng:/etc/searxng:rw
    environment:
      - SEARXNG_BASE_URL=https://search.yourdomain.com/
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - SETGID
      - SETUID
    logging:
      driver: "json-file"
      options:
        max-size: "1m"
        max-file: "1"`}
        />
      </div>
    </div>
  );
};

export default SearXNGConfigGuide;
