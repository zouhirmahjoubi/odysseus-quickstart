
import React, { useState, useEffect } from 'react';
import NeoBrutalButton from './NeoBrutalButton.jsx';

const ConfiguratorSection = () => {
  const [offline, setOffline] = useState(false);
  const [cloud, setCloud] = useState(false);
  const [lan, setLan] = useState(false);
  const [envCode, setEnvCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let code = `# Base Configuration\nOLLAMA_BASE_URL=http://localhost:11434\nOLLAMA_MODEL=mistral\nAPI_PORT=3000\nAPI_HOST=127.0.0.1\n\n`;

    if (offline) {
      code += `# Offline Mode\nOFFLINE_MODE=true\nCLOUD_APIS_ENABLED=false\n\n`;
    }

    if (cloud) {
      code += `# Cloud APIs\nCLOUD_APIS_ENABLED=true\nOPENROUTER_API_KEY=your_api_key_here\nOPENROUTER_BASE_URL=https://openrouter.ai/api/v1\n\n`;
    }

    if (lan) {
      code += `# LAN Access\nAPI_HOST=0.0.0.0\nEXPOSE_LAN=true\nLAN_PORT=3000\n\n`;
    }

    setEnvCode(code.trim());
  }, [offline, cloud, lan]);

  const handleCopy = () => {
    navigator.clipboard.writeText(envCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="section-padding bg-[hsl(var(--card))] neo-border neo-shadow w-full max-w-full overflow-hidden">
      <div className="max-w-[1000px] mx-auto w-full">
        <div className="mb-[20px] md:mb-[40px]">
          <h2 className="space-grotesk text-section font-bold text-[hsl(var(--foreground))] leading-tight mb-[10px]">
            Configure Your Environment
          </h2>
          <p className="text-sub text-[hsl(var(--muted-foreground))]">
            Customize your OdysseusAI setup
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px] md:gap-[40px] w-full">
          <div className="flex flex-col gap-[15px] w-full">
            <label className={`flex items-start md:items-center gap-[15px] p-[15px] border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] cursor-pointer transition-all ${offline ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--background))]'} min-h-[44px] w-full`}>
              <input type="checkbox" checked={offline} onChange={(e) => setOffline(e.target.checked)} className="w-5 h-5 md:w-6 md:h-6 mt-0.5 md:mt-0 accent-black flex-shrink-0" />
              <span className="font-bold space-grotesk text-[14px] md:text-[16px] text-black">Run completely offline (Ollama Only)</span>
            </label>
            
            <label className={`flex items-start md:items-center gap-[15px] p-[15px] border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] cursor-pointer transition-all ${cloud ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--background))]'} min-h-[44px] w-full`}>
              <input type="checkbox" checked={cloud} onChange={(e) => setCloud(e.target.checked)} className="w-5 h-5 md:w-6 md:h-6 mt-0.5 md:mt-0 accent-black flex-shrink-0" />
              <span className="font-bold space-grotesk text-[14px] md:text-[16px] text-black">Enable Cloud APIs (OpenRouter Pipeline Link)</span>
            </label>
            
            <label className={`flex items-start md:items-center gap-[15px] p-[15px] border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] cursor-pointer transition-all ${lan ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--background))]'} min-h-[44px] w-full`}>
              <input type="checkbox" checked={lan} onChange={(e) => setLan(e.target.checked)} className="w-5 h-5 md:w-6 md:h-6 mt-0.5 md:mt-0 accent-black flex-shrink-0" />
              <span className="font-bold space-grotesk text-[14px] md:text-[16px] text-black">Expose to Local Area Network (LAN Access)</span>
            </label>
          </div>

          <div className="flex flex-col w-full max-w-full">
            <div className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] p-[15px] md:p-[20px] h-[200px] md:h-[250px] overflow-x-auto overflow-y-auto mb-[15px] md:mb-[20px] w-full">
              <pre className="font-mono text-[12px] md:text-[14px] text-black whitespace-pre-wrap break-words">{envCode}</pre>
            </div>
            <NeoBrutalButton 
              onClick={handleCopy}
              variant="accent"
              className="w-full lg:w-auto lg:self-start"
            >
              {copied ? '✓ Copied!' : 'Copy to Clipboard'}
            </NeoBrutalButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConfiguratorSection;
