
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

const TerminalOutput = ({ output, isLoading, tokenCount, responseTime }) => {
  const endRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output, isLoading]);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 font-mono-code text-[14px] leading-relaxed break-words text-[hsl(var(--workspace-terminal-text))]">
      {output.length === 0 && (
        <div className="opacity-50 select-none flex flex-col items-center justify-center h-full">
          <p>System ready. Select a prompt or type below.</p>
        </div>
      )}

      {output.map((msg, index) => (
        <div key={index} className="mb-6 w-full max-w-full group">
          {msg.role === 'user' ? (
            <div className="text-[hsl(var(--workspace-terminal-text))] mb-2">
              <div className="text-[10px] md:text-[12px] opacity-50 mb-1 font-bold">[{msg.timestamp}] USER_INPUT</div>
              <div className="break-words w-full ml-4 border-l-2 border-[hsl(var(--workspace-terminal-text))]/30 pl-3">
                &gt; {msg.content}
              </div>
            </div>
          ) : msg.role === 'system' ? (
            <div className="text-[hsl(var(--workspace-warning))] mb-2">
              <div className="text-[10px] md:text-[12px] opacity-50 mb-1 font-bold">[{msg.timestamp}] SYSTEM</div>
              <div className="break-words w-full">{msg.content}</div>
            </div>
          ) : msg.role === 'error' ? (
            <div className="text-[hsl(var(--workspace-error))] mb-2">
              <div className="text-[10px] md:text-[12px] opacity-50 mb-1 font-bold">[{msg.timestamp}] ERROR</div>
              <div className="break-words w-full bg-[hsl(var(--workspace-error))]/10 p-3 border border-[hsl(var(--workspace-error))]">
                {msg.content}
              </div>
            </div>
          ) : (
            <div className="text-[#FFFFFF] mb-2 w-full max-w-full relative">
              <div className="flex justify-between items-center mb-2">
                <div className="text-[10px] md:text-[12px] opacity-50 font-bold text-[hsl(var(--workspace-terminal-text))]">[{msg.timestamp}] ASSISTANT_RESPONSE</div>
                <button 
                  onClick={() => handleCopy(msg.content, index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#333] text-gray-400 hover:text-white border border-transparent hover:border-gray-500 flex items-center gap-1 text-xs"
                  title="Copy response"
                >
                  {copiedIndex === index ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  {copiedIndex === index ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="prose prose-invert max-w-full overflow-hidden prose-pre:bg-transparent prose-pre:p-0 prose-p:my-2 prose-headings:text-[#FFFFFF] prose-a:text-[hsl(var(--workspace-highlight))] prose-a:underline hover:prose-a:text-[hsl(var(--workspace-accent))]">
                <ReactMarkdown
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <div className="max-w-full w-full border-[2px] border-[hsl(var(--workspace-terminal-text))]/40 my-4 bg-[#111]">
                          <div className="flex justify-between items-center px-3 py-1.5 border-b-[2px] border-[hsl(var(--workspace-terminal-text))]/40 bg-[#222]">
                            <span className="text-[10px] uppercase font-bold text-[hsl(var(--workspace-terminal-text))]">{match[1]}</span>
                          </div>
                          <div className="overflow-x-auto p-2">
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              className="!m-0 !bg-transparent text-[12px] md:text-[13px] w-full"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          </div>
                        </div>
                      ) : (
                        <code className="bg-[#222] text-[#FFF] px-1.5 py-0.5 border border-[#444] rounded-none break-words" {...props}>
                          {children}
                        </code>
                      )
                    },
                    table({node, children, ...props}) {
                      return (
                        <div className="overflow-x-auto w-full my-4">
                          <table className="w-full text-left border-collapse border-[2px] border-[hsl(var(--workspace-terminal-text))]/40" {...props}>
                            {children}
                          </table>
                        </div>
                      )
                    },
                    th({node, children, ...props}) {
                      return <th className="border-[2px] border-[hsl(var(--workspace-terminal-text))]/40 px-3 py-2 bg-[#222] font-bold text-[hsl(var(--workspace-terminal-text))]" {...props}>{children}</th>
                    },
                    td({node, children, ...props}) {
                      return <td className="border-[2px] border-[hsl(var(--workspace-terminal-text))]/40 px-3 py-2" {...props}>{children}</td>
                    }
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
              
              {/* Token tracking for assistant responses */}
              {msg.metrics && (
                <div className="mt-3 flex flex-wrap gap-3 text-[10px] md:text-[11px] font-bold text-[hsl(var(--workspace-terminal-text))]/60 uppercase">
                  <span className="border border-[hsl(var(--workspace-terminal-text))]/30 px-2 py-0.5 bg-[#111]">In: {msg.metrics.inputTokens} tk</span>
                  <span className="border border-[hsl(var(--workspace-terminal-text))]/30 px-2 py-0.5 bg-[#111]">Out: {msg.metrics.outputTokens} tk</span>
                  <span className="border border-[hsl(var(--workspace-terminal-text))]/30 px-2 py-0.5 bg-[#111]">Time: {msg.metrics.time}</span>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      
      {isLoading && (
        <div className="text-[hsl(var(--workspace-accent))] animate-pulse font-bold tracking-widest mt-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-[hsl(var(--workspace-accent))] rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-[hsl(var(--workspace-accent))] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
          <span className="w-2 h-2 bg-[hsl(var(--workspace-accent))] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
          [ PROCESSING MODEL INFERENCE ... ]
        </div>
      )}
      
      <div ref={endRef} className="h-4"></div>
    </div>
  );
};

export default TerminalOutput;
