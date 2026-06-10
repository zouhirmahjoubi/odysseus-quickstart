
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Trash2, Mail, Download } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';

const NewsletterAdminPage = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await apiServerClient.fetch('/newsletter/subscribers?perPage=100');
      const data = await res.json();
      if (res.ok) {
        setSubscribers(data.items || []);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      toast.error('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subscriber?')) return;
    try {
      const res = await apiServerClient.fetch(`/newsletter/subscribers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Subscriber deleted');
      fetchSubscribers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filtered = subscribers.filter(s => s.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet><title>Newsletter Admin - OdysseusAI</title></Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b-[3px] border-black pb-4 gap-4">
        <h1 className="text-4xl font-black space-grotesk flex items-center gap-3">
          <Mail size={36} /> Newsletter
        </h1>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input 
              type="text" 
              placeholder="Search emails..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="neo-input pl-10 py-2"
            />
            <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
          </div>
          <button className="neo-button bg-[var(--accent-sky)] text-black whitespace-nowrap" onClick={() => toast.info('Export started')}>
            <Download size={20} className="mr-2" /> Export CSV
          </button>
        </div>
      </div>

      <div className="neo-card p-0 overflow-x-auto bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[hsl(var(--background))] border-b-[3px] border-black text-sm uppercase tracking-wide">
              <th className="p-4 font-black">Email</th>
              <th className="p-4 font-black">Status</th>
              <th className="p-4 font-black">Subscribed Date</th>
              <th className="p-4 font-black text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="p-8 text-center font-bold">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="4" className="p-8 text-center font-bold text-gray-500">No subscribers found.</td></tr>
            ) : (
              filtered.map(sub => (
                <tr key={sub.id} className="border-b border-dashed border-gray-300 hover:bg-gray-50">
                  <td className="p-4 font-bold">{sub.email}</td>
                  <td className="p-4">
                    <span className={`neo-badge ${sub.status === 'subscribed' ? 'bg-[var(--accent-mint)]' : 'bg-red-200'}`}>
                      {sub.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-sm">{new Date(sub.created).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(sub.id)} className="p-2 neo-border bg-white hover:bg-red-500 hover:text-white">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewsletterAdminPage;
