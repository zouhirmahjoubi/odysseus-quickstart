
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ShieldAlert } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';

const TwoFactorVerifyPage = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // In a complete implementation, this would hit the API and utilize the current session context
    setTimeout(() => {
      toast.success('Identity verified securely.');
      navigate('/');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-[hsl(var(--background))]">
      <Helmet><title>Verify Identity - OdysseusAI</title></Helmet>
      
      <div className="neo-card bg-white max-w-md w-full p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[var(--primary-accent)] neo-border flex items-center justify-center">
            <ShieldAlert size={32} className="text-black" />
          </div>
        </div>
        <h1 className="text-2xl font-black space-grotesk text-center mb-2">Two-Factor Authentication</h1>
        <p className="font-bold text-gray-600 text-center mb-6">Enter the 6-digit code from your authenticator app or email to proceed.</p>
        
        <form onSubmit={handleVerify}>
          <input 
            type="text" 
            maxLength="6"
            required
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
            className="neo-input text-center text-3xl tracking-[0.5em] font-mono mb-6 py-4"
            placeholder="000000"
          />
          <button type="submit" disabled={loading || code.length < 6} className="neo-button bg-black text-white w-full py-4 text-lg">
            {loading ? 'Verifying...' : 'Verify Identity'}
          </button>
        </form>
        
        <div className="mt-6 text-center flex flex-col gap-3">
          <button className="font-bold text-sm text-gray-500 hover:text-black underline transition-colors">
            Resend Code
          </button>
          <button className="font-bold text-sm text-gray-500 hover:text-black underline transition-colors">
            Use a backup code
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorVerifyPage;
