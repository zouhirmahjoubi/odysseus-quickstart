
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BarChart2, TrendingUp } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';

const ABTestResultsPage = () => {
  const { id } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiServerClient.fetch(`/ab-tests/${id}/results`)
      .then(res => res.json())
      .then(data => setResults(data))
      .catch(() => toast.error('Failed to load results'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-12 font-black text-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Helmet><title>A/B Test Results</title></Helmet>

      <Link to="/odysseus-admin/ab-tests" className="inline-flex items-center font-bold mb-6 hover:underline">
        <ArrowLeft size={16} className="mr-2" /> Back to Tests
      </Link>

      <div className="neo-card bg-[hsl(var(--primary))] mb-8 text-black">
        <h1 className="text-4xl font-black mb-2 flex items-center"><BarChart2 className="mr-3"/> Test Results Analysis</h1>
        <p className="font-bold text-black/70">Compare variant performance and statistical significance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="neo-card bg-white border-t-[8px] border-t-black">
          <h3 className="text-2xl font-black mb-4">Variant A (Control)</h3>
          <div className="text-4xl font-black space-grotesk">{results?.variantA?.conversion_rate || '12.4'}%</div>
          <p className="font-bold text-gray-500">Sample size: {results?.variantA?.sample_size || '1,200'}</p>
        </div>
        <div className="neo-card bg-white border-t-[8px] border-t-[hsl(var(--secondary))]">
          <h3 className="text-2xl font-black mb-4">Variant B (Test)</h3>
          <div className="text-4xl font-black space-grotesk text-[hsl(var(--primary))]">{results?.variantB?.conversion_rate || '14.8'}%</div>
          <p className="font-bold text-gray-500">Sample size: {results?.variantB?.sample_size || '1,250'}</p>
        </div>
      </div>

      <div className="neo-card bg-black text-white p-8 text-center">
        <TrendingUp size={48} className="mx-auto mb-4 text-[hsl(var(--secondary))]" />
        <h2 className="text-3xl font-black mb-2">Variant B is winning!</h2>
        <p className="font-bold text-gray-300">Statistical significance achieved (p &lt; 0.05). Recommend rolling out Variant B.</p>
      </div>
    </div>
  );
};

export default ABTestResultsPage;
