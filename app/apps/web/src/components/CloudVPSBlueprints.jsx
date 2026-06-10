
import React, { useState } from 'react';
import { Copy, Check, Server } from 'lucide-react';

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

const CloudVPSBlueprints = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Server size={32} className="text-[hsl(var(--highlight))]" />
        <h2 className="text-3xl font-black">Cloud VPS Blueprints</h2>
      </div>

      <div className="neo-card">
        <div className="inline-block px-3 py-1 bg-[#FF9000] text-black font-bold text-sm neo-border mb-4">
          Hetzner Cloud
        </div>
        <h3 className="text-2xl font-bold mb-2">Docker Compose Setup</h3>
        <p className="mb-4 opacity-80">Estimated Time: 15 mins | Cost: ~$5/mo</p>
        
        <p className="mb-4 font-medium">
          Deploying on Hetzner provides the best price-to-performance ratio. Ensure your `.env` binds to `0.0.0.0` to allow external access through the reverse proxy.
        </p>

        <CodeBlock 
          language="docker-compose.yml"
          code={`version: '3.8'
services:
  odysseus-core:
    image: odysseus/core:latest
    ports:
      - "8000:8000"
    env_file:
      - .env
    restart: unless-stopped
    networks:
      - odysseus-net

networks:
  odysseus-net:
    driver: bridge`}
        />

        <CodeBlock 
          language=".env"
          code={`# CRITICAL: Bind to 0.0.0.0, not localhost
HOST=0.0.0.0
PORT=8000
DATABASE_URL=postgres://user:pass@db:5432/odysseus
API_KEY_SECRET=your_secure_random_string`}
        />
      </div>

      <div className="neo-card">
        <div className="inline-block px-3 py-1 bg-[#FF9000] text-black font-bold text-sm neo-border mb-4">
          DigitalOcean
        </div>
        <h3 className="text-2xl font-bold mb-2">App Platform Config</h3>
        <p className="mb-4 opacity-80">Estimated Time: 10 mins | Cost: ~$10/mo</p>
        <p className="mb-4 font-medium">
          For a managed experience, use DigitalOcean App Platform. Define your spec in YAML.
        </p>
        <CodeBlock 
          language="app.yaml"
          code={`name: odysseus-app
services:
- name: web
  github:
    repo: your-org/odysseus
    branch: main
  run_command: npm start
  http_port: 8080
  instance_size_slug: basic-xxs`}
        />
      </div>
    </div>
  );
};

export default CloudVPSBlueprints;
