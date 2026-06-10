
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Smartphone, Trash2, RefreshCw } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';

const MobileDeviceSettingsPage = () => {
  const { user } = useAuth();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDevices = async () => {
    if (!user) return;
    try {
      const res = await apiServerClient.fetch('/mobile/devices');
      const data = await res.json();
      setDevices(data.items || []);
    } catch (err) {
      toast.error('Failed to load devices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDevices(); }, [user]);

  const removeDevice = async (id) => {
    if (!window.confirm('Revoke access for this device?')) return;
    try {
      await apiServerClient.fetch(`/mobile/devices/${id}`, { method: 'DELETE' });
      toast.success('Device removed');
      fetchDevices();
    } catch (err) {
      toast.error('Failed to remove device');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet><title>Mobile Devices - OdysseusAI</title></Helmet>
      
      <div className="mb-10 border-b-[3px] border-black pb-6">
        <h1 className="text-4xl font-black flex items-center gap-3">
          <Smartphone size={36} className="text-[hsl(var(--primary))]" /> Mobile Devices
        </h1>
        <p className="font-bold text-gray-600 mt-2">Manage connected mobile apps and notification settings.</p>
      </div>

      <div className="space-y-6">
        <div className="neo-card bg-white p-0 overflow-hidden">
          <div className="p-4 bg-[hsl(var(--background))] border-b-[3px] border-black font-black flex justify-between items-center">
            <span>Connected Devices</span>
            <button onClick={fetchDevices} className="p-1 hover:bg-gray-200 border-[3px] border-black bg-white"><RefreshCw size={16}/></button>
          </div>
          <div className="p-6 space-y-4">
            {loading ? <p className="font-bold">Loading...</p> : devices.length === 0 ? (
              <p className="font-bold text-gray-500">No devices connected. Download the app to get started.</p>
            ) : (
              devices.map(d => (
                <div key={d.id} className="flex items-center justify-between p-4 bg-gray-50 border-[3px] border-black">
                  <div>
                    <h3 className="font-black">{d.device_name}</h3>
                    <p className="text-sm font-bold text-gray-500">{d.device_type} • OS: {d.os_version}</p>
                    <p className="text-xs font-bold text-gray-400 mt-1">Last Sync: {new Date(d.last_sync_date).toLocaleString()}</p>
                  </div>
                  <button onClick={() => removeDevice(d.id)} className="neo-button bg-[hsl(var(--destructive))] text-white p-2">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDeviceSettingsPage;
