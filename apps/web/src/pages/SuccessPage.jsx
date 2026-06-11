
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CheckCircle, Download, ArrowRight } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';
import PageTransition from '@/components/PageTransition.jsx';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [paymentData, setPaymentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sessionId) {
      apiServerClient.fetch(`/stripe/session/${sessionId}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to verify session');
          return res.json();
        })
        .then(data => {
          setPaymentData(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError('Could not verify payment status.');
          setIsLoading(false);
        });
    } else {
      setError('No session ID found.');
      setIsLoading(false);
    }
  }, [sessionId]);

  return (
    <PageTransition>
      <Helmet>
        <title>Payment Successful - OdysseusAI</title>
      </Helmet>
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="neo-card max-w-lg w-full text-center">
          {isLoading ? (
            <div className="py-12 font-bold text-xl animate-pulse">Verifying payment...</div>
          ) : error ? (
            <div className="py-12">
              <h2 className="text-2xl font-bold text-red-500 mb-4">Verification Error</h2>
              <p className="font-medium mb-6">{error}</p>
              <Link to="/" className="neo-button bg-[hsl(var(--highlight))] inline-block">Return Home</Link>
            </div>
          ) : (
            <div className="py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full neo-border bg-[#BBF7D0] mb-6">
                <CheckCircle size={40} className="text-black" />
              </div>
              <h1 className="text-4xl font-black mb-2">Payment Successful!</h1>
              <p className="text-lg font-medium opacity-80 mb-8">
                Thank you for your purchase. A receipt has been sent to {paymentData?.customerEmail || 'your email'}.
              </p>
              
              <div className="bg-[hsl(var(--bg-sidebar))] p-6 neo-border mb-8 text-left">
                <h3 className="font-bold text-xl mb-4">Order Details</h3>
                <div className="flex justify-between mb-2 font-medium">
                  <span>Status:</span>
                  <span className="uppercase font-bold text-green-600">{paymentData?.status}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Amount Paid:</span>
                  <span className="font-bold">${(paymentData?.amountTotal / 100).toFixed(2)}</span>
                </div>
              </div>

              {(!paymentData?.lineItems || 
                paymentData.lineItems.length === 0 || 
                paymentData.lineItems.some(item => 
                  item.description?.toLowerCase().includes('launch kit') || 
                  item.description?.toLowerCase().includes('odysseus')
                )
              ) ? (
                <a 
                  href={`/hcgi/api/stripe/download/${sessionId}`}
                  download="odysseus-launch-kit.zip"
                  className="neo-button bg-[#FF9000] text-black w-full flex items-center justify-center gap-2 mb-6 hover:no-underline shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none"
                >
                  <Download size={20} strokeWidth={2.5} /> Download Odysseus Launch Kit
                </a>
              ) : (
                <a 
                  href={`/hcgi/api/stripe/download/${sessionId}`}
                  download="hardened-stack.zip"
                  className="neo-button bg-[#FF9000] text-black w-full flex items-center justify-center gap-2 mb-6 hover:no-underline shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none"
                >
                  <Download size={20} strokeWidth={2.5} /> Download Hardened Stack
                </a>
              )}
              
              <Link to="/resources" className="font-bold flex items-center justify-center gap-2 hover:underline">
                View Documentation <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default SuccessPage;
