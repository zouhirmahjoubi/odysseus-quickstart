
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { ShieldAlert, Search } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';

const SecurityAuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiServerClient.fetch('/odysseus-admin/security/audit-log')
      .then(res => res.json())
      .then(data => setLogs(data.items || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Helmet><title>Audit Log - Security Admin</title></Helmet>
      
      <div className="mb-10 border-b-[3px] border-black pb-6">
        <h1 className="text-4xl font-black space-grotesk flex items-center gap-3">
          <ShieldAlert size={36} className="text-black" /> Audit Log
        </h1>
      </div>

      <div className="neo-card p-0 bg-white">
        <table className="w-full text-left">
          <thead className="bg-[hsl(var(--background))] border-b-[3px] border-black uppercase text-sm font-black">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Event Type</th>
              <th className="p-4">User</th>
              <th className="p-4">IP Address</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="5" className="p-8 text-center font-bold">Loading...</td></tr> : 
              logs.map(log => (
                <tr key={log.id} className="border-b border-dashed border-gray-300">
                  <td className="p-4 font-bold text-sm">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-4 font-black">{log.event_type}</td>
                  <td className="p-4">{log.user_id || 'System'}</td>
                  <td className="p-4 font-jetbrains-mono text-sm">{log.ip_address}</td>
                  <td className="p-4">
                    <span className={`neo-badge ${log.status === 'success' ? 'bg-[hsl(var(--secondary))]' : 'bg-[hsl(var(--destructive))] text-white'}`}>
                      {log.status?.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SecurityAuditLogPage;
