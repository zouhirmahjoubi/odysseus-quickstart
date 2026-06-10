
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Key, Copy, Trash2, Plus, Eye, EyeOff, RefreshCw } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';

const ApiKeyManagementPage = () => {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showKeys, setShowKeys] = useState({});
  const [newKeyData, setNewKeyData] = useState({ name: '', permissions: ['read'] });
  const [generatedKey, setGeneratedKey] = useState(null);

  const fetchKeys = async () => {
    try {
      setLoading(true);
      const res = await apiServerClient.fetch('/api-keys');
      if (!res.ok) throw new Error('Failed to fetch keys');
      const data = await res.json();
      setKeys(data.items || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchKeys(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await apiServerClient.fetch('/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKeyData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setGeneratedKey(data.key);
      fetchKeys();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this API key? This action cannot be undone.')) return;
    try {
      const res = await apiServerClient.fetch(`/api-keys/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete key');
      toast.success('API key deleted');
      fetchKeys();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRegenerate = async (id) => {
    if (!window.confirm('Regenerating will invalidate the old key immediately. Continue?')) return;
    try {
      const res = await apiServerClient.fetch(`/api-keys/${id}/regenerate`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setGeneratedKey(data.key);
      fetchKeys();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const toggleShowKey = (id) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 relative">
      <Helmet><title>API Keys - OdysseusAI</title></Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b-[3px] border-black pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-black space-grotesk flex items-center gap-3">
            <Key size={36} className="text-[var(--primary-accent)]" /> API Keys
          </h1>
          <p className="font-bold text-gray-600 mt-2">Manage API keys for programmatic access to OdysseusAI services.</p>
        </div>
        <button onClick={() => { setNewKeyData({ name: '', permissions: ['read'] }); setShowModal(true); setGeneratedKey(null); }} className="neo-button bg-black text-white whitespace-nowrap">
          <Plus size={20} className="mr-2" /> Generate New Key
        </button>
      </div>

      <div className="neo-card p-0 overflow-x-auto bg-white">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[hsl(var(--background))] border-b-[3px] border-black uppercase tracking-wide text-sm">
              <th className="p-5 font-black">Name & Scopes</th>
              <th className="p-5 font-black">API Key</th>
              <th className="p-5 font-black">Created / Last Used</th>
              <th className="p-5 font-black text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="p-8 text-center font-bold">Loading API Keys...</td></tr>
            ) : keys.length === 0 ? (
              <tr><td colSpan="4" className="p-8 text-center font-bold text-gray-500">No API keys found. Generate one to get started.</td></tr>
            ) : (
              keys.map(key => (
                <tr key={key.id} className="border-b border-dashed border-gray-300 hover:bg-gray-50 transition-colors">
                  <td className="p-5">
                    <p className="font-black text-lg">{key.name}</p>
                    <div className="flex gap-2 mt-2">
                      {key.permissions?.map(p => (
                        <span key={p} className="neo-badge bg-[var(--secondary-accent)]">{p}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 font-jetbrains-mono px-3 py-1.5 neo-border text-sm font-bold min-w-[200px] inline-block">
                        {showKeys[key.id] ? key.key : 'sk-••••••••••••••••••••••••'}
                      </code>
                      <button onClick={() => toggleShowKey(key.id)} className="p-2 neo-border bg-white hover:bg-gray-100" aria-label="Toggle visibility">
                        {showKeys[key.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </td>
                  <td className="p-5 font-medium text-sm text-gray-600">
                    <div>Created: {new Date(key.created_date || key.created).toLocaleDateString()}</div>
                    <div>Used: {key.last_used_date ? new Date(key.last_used_date).toLocaleDateString() : 'Never'}</div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => copyToClipboard(key.key)} className="p-2 neo-border bg-white hover:bg-[var(--primary-accent)]" title="Copy Key"><Copy size={16} /></button>
                      <button onClick={() => handleRegenerate(key.id)} className="p-2 neo-border bg-white hover:bg-yellow-300" title="Regenerate"><RefreshCw size={16} /></button>
                      <button onClick={() => handleDelete(key.id)} className="p-2 neo-border bg-white hover:bg-[hsl(var(--destructive))] hover:text-white" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Custom Brutalist Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="neo-card bg-white w-full max-w-lg relative">
            <h2 className="text-2xl font-black space-grotesk border-b-[3px] border-black pb-4 mb-6">
              {generatedKey ? 'Save Your API Key' : 'Generate New API Key'}
            </h2>
            
            {generatedKey ? (
              <div className="space-y-6">
                <div className="p-4 bg-[var(--status-warning)] neo-border font-bold text-sm">
                  Please copy this key and save it securely. You will not be able to see it again!
                </div>
                <div className="flex gap-2">
                  <input type="text" readOnly value={generatedKey} className="neo-input font-jetbrains-mono" />
                  <button onClick={() => copyToClipboard(generatedKey)} className="neo-button bg-black text-white px-4"><Copy size={20} /></button>
                </div>
                <button onClick={() => setShowModal(false)} className="neo-button bg-[var(--primary-accent)] w-full">I've Saved It</button>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-6">
                <div>
                  <label className="block font-bold mb-2">Key Name</label>
                  <input type="text" required placeholder="e.g., Production Agent Server" value={newKeyData.name} onChange={e => setNewKeyData({...newKeyData, name: e.target.value})} className="neo-input" />
                </div>
                
                <div>
                  <label className="block font-bold mb-2">Permissions</label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {['read', 'write', 'admin'].map(perm => (
                      <label key={perm} className="flex items-center gap-2 font-bold cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 neo-border checked:bg-[var(--primary-accent)] accent-black"
                          checked={newKeyData.permissions.includes(perm)}
                          onChange={e => {
                            const perms = e.target.checked 
                              ? [...newKeyData.permissions, perm] 
                              : newKeyData.permissions.filter(p => p !== perm);
                            setNewKeyData({...newKeyData, permissions: perms.length ? perms : ['read']});
                          }} 
                        />
                        {perm.charAt(0).toUpperCase() + perm.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t-[3px] border-black mt-8">
                  <button type="button" onClick={() => setShowModal(false)} className="neo-button bg-gray-200 flex-1">Cancel</button>
                  <button type="submit" className="neo-button bg-black text-white flex-1">Generate Key</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeyManagementPage;
