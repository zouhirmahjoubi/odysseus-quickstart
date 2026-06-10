
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Terminal } from 'lucide-react';

const LOG_MESSAGES = [
  '[INFO] Initializing Ollama Node...',
  '[SUCCESS] Core Agent Active',
  '[PROCESSING] Running Deep Research...',
  '[INFO] Model Quantization Complete',
  '[SUCCESS] Email Intelligence Ready',
  '[INFO] Hardware Cookbook Loaded',
  '[PROCESSING] Autonomous Agents Spinning Up...'
];

const SystemLogger = () => {
  const [logs, setLogs] = useState([LOG_MESSAGES[0]]);
  const [isExpanded, setIsExpanded] = useState(true);
  const logsEndRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => {
        const nextLog = LOG_MESSAGES[prev.length % LOG_MESSAGES.length];
        const newLogs = [...prev, nextLog];
        return newLogs.slice(-20); // Keep last 20 logs
      });
    }, 5000 + Math.random() * 5000); // 5-10 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isExpanded && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isExpanded]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
      <div className="neo-border neo-shadow bg-black text-[#00FF00] overflow-hidden flex flex-col">
        <div 
          className="flex items-center justify-between px-4 py-2 border-b-[3px] border-[#00FF00] bg-[#1a1a1a] cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2 font-bold font-mono-code text-sm">
            <Terminal size={16} />
            <span>SYSTEM_LOGS // ODYSSEUS_CORE</span>
          </div>
          <button className="hover:bg-[#00FF00] hover:text-black p-1 transition-colors">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 120 }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 overflow-y-auto font-mono-code text-sm flex flex-col gap-1"
            >
              {logs.map((log, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`${log.includes('[ERROR]') ? 'text-red-500' : log.includes('[SUCCESS]') ? 'text-[#00FF00]' : log.includes('[PROCESSING]') ? 'text-yellow-400' : 'text-blue-400'}`}
                >
                  <span className="opacity-50 mr-2">{new Date().toLocaleTimeString()}</span>
                  {log}
                </motion.div>
              ))}
              <div ref={logsEndRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SystemLogger;
