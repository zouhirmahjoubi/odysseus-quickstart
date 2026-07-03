
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calculator, Zap, Settings, Cpu, HardDrive } from 'lucide-react';
import { toast } from 'sonner';

const CalculatorSidebar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem('adminMode') === 'true') {
      setIsAdmin(true);
    }

    let keys = '';
    const handleKeyDown = async (e) => {
      keys += e.key;
      if (keys.length > 30) keys = keys.slice(-30);
      
      if (keys.includes('admin')) {
        const msgBuffer = new TextEncoder().encode('ActivateOdysseusMode');
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        if (hashHex === 'ca45e99818aa5e197da9319688df5529f8c6b41c60424a87311746c671609f58') {
          localStorage.setItem('adminMode', 'true');
          setIsAdmin(true);
          keys = ''; 
          toast.success('Admin mode activated');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isActive = (path) => location.pathname === path;

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <aside className="w-[300px] h-screen sticky top-0 bg-[hsl(var(--background))] border-r-[3px] border-[hsl(var(--border))] flex flex-col p-6 overflow-y-auto z-40">
      <Link to="/" className="inline-block mb-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">
        <div className="bg-[hsl(var(--card))] border-neo shadow-neo p-4 font-black text-2xl tracking-tighter hover:-translate-y-1 transition-transform">
          Odysseus<span className="text-[hsl(var(--primary))]">AI</span>
        </div>
      </Link>

      <nav className="flex flex-col gap-4" aria-label="Calculator Navigation">
        <button 
          onClick={() => scrollToSection('hardware-token')}
          className={`border-neo p-3 font-bold flex items-center gap-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 text-left ${isActive('/odysseus-calculator') ? 'bg-[hsl(var(--secondary))] shadow-neo' : 'bg-[hsl(var(--card))] hover:bg-[hsl(var(--secondary))]'}`}
        >
          <Calculator size={20} aria-hidden="true" />
          Hardware & Token Calc
        </button>
        
        <button 
          onClick={() => scrollToSection('inference-speed')}
          className="bg-[hsl(var(--card))] border-neo p-3 font-bold flex items-center gap-3 hover:bg-[hsl(var(--secondary))] transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          <Zap size={20} aria-hidden="true" />
          Inference Speed
        </button>
        
        <button 
          onClick={() => scrollToSection('training-estimator')}
          className="bg-[hsl(var(--card))] border-neo p-3 font-bold flex items-center gap-3 hover:bg-[hsl(var(--secondary))] transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          <Cpu size={20} aria-hidden="true" />
          Training Estimator
        </button>
        
        <button 
          onClick={() => scrollToSection('storage-calculator')}
          className="bg-[hsl(var(--card))] border-neo p-3 font-bold flex items-center gap-3 hover:bg-[hsl(var(--secondary))] transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          <HardDrive size={20} aria-hidden="true" />
          Storage Requirements
        </button>
      </nav>

      {isAdmin && (
        <div className="mt-auto pt-8">
          <Link 
            to="/zouhirm/dashboard"
            className="bg-[hsl(var(--card))] border-neo shadow-neo p-3 font-bold flex items-center gap-3 cursor-pointer hover:bg-[hsl(var(--secondary))] transition-colors text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            <Settings size={20} aria-hidden="true" /> 
            Control Panel
          </Link>
        </div>
      )}
    </aside>
  );
};

export default CalculatorSidebar;
