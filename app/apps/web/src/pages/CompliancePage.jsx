
import React from 'react';
import { Helmet } from 'react-helmet';
import { FileCheck } from 'lucide-react';

const CompliancePage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet><title>Compliance Center</title></Helmet>
      <div className="mb-10 border-b-[3px] border-black pb-6">
        <h1 className="text-4xl font-black space-grotesk flex items-center gap-3">
          <FileCheck size={36} /> Compliance Center
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['GDPR', 'SOC 2 Type II', 'CCPA', 'ISO 27001'].map(cert => (
          <div key={cert} className="neo-card bg-white flex justify-between items-center">
            <h3 className="font-black text-xl">{cert}</h3>
            <span className="neo-badge bg-[hsl(var(--secondary))]">Compliant</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompliancePage;
