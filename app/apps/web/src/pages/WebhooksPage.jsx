
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Webhook, Plus, Edit, Trash2, Activity, Play } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';

const AVAILABLE_EVENTS = [
  'agent.installed', 'agent.uninstalled', 'agent.tested', 'agent.error',
  'user.created', 'user.updated', 'user.deleted', 'test.completed', 'test.failed'
];

const WebhooksPage = () => {
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState(null);
  
  const defaultForm = { url: '', events: [], active: true, retryPolicy: { maxRetries: 3 } };
  const [formData, setFormData] = useState(defaultForm);

  const fetchWebhooks = async () => {
    try {
      setLoading(true);
      const res = await apiServerClient.fetch('/webhooks');
      if (res.ok) {
        const data = await res.json();
        setWebhooks(data.items || []);
      }
    } catch (err) {
      toast.error('Failed to load webhooks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWebhooks(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.events.length === 0) return toast.error('Select at least one event');
    
    try {
      const url = editingWebhook ? `/webhooks/${editingWebhook.id}` : '/webhooks';
      const method = editingWebhook ? 'PUT' : 'POST';
      const res = await apiServerClient.fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      toast.success(editingWebhook ? 'Webhook updated' : 'Webhook created');
      if (data.secret) {
        alert(`IMPORTANT: Your webhook signing secret is:\n\n${data.secret}\n\nPlease save this now. You won't see it again.`);
      }
      setShowModal(false);
      fetchWebhooks();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete webhook?')) return;
    try {
      await apiServerClient.fetch(`/webhooks/${id}`, { method: 'DELETE' });
      toast.success('Deleted');
      fetchWebhooks();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleTest = async (id) => {
    try {
      const res = await apiServerClient.fetch(`/webhooks/${id}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'test.completed' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`Test sent. Status: ${data.status}`);
      fetchWebhooks();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Helmet><title>Webhooks - OdysseusAI</title></Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b-[3px] border-black pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-black space-grotesk flex items-center gap-3">
            <Webhook size={36} className="text-[var(--primary-accent)]" /> Webhooks
          </h1>
          <p className="font-bold text-gray-600 mt-2">Subscribe to real-time events and push notifications to your servers.</p>
        </div>
        <div className="flex gap-4">
          <Link to="/settings/webhooks/logs" className="neo-button bg-white text-black">
            <Activity size={20} className="mr-2" /> View Logs
          </Link>
          <button onClick={() => { setEditingWebhook(null); setFormData(defaultForm); setShowModal(true); }} className="neo-button bg-black text-white">
            <Plus size={20} className="mr-2" /> Add Endpoint
          </button>
        </div>
      </div>

      <div className="neo-card p-0 overflow-x-auto bg-white">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[hsl(var(--background))] border-b-[3px] border-black uppercase tracking-wide text-sm">
              <th className="p-5 font-black">Endpoint URL</th>
              <th className="p-5 font-black">Events</th>
              <th className="p-5 font-black">Status</th>
              <th className="p-5 font-black">Last Response</th>
              <th className="p-5 font-black text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center font-bold">Loading Webhooks...</td></tr>
            ) : webhooks.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center font-bold text-gray-500">No webhooks configured.</td></tr>
            ) : (
              webhooks.map(wh => (
                <tr key={wh.id} className="border-b border-dashed border-gray-300 hover:bg-gray-50">
                  <td className="p-5">
                    <p className="font-jetbrains-mono font-bold text-sm truncate max-w-[300px]">{wh.url}</p>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-wrap gap-1">
                      <span className="neo-badge bg-[var(--secondary-accent)]">{wh.events?.length} subscribed</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`neo-badge ${wh.active ? 'neo-badge-success' : 'bg-gray-200'}`}>
                      {wh.active ? 'ACTIVE' : 'DISABLED'}
                    </span>
                  </td>
                  <td className="p-5 font-medium text-sm">
                    {wh.last_response_status ? (
                      <span className={`neo-badge ${wh.last_response_status >= 200 && wh.last_response_status < 300 ? 'neo-badge-success' : 'neo-badge-error'}`}>
                        {wh.last_response_status}
                      </span>
                    ) : 'N/A'}
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleTest(wh.id)} className="p-2 neo-border bg-white hover:bg-[var(--primary-accent)]" title="Send Test"><Play size={16} /></button>
                      <button onClick={() => { setEditingWebhook(wh); setFormData(wh); setShowModal(true); }} className="p-2 neo-border bg-white hover:bg-gray-200" title="Edit"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(wh.id)} className="p-2 neo-border bg-white hover:bg-[hsl(var(--destructive))] hover:text-white" title="Delete"><Trash2 size={16} /></button>
                      <Link to={`/settings/webhooks/${wh.id}/logs`} className="p-2 neo-border bg-white hover:bg-[var(--secondary-accent)]" title="Logs"><Activity size={16} /></Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Webhook Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto pt-20">
          <div className="neo-card bg-white w-full max-w-2xl relative my-auto">
            <h2 className="text-2xl font-black space-grotesk border-b-[3px] border-black pb-4 mb-6">
              {editingWebhook ? 'Edit Endpoint' : 'Add Webhook Endpoint'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-bold mb-2">Endpoint URL</label>
                <input type="url" required placeholder="https://your-domain.com/webhook" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="neo-input font-jetbrains-mono text-sm" />
              </div>
              
              <div className="neo-card bg-[var(--background-light)] p-4">
                <label className="block font-bold mb-4">Event Subscriptions</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AVAILABLE_EVENTS.map(event => (
                    <label key={event} className="flex items-center gap-2 font-bold text-sm cursor-pointer hover:bg-white p-2 neo-border transition-colors">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 neo-border checked:bg-[var(--primary-accent)] accent-black"
                        checked={formData.events?.includes(event)}
                        onChange={e => {
                          const evts = e.target.checked 
                            ? [...(formData.events || []), event] 
                            : (formData.events || []).filter(ev => ev !== event);
                          setFormData({...formData, events: evts});
                        }} 
                      />
                      {event}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-6 items-center border-t-[3px] border-black pt-6">
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} className="w-5 h-5 neo-border checked:bg-[var(--primary-accent)] accent-black" />
                  Endpoint is Active
                </label>
                <div className="ml-auto flex gap-4">
                  <button type="button" onClick={() => setShowModal(false)} className="neo-button bg-gray-200">Cancel</button>
                  <button type="submit" className="neo-button bg-black text-white">Save Webhook</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebhooksPage;
