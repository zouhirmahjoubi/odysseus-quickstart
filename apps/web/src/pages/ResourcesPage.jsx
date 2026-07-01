
import React from 'react';
import { Helmet } from 'react-helmet';
import LLMReferenceDirectory from '@/pages/LLMReferenceDirectory.jsx';
import TaskWorkloadFramework from '@/pages/TaskWorkloadFramework.jsx';
import FeaturedLaunchKitCard from '@/components/FeaturedLaunchKitCard.jsx';

const ResourcesPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-12 pb-24 font-rounded">
      <Helmet>
        <title>Resources Hub | OdysseusAI</title>
      </Helmet>

      <div className="mb-16 select-none">
        <div className="flex items-center gap-2 bg-[#FFB300]/10 px-4 py-1.5 rounded-full border border-[#FFB300]/20 text-sm font-bold mb-6 inline-flex">
          <span className="bg-[#FFB300] px-2 py-0.5 rounded-full text-xs text-black font-black">
            KNOWLEDGE
          </span>
          <span className="text-gray-300">Resources Hub</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
          Technical{' '}
          <span className="text-[#FFB300] bg-[#FFB300]/10 px-4 py-1 border border-[#FFB300]/20 rounded-3xl inline-block transform -rotate-1 shadow-[0_0_15px_rgba(255,179,0,0.2)]">
            Resources
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl font-medium leading-relaxed">
          Your comprehensive destination for technical specifications, workload frameworks, and deployment guidelines for enterprise AI infrastructure.
        </p>
      </div>

      {/* Featured Launch Kit Promo */}
      <div className="mb-16">
        <FeaturedLaunchKitCard />
      </div>

      <div className="flex flex-col gap-24">
        <div id="directory">
          <LLMReferenceDirectory hideHelmet={true} />
        </div>

        <div id="framework">
          <TaskWorkloadFramework hideHelmet={true} />
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
