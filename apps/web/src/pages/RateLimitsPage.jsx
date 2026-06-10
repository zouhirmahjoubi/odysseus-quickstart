
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Activity, Zap, HardDrive, Cpu } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const RateLimitsPage = () => {
  const { user } = useAuth();
  const [limits, setLimits] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchLimits = async () => {
      try {
        const res = await apiServerClient.fetch('/rate-limits');
        if (res.ok) {
          const data = await res.json();
          setLimits(data);
        }
      } catch (err) {
        toast.error('Failed to load quota information');
      } finally {
        setLoading(false);
      }
    };
    fetchLimits();
  }, [user]);

  const calculatePercentage = (usage, limit) => {
    if (!limit) return 0;
    return Math.min(Math.round((usage / limit) * 100), 100);
  };

  const getProgressColor = (percent) => {
    if (percent > 90) return 'bg-[hsl(var(--status-error))]';
    if (percent > 75) return 'bg-[hsl(var(--status-warning))]';
    return 'bg-[var(--primary-accent)]';
  };

  const renderLimitCard = (title, icon, usageKey, limitKey, format = val => val) => {
    const usage = limits?.[usageKey] || 0;
    const limit = limits?.[limitKey] || 100; // Mock default limit if not provided
    const percent = calculatePercentage(usage, limit);
    const color = getProgressColor(percent);

    return (
      <div className="neo-card bg-white flex flex-col h-full">
        <div className="flex items-center gap-3 mb-6 border-b-[3px] border-black pb-3">
          <div className="w-10 h-10 bg-[var(--secondary-accent)] neo-border flex items-center justify-center">
            {icon}
          </div>
          <h3 className="font-black text-xl space-grotesk">{title}</h3>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between font-bold text-sm mb-2">
            <span>Usage</span>
            <span>{format(usage)} / {format(limit)}</span>
          </div>
          <div className="h-4 w-full bg-gray-200 neo-border overflow-hidden">
            <div className={`h-full ${color} border-r-[3px] border-black transition-all duration-500`} style={{ width: `${percent}%` }}></div>
          </div>
        </div>
        
        <p className="text-sm font-bold text-gray-500 mt-auto">
          {percent >= 100 ? 'Quota Exceeded' : `${100 - percent}% remaining`}
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Helmet><title>Rate Limits & Quotas - OdysseusAI</title></Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b-[3px] border-black pb-6">
        <div>
          <h1 className="text-4xl font-black space-grotesk flex items-center gap-3">
            <Zap size={36} className="text-[var(--primary-accent)]" /> Quotas & Limits
          </h1>
          <p className="font-bold text-gray-600 mt-2">Monitor your API usage and service quotas.</p>
        </div>
        <button className="neo-button bg-black text-white mt-4 md:mt-0">Upgrade Plan</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-gray-200 neo-border"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {renderLimitCard('API Requests (Daily)', <Activity size={20} />, 'requests_per_day_usage', 'requests_per_day', val => val.toLocaleString())}
          {renderLimitCard('Test Runs (Daily)', <Cpu size={20} />, 'test_runs_per_day_usage', 'test_runs_per_day')}
          {renderLimitCard('Agent Installs (Monthly)', <HardDrive size={20} />, 'agent_installations_usage', 'agent_installations_per_month')}
        </div>
      )}

      <div className="neo-card bg-[var(--background-light)] p-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black space-grotesk mb-2">Need Higher Limits?</h2>
          <p className="font-bold text-gray-600">Enterprise plans offer custom rate limits and dedicated support.</p>
        </div>
        <button className="neo-button bg-[var(--primary-accent)] text-black whitespace-nowrap text-lg px-8">Contact Sales</button>
      </div>
    </div>
  );
};

export default RateLimitsPage;
