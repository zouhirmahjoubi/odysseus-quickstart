import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { AlertOctagon, Clipboard, ShieldAlert, Key, Zap, Settings, ShieldCheck, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const FixPage = () => {
  const [activeTab, setActiveTab] = useState('password');
  const [rawLogs, setRawLogs] = useState('');
  const [sanitizedLogs, setSanitizedLogs] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Sanitizer logic: Redact API keys, passwords, and db credentials
  const handleSanitize = () => {
    if (!rawLogs.trim()) {
      toast.error('Please paste some log content first!');
      return;
    }

    let logs = rawLogs;

    // Redact OpenAI Keys (sk-proj-... or sk-...)
    logs = logs.replace(/sk-[A-Za-z0-9-_]{20,}/g, '[REDACTED_OPENAI_API_KEY]');

    // Redact OpenRouter Keys (sk-or-v1-...)
    logs = logs.replace(/sk-or-v1-[A-Za-z0-9-_]{20,}/g, '[REDACTED_OPENROUTER_API_KEY]');

    // Redact general password fields in JSON or URL query params
    logs = logs.replace(/(password|passwd|pass|secret|key|token)["'\s:=]+[^\s"'}]+/gi, (match) => {
      // Find the separator
      const parts = match.split(/[:=]/);
      if (parts.length > 1) {
        return `${parts[0]}: [REDACTED_CREDENTIAL]`;
      }
      return '[REDACTED_CREDENTIAL]';
    });

    // Redact Auth headers (Bearer ...)
    logs = logs.replace(/Bearer\s+[A-Za-z0-9-._~+/]+=*/g, 'Bearer [REDACTED_TOKEN]');

    // Redact database URIs (e.g. postgres://user:pass@host:port/db)
    logs = logs.replace(/(mongodb|postgres|postgresql|mysql|sqlite):\/\/[^@\s]+@/g, '$1://[REDACTED_DB_CREDENTIALS]@');

    setSanitizedLogs(logs);
    toast.success('Logs sanitized successfully! All credentials redacted.');
  };

  const handleCopy = () => {
    if (!sanitizedLogs) return;
    navigator.clipboard.writeText(sanitizedLogs);
    setIsCopied(true);
    toast.success('Sanitized logs copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-12 pb-24 font-rounded">
      <Helmet>
        <title>Error Doctor & Troubleshooter | Odysseus AI</title>
        <meta name="description" content="Triage environment port clashes, database authentications, and missing Ollama backends. Sanitize terminal outputs before submission." />
      </Helmet>

      {/* Hero Banner */}
      <div className="mb-12 select-none">
        <div className="flex items-center gap-2 bg-[#10B981]/10 px-4 py-1.5 rounded-full border border-[#10B981]/20 text-sm font-bold mb-6 inline-flex">
          <span className="bg-[#10B981] px-2 py-0.5 rounded-full text-xs text-black font-black">
            DIAGNOSTIC
          </span>
          <span className="text-gray-300">Odysseus Error Doctor</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight flex items-center gap-3">
          <AlertOctagon className="w-10 h-10 text-[#10B981]" />
          Error{' '}
          <span className="text-[#10B981] bg-[#10B981]/10 px-4 py-1 border border-[#10B981]/20 rounded-3xl inline-block transform -rotate-1 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            Doctor
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl font-medium leading-relaxed mb-8">
          Resolve typical installation blockpoints. Sanitize your terminal outputs safely before sharing logs with development support channels.
        </p>
      </div>

      {/* Safe Log Sanitizer Widget */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 mb-12 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <ShieldAlert className="w-32 h-32 text-[#10B981]" />
        </div>

        <h2 className="text-2xl font-black mb-4 flex items-center gap-2 text-white">
          <ShieldCheck className="w-7 h-7 text-[#10B981]" />
          Client-Side Safe Log Sanitizer
        </h2>
        <p className="text-sm text-gray-400 font-semibold mb-6">
          Paste your stack traces or console output here. The sanitizer runs completely client-side in your browser to strip out passwords, auth tokens, database credentials, and OpenAI/OpenRouter API keys.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Input text */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-[#10B981] mb-2">
              1. Raw Console Logs
            </label>
            <textarea
              value={rawLogs}
              onChange={(e) => setRawLogs(e.target.value)}
              placeholder="Paste terminal errors containing sk-... keys, passwords, or token payloads here..."
              className="w-full h-48 border border-white/10 rounded-2xl p-3 text-xs font-mono bg-white/5 text-white outline-none focus:ring-2 focus:ring-[#10B981] placeholder:text-gray-500 transition-all resize-none"
            />
          </div>

          {/* Sanitized output */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-[#10B981] mb-2">
              2. Sanitized Output (Safe to share)
            </label>
            <textarea
              value={sanitizedLogs}
              readOnly
              placeholder="Output will be clean of all sensitive secrets..."
              className="w-full h-48 border border-white/10 rounded-2xl p-3 text-xs font-mono bg-black/40 text-[#10B981] outline-none resize-none"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            onClick={handleSanitize}
            className="bg-[#10B981] text-black hover:bg-[#10B981]/85 border border-[#10B981]/30 shadow-[0_0_15px_rgba(16,185,129,0.2)] rounded-full px-6 py-2.5 font-black uppercase text-xs tracking-wider cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Redact Sensitive Credentials
          </button>
          {sanitizedLogs && (
            <button
              onClick={handleCopy}
              className="bg-white/5 border border-white/10 text-white hover:bg-white/10 shadow-md rounded-full px-6 py-2.5 font-black uppercase text-xs tracking-wider cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5"
            >
              {isCopied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Clipboard className="w-4 h-4" />}
              <span>Copy Clean Logs</span>
            </button>
          )}
        </div>
      </div>

      {/* Triage Tabs Widget */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 mb-12 backdrop-blur-md">
        <h2 className="text-2xl font-black mb-6 uppercase tracking-tight text-white flex items-center gap-2">
          <Zap className="w-7 h-7 text-[#10B981]" />
          Common Triage Solutions
        </h2>

        {/* Tab Headers */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4 mb-8">
          {[
            { id: 'password', label: 'Password Lost' },
            { id: 'ports', label: 'Port Clashing' },
            { id: 'ollama', label: 'Ollama Missing' },
            { id: 'powershell', label: 'PS Blocked' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 border rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? 'bg-[#10B981] text-black border-[#10B981]/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-black/40 border border-white/10 p-6 rounded-2xl shadow-lg min-h-[200px]">
          {activeTab === 'password' && (
            <div>
              <h3 className="text-lg font-black text-white mb-3 uppercase flex items-center gap-1.5">
                <Key className="w-5 h-5 text-[#10B981]" /> Admin Password Recovery
              </h3>
              <p className="text-sm text-gray-400 font-semibold leading-relaxed mb-4">
                If you misplaced the temporary credentials generated on first startup, you can check the start logs or rebuild the credentials via PocketBase:
              </p>
              <ol className="text-sm text-gray-400 font-semibold space-y-2 list-decimal pl-5">
                <li>Check your terminal uvicorn logs where the startup details are first generated.</li>
                <li>
                  Access the PocketBase backend UI locally at <code className="text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded">http://localhost:8090/_/</code>.
                </li>
                <li>Create a secondary admin account or modify the users collections directly.</li>
              </ol>
            </div>
          )}

          {activeTab === 'ports' && (
            <div>
              <h3 className="text-lg font-black text-white mb-3 uppercase">Port clashes (7000 / 3001)</h3>
              <p className="text-sm text-gray-400 font-semibold leading-relaxed mb-4">
                If another process is using port 7000, you will see a bind exception. Find the process using these commands:
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-black text-xs text-[#10B981] uppercase tracking-wider mb-2">Windows: Find process PID</h4>
                  <pre className="bg-black/60 text-[#10B981] p-3 rounded-[12px] border border-white/10 font-mono text-xs overflow-x-auto">
                    <code>netstat -ano | findstr 7000</code>
                  </pre>
                </div>
                <div>
                  <h4 className="font-black text-xs text-[#10B981] uppercase tracking-wider mb-2">macOS / Linux: Find process PID</h4>
                  <pre className="bg-black/60 text-[#10B981] p-3 rounded-[12px] border border-white/10 font-mono text-xs overflow-x-auto">
                    <code>lsof -i :7000</code>
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ollama' && (
            <div>
              <h3 className="text-lg font-black text-white mb-3 uppercase">Ollama Not Detected</h3>
              <p className="text-sm text-gray-400 font-semibold leading-relaxed mb-4">
                If Odysseus reports that Ollama cannot be reached:
              </p>
              <ul className="text-sm text-gray-400 font-semibold space-y-2 list-disc pl-5">
                <li>Verify Ollama is running in your taskbar or terminal.</li>
                <li>
                  Check that <code className="text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded">OLLAMA_ORIGINS</code> is set to <code className="text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded">*</code> if you are having CORS problems. On Windows, set this environment variable globally; on Linux, edit the systemd unit file.
                </li>
                <li>Ensure you use <code className="text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded">host.docker.internal</code> if running Odysseus inside a container.</li>
              </ul>
            </div>
          )}

          {activeTab === 'powershell' && (
            <div>
              <h3 className="text-lg font-black text-white mb-3 uppercase flex items-center gap-1.5">
                <ShieldAlert className="w-5 h-5 text-[#10B981]" /> PowerShell Script Blocked
              </h3>
              <p className="text-sm text-gray-400 font-semibold leading-relaxed mb-4">
                Windows stops unverified scripts by default. If you see the policy block error, run:
              </p>
              <pre className="bg-black/60 text-[#10B981] p-3 rounded-[12px] border border-white/10 font-mono text-xs overflow-x-auto mb-4">
                <code>Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser</code>
              </pre>
              <p className="text-sm text-gray-400 font-semibold leading-relaxed">
                This changes the execution policy specifically for scripts you write locally while maintaining global security blocks.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FixPage;
