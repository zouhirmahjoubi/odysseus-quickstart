
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Shield, Key, Smartphone, Activity, AlertTriangle } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const SecuritySettingsPage = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    if (!user) return;
    apiServerClient.fetch(`/security/login-history?userId=${user.id}`).then(res => res.json()).then(data => setHistory(data.items || [])).catch(console.error);
    apiServerClient.fetch(`/security/trusted-devices?userId=${user.id}`).then(res => res.json()).then(data => setDevices(data.items || [])).catch(console.error);
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Helmet><title>Security Settings - OdysseusAI</title></Helmet>
      
      <h1 className="text-4xl font-black space-grotesk mb-8 border-b-[3px] border-black pb-4">Security Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* 2FA Section */}
        <div className="neo-card bg-[var(--background-light)]">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={24} className="text-[var(--primary-accent)]" />
            <h2 className="text-2xl font-black space-grotesk">Two-Factor Auth</h2>
          </div>
          <p className="font-bold text-gray-600 mb-6">Add an extra layer of security to your account.</p>
          <Link to="/settings/security/2fa" className="neo-button bg-white text-black w-full">Manage 2FA</Link>
        </div>

        {/* Password Section */}
        <div className="neo-card bg-white">
          <div className="flex items-center gap-3 mb-4">
            <Key size={24} />
            <h2 className="text-2xl font-black space-grotesk">Password</h2>
          </div>
          <p className="font-bold text-gray-600 mb-6">Update your password regularly to keep your account secure.</p>
          <button className="neo-button bg-black text-white w-full hover:bg-gray-800">Change Password</button>
        </div>
      </div>

      {/* Trusted Devices */}
      <div className="neo-card bg-white mb-8 p-0 overflow-hidden">
        <div className="p-6 border-b-[3px] border-black bg-[var(--secondary-accent)]">
          <h2 className="text-2xl font-black space-grotesk flex items-center gap-3"><Smartphone size={24}/> Trusted Devices</h2>
        </div>
        <div className="p-0">
          {devices.length === 0 ? (
            <p className="p-6 font-bold text-gray-500">No trusted devices found.</p>
          ) : (
            <ul className="divide-y-3 divide-black">
              {devices.map(d => (
                <li key={d.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                  <div>
                    <p className="font-bold">{d.device_info}</p>
                    <p className="text-sm text-gray-500">IP: {d.ip_address} • Last used: {new Date(d.last_used).toLocaleDateString()}</p>
                  </div>
                  <button className="text-red-500 font-bold text-sm hover:underline">Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Login History */}
      <div className="neo-card bg-white p-0 overflow-hidden">
        <div className="p-6 border-b-[3px] border-black">
          <h2 className="text-2xl font-black space-grotesk flex items-center gap-3"><Activity size={24}/> Recent Activity</h2>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b-[3px] border-black">
              <tr>
                <th className="p-4 font-black text-sm">Date</th>
                <th className="p-4 font-black text-sm">Device</th>
                <th className="p-4 font-black text-sm">IP Address</th>
                <th className="p-4 font-black text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y border-gray-200">
              {history.slice(0, 5).map(h => (
                <tr key={h.id}>
                  <td className="p-4 font-medium text-sm">{new Date(h.created_date).toLocaleString()}</td>
                  <td className="p-4 font-medium text-sm">{h.device_info}</td>
                  <td className="p-4 font-medium text-sm">{h.ip_address}</td>
                  <td className="p-4"><span className={`neo-badge ${h.status === 'success' ? 'bg-[var(--primary-accent)]' : 'bg-red-200'}`}>{h.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettingsPage;
