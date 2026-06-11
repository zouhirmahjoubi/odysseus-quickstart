
import React, { useState } from 'react';
import { Shield, Check, Download } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';
import { toast } from 'sonner';

const HardenedStackProduct = () => {
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    'Cloudflare Tunnel Integration',
    'Tailscale VPN Setup',
    'Nginx Reverse Proxy with Let\'s Encrypt SSL',
    'UFW Firewall Hardening',
    'Admin Access Protection',
    'Automated Backups',
    'Health Monitoring Scripts'
  ];

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await apiServerClient.fetch('/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 79,
          productName: 'Hardened Stack: Production-Ready Deployment Script',
          successUrl: window.location.origin + '/success?session_id={CHECKOUT_SESSION_ID}',
          cancelUrl: window.location.origin + '/cancel'
        })
      });
      
      if (!response.ok) throw new Error('Checkout failed');
      
      const data = await response.json();
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to initiate checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="neo-card border-[hsl(var(--border-color))] relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-[#FF9000] text-black font-bold px-4 py-1 neo-border border-t-0 border-r-0">
        PREMIUM
      </div>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-[#FF9000] neo-border text-black">
          <Shield size={32} />
        </div>
        <div>
          <h3 className="text-2xl font-black">Hardened Stack</h3>
          <p className="font-bold opacity-70">Production-Ready Deployment Script</p>
        </div>
      </div>
      
      <p className="mb-6 font-medium text-lg">
        Automate secure remote access, SSL, reverse proxy, and firewall hardening in minutes.
      </p>
      
      <ul className="space-y-3 mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3 font-medium">
            <div className="mt-1 bg-[#BBF7D0] text-black rounded-full p-0.5 neo-border border-2">
              <Check size={14} strokeWidth={3} />
            </div>
            {feature}
          </li>
        ))}
      </ul>
      
      <div className="flex items-center justify-between pt-6 border-t-[3px] border-[hsl(var(--border-color))]">
        <div className="text-4xl font-black">$79<span className="text-lg opacity-50">.00</span></div>
        <button 
          onClick={handleCheckout}
          disabled={isLoading}
          className="neo-button bg-[#FF9000] text-black flex items-center gap-2"
        >
          {isLoading ? 'Processing...' : <><Download size={20} /> Download Now</>}
        </button>
      </div>
    </div>
  );
};

export default HardenedStackProduct;
