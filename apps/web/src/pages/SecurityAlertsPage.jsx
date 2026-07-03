
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';

const SecurityAlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    apiServerClient.fetch('/odysseus-admin/security/alerts')
      .then(res => res.json())
      .then(data => setAlerts(data.items || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAlerts(); }, []);

  const handleResolve = async (id) => {
    try {
      await apiServerClient.fetch(`/odysseus-admin/security/alerts/${id}/resolve`, { method: 'POST' });
      toast.success('Alert resolved');
      fetchAlerts();
    } catch (e) {
      toast.error('Failed to resolve alert');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Helmet><title>Security Alerts</title></Helmet>
      
      <div className="mb-10 border-b-[3px] border-black pb-6">
        <h1 className="text-4xl font-black space-grotesk flex items-center gap-3 text-[hsl(var(--destructive))]">
          <AlertTriangle size={36} /> Security Alerts
        </h1>
      </div>

      <div className="grid gap-6">
        {loading ? <div className="animate-pulse h-24 bg-white neo-border" /> : alerts.map(alert => (
          <div key={alert.id} className="neo-card bg-white flex justify-between items-center border-l-[8px] border-l-[hsl(var(--destructive))]">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="neo-badge bg-[hsl(var(--destructive))] text-white">{alert.severity?.toUpperCase()}</span>
                <h3 className="font-black text-xl">{alert.alert_type}</h3>
              </div>
              <p className="font-bold text-gray-600">{alert.description}</p>
              <p className="text-sm font-bold text-gray-400 mt-2">{new Date(alert.timestamp).toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleResolve(alert.id)} className="neo-button bg-[hsl(var(--secondary))] text-sm py-2"><CheckCircle size={16} className="mr-2"/> Resolve</button>
            </div>
          </div>
        ))}
        {!loading && alerts.length === 0 && (
          <div className="neo-card bg-[hsl(var(--secondary))] text-center py-12 font-black text-xl">
            No active security alerts. You're all clear!
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityAlertsPage;
