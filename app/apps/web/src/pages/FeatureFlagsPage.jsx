
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Flag, Plus, Trash2, Power } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';

const FeatureFlagsPage = () => {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFlags = async () => {
    try {
      const res = await apiServerClient.fetch('/feature-flags');
      const data = await res.json();
      setFlags(data.items || []);
    } catch (err) {
      toast.error('Failed to load feature flags');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFlags(); }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Helmet><title>Feature Flags - Admin</title></Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b-[3px] border-black pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-black space-grotesk flex items-center gap-3">
            <Flag size={36} className="text-[hsl(var(--primary))]" /> Feature Flags
          </h1>
          <p className="font-bold text-gray-600 mt-2">Control feature rollouts safely in production.</p>
        </div>
        <button className="neo-button bg-black text-white">
          <Plus size={20} className="mr-2" /> New Flag
        </button>
      </div>

      <div className="neo-card p-0 overflow-x-auto bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[hsl(var(--background))] border-b-[3px] border-black uppercase text-sm font-black">
              <th className="p-4">Flag Name</th>
              <th className="p-4">Type</th>
              <th className="p-4">Rollout %</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="5" className="p-8 text-center font-bold">Loading...</td></tr> : 
              flags.map(flag => (
                <tr key={flag.id} className="border-b border-dashed border-black hover:bg-gray-50">
                  <td className="p-4 font-black">{flag.name}</td>
                  <td className="p-4"><span className="neo-badge bg-[hsl(var(--accent))]">{flag.type}</span></td>
                  <td className="p-4 font-bold">{flag.rollout_percentage || 0}%</td>
                  <td className="p-4">
                    <span className={`neo-badge ${flag.status === 'enabled' ? 'bg-[hsl(var(--secondary))]' : 'bg-gray-200'}`}>
                      {flag.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button className="p-2 border-[3px] border-black bg-white hover:bg-[hsl(var(--primary))]"><Power size={16}/></button>
                    <button className="p-2 border-[3px] border-black bg-white hover:bg-[hsl(var(--destructive))] hover:text-white"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeatureFlagsPage;
