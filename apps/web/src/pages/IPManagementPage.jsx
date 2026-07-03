
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Shield, Lock, Unlock, Plus } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';

const IPManagementPage = () => {
  const [ips, setIps] = useState({ whitelist: [], blacklist: [] });
  const [loading, setLoading] = useState(true);

  const fetchIPs = async () => {
    try {
      const res = await apiServerClient.fetch('/odysseus-admin/security/ip-management');
      const data = await res.json();
      setIps(data);
    } catch (e) {
      toast.error('Failed to load IP lists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIPs(); }, []);

  const ListBlock = ({ title, data, type }) => (
    <div className="neo-card bg-white p-0">
      <div className={`p-4 border-b-[3px] border-black font-black flex justify-between items-center ${type === 'whitelist' ? 'bg-[hsl(var(--secondary))]' : 'bg-[hsl(var(--destructive))] text-white'}`}>
        <h2 className="flex items-center gap-2">{type === 'whitelist' ? <Unlock size={20}/> : <Lock size={20}/>} {title}</h2>
        <button className="p-1 border-[3px] border-black bg-white text-black hover:bg-gray-200"><Plus size={16}/></button>
      </div>
      <div className="p-4 space-y-2">
        {data.length === 0 ? <p className="font-bold text-gray-500">List is empty.</p> : 
          data.map((ip, i) => (
            <div key={i} className="flex justify-between items-center p-2 border-[3px] border-black bg-[hsl(var(--background))] font-jetbrains-mono font-bold text-sm">
              <span>{ip.ip_address}</span>
            </div>
          ))
        }
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Helmet><title>IP Management - Security</title></Helmet>
      <div className="mb-10 border-b-[3px] border-black pb-6">
        <h1 className="text-4xl font-black space-grotesk flex items-center gap-3">
          <Shield size={36} /> IP Access Control
        </h1>
      </div>
      {loading ? <div className="font-black">Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ListBlock title="Whitelist (Allowed)" data={ips.whitelist || []} type="whitelist" />
          <ListBlock title="Blacklist (Blocked)" data={ips.blacklist || []} type="blacklist" />
        </div>
      )}
    </div>
  );
};

export default IPManagementPage;
