
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Languages, Plus, Download, Upload } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';

const TranslationManagementPage = () => {
  const [langs, setLangs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiServerClient.fetch('/languages')
      .then(res => res.json())
      .then(data => setLangs(data.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Helmet><title>Translations - Admin</title></Helmet>
      <div className="flex justify-between items-center mb-10 border-b-[3px] border-black pb-6">
        <h1 className="text-4xl font-black space-grotesk flex items-center gap-3">
          <Languages size={36} /> Translation Management
        </h1>
        <div className="flex gap-2">
          <button className="neo-button bg-white text-sm py-2 px-4"><Upload size={16}/></button>
          <button className="neo-button bg-white text-sm py-2 px-4"><Download size={16}/></button>
          <button className="neo-button bg-black text-white text-sm py-2 px-4"><Plus size={16} className="mr-2"/> Add Language</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <p className="font-black">Loading...</p> : langs.length === 0 ? <p className="font-bold">No languages found.</p> : 
          langs.map((l, i) => (
            <div key={i} className="neo-card bg-white text-center py-8 hover:-translate-y-2 transition-transform">
              <h3 className="text-2xl font-black mb-2">{l.name}</h3>
              <p className="font-bold text-gray-500 mb-4">{l.code}</p>
              <button className="neo-button bg-[hsl(var(--accent))] w-full">Edit Translations</button>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default TranslationManagementPage;
