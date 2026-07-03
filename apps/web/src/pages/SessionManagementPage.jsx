
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Laptop, Trash2 } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';

const SessionManagementPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      const res = await apiServerClient.fetch('/odysseus-admin/security/sessions');
      const data = await res.json();
      setSessions(data.items || []);
    } catch (e) {
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSessions(); }, []);

  const terminate = async (id) => {
    try {
      await apiServerClient.fetch(`/odysseus-admin/security/sessions/${id}`, { method: 'DELETE' });
      toast.success('Session terminated');
      fetchSessions();
    } catch (e) {
      toast.error('Failed to terminate session');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Helmet><title>Active Sessions - Admin</title></Helmet>
      <div className="mb-10 border-b-[3px] border-black pb-6">
        <h1 className="text-4xl font-black space-grotesk flex items-center gap-3">
          <Laptop size={36} /> Active User Sessions
        </h1>
      </div>
      <div className="neo-card bg-white p-0">
        <div className="p-4 space-y-4">
          {loading ? <p className="font-black">Loading...</p> : sessions.length === 0 ? <p className="font-bold">No active sessions.</p> : 
            sessions.map(s => (
              <div key={s.id} className="flex justify-between items-center p-4 border-[3px] border-black bg-gray-50">
                <div>
                  <h3 className="font-black text-lg">User ID: {s.user_id}</h3>
                  <p className="text-sm font-bold text-gray-500">IP: {s.ip_address} • Started: {new Date(s.created).toLocaleString()}</p>
                </div>
                <button onClick={() => terminate(s.id)} className="neo-button bg-[hsl(var(--destructive))] text-white p-2">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default SessionManagementPage;
