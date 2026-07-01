import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Container, Copy, Check, Terminal, Info, Server, Network } from 'lucide-react';
import { toast } from 'sonner';

const DockerInstallPage = () => {
  const [copiedText, setCopiedText] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    toast.success('Configuration copied to clipboard!');
    setTimeout(() => setCopiedText(null), 2000);
  };

  const scripts = {
    composeCmd: 'docker compose up -d --build',
    logsCmd: 'docker compose logs -f odysseus',
    psCmd: 'docker compose ps',
    composeYaml: `version: '3.8'

services:
  odysseus-app:
    image: node:18-alpine
    container_name: odysseus-workspace
    working_dir: /app
    volumes:
      - .:/app
    ports:
      - "7000:7000"
    environment:
      - PORT=7000
      - PB_URL=http://pocketbase:8090
    command: sh -c "npm install && npm run dev"
    depends_on:
      - pocketbase

  pocketbase:
    image: pocketbase:latest
    container_name: odysseus-db
    ports:
      - "8090:8090"
    volumes:
      - pb_data:/pb/pb_data
    restart: unless-stopped

volumes:
  pb_data:`
  };

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 md:px-8 font-sans text-white">
      <Helmet>
        <title>Docker Compose Setup | Odysseus AI Installation Guide</title>
        <meta name="description" content="Orchestrate Odysseus AI using Docker containers. Copy-paste docker-compose.yml files, container lifecycle commands, and localhost connection setups." />
      </Helmet>

      {/* Hero Banner */}
      <div className="max-w-4xl mx-auto mb-12 pt-6 text-left">
        <div className="flex items-center gap-4 mb-4">
          <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full px-4 py-1 text-xs font-black uppercase tracking-wider">
            DOCKER SETUP
          </span>
          <span className="font-bold text-sm text-white/50">Cross-platform compatibility</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 flex items-center gap-3 text-white">
          <Container className="w-10 h-10 text-cyan-400" />
          DOCKER <span className="bg-cyan-500/10 text-cyan-400 px-4 py-0.5 border border-cyan-500/20 rounded-3xl inline-block transform -rotate-1">COMPOSE</span>
        </h1>
        <p className="text-lg text-white/60 font-medium leading-relaxed">
          Run Odysseus inside Docker containers. This keeps your operating system clean and automates databases without managing SQLite or Node services locally.
        </p>
      </div>

      {/* Main Flow Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Step-by-step Command Blocks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-left">
            <h3 className="text-xl font-black mb-3 flex items-center gap-2 text-white">
              <Terminal className="w-5 h-5 text-[#E73A5A]" />
              1. Run Compose Stack
            </h3>
            <p className="text-sm text-white/60 font-medium mb-4">
              Trigger the build process. Docker will fetch node dependencies and PocketBase databases, serving them in the background:
            </p>
            <div className="bg-black/60 text-emerald-400 p-4 rounded-[12px] border border-white/10 font-mono text-sm flex justify-between items-center overflow-x-auto">
              <code>{scripts.composeCmd}</code>
              <button
                onClick={() => handleCopy(scripts.composeCmd, 'composeCmd')}
                className="ml-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full px-3 py-1 text-xs font-bold transition-all duration-200"
              >
                {copiedText === 'composeCmd' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-left">
            <h3 className="text-xl font-black mb-3 flex items-center gap-2 text-white">
              <Server className="w-5 h-5 text-[#E73A5A]" />
              2. Inspect Container Status
            </h3>
            <p className="text-sm text-white/60 font-medium mb-4">
              Verify that both the web workspace and database containers are active and mapped:
            </p>
            <div className="bg-black/60 text-emerald-400 p-4 rounded-[12px] border border-white/10 font-mono text-sm flex justify-between items-center overflow-x-auto">
              <code>{scripts.psCmd}</code>
              <button
                onClick={() => handleCopy(scripts.psCmd, 'psCmd')}
                className="ml-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full px-3 py-1 text-xs font-bold transition-all duration-200"
              >
                {copiedText === 'psCmd' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-left">
            <h3 className="text-xl font-black mb-3 flex items-center gap-2 text-white">
              <Info className="w-5 h-5 text-[#E73A5A]" />
              3. Retrieve Admin Credentials
            </h3>
            <p className="text-sm text-white/60 font-medium mb-4">
              Upon start, Odysseus creates a secure, temporary admin credential. Extract it from logs:
            </p>
            <div className="bg-black/60 text-emerald-400 p-4 rounded-[12px] border border-white/10 font-mono text-sm flex justify-between items-center overflow-x-auto">
              <code>{scripts.logsCmd}</code>
              <button
                onClick={() => handleCopy(scripts.logsCmd, 'logsCmd')}
                className="ml-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full px-3 py-1 text-xs font-bold transition-all duration-200"
              >
                {copiedText === 'logsCmd' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Yaml File Block */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full flex flex-col justify-between backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-left">
            <div>
              <h3 className="text-xl font-black mb-4 uppercase tracking-wider text-cyan-400 text-left">
                docker-compose.yml
              </h3>
              <pre className="bg-black/60 text-emerald-400 font-mono text-[10px] p-4 rounded-[16px] border border-white/10 overflow-auto max-h-[360px]">
                <code>{scripts.composeYaml}</code>
              </pre>
            </div>
            <button
              onClick={() => handleCopy(scripts.composeYaml, 'composeYaml')}
              className="mt-6 w-full bg-cyan-500 hover:bg-cyan-600 text-white border border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] rounded-full py-2.5 font-black uppercase text-xs tracking-wider cursor-pointer transition-all"
            >
              {copiedText === 'composeYaml' ? 'YAML Copied!' : 'Copy YAML Code'}
            </button>
          </div>
        </div>
      </div>

      {/* Network Bridge Notice */}
      <div className="max-w-4xl mx-auto border border-[#fe6e00]/20 bg-[#fe6e00]/5 p-6 rounded-2xl flex gap-4 items-start backdrop-blur-md">
        <Network className="w-8 h-8 text-[#fe6e00] flex-shrink-0 mt-1" />
        <div className="text-left">
          <h4 className="font-black text-white mb-1">Docker Bridge Network Gateways</h4>
          <p className="text-sm text-white/70 font-medium leading-relaxed text-left">
            If you are running Ollama on your host machine (outside of Docker) and Odysseus inside Docker, you cannot connect using <code>localhost:11434</code>. Instead, route to your host gateway coordinates:
            <br />
            - macOS / Windows: <code className="text-cyan-400 bg-white/5 px-1 py-0.5 rounded border border-white/10">http://host.docker.internal:11434/v1</code>
            <br />
            - Linux: Add <code className="text-cyan-400 bg-white/5 px-1 py-0.5 rounded border border-white/10">--add-host=host.docker.internal:host-gateway</code> to docker run or map network routes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DockerInstallPage;
