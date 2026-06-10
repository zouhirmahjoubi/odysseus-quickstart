
import React from 'react';
import { Helmet } from 'react-helmet';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyticsReports = () => {
  const lineData = [
    { name: 'Week 1', sales: 4000, traffic: 2400 },
    { name: 'Week 2', sales: 3000, traffic: 1398 },
    { name: 'Week 3', sales: 2000, traffic: 9800 },
    { name: 'Week 4', sales: 2780, traffic: 3908 },
    { name: 'Week 5', sales: 1890, traffic: 4800 },
    { name: 'Week 6', sales: 2390, traffic: 3800 },
    { name: 'Week 7', sales: 3490, traffic: 4300 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet><title>Analytics - Admin</title></Helmet>
      
      <div className="flex justify-between items-center mb-8 border-b-3 border-black pb-4">
        <h1 className="text-4xl font-black space-grotesk">Analytics Reports</h1>
        <button className="neo-button-secondary py-2 px-4 text-sm">Export PDF</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="neo-card bg-white p-6">
          <h2 className="text-xl font-black space-grotesk mb-6 border-b-2 border-black pb-2">Sales vs Traffic</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontFamily: 'Space Grotesk', fontWeight: 'bold', fontSize: 12}} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fontFamily: 'Space Grotesk', fontWeight: 'bold', fontSize: 12}} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fontFamily: 'Space Grotesk', fontWeight: 'bold', fontSize: 12}} />
                <Tooltip contentStyle={{ border: '3px solid black', borderRadius: '0', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }} />
                <Line yAxisId="left" type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={4} activeDot={{ r: 8, stroke: 'black', strokeWidth: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="traffic" stroke="hsl(var(--secondary))" strokeWidth={4} activeDot={{ r: 8, stroke: 'black', strokeWidth: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="neo-card bg-[hsl(var(--background))] p-6">
          <h2 className="text-xl font-black space-grotesk mb-6 border-b-2 border-black pb-2">Top Categories</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{name:'AI', val:85},{name:'Web', val:45},{name:'DevOps', val:65},{name:'Security', val:30}]} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fontFamily: 'Space Grotesk', fontWeight: 'bold'}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontFamily: 'Space Grotesk', fontWeight: 'bold'}} width={80}/>
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ border: '3px solid black', borderRadius: '0', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }} />
                <Bar dataKey="val" fill="black" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReports;
