
import React, { useState } from 'react';
import { validateEmail, getStoredLeads, saveLeads } from '@/utils/storage.js';

const DeviceBlocker = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const leads = getStoredLeads();
    leads.push({ email, timestamp: new Date().toISOString() });
    saveLeads(leads);

    setSuccess(true);
    setEmail('');
  };

  return (
    <div className="block lg:hidden fixed inset-0 w-screen h-screen bg-[#FFFDE6] flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white border-[3px] border-black max-w-md w-full p-8 text-center shadow-[4px_4px_0px_0px_#000000] my-auto">
        <h1 className="font-black text-2xl mb-5 text-black space-grotesk leading-tight">
          Desktop Environment Required // 🖥️ Workspace Access Blocked
        </h1>
        
        <p className="text-base leading-relaxed text-[#333333] mb-6">
          The OdysseusAI localized control cockpit requires advanced screen layout widths and desktop architectures to process tasks. Mobile and tablet browsers are completely unsupported.
        </p>

        <div className="bg-[#BAE6FD] border-[3px] border-black p-6 mb-6 text-left shadow-[4px_4px_0px_0px_#000000]">
          <h3 className="font-bold space-grotesk text-lg mb-2 text-black">Get Desktop Access</h3>
          <p className="text-sm text-[#333333] mb-4">Enter your email to receive the installation scripts and desktop access link directly to your inbox.</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-white border-[3px] border-black p-[12px_15px] text-[16px] text-black focus:outline-none focus:shadow-[2px_2px_0px_0px_#000000] transition-all space-grotesk"
            />
            {error && <p className="text-red-600 font-bold text-sm">{error}</p>}
            {success && <p className="text-green-600 font-bold text-sm">✓ Check your email for installation scripts!</p>}
            
            <button 
              type="submit"
              className="bg-[#BBF7D0] text-black font-bold space-grotesk border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] p-[12px_30px] hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-[2px] hover:-translate-x-[2px] transition-all"
            >
              Send Installation Scripts
            </button>
          </form>
        </div>
        
        <div className="border-t-[3px] border-black pt-4 text-sm text-gray-600 space-y-1 font-bold">
          <p>Minimum screen width: 1024px</p>
          <p>Supported: Desktop browsers (Chrome, Firefox, Safari, Edge)</p>
        </div>
      </div>
    </div>
  );
};

export default DeviceBlocker;
