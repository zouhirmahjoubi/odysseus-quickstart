
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Users, Plus, Filter, Trash2, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';

const UserSegmentsPage = () => {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSegments = async () => {
    try {
      const res = await apiServerClient.fetch('/segments');
      const data = await res.json();
      setSegments(data.items || []);
    } catch (err) {
      toast.error('Failed to load segments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSegments(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete segment?')) return;
    try {
      await apiServerClient.fetch(`/segments/${id}`, { method: 'DELETE' });
      toast.success('Segment deleted');
      fetchSegments();
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Helmet><title>User Segments - Admin</title></Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b-[3px] border-black pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-black space-grotesk flex items-center gap-3">
            <Users size={36} className="text-[hsl(var(--primary))]" /> User Segmentation
          </h1>
          <p className="font-bold text-gray-600 mt-2">Target audiences for A/B tests and feature flags.</p>
        </div>
        <button className="neo-button bg-black text-white">
          <Plus size={20} className="mr-2" /> New Segment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <div className="animate-pulse h-40 bg-gray-200 neo-border col-span-full" /> : segments.map(seg => (
          <div key={seg.id} className="neo-card bg-white flex flex-col h-full hover:-translate-y-1 hover:shadow-neo transition-transform">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-black truncate">{seg.name}</h3>
              <span className="neo-badge bg-[hsl(var(--secondary))]">{seg.member_count || 0} users</span>
            </div>
            <p className="font-bold text-gray-600 text-sm mb-6 flex-1 line-clamp-2">{seg.description}</p>
            
            <div className="flex gap-2 mt-auto pt-4 border-t-[3px] border-black border-dashed">
              <Link to={`/odysseus-admin/segments/${seg.id}`} className="neo-button bg-[hsl(var(--accent))] flex-1 text-sm py-2 px-0 text-center">View</Link>
              <button className="neo-button bg-gray-100 p-2"><Edit size={16}/></button>
              <button onClick={() => handleDelete(seg.id)} className="neo-button bg-[hsl(var(--destructive))] text-white p-2"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSegmentsPage;
