
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Download, Mail } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';

const SegmentDetailsPage = () => {
  const { id } = useParams();
  const [segment, setSegment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiServerClient.fetch(`/segments/${id}`)
      .then(res => res.json())
      .then(data => setSegment(data))
      .catch(() => toast.error('Failed to load details'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-12 font-black text-center">Loading...</div>;
  if (!segment) return <div className="p-12 font-black text-center">Segment not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Helmet><title>{segment.name} - Segment Details</title></Helmet>

      <Link to="/admin/segments" className="inline-flex items-center font-bold mb-6 hover:underline">
        <ArrowLeft size={16} className="mr-2" /> Back to Segments
      </Link>

      <div className="neo-card bg-[hsl(var(--background))] mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black mb-2">{segment.name}</h1>
          <p className="font-bold text-gray-600">{segment.description}</p>
        </div>
        <div className="flex gap-4">
          <button className="neo-button bg-white text-sm"><Download size={16} className="mr-2"/> Export</button>
          <button className="neo-button bg-black text-white text-sm"><Mail size={16} className="mr-2"/> Message</button>
        </div>
      </div>

      <div className="neo-card bg-white p-0 overflow-hidden">
        <div className="p-4 border-b-[3px] border-black bg-[hsl(var(--accent))] font-black flex items-center">
          <Users size={20} className="mr-2"/> Segment Members ({segment.member_count || 0})
        </div>
        <div className="p-8 text-center text-gray-500 font-bold">
          List of members will appear here...
        </div>
      </div>
    </div>
  );
};

export default SegmentDetailsPage;
