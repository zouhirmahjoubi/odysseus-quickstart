
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Shield, Smartphone, Mail, QrCode } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const TwoFactorSetupPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [method, setMethod] = useState('TOTP');
  const [setupData, setSetupData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSetup = async () => {
    setLoading(true);
    try {
      const res = await apiServerClient.fetch('/2fa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, method })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setSetupData(data);
      toast.success('Setup initiated. Please verify.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = e.target.code.value;
    try {
      const res = await apiServerClient.fetch('/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, code })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      toast.success('2FA Enabled Successfully!');
      navigate('/settings/security');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Helmet><title>Setup 2FA - OdysseusAI</title></Helmet>
      
      <h1 className="text-4xl font-black space-grotesk mb-8 flex items-center gap-3">
        <Shield size={36} /> Two-Factor Authentication
      </h1>

      {!setupData ? (
        <div className="neo-card bg-white">
          <h2 className="text-2xl font-black mb-6">Select Method</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button onClick={() => setMethod('TOTP')} className={`p-6 neo-border text-center transition-colors ${method === 'TOTP' ? 'bg-[var(--primary-accent)]' : 'bg-gray-50 hover:bg-gray-100'}`}>
              <QrCode size={32} className="mx-auto mb-3" />
              <span className="font-bold block">Authenticator App</span>
            </button>
            <button onClick={() => setMethod('SMS')} className={`p-6 neo-border text-center transition-colors ${method === 'SMS' ? 'bg-[var(--primary-accent)]' : 'bg-gray-50 hover:bg-gray-100'}`}>
              <Smartphone size={32} className="mx-auto mb-3" />
              <span className="font-bold block">SMS Text</span>
            </button>
            <button onClick={() => setMethod('Email')} className={`p-6 neo-border text-center transition-colors ${method === 'Email' ? 'bg-[var(--primary-accent)]' : 'bg-gray-50 hover:bg-gray-100'}`}>
              <Mail size={32} className="mx-auto mb-3" />
              <span className="font-bold block">Email Code</span>
            </button>
          </div>
          <button onClick={handleSetup} disabled={loading} className="neo-button bg-black text-white w-full">
            {loading ? 'Processing...' : 'Continue Setup'}
          </button>
        </div>
      ) : (
        <div className="neo-card bg-white">
          <h2 className="text-2xl font-black mb-6">Verify Setup</h2>
          {setupData.method === 'TOTP' && setupData.qrCode && (
            <div className="mb-6 text-center">
              <p className="font-bold mb-4">Scan this QR code with your authenticator app:</p>
              <img src={setupData.qrCode} alt="QR Code" className="mx-auto neo-border p-2 bg-white" />
              <p className="font-mono text-sm mt-4 bg-gray-100 p-2 neo-border inline-block">{setupData.secret}</p>
            </div>
          )}
          <form onSubmit={handleVerify} className="max-w-sm mx-auto">
            <label className="block font-bold mb-2 text-center">Enter 6-digit code</label>
            <input type="text" name="code" required maxLength="6" className="neo-input text-center text-2xl tracking-widest font-mono mb-4" placeholder="000000" />
            <button type="submit" className="neo-button bg-[var(--primary-accent)] text-black w-full">Verify & Enable</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TwoFactorSetupPage;
