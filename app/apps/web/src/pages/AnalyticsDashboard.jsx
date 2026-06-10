
import React from 'react';
import { Helmet } from 'react-helmet';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Download } from 'lucide-react';

const data = [
  { name: 'Mon', views: 4000, users: 2400 },
  { name: 'Tue', views: 3000, users: 1398 },
  { name: 'Wed', views: 2000, users: 9800 },
  { name: 'Thu', views: 2780, users: 3908 },
  { name: 'Fri', views: 1890, users: 4800 },
  { name: 'Sat', views: 2390, users: 3800 },
  { name: 'Sun', views: 3490, users: 4300 },
];

const trafficData = [
  { name: 'Direct', value: 400 },
  { name: 'Social', value: 300 },
  { name: 'Search', value: 300 },
  { name: 'Referral', value: 200 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

const AnalyticsDashboard = () => {
  return (
    <div className="space-y-8">
      <Helmet><title>Analytics | Admin</title></Helmet>

      <div className="flex justify-between items-center bg-card neo-border p-6 shadow-[4px_4px_0px_0px_hsl(var(--shadow-color))]">
        <h1 className="text-3xl font-black uppercase">Analytics</h1>
        <button className="neo-button bg-card py-2">
          <Download size={20} className="mr-2" /> Export
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="neo-card p-6 bg-card">
          <h3 className="font-black uppercase text-sm mb-2">Page Views</h3>
          <p className="text-4xl font-black">124.5k</p>
          <span className="text-secondary font-bold text-sm">+14.2%</span>
        </div>
        <div className="neo-card p-6 bg-card">
          <h3 className="font-black uppercase text-sm mb-2">Unique Visitors</h3>
          <p className="text-4xl font-black">48.2k</p>
          <span className="text-secondary font-bold text-sm">+8.1%</span>
        </div>
        <div className="neo-card p-6 bg-card">
          <h3 className="font-black uppercase text-sm mb-2">Bounce Rate</h3>
          <p className="text-4xl font-black">34.2%</p>
          <span className="text-destructive font-bold text-sm">-2.4%</span>
        </div>
        <div className="neo-card p-6 bg-card">
          <h3 className="font-black uppercase text-sm mb-2">Session Duration</h3>
          <p className="text-4xl font-black">4m 12s</p>
          <span className="text-secondary font-bold text-sm">+1.2m</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="neo-card p-6">
          <h2 className="text-xl font-black uppercase mb-6 border-b-4 border-border pb-4">Views & Users Over Time</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" className="font-bold" />
                <YAxis stroke="hsl(var(--foreground))" className="font-bold" />
                <Tooltip contentStyle={{ border: '4px solid hsl(var(--border))', borderRadius: '8px', fontWeight: 'bold' }} />
                <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={4} dot={{ strokeWidth: 4 }} />
                <Line type="monotone" dataKey="users" stroke="hsl(var(--accent))" strokeWidth={4} dot={{ strokeWidth: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="neo-card p-6">
          <h2 className="text-xl font-black uppercase mb-6 border-b-4 border-border pb-4">Traffic Sources</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={trafficData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" stroke="hsl(var(--border))" strokeWidth={4}>
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ border: '4px solid hsl(var(--border))', borderRadius: '8px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4 font-bold text-sm">
            {trafficData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-border" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
