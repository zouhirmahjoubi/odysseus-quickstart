import React from 'react';
import { Helmet } from 'react-helmet';
import { ShieldCheck } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen py-12 px-4 md:px-8 font-rounded text-white select-none">
      <Helmet>
        <title>Privacy Policy | Odysseus AI</title>
        <meta name="description" content="Read the Odysseus AI privacy commitment. We offer a 100% local-first workspace. No cloud data harvesting or telemetry tracking of prompts." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto pt-6">
        <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase text-center text-white">
          PRIVACY <span className="underline decoration-wavy decoration-[#00F0FF]">POLICY</span>
        </h1>
        <p className="text-center text-sm font-black text-gray-500 uppercase tracking-widest mb-12">
          Last updated: June 14, 2026
        </p>
        
        {/* Core Privacy Promise */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 mb-8 flex gap-4 items-start backdrop-blur-md">
          <ShieldCheck className="w-10 h-10 text-[#00F0FF] flex-shrink-0" />
          <div>
            <h4 className="font-black text-lg text-white mb-1">Our Local-First Privacy Promise</h4>
            <p className="text-sm text-gray-400 font-semibold leading-relaxed">
              Odysseus AI is designed to run 100% locally on your computer. Your conversations, prompts, system keys, vector databases, and document chunks never leave your machine. We do not run tracking telemetry or cloud pipelines to harvest your work.
            </p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-8 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.3)]">
          <div>
            <h2 className="text-2xl font-black mb-3 uppercase tracking-tight text-[#00F0FF]">
              1. Information We Collect
            </h2>
            <p className="text-sm md:text-base text-gray-400 font-medium leading-relaxed">
              Because our app is run locally, we collect zero prompt details. The only information processed by our website is standard web traffic analytics and checkout records managed securely by our payment merchant, Stripe, during premium Launch Kit transactions.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black mb-3 uppercase tracking-tight text-[#00F0FF]">
              2. Environment Variables & Keys
            </h2>
            <p className="text-sm md:text-base text-gray-400 font-medium leading-relaxed">
              Any credentials, API tokens (e.g. OpenAI or OpenRouter keys), and database configuration details you configure are saved purely within your local <code>.env</code> settings files on your machine. Our server code has no methods for transmuting or caching these secrets remotely.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black mb-3 uppercase tracking-tight text-[#00F0FF]">
              3. Secure Log Sanitization
            </h2>
            <p className="text-sm md:text-base text-gray-400 font-medium leading-relaxed">
              If you utilize our Error Doctor log sanitizer, all redaction regex searches execute entirely inside your local browser memory space. The log inputs are never posted to a backend server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
