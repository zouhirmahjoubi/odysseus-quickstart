
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Key, Smartphone, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const TwoFactorManagementPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet><title>Manage 2FA - OdysseusAI</title></Helmet>
      
      <Link to="/settings/security" className="inline-flex items-center font-bold mb-8 hover:underline">
        <ArrowLeft size={16} className="mr-2" /> Back to Security Settings
      </Link>

      <h1 className="text-4xl font-black space-grotesk mb-8 flex items-center gap-3 border-b-[3px] border-black pb-4">
        <Shield size={36} /> Manage Two-Factor Auth
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="neo-card bg-[var(--primary-accent)] text-black">
          <h2 className="text-2xl font-black mb-4">Current Status</h2>
          <div className="flex items-center justify-between bg-white neo-border p-4 mb-6">
            <span className="font-bold">Authenticator App (TOTP)</span>
            <span className="neo-badge bg-[var(--accent-mint)]">ACTIVE</span>
          </div>
          <button className="neo-button bg-black text-white w-full hover:bg-gray-800">
            Change Primary Method
          </button>
        </div>

        <div className="space-y-6">
          <div className="neo-card bg-white">
            <h3 className="text-xl font-black flex items-center mb-2"><Key size={20} className="mr-2"/> Backup Codes</h3>
            <p className="text-sm font-bold text-gray-600 mb-4">Use these secure codes to log in if you lose access to your primary device.</p>
            <button 
              onClick={() => toast.info('Regenerating backup codes...')} 
              className="neo-button bg-[var(--accent-sky)] text-black w-full text-sm py-3"
            >
              View & Regenerate Codes
            </button>
          </div>

          <div className="neo-card bg-white border-red-500 border-[3px]">
            <h3 className="text-xl font-black flex items-center mb-2 text-red-600"><AlertTriangle size={20} className="mr-2"/> Danger Zone</h3>
            <p className="text-sm font-bold text-gray-600 mb-4">Disabling Two-Factor Authentication makes your account significantly less secure.</p>
            <button 
              onClick={() => {
                if(window.confirm('Are you sure you want to disable 2FA? This is highly discouraged.')) {
                  toast.success('Two-factor authentication disabled.');
                }
              }} 
              className="neo-button bg-red-500 text-white w-full text-sm py-3 hover:bg-red-600"
            >
              Disable 2FA
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default TwoFactorManagementPage;
