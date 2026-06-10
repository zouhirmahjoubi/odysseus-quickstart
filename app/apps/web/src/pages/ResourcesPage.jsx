
import React from 'react';
import { Helmet } from 'react-helmet';
import LLMReferenceDirectory from '@/pages/LLMReferenceDirectory.jsx';
import TaskWorkloadFramework from '@/pages/TaskWorkloadFramework.jsx';

const ResourcesPage = () => {
  return (
    <div className="max-w-7xl mx-auto pb-24 pt-12">
      <Helmet>
        <title>Resources Hub | OdysseusAI</title>
      </Helmet>

      <div className="mb-16">
        <div className="inline-block bg-accent text-accent-foreground border-4 border-border px-4 py-1 font-black uppercase tracking-widest mb-6 shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))]">
          Knowledge Base
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase leading-none mb-6">
          Resources Hub
        </h1>
        <p className="text-xl font-bold max-w-3xl text-muted-foreground">
          Your comprehensive destination for technical specifications, workload frameworks, and deployment guidelines for enterprise AI infrastructure.
        </p>
      </div>

      <div className="flex flex-col gap-24">
        <section id="directory">
          <LLMReferenceDirectory hideHelmet={true} />
        </section>

        <section id="framework">
          <TaskWorkloadFramework hideHelmet={true} />
        </section>
      </div>
    </div>
  );
};

export default ResourcesPage;
