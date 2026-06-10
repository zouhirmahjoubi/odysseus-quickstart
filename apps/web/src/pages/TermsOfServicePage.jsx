
import React from 'react';
import { Helmet } from 'react-helmet';
import BreadcrumbNav from '@/components/BreadcrumbNav.jsx';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <Helmet>
        <title>Terms of Service | OdysseusAI</title>
      </Helmet>
      
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BreadcrumbNav />
        
        <h1 className="text-4xl font-extrabold mb-8">Terms of Service</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-muted-foreground mb-8">
            Last updated: June 7, 2026. Please read these terms carefully before using the OdysseusAI marketplace.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4 text-muted-foreground">
            By accessing or using OdysseusAI, the World #1 Digital Marketplace, you agree to be bound by these Terms of Service and all applicable laws and regulations.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">2. Digital Assets and Licensing</h2>
          <p className="mb-4 text-muted-foreground">
            When you purchase a digital asset from our marketplace, you are granted a license to use the asset according to the specific license terms provided at the time of purchase. You may not redistribute or resell the assets unless explicitly permitted.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">3. User Accounts</h2>
          <p className="mb-4 text-muted-foreground">
            You are responsible for safeguarding your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
