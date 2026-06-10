
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Eye, Trash2, MessageSquare } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const ContactAdminPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSub, setSelectedSub] = useState(null);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('contact_submissions').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setSubmissions(records);
    } catch (err) {
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await pb.collection('contact_submissions').update(id, { status: newStatus }, { $autoCancel: false });
      fetchSubmissions();
      if (selectedSub && selectedSub.id === id) {
        setSelectedSub(prev => ({...prev, status: newStatus}));
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this submission?')) return;
    try {
      await pb.collection('contact_submissions').delete(id, { $autoCancel: false });
      toast.success('Deleted');
      setSelectedSub(null);
      fetchSubmissions();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const filtered = submissions.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedSub) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={() => setSelectedSub(null)} className="neo-button bg-white mb-6">← Back to List</button>
        <div className="neo-card bg-white">
          <div className="flex justify-between items-start border-b-[3px] border-black pb-6 mb-6">
            <div>
              <h2 className="text-3xl font-black space-grotesk mb-2">{selectedSub.subject}</h2>
              <p className="font-bold text-gray-600">From: {selectedSub.name} ({selectedSub.email})</p>
              {selectedSub.phone && <p className="font-bold text-gray-600">Phone: {selectedSub.phone}</p>}
              <p className="text-sm font-bold text-gray-400 mt-2">{new Date(selectedSub.created).toLocaleString()}</p>
            </div>
            <span className={`neo-badge ${selectedSub.status === 'new' ? 'bg-[var(--accent-mint)]' : 'bg-gray-200'}`}>
              {selectedSub.status.toUpperCase()}
            </span>
          </div>
          <div className="prose max-w-none font-medium text-lg mb-8 whitespace-pre-wrap">
            {selectedSub.message}
          </div>
          <div className="flex gap-4 border-t-[3px] border-black pt-6">
            <button onClick={() => handleStatusChange(selectedSub.id, 'replied')} className="neo-button bg-[var(--accent-sky)] text-black flex-1">
              Mark as Replied
            </button>
            <button onClick={() => handleDelete(selectedSub.id)} className="neo-button bg-red-500 text-white">
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet><title>Contact Submissions - Admin</title></Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b-[3px] border-black pb-4 gap-4">
        <h1 className="text-4xl font-black space-grotesk flex items-center gap-3">
          <MessageSquare size={36} /> Inbox
        </h1>
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Search name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="neo-input pl-10 py-2"
          />
          <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
        </div>
      </div>

      <div className="neo-card p-0 overflow-x-auto bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[hsl(var(--background))] border-b-[3px] border-black text-sm uppercase tracking-wide">
              <th className="p-4 font-black">Sender</th>
              <th className="p-4 font-black">Subject</th>
              <th className="p-4 font-black">Date</th>
              <th className="p-4 font-black">Status</th>
              <th className="p-4 font-black text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center font-bold">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center font-bold text-gray-500">No submissions found.</td></tr>
            ) : (
              filtered.map(sub => (
                <tr key={sub.id} className={`border-b border-dashed border-gray-300 hover:bg-gray-50 ${sub.status === 'new' ? 'bg-[var(--accent-pale-yellow)]' : ''}`}>
                  <td className="p-4 font-bold">
                    {sub.name} <br/><span className="text-xs text-gray-500 font-medium">{sub.email}</span>
                  </td>
                  <td className="p-4 font-bold max-w-xs truncate">{sub.subject}</td>
                  <td className="p-4 font-medium text-sm">{new Date(sub.created).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`neo-badge ${sub.status === 'new' ? 'bg-[var(--accent-mint)]' : 'bg-gray-200'}`}>
                      {sub.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setSelectedSub(sub); if(sub.status==='new') handleStatusChange(sub.id, 'read'); }} className="p-2 neo-border bg-white hover:bg-[var(--accent-sky)]">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => handleDelete(sub.id)} className="p-2 neo-border bg-white hover:bg-red-500 hover:text-white">
                        <Trash2 size={16} />
                      </button>
                    </div>
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

export default ContactAdminPage;
