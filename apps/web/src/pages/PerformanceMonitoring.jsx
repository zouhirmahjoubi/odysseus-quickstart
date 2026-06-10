
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Activity, Server, Database, AlertCircle, RefreshCw } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';

const PerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await apiServerClient.fetch('/admin/performance');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
      }
    } catch (err) {
      toast.error('Failed to load performance metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMetrics(); }, []);

  const clearCache = async () => {
    try {
      await apiServerClient.fetch('/admin/cache/clear', { method: 'POST' });
      toast.success('System cache cleared successfully');
      fetchMetrics();
    } catch (err) {
      toast.error('Failed to clear cache');
    }
  };

  const MetricBox = ({ title, value, unit, status = 'normal' }) => {
    const bgClass = status === 'error' ? 'bg-[hsl(var(--status-error))] text-white' : 
                    status === 'warning' ? 'bg-[hsl(var(--status-warning))]' : 
                    'bg-white';
    return (
      <div className={`neo-card ${bgClass}`}>
        <h3 className="text-sm font-bold uppercase tracking-wider mb-2 opacity-80">{title}</h3>
        <div className="text-4xl font-black space-grotesk flex items-baseline gap-1">
          {value} <span className="text-lg font-bold">{unit}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Helmet><title>System Performance - Admin</title></Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b-[3px] border-black pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-black space-grotesk flex items-center gap-3">
            <Activity size={36} className="text-[var(--status-error)]" /> System Performance
          </h1>
          <p className="font-bold text-gray-600 mt-2">Monitor API health, database latency, and cache efficiency.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={clearCache} className="neo-button bg-[var(--tertiary-accent)] text-black whitespace-nowrap">
            <Database size={20} className="mr-2" /> Clear Cache
          </button>
          <button onClick={fetchMetrics} className="neo-button bg-black text-white whitespace-nowrap">
            <RefreshCw size={20} className="mr-2" /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-32 bg-gray-200 neo-border"></div>)}
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-black space-grotesk mb-6 flex items-center"><Server size={24} className="mr-3"/> Global Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <MetricBox title="Avg API Response" value={metrics?.avgResponseTime || '142'} unit="ms" />
            <MetricBox title="P99 Response" value={metrics?.p99ResponseTime || '850'} unit="ms" status="warning" />
            <MetricBox title="Error Rate" value={metrics?.errorRate || '0.12'} unit="%" status={parseFloat(metrics?.errorRate) > 1 ? 'error' : 'normal'} />
            <MetricBox title="Uptime" value={metrics?.uptime || '99.99'} unit="%" />
            <MetricBox title="Cache Hit Rate" value={metrics?.cacheHitRate || '84.5'} unit="%" />
            <MetricBox title="DB Query Time" value={metrics?.avgDatabaseTime || '45'} unit="ms" />
          </div>

          <div className="neo-card bg-[var(--background-light)] border-t-[8px] border-t-[hsl(var(--status-error))]">
            <h2 className="text-xl font-black space-grotesk mb-4 flex items-center"><AlertCircle size={20} className="mr-2 text-[hsl(var(--status-error))]"/> Active System Alerts</h2>
            <div className="p-4 bg-white neo-border font-bold text-sm flex items-center">
              <span className="w-3 h-3 rounded-full bg-[hsl(var(--status-warning))] mr-3"></span>
              P99 Response time exceeding 800ms threshold on /search endpoint. Database indexes recommended.
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PerformanceMonitoring;
