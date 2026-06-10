
import React from 'react';
import { Helmet } from 'react-helmet';
import { Key } from 'lucide-react';

const EncryptionSettingsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet><title>Encryption Settings</title></Helmet>
      <div className="mb-10 border-b-[3px] border-black pb-6">
        <h1 className="text-4xl font-black space-grotesk flex items-center gap-3">
          <Key size={36} /> Encryption & Keys
        </h1>
      </div>
      <div className="neo-card bg-white space-y-6">
        <div className="p-4 bg-[hsl(var(--secondary))] border-neo font-black">
          Status: AES-256 Encryption Active
        </div>
        <button className="neo-button bg-black text-white w-full">Rotate Master Key</button>
        <div className="pt-6 border-t-neo">
          <p className="font-bold text-gray-600 mb-4">Database fields including API keys, tokens, and PII are encrypted at rest.</p>
        </div>
      </div>
    </div>
  );
};

export default EncryptionSettingsPage;
