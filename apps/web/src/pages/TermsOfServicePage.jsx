import React from 'react';
import { Helmet } from 'react-helmet';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen py-12 px-4 md:px-8 font-rounded text-white select-none">
      <Helmet>
        <title>Terms of Service | Odysseus AI</title>
        <meta name="description" content="Read the terms of service for Odysseus AI. Review licensing conditions, open source permissions, and Stripe checkout guidelines." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto pt-6">
        <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase text-center text-white">
          TERMS OF <span className="underline decoration-wavy decoration-[#00F0FF]">SERVICE</span>
        </h1>
        <p className="text-center text-sm font-black text-gray-500 uppercase tracking-widest mb-12">
          Last updated: June 14, 2026
        </p>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-8 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.3)]">
          <div>
            <h2 className="text-2xl font-black mb-3 uppercase tracking-tight text-[#00F0FF]">
              1. Acceptance of Terms
            </h2>
            <p className="text-sm md:text-base text-gray-400 font-medium leading-relaxed">
              By deploying our open-source codebase or procuring custom Launch Kit templates, you agree to these Terms of Service. If you do not agree, you must cease using the application.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black mb-3 uppercase tracking-tight text-[#00F0FF]">
              2. Open Source Licensing
            </h2>
            <p className="text-sm md:text-base text-gray-400 font-medium leading-relaxed">
              The Odysseus AI repository code is distributed under permissive open-source licenses. You are welcome to clone, modify, and run the interface locally on your own hardware without licensing payments.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black mb-3 uppercase tracking-tight text-[#00F0FF]">
              3. Paid Launch Kits & Stripe Transactions
            </h2>
            <p className="text-sm md:text-base text-gray-400 font-medium leading-relaxed">
              Our pre-packaged Launch Kits are commercial digital templates processed securely through Stripe. Purchase grants you a personal license to deploy the template configurations on your own workstations. Redistributing or reselling the compiled Launch Kit configurations is prohibited.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black mb-3 uppercase tracking-tight text-[#00F0FF]">
              4. Disclaimer of Warranty
            </h2>
            <p className="text-sm md:text-base text-gray-400 font-medium leading-relaxed">
              The software is provided "as is", without warranty of any kind, express or implied. In no event shall the authors or copyright holders be liable for any claim, damages, or other liability arising from your local LLM configurations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
