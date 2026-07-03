
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const NeuralGridAdminDashboard = () => {
  return (
    <>
      <Helmet>
        <title>System_Dashboard | Neural Grid</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=JetBrains+Mono:wght@400;700;900&family=Space+Grotesk:wght@500;700;900&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet" />
      </Helmet>

      <style>{`
        .blueprint-grid {
          background-color: #1a1a1a;
          background-size: 40px 40px;
          background-image:
            linear-gradient(to right, rgba(0, 215, 254, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 215, 254, 0.05) 1px, transparent 1px);
        }
        .neo-shadow-sm { box-shadow: 4px 4px 0px 0px #00d7fe; }
        .neo-shadow-md { box-shadow: 8px 8px 0px 0px #ff6b35; }
        .neo-shadow-lg { box-shadow: 12px 12px 0px 0px #7c5800; }
        
        .neo-shadow-sm-hover:hover { box-shadow: 6px 6px 0px 0px #00d7fe; transform: translate(-2px, -2px); }
        .neo-shadow-md-hover:hover { box-shadow: 10px 10px 0px 0px #ff6b35; transform: translate(-2px, -2px); }
        
        .neo-shadow-active:active { box-shadow: 0px 0px 0px 0px transparent !important; transform: translate(4px, 4px) !important; }

        .font-space { font-family: 'Space Grotesk', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-inter { font-family: 'Inter', sans-serif; }

        /* Custom Scrollbar for inner elements */
        .ng-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .ng-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-left: 2px solid #00d7fe;
        }
        .ng-scrollbar::-webkit-scrollbar-thumb {
          background: #ff6b35;
          border: 2px solid #1a1a1a;
        }
      `}</style>

      {/* MOBILE WARNING (Hidden on md+) */}
      <div className="flex md:hidden h-screen w-full bg-[#1a1a1a] text-[#00d7fe] items-center justify-center p-6 text-center font-mono relative z-50">
        <div className="border-4 border-[#ff6b35] bg-[#1a1a1a] p-8 neo-shadow-md flex flex-col items-center">
          <span className="material-symbols-outlined text-[64px] mb-4 text-[#ff6b35]">warning</span>
          <h1 className="text-2xl font-black mb-2 uppercase text-[#ffffff]">Resolution Block</h1>
          <p className="text-[#00d7fe] mb-8 font-bold">Neural Grid interface requires terminal resolution (MD+). Please access via desktop terminal.</p>
          <Link to="/odysseus-admin" className="bg-[#ff6b35] text-[#1a1a1a] px-6 py-3 font-black uppercase tracking-widest border-2 border-[#ff6b35] neo-shadow-sm transition-all active:translate-y-1 active:translate-x-1 active:shadow-none">
            Return to Standard Admin
          </Link>
        </div>
      </div>

      {/* MAIN DESKTOP LAYOUT (Hidden on mobile) */}
      <div className="hidden md:flex h-screen w-full bg-[#1a1a1a] text-[#ffffff] font-inter blueprint-grid overflow-hidden">
        
        {/* SIDEBAR */}
        <aside className="w-72 border-r-4 border-[#00d7fe] bg-[#1a1a1a] flex flex-col z-20 shadow-[4px_0_15px_rgba(0,0,0,0.5)]">
          {/* Logo Area */}
          <div className="p-6 border-b-4 border-[#00d7fe]">
            <Link to="/odysseus-admin" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-[#00d7fe] border-2 border-[#ffffff] flex items-center justify-center neo-shadow-md transition-all group-hover:translate-x-1">
                <span className="material-symbols-outlined text-[#1a1a1a] font-black text-3xl">grid_view</span>
              </div>
              <div className="flex flex-col">
                <span className="font-space font-black text-xl tracking-tighter uppercase text-[#00d7fe]">System_</span>
                <span className="font-space font-black text-xl tracking-tighter uppercase text-[#ffffff] leading-none">Dashboard</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-4 overflow-y-auto ng-scrollbar">
            <p className="font-mono text-xs font-bold text-[#ff6b35] mb-2 uppercase tracking-widest">Core_Modules</p>
            
            {[
              { icon: 'dashboard', label: 'Dashboard', active: true },
              { icon: 'storefront', label: 'Marketplace', active: false },
              { icon: 'memory', label: 'Compute', active: false },
              { icon: 'database', label: 'Storage', active: false },
              { icon: 'settings', label: 'Settings', active: false }
            ].map((nav, idx) => (
              <a href="#" key={idx} className={`flex items-center gap-4 px-4 py-3 border-2 transition-all font-space font-bold uppercase tracking-wider ${nav.active ? 'bg-[#7c5800] border-[#ffffff] text-[#ffffff] neo-shadow-sm translate-x-2' : 'border-transparent text-[#00d7fe] hover:border-[#00d7fe] hover:bg-[rgba(0,215,254,0.1)]'}`}>
                <span className="material-symbols-outlined">{nav.icon}</span>
                <span>{nav.label}</span>
              </a>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-6 border-t-4 border-[#00d7fe] bg-[#1a1a1a]">
            <div className="flex items-center gap-4 border-2 border-[#ff6b35] p-3 neo-shadow-md">
              <div className="relative">
                <div className="w-10 h-10 bg-[#7c5800] border-2 border-[#ffffff] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#ffffff]">admin_panel_settings</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00d7fe] border-2 border-[#1a1a1a] rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-mono font-bold text-sm text-[#ffffff]">ROOT_USER</span>
                <span className="font-mono text-xs text-[#00d7fe]">SYS_ONLINE</span>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
          
          {/* TOP HEADER */}
          <header className="h-24 border-b-4 border-[#00d7fe] bg-[#1a1a1a]/95 backdrop-blur flex items-center justify-between px-8 z-30 flex-shrink-0">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-[#ff6b35] text-3xl animate-spin-slow" style={{animationDuration: '4s'}}>settings_input_component</span>
              <h2 className="font-space font-black text-2xl uppercase tracking-widest text-[#ffffff]">Neural_Grid <span className="text-[#00d7fe]">/ Overview</span></h2>
            </div>
            <div className="flex items-center gap-6">
              <div className="font-mono text-sm font-bold flex flex-col items-end">
                <span className="text-[#00d7fe]">Uplink: STABLE</span>
                <span className="text-[#ff6b35]">Latency: 12ms</span>
              </div>
              <div className="flex gap-4">
                <button className="bg-[#1a1a1a] text-[#00d7fe] border-2 border-[#00d7fe] px-4 py-2 font-mono font-bold uppercase tracking-wider flex items-center gap-2 neo-shadow-sm transition-all hover:bg-[#00d7fe] hover:text-[#1a1a1a] neo-shadow-active">
                  <span className="material-symbols-outlined text-lg">sync</span> Sync
                </button>
                <button className="bg-[#ff6b35] text-[#1a1a1a] border-2 border-[#ff6b35] px-4 py-2 font-mono font-black uppercase tracking-wider flex items-center gap-2 neo-shadow-md transition-all hover:bg-[#ffffff] hover:border-[#ffffff] neo-shadow-active">
                  <span className="material-symbols-outlined text-lg">rocket_launch</span> Deploy
                </button>
              </div>
            </div>
          </header>

          {/* SCROLLABLE CONTENT */}
          <main className="flex-1 overflow-y-auto p-8 ng-scrollbar space-y-8 pb-20">
            
            {/* STAT CARDS ROW */}
            <section>
              <h3 className="font-mono font-bold text-[#ff6b35] mb-4 uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined">data_usage</span> Publishing_Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {[
                  { label: 'Active_Products', value: '142', icon: 'inventory_2', color: '#00d7fe', bg: '#1a1a1a' },
                  { label: 'Transmissions', value: '8,432', icon: 'podcasts', color: '#1a1a1a', bg: '#ff6b35' },
                  { label: 'Node_Integrity', value: '99.9%', icon: 'security', color: '#ffffff', bg: '#7c5800' },
                  { label: 'Network_Load', value: '42%', icon: 'speed', color: '#1a1a1a', bg: '#00d7fe' }
                ].map((stat, idx) => (
                  <div key={idx} className="border-3 border-[#ffffff] p-6 neo-shadow-sm neo-shadow-sm-hover transition-all flex flex-col gap-4 relative overflow-hidden" style={{ backgroundColor: stat.bg }}>
                    <div className="flex justify-between items-start z-10 relative">
                      <span className="font-space font-black text-sm uppercase tracking-wider" style={{ color: stat.color }}>{stat.label}</span>
                      <span className="material-symbols-outlined text-3xl" style={{ color: stat.color }}>{stat.icon}</span>
                    </div>
                    <div className="font-mono font-black text-5xl z-10 relative" style={{ color: stat.color }}>
                      {stat.value}
                    </div>
                    {/* Decorative background element */}
                    <span className="material-symbols-outlined absolute -bottom-6 -right-6 text-9xl opacity-20 z-0 pointer-events-none" style={{ color: stat.color }}>{stat.icon}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* BENTO GRID: Main Content Management & Visualizer */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* CONTENT MANAGEMENT (Col 1 & 2) */}
              <div className="xl:col-span-2 space-y-6">
                
                {/* Actions Row */}
                <div className="flex justify-between items-end border-b-2 border-[#00d7fe] pb-4">
                  <h3 className="font-mono font-bold text-[#ff6b35] uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined">folder_managed</span> Content_Management
                  </h3>
                  <div className="flex gap-3">
                    <button className="bg-[#1a1a1a] text-[#ffffff] border-2 border-[#ffffff] px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#ffffff] hover:text-[#1a1a1a] transition-colors">
                      <span className="material-symbols-outlined text-sm">add_box</span> Create_Transmission
                    </button>
                    <button className="bg-[#7c5800] text-[#ffffff] border-2 border-[#7c5800] px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#ff6b35] hover:border-[#ff6b35] hover:text-[#1a1a1a] transition-colors">
                      <span className="material-symbols-outlined text-sm">delete_sweep</span> Purge_Cache
                    </button>
                  </div>
                </div>

                {/* Table container */}
                <div className="border-3 border-[#00d7fe] bg-[#1a1a1a] neo-shadow-lg overflow-hidden">
                  <div className="bg-[#00d7fe] px-4 py-2 font-space font-black uppercase text-[#1a1a1a] flex justify-between items-center">
                    <span>Active_Transmissions_Log</span>
                    <span className="material-symbols-outlined">sort</span>
                  </div>
                  <div className="overflow-x-auto ng-scrollbar">
                    <table className="w-full text-left border-collapse font-mono text-sm">
                      <thead>
                        <tr className="border-b-2 border-[#00d7fe] text-[#00d7fe]">
                          <th className="p-4 font-bold uppercase tracking-wider">ID</th>
                          <th className="p-4 font-bold uppercase tracking-wider">Designation</th>
                          <th className="p-4 font-bold uppercase tracking-wider">Status</th>
                          <th className="p-4 font-bold uppercase tracking-wider">Timestamp</th>
                          <th className="p-4 font-bold uppercase tracking-wider text-right">Execute</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 'TX-001', name: 'Quantum_Heuristics_v2', status: 'ONLINE', time: '14:32:00', color: '#00d7fe' },
                          { id: 'TX-002', name: 'Market_Pulse_Override', status: 'STANDBY', time: '12:15:44', color: '#ff6b35' },
                          { id: 'TX-003', name: 'Core_Logic_Update', status: 'ONLINE', time: '09:00:12', color: '#00d7fe' },
                          { id: 'TX-004', name: 'Subroutine_Alpha', status: 'OFFLINE', time: '01:22:05', color: '#7c5800' },
                        ].map((row, idx) => (
                          <tr key={idx} className="border-b border-[rgba(0,215,254,0.2)] hover:bg-[rgba(0,215,254,0.05)] transition-colors">
                            <td className="p-4 text-[#ffffff]">{row.id}</td>
                            <td className="p-4 font-bold text-[#ffffff]">{row.name}</td>
                            <td className="p-4">
                              <span className="px-2 py-1 text-xs border border-current font-bold" style={{ color: row.color, backgroundColor: `${row.color}20` }}>
                                {row.status}
                              </span>
                            </td>
                            <td className="p-4 text-[#ffffff] opacity-70">{row.time}</td>
                            <td className="p-4 text-right">
                              <button className="p-1 border border-[#00d7fe] text-[#00d7fe] hover:bg-[#00d7fe] hover:text-[#1a1a1a] transition-colors inline-flex">
                                <span className="material-symbols-outlined text-sm">terminal</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* SYSTEM VISUALIZER (Col 3) */}
              <div className="space-y-6">
                <h3 className="font-mono font-bold text-[#ff6b35] mb-4 uppercase tracking-widest flex items-center gap-2 border-b-2 border-[#00d7fe] pb-4">
                  <span className="material-symbols-outlined">memory_alt</span> System_Visualizer
                </h3>
                
                <div className="border-3 border-[#ff6b35] bg-[#1a1a1a] p-6 neo-shadow-md h-[400px] flex flex-col relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00d7fe 2px, #00d7fe 4px)' }}></div>
                  
                  <div className="font-mono text-xs text-[#00d7fe] mb-4 z-10 flex justify-between">
                    <span>GRID_ALLOCATION_MATRIX</span>
                    <span className="animate-pulse text-[#ff6b35]">REC</span>
                  </div>

                  <div className="flex-1 flex flex-col justify-center space-y-6 z-10">
                    {[
                      { label: 'CPU_THREADS', pct: '88%', fill: '#ff6b35' },
                      { label: 'MEM_BUFFER', pct: '64%', fill: '#00d7fe' },
                      { label: 'I/O_STREAM', pct: '21%', fill: '#7c5800' }
                    ].map((bar, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between font-mono text-xs font-bold text-[#ffffff]">
                          <span>{bar.label}</span>
                          <span>{bar.pct}</span>
                        </div>
                        <div className="h-4 w-full border-2 border-[#ffffff] bg-[#1a1a1a] p-[2px]">
                          <div className="h-full bg-current" style={{ width: bar.pct, color: bar.fill }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 border-t-2 border-dashed border-[#00d7fe] z-10">
                    <p className="font-mono text-[10px] text-[#00d7fe] leading-tight opacity-80">
                      &gt; SYSTEM OPTIMIZED<br/>
                      &gt; NO ANOMALIES DETECTED<br/>
                      <span className="animate-pulse">_</span>
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </main>

          {/* FOOTER */}
          <footer className="border-t-4 border-[#00d7fe] bg-[#1a1a1a] p-4 flex justify-between items-center text-[#ffffff] font-mono text-xs uppercase z-20">
            <span className="opacity-60">© 2026 OdysseusAI // Neural Grid Admin</span>
            <div className="flex gap-4">
              <span className="flex items-center gap-1 text-[#00d7fe]"><span className="material-symbols-outlined text-sm">verified</span> SECURE_LINK</span>
              <span className="flex items-center gap-1 text-[#ff6b35]"><span className="material-symbols-outlined text-sm">api</span> API_v3.2</span>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default NeuralGridAdminDashboard;
