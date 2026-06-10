
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { BarChart3, TrendingUp, Users, Activity, ExternalLink } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

// Mock Recharts for layout without failing on missing props if recharts isn't strictly available in env yet
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'Mon', calls: 4000 },
  { name: 'Tue', calls: 3000 },
  { name: 'Wed', calls: 2000 },
  { name: 'Thu', calls: 2780 },
  { name: 'Fri', calls: 1890 },
  { name: 'Sat', calls: 2390 },
  { name: 'Sun', calls: 3490 },
];

const InsightsPage = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      apiServerClient.fetch('/insights', { headers: { 'x-user-id': user.id } })
        .then(res => res.json())
        .then(data => setInsights(data))
        .catch(() => toast.error('Failed to load insights'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const StatCard = ({ title, value, trend, icon: Icon, color }) => (
    <div className={`neo-card bg-white border-t-[8px] ${color}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-gray-500 uppercase tracking-wide text-xs">{title}</h3>
        <div className="p-2 neo-border bg-[var(--background-light)]"><Icon size={18} /></div>
      </div>
      <div className="text-4xl font-black space-grotesk mb-2">{value}</div>
      <div className={`text-sm font-bold flex items-center ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        <TrendingUp size={16} className={`mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
        {Math.abs(trend)}% from last week
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Helmet><title>Workspace Insights - OdysseusAI</title></Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b-[3px] border-black pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-black space-grotesk flex items-center gap-3">
            <BarChart3 size={36} className="text-[var(--primary-accent)]" /> Workspace Insights
          </h1>
          <p className="font-bold text-gray-600 mt-2">Data-driven analysis of your agent ecosystem.</p>
        </div>
        <div className="flex gap-4">
          <select className="neo-input w-40 font-bold bg-white text-sm">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total API Calls" value="124.5K" trend={12.5} icon={Activity} color="border-t-[var(--primary-accent)]" />
        <StatCard title="Active Agents" value="24" trend={8.2} icon={BarChart3} color="border-t-[var(--secondary-accent)]" />
        <StatCard title="Team Members" value="12" trend={0} icon={Users} color="border-t-[var(--tertiary-accent)]" />
        <StatCard title="Cost Saved" value="$4.2K" trend={-2.4} icon={TrendingUp} color="border-t-black" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 neo-card bg-white p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b-[3px] border-black">
            <h2 className="text-xl font-black space-grotesk">API Usage Trends</h2>
          </div>
          <div className="p-6 h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000" vertical={false} />
                <XAxis dataKey="name" stroke="#000" tick={{fontFamily: 'Space Grotesk', fontWeight: 'bold'}} />
                <YAxis stroke="#000" tick={{fontFamily: 'Space Grotesk', fontWeight: 'bold'}} />
                <Tooltip contentStyle={{ border: '3px solid #000', borderRadius: '0', boxShadow: '4px 4px 0px 0px #000' }} />
                <Line type="monotone" dataKey="calls" stroke="var(--primary-accent)" strokeWidth={4} dot={{ strokeWidth: 3, r: 6, fill: '#000' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-8">
          <div className="neo-card bg-[var(--background-light)]">
            <h2 className="text-xl font-black space-grotesk mb-4 flex items-center"><Activity size={20} className="mr-2"/> Top Agents</h2>
            <div className="space-y-4">
              {['Data Scraper Pro', 'Support Bot AI', 'Code Reviewer'].map((agent, i) => (
                <div key={i} className="flex items-center justify-between font-bold border-b border-black pb-2 last:border-0 last:pb-0">
                  <span className="flex items-center"><span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs mr-3">{i+1}</span> {agent}</span>
                  <span>{100 - i*20}K calls</span>
                </div>
              ))}
            </div>
            <button className="w-full text-sm font-bold mt-6 flex items-center justify-center hover:underline">View All <ExternalLink size={14} className="ml-1"/></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
