
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar.jsx';

const AdminLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-[hsl(var(--background))] text-[hsl(var(--foreground))] selection:bg-[hsl(var(--accent))] selection:text-black font-sans">
      <AdminSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      
      <main className="flex-1 lg:ml-72 min-h-screen overflow-x-hidden flex flex-col w-full">
        {/* Mobile Header for Admin */}
        <header className="lg:hidden h-[70px] border-b-[4px] border-black flex items-center px-4 bg-[hsl(var(--primary))] shrink-0 sticky top-0 z-30">
          <button 
            onClick={() => setIsMobileOpen(true)} 
            className="p-[8px] border-[3px] border-black rounded-[8px] bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all touch-target"
            aria-label="Open Admin Menu"
          >
            <Menu size={24} strokeWidth={3} />
          </button>
          <span className="ml-4 font-black uppercase text-lg tracking-wide text-black">Admin Console</span>
        </header>
        
        <div className="p-4 md:p-8 w-full max-w-[1600px] mx-auto flex-1">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
