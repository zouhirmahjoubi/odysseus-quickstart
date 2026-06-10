
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { XCircle, ArrowLeft } from 'lucide-react';
import PageTransition from '@/components/PageTransition.jsx';

const CancelPage = () => {
  return (
    <PageTransition>
      <Helmet>
        <title>Payment Cancelled - OdysseusAI</title>
      </Helmet>
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="neo-card max-w-lg w-full text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full neo-border bg-red-200 mb-6">
            <XCircle size={40} className="text-red-600" />
          </div>
          <h1 className="text-4xl font-black mb-4">Payment Cancelled</h1>
          <p className="text-lg font-medium opacity-80 mb-8">
            Your checkout process was cancelled. No charges were made to your account.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/resources" className="neo-button bg-[hsl(var(--highlight))] flex items-center justify-center gap-2">
              Try Again
            </Link>
            <Link to="/" className="neo-button bg-[hsl(var(--card-bg))] flex items-center justify-center gap-2">
              <ArrowLeft size={20} /> Return Home
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CancelPage;
