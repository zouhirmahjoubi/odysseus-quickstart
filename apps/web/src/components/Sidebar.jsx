
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Calculator, MonitorPlay, BookOpen, Moon, Sun, 
  FileText, Database, Briefcase, ShoppingBag, Menu, X, ChevronRight,
  User, LogOut, ShieldAlert, Rocket, Zap
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isCyberMode, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const { isAuthenticated: isAdmin } = useAdminAuth();
  
  // Desktop state
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Mobile state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  const handleLogout = () => {
    logout();
    setIsMobileOpen(false);
    navigate('/');
  };

  const menuItems = [
    { name: 'HOME', path: '/', icon: LayoutDashboard },
    { name: 'MARKETPLACE', path: '/products', icon: ShoppingBag },
    { name: 'CALCULATOR', path: '/calculator', icon: Calculator },
    { name: 'SIMULATOR', path: '/workspace-simulator', icon: MonitorPlay },
    { name: 'BLOG', path: '/blog', icon: FileText },
  ];

  const referenceItems = [
    { name: 'RESOURCES', path: '/resources', icon: BookOpen },
    { name: 'LLM DIRECTORY', path: '/llm-directory', icon: Database },
    { name: 'WORKLOADS', path: '/workloads', icon: Briefcase },
    { name: 'TRIAGE WIZARD', path: '/triage-wizard', icon: ShieldAlert },
    { name: 'LAUNCH KIT', path: '/launch-kit', icon: Rocket },
    { name: 'QUICKSTART', path: '/quickstart', icon: Zap },
  ];

  return (
    <>
      {/* Mobile Hamburger Toggle (Visible only on mobile/tablet) */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-[45] touch-target border-[4px] border-black bg-[hsl(var(--primary))] rounded-[8px] p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all"
        aria-label="Open Menu"
      >
        <Menu size={24} className="text-black" strokeWidth={3} />
      </button>

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className={`hidden md:flex fixed inset-y-0 left-0 bg-[hsl(var(--primary))] border-r-[4px] border-black z-50 flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64 lg:w-72'}`}>
        <div className="h-[70px] p-4 flex items-center justify-between border-b-[4px] border-black bg-[hsl(var(--primary))]">
          {!isCollapsed && (
            <Link to="/" className="flex items-center gap-2 overflow-hidden">
              <span className="font-black text-xl tracking-tight leading-none text-black truncate">ODYSSEUS</span>
              <span className="bg-[hsl(var(--accent))] text-black border-2 border-black rounded-[4px] px-1 py-0.5 font-black text-sm leading-none">AI</span>
            </Link>
          )}
          <div className={`flex items-center gap-2 ${isCollapsed ? 'mx-auto flex-col' : ''}`}>
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-[40px] h-[40px] border-[4px] border-black bg-[hsl(var(--card))] flex items-center justify-center hover:bg-[hsl(var(--accent))] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none rounded-[8px]"
            >
              {isCollapsed ? <Menu size={18} strokeWidth={3} className="text-black" /> : <X size={18} strokeWidth={3} className="text-black" />}
            </button>
            <button 
              onClick={toggleTheme}
              className="w-[40px] h-[40px] border-[4px] border-black bg-[hsl(var(--card))] flex items-center justify-center hover:bg-[hsl(var(--accent))] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none rounded-[8px]"
            >
              {isCyberMode ? <Sun size={18} strokeWidth={3} className="text-black" /> : <Moon size={18} strokeWidth={3} className="text-black" />}
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link 
                  key={item.name}
                  to={item.path}
                  title={isCollapsed ? item.name : ''}
                  className={`
                    flex items-center gap-3 px-3 py-3 border-[4px] border-black font-black text-sm lg:text-base transition-all duration-200 uppercase tracking-wide rounded-lg
                    ${isActive 
                      ? 'bg-[hsl(var(--active-green))] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-1 translate-y-1' 
                      : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-[hsl(var(--light-blue))]'
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                >
                  <item.icon size={20} strokeWidth={3} className="flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </div>

          <div>
            {!isCollapsed && <h3 className="font-black uppercase tracking-widest text-xs mb-3 px-2 border-b-[4px] border-black pb-2 text-black inline-block">Reference</h3>}
            <div className="flex flex-col gap-3">
              {referenceItems.map((item) => {
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path);
                return (
                  <Link 
                    key={item.name}
                    to={item.path}
                    title={isCollapsed ? item.name : ''}
                    className={`
                      flex items-center gap-3 px-3 py-2 border-[4px] border-black font-bold text-xs lg:text-sm transition-all duration-200 uppercase rounded-lg
                      ${isActive 
                        ? 'bg-[hsl(var(--active-green))] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-1 translate-y-1' 
                        : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-[hsl(var(--light-blue))]'
                      }
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                  >
                    <item.icon size={18} strokeWidth={3} className="flex-shrink-0" />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* User / Admin Section for Desktop Sidebar */}
          <div className="mt-auto pt-4 border-t-[4px] border-black flex flex-col gap-3">
            {isAdmin && (
              <Link 
                to="/admin"
                title={isCollapsed ? 'Admin' : ''}
                className={`
                  flex items-center gap-3 px-3 py-3 border-[4px] border-black font-black text-sm lg:text-base transition-all duration-200 uppercase tracking-wide rounded-lg
                  bg-[hsl(var(--destructive))] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:brightness-110
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <ShieldAlert size={20} strokeWidth={3} className="flex-shrink-0" />
                {!isCollapsed && <span className="truncate">Admin Panel</span>}
              </Link>
            )}

            {!isAuthenticated ? (
              <Link 
                to="/login"
                title={isCollapsed ? 'Login' : ''}
                className={`
                  flex items-center gap-3 px-3 py-3 border-[4px] border-black font-black text-sm lg:text-base transition-all duration-200 uppercase tracking-wide rounded-lg
                  bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-[hsl(var(--primary))]
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <User size={20} strokeWidth={3} className="flex-shrink-0" />
                {!isCollapsed && <span className="truncate">Login</span>}
              </Link>
            ) : (
              <div className="flex flex-col gap-3">
                <Link 
                  to="/dashboard"
                  title={isCollapsed ? 'Dashboard' : ''}
                  className={`
                    flex items-center gap-3 px-3 py-3 border-[4px] border-black font-black text-sm lg:text-base transition-all duration-200 uppercase tracking-wide rounded-lg
                    ${location.pathname === '/dashboard' ? 'bg-[hsl(var(--active-green))] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-1 translate-y-1' : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-[hsl(var(--active-green))]'} text-black
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                >
                  <LayoutDashboard size={20} strokeWidth={3} className="flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">Dashboard</span>}
                </Link>
                <button 
                  onClick={handleLogout}
                  title={isCollapsed ? 'Logout' : ''}
                  className={`
                    flex items-center gap-3 px-3 py-3 border-[4px] border-black font-black text-sm lg:text-base transition-all duration-200 uppercase tracking-wide rounded-lg
                    bg-[hsl(var(--orange))] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:brightness-110
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                >
                  <LogOut size={20} strokeWidth={3} className="flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">Logout</span>}
                </button>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* --- MOBILE OVERLAY BACKGROUND --- */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[55] md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* --- MOBILE/TABLET SIDEBAR MENU --- */}
      <div 
        className={`fixed top-0 left-0 bottom-0 z-[60] bg-[hsl(var(--sidebar))] border-r-[4px] border-black w-[85vw] max-w-[320px] transition-transform duration-300 md:hidden flex flex-col ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4 border-b-[4px] border-black bg-[hsl(var(--primary))] flex justify-between items-center h-[70px]">
          <Link to="/" className="flex items-center gap-1.5" onClick={() => setIsMobileOpen(false)}>
            <span className="font-black text-xl tracking-tighter text-black uppercase leading-none">
              ODYSSEUS
            </span>
          </Link>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center touch-target bg-[hsl(var(--background))] border-[4px] border-black rounded-[8px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
            >
              {isCyberMode ? <Sun size={18} strokeWidth={3} className="text-black" /> : <Moon size={18} strokeWidth={3} className="text-black" />}
            </button>
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="w-10 h-10 flex items-center justify-center touch-target bg-[hsl(var(--card))] border-[4px] border-black rounded-[8px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
            >
              <X size={18} strokeWidth={3} className="text-black" />
            </button>
          </div>
        </div>

        <nav className="py-4 px-4 overflow-y-auto flex flex-col gap-4 flex-1">
          <div className="flex flex-col gap-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 border-[4px] border-black font-bold text-sm transition-all duration-200 uppercase rounded-lg group ${
                    isActive 
                      ? 'bg-[hsl(var(--active-green))] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-[2px] translate-x-[2px]' 
                      : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[hsl(var(--light-blue))]'
                  }`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <item.icon size={20} strokeWidth={2.5} className="flex-shrink-0" />
                  <span className="flex-1 font-black">{item.name}</span>
                  <ChevronRight size={18} strokeWidth={3} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </div>

          <h3 className="font-black uppercase tracking-widest text-xs mt-4 px-2 border-b-[4px] border-black pb-2 text-black inline-block">Reference</h3>
          
          <div className="flex flex-col gap-3 pb-4">
            {referenceItems.map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 border-[4px] border-black font-bold text-sm transition-all duration-200 uppercase rounded-lg group ${
                    isActive 
                      ? 'bg-[hsl(var(--active-green))] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-[2px] translate-x-[2px]' 
                      : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[hsl(var(--light-blue))]'
                  }`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <item.icon size={20} strokeWidth={2.5} className="flex-shrink-0" />
                  <span className="flex-1 font-black">{item.name}</span>
                  <ChevronRight size={18} strokeWidth={3} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </div>

          {/* User Auth Section for Mobile Menu */}
          <div className="mt-auto pt-4 border-t-[4px] border-black flex flex-col gap-3 mb-6">
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-3 px-4 py-3 border-[4px] border-black font-black text-sm transition-all duration-200 uppercase rounded-lg group bg-[hsl(var(--destructive))] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                onClick={() => setIsMobileOpen(false)}
              >
                <ShieldAlert size={20} strokeWidth={3} className="flex-shrink-0" />
                <span className="flex-1">Admin Panel</span>
                <ChevronRight size={18} strokeWidth={3} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            )}

            {!isAuthenticated ? (
              <Link
                to="/login"
                className="flex items-center gap-3 px-4 py-3 border-[4px] border-black font-black text-sm transition-all duration-200 uppercase rounded-lg group bg-[hsl(var(--primary))] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                onClick={() => setIsMobileOpen(false)}
              >
                <User size={20} strokeWidth={3} className="flex-shrink-0" />
                <span className="flex-1">Login</span>
                <ChevronRight size={18} strokeWidth={3} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 border-[4px] border-black font-black text-sm transition-all duration-200 uppercase rounded-lg group bg-[hsl(var(--active-green))] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <LayoutDashboard size={20} strokeWidth={3} className="flex-shrink-0" />
                  <span className="flex-1">Dashboard</span>
                  <ChevronRight size={18} strokeWidth={3} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 border-[4px] border-black font-black text-sm transition-all duration-200 uppercase rounded-lg group bg-[hsl(var(--orange))] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left"
                >
                  <LogOut size={20} strokeWidth={3} className="flex-shrink-0" />
                  <span className="flex-1">Logout</span>
                </button>
              </>
            )}
          </div>

        </nav>
      </div>
    </>
  );
};

export default Sidebar;
