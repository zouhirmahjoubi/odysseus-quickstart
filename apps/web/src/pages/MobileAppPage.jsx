
import React from 'react';
import { Helmet } from 'react-helmet';
import { Smartphone, Zap, Bell, WifiOff, Fingerprint, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const MobileAppPage = () => {
  const features = [
    { icon: Bell, title: 'Push Notifications', desc: 'Real-time alerts for workflow completions and errors.' },
    { icon: WifiOff, title: 'Offline Mode', desc: 'Access cached reports and agent logs without internet.' },
    { icon: Fingerprint, title: 'Biometric Auth', desc: 'Secure access using FaceID or Fingerprint scanning.' },
    { icon: Activity, title: 'Mobile Analytics', desc: 'Live dashboard of your workspace performance.' }
  ];

  return (
    <div className="w-full">
      <Helmet><title>Mobile App - OdysseusAI</title></Helmet>
      
      <section className="bg-[hsl(var(--background))] py-20 px-4 border-b-[3px] border-black">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <span className="neo-badge bg-[hsl(var(--primary))] mb-6 text-sm px-4 py-1">AVAILABLE NOW</span>
            <h1 className="text-5xl md:text-7xl font-black space-grotesk leading-tight mb-6">
              Your Agents.<br/>In Your Pocket.
            </h1>
            <p className="text-xl font-bold text-gray-700 mb-8 max-w-lg">
              Manage workflows, monitor performance, and control AI agents from anywhere with the native iOS and Android app.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="neo-button bg-black text-white px-8 py-4 text-lg">App Store</button>
              <button className="neo-button bg-[hsl(var(--secondary))] text-black px-8 py-4 text-lg">Google Play</button>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-64 h-[500px] border-[3px] border-black bg-white shadow-[12px_12px_0px_0px_#FF9500] rounded-[2rem] p-4 relative flex flex-col">
              <div className="w-32 h-6 bg-black rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2"></div>
              <div className="flex-1 bg-[hsl(var(--background))] border-[3px] border-black mt-4 flex items-center justify-center">
                <Smartphone size={64} className="text-gray-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-16">Mobile-First Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="neo-card bg-[hsl(var(--background))] hover:-translate-y-2 transition-transform">
                <div className="w-12 h-12 bg-[hsl(var(--accent))] border-[3px] border-black flex items-center justify-center mb-4">
                  <f.icon size={24} />
                </div>
                <h3 className="text-xl font-black mb-2">{f.title}</h3>
                <p className="font-bold text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MobileAppPage;
