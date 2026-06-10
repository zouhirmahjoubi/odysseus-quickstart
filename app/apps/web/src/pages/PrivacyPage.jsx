
import React from 'react';
import { Helmet } from 'react-helmet';
import BreadcrumbNav from '@/components/BreadcrumbNav.jsx';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <Helmet>
        <title>Privacy Policy | OdysseusAI</title>
      </Helmet>
      
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BreadcrumbNav />
        
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-balance">Privacy Policy</h1>
        
        <div className="prose prose-slate prose-lg max-w-none text-foreground">
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed font-medium">
            Last updated: June 8, 2026. Welcome to OdysseusAI, the World #1 Digital Marketplace. We rigorously respect your data sovereignty and adhere to the highest standards of privacy protection.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">1. Telemetry and Information Collection</h2>
          <p className="mb-6 text-muted-foreground leading-relaxed">
            We collect precise technical information required to validate hardware configurations and manage asset licensing. This includes account credentials, transactional histories, and opt-in diagnostic logs when utilizing our workspace simulator. We explicitly do not log prompt content or model outputs during simulator execution unless you enable persistent session history.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">2. Utilization of Data</h2>
          <p className="mb-6 text-muted-foreground leading-relaxed">
            Collected data powers core marketplace functionality: verifying licensing entitlements, delivering localized content via our CDN edge nodes, calculating accurate hardware recommendations, and processing secure payments. Anonymized aggregate metrics are used to rank products and establish baseline VRAM requirements for new AI architectures.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">3. Enterprise Security Infrastructure</h2>
          <p className="mb-6 text-muted-foreground leading-relaxed">
            Your data rests on SOC2 Type II compliant infrastructure. All credentials, API keys, and payment tokens are hashed and encrypted at rest utilizing AES-256 standards. We implement continuous automated vulnerability scanning and enforce mandatory multi-factor authentication for administrative access. We do not sell your personal identifying information to third-party data brokers under any circumstances.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
