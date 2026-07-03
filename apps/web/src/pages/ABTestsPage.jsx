
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { SplitSquareHorizontal, Plus, Play, Pause, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';

const ABTestsPage = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTests = async () => {
    try {
      const res = await apiServerClient.fetch('/ab-tests');
      const data = await res.json();
      setTests(data.items || []);
    } catch (err) {
      toast.error('Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTests(); }, []);

  const toggleTest = async (id, currentStatus) => {
    const action = currentStatus === 'running' ? 'pause' : 'start';
    try {
      await apiServerClient.fetch(`/ab-tests/${id}/${action}`, { method: 'POST' });
      toast.success(`Test ${action === 'start' ? 'started' : 'paused'}`);
      fetchTests();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Helmet><title>A/B Testing - Admin</title></Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b-[3px] border-black pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-black space-grotesk flex items-center gap-3">
            <SplitSquareHorizontal size={36} className="text-[hsl(var(--primary))]" /> A/B Tests
          </h1>
          <p className="font-bold text-gray-600 mt-2">Experiment with features, content, and pricing.</p>
        </div>
        <button className="neo-button bg-black text-white">
          <Plus size={20} className="mr-2" /> Create Test
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <div className="animate-pulse h-40 bg-gray-200 neo-border col-span-full" /> : tests.map(test => (
          <div key={test.id} className="neo-card bg-white flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-black truncate">{test.name}</h3>
              <span className={`neo-badge ${test.status === 'running' ? 'bg-[hsl(var(--secondary))]' : 'bg-gray-200'}`}>
                {test.status?.toUpperCase()}
              </span>
            </div>
            <p className="font-bold text-gray-600 text-sm mb-6 flex-1 line-clamp-2">{test.description}</p>
            
            <div className="flex gap-2 mt-auto pt-4 border-t-[3px] border-black border-dashed">
              <Link to={`/odysseus-admin/ab-tests/${test.id}/results`} className="neo-button bg-[hsl(var(--accent))] flex-1 text-sm py-2 px-0 text-center"><BarChart2 size={16} className="mr-1"/> Results</Link>
              <button onClick={() => toggleTest(test.id, test.status)} className="neo-button bg-gray-100 p-2">
                {test.status === 'running' ? <Pause size={16}/> : <Play size={16}/>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ABTestsPage;
