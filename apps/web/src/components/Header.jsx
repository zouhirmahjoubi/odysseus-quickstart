import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, LayoutDashboard, User, ShieldAlert, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/hooks/useCart.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import LogoComponent from './LogoComponent.jsx';

// Simple dropdown hook
const useDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return { open, setOpen, ref };
};

const Header = ({ setIsCartOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const { isAuthenticated: isAdmin } = useAdminAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(140);

  const installDropdown = useDropdown();
  const troubleshootDropdown = useDropdown();
  const resourcesDropdown = useDropdown();

  // Measure the actual header height so mobile menu sits right below it
  const updateMenuTop = useCallback(() => {
    const header = document.getElementById('site-header');
    if (header) setMenuTop(header.getBoundingClientRect().height);
  }, []);

  useEffect(() => {
    updateMenuTop();
    window.addEventListener('resize', updateMenuTop);
    return () => window.removeEventListener('resize', updateMenuTop);
  }, [updateMenuTop]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleTryItFree = () => {
    navigate('/odysseus-login');
    setIsMenuOpen(false);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `transition-colors uppercase font-bold tracking-wider text-[11px] lg:text-xs pb-1 ${
      isActive ? 'text-primary border-b-2 border-primary' : 'text-foreground hover:text-primary'
    }`;
  };

  const dropdownItemClass = "block w-full text-left px-4 py-2.5 text-xs font-bold text-foreground hover:bg-primary hover:text-primary-foreground rounded-xl transition-colors";

  return (
    <>
      {/* Desktop / Main Navbar bar */}
      <div className="w-full bg-background/85 backdrop-blur-[20px] flex justify-center items-center px-4 md:px-8 h-[70px] border-b border-border">
        <div className="w-full max-w-7xl flex items-center justify-between h-full">
          
          {/* Brand / Logo */}
          <div className="flex-shrink-0">
            <LogoComponent onClick={() => setIsMenuOpen(false)} />
          </div>

          {/* Center: Desktop Marketing Links */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/odysseus-Launch-Kit" className={navLinkClass('/odysseus-Launch-Kit')}>Marketplace</Link>
            <Link to="/odysseus-calculator" className={navLinkClass('/odysseus-calculator')}>Calculator</Link>
            <Link to="/odysseus-benchmark" className={navLinkClass('/odysseus-benchmark')}>Benchmark</Link>
            <Link to="/odysseus-blog" className={navLinkClass('/odysseus-blog')}>Independent Developer Blog</Link>

            {/* Install Paths Dropdown */}
            <div className="relative" ref={installDropdown.ref}>
              <button
                onClick={() => {
                  installDropdown.setOpen(o => !o);
                  troubleshootDropdown.setOpen(false);
                  resourcesDropdown.setOpen(false);
                }}
                className={`flex items-center gap-1 transition-colors uppercase font-bold tracking-wider text-[11px] lg:text-xs text-foreground hover:text-primary pb-1 ${installDropdown.open ? 'text-primary' : ''}`}
              >
                Install Paths
                <ChevronDown size={12} className={`transition-transform ${installDropdown.open ? 'rotate-180' : ''}`} />
              </button>
              {installDropdown.open && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-background/90 backdrop-blur-[15px] border border-border rounded-2xl shadow-xl overflow-hidden min-w-[170px] p-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link to="/odysseus-ai-install" onClick={() => installDropdown.setOpen(false)} className={dropdownItemClass}>Install Hub</Link>
                  <Link to="/odysseus-install/docker" onClick={() => installDropdown.setOpen(false)} className={dropdownItemClass}>Docker Setup</Link>
                  <Link to="/odysseus-install/ollama" onClick={() => installDropdown.setOpen(false)} className={dropdownItemClass}>Ollama Resolver</Link>
                  <Link to="/odysseus-install/windows" onClick={() => installDropdown.setOpen(false)} className={dropdownItemClass}>Windows Native</Link>
                  <Link to="/odysseus-install/macbook" onClick={() => installDropdown.setOpen(false)} className={dropdownItemClass}>macOS Native</Link>
                </div>
              )}
            </div>

            {/* Troubleshoot Dropdown */}
            <div className="relative" ref={troubleshootDropdown.ref}>
              <button
                onClick={() => {
                  troubleshootDropdown.setOpen(o => !o);
                  installDropdown.setOpen(false);
                  resourcesDropdown.setOpen(false);
                }}
                className={`flex items-center gap-1 transition-colors uppercase font-bold tracking-wider text-[11px] lg:text-xs text-foreground hover:text-primary pb-1 ${troubleshootDropdown.open ? 'text-primary' : ''}`}
              >
                Troubleshoot
                <ChevronDown size={12} className={`transition-transform ${troubleshootDropdown.open ? 'rotate-180' : ''}`} />
              </button>
              {troubleshootDropdown.open && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-background/90 backdrop-blur-[15px] border border-border rounded-2xl shadow-xl overflow-hidden min-w-[170px] p-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link to="/odysseus-fix" onClick={() => troubleshootDropdown.setOpen(false)} className={dropdownItemClass}>Error Doctor</Link>
                  <Link to="/odysseus-triage-wizard" onClick={() => troubleshootDropdown.setOpen(false)} className={dropdownItemClass}>Triage Wizard</Link>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="relative" ref={resourcesDropdown.ref}>
              <button
                onClick={() => {
                  resourcesDropdown.setOpen(o => !o);
                  installDropdown.setOpen(false);
                  troubleshootDropdown.setOpen(false);
                }}
                className={`flex items-center gap-1 transition-colors uppercase font-bold tracking-wider text-[11px] lg:text-xs text-foreground hover:text-primary pb-1 ${resourcesDropdown.open ? 'text-primary' : ''}`}
              >
                Resources
                <ChevronDown size={12} className={`transition-transform ${resourcesDropdown.open ? 'rotate-180' : ''}`} />
              </button>
              {resourcesDropdown.open && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-background/90 backdrop-blur-[15px] border border-border rounded-2xl shadow-xl overflow-hidden min-w-[170px] p-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link to="/odysseus-resources" onClick={() => resourcesDropdown.setOpen(false)} className={dropdownItemClass}>Guides & Tutorials</Link>
                  <Link to="/odysseus-llm-directory" onClick={() => resourcesDropdown.setOpen(false)} className={dropdownItemClass}>LLM Directory</Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Admin Tag */}
            {isAdmin && (
              <Link
                to="/odysseus-admin"
                className="hidden lg:flex items-center gap-1.5 px-4 py-1.5 bg-[#E73A5A] text-white font-bold text-xs rounded-full shadow-[0_0_10px_rgba(231, 58, 90,0.3)] hover:brightness-112 transition-all"
              >
                <ShieldAlert size={14} /> Admin
              </Link>
            )}

            {/* User Auth Link */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  to="/odysseus-dashboard"
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-foreground/10 hover:bg-foreground/20 border border-border text-foreground font-bold text-xs rounded-full transition-all"
                >
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 bg-foreground/10 hover:bg-primary/20 border border-border rounded-full transition-all flex items-center justify-center"
                  title="Logout"
                >
                  <LogOut size={14} className="text-foreground" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleTryItFree}
                className="hidden sm:block bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_0_15px_rgba(231,58,90,0.4)] hover:brightness-112 hover:scale-[1.03] transition-all"
              >
                Whitelist
              </button>
            )}

            {/* Shopping Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-foreground/5 hover:bg-primary/20 border border-border rounded-full hover:scale-105 transition-all flex items-center justify-center"
              aria-label="Open Cart"
            >
              <ShoppingCart size={16} className="text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px] shadow-[0_0_8px_rgba(231,58,90,0.6)]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMenuOpen(o => !o)}
              className="lg:hidden w-[38px] h-[38px] border border-border bg-foreground/5 rounded-full hover:bg-foreground/10 transition-colors flex items-center justify-center"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X size={18} className="text-foreground" /> : <Menu size={18} className="text-foreground" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-30 lg:hidden" onClick={() => setIsMenuOpen(false)}>
          <div
            className="absolute left-4 right-4 bg-background/90 backdrop-blur-[15px] border border-border rounded-3xl p-5 flex flex-col gap-3 shadow-2xl overflow-y-auto max-h-[70vh]"
            onClick={e => e.stopPropagation()}
            style={{ top: `${menuTop + 8}px` }}
          >
            <Link to="/odysseus-Launch-Kit" onClick={() => setIsMenuOpen(false)} className="w-full block py-2.5 text-left font-bold text-foreground hover:text-primary border-b border-border/40">Marketplace</Link>
            <Link to="/odysseus-calculator" onClick={() => setIsMenuOpen(false)} className="w-full block py-2.5 text-left font-bold text-foreground hover:text-primary border-b border-border/40">Calculator</Link>
            <Link to="/odysseus-benchmark" onClick={() => setIsMenuOpen(false)} className="w-full block py-2.5 text-left font-bold text-foreground hover:text-primary border-b border-border/40">Benchmark 🏆</Link>
            <Link to="/odysseus-blog" onClick={() => setIsMenuOpen(false)} className="w-full block py-2.5 text-left font-bold text-foreground hover:text-primary border-b border-border/40">Independent Developer Blog</Link>
            
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-2 border-b border-border/30 pb-1">Install Paths</div>
            <div className="grid grid-cols-2 gap-2 pl-2">
              <Link to="/odysseus-ai-install" onClick={() => setIsMenuOpen(false)} className="block py-1 text-left font-bold text-xs text-muted-foreground hover:text-primary">Install Hub</Link>
              <Link to="/odysseus-install/docker" onClick={() => setIsMenuOpen(false)} className="block py-1 text-left font-bold text-xs text-muted-foreground hover:text-primary">Docker Setup</Link>
              <Link to="/odysseus-install/ollama" onClick={() => setIsMenuOpen(false)} className="block py-1 text-left font-bold text-xs text-muted-foreground hover:text-primary">Ollama Resolver</Link>
              <Link to="/odysseus-install/windows" onClick={() => setIsMenuOpen(false)} className="block py-1 text-left font-bold text-xs text-muted-foreground hover:text-primary">Windows Native</Link>
              <Link to="/odysseus-install/macbook" onClick={() => setIsMenuOpen(false)} className="block py-1 text-left font-bold text-xs text-muted-foreground hover:text-primary">macOS Native</Link>
            </div>

            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-2 border-b border-border/30 pb-1">Troubleshoot</div>
            <div className="grid grid-cols-2 gap-2 pl-2">
              <Link to="/odysseus-fix" onClick={() => setIsMenuOpen(false)} className="block py-1 text-left font-bold text-xs text-muted-foreground hover:text-primary">Error Doctor</Link>
              <Link to="/odysseus-triage-wizard" onClick={() => setIsMenuOpen(false)} className="block py-1 text-left font-bold text-xs text-muted-foreground hover:text-primary">Triage Wizard</Link>
            </div>

            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-2 border-b border-border/30 pb-1">Resources</div>
            <div className="grid grid-cols-2 gap-2 pl-2">
              <Link to="/odysseus-resources" onClick={() => setIsMenuOpen(false)} className="block py-1 text-left font-bold text-xs text-muted-foreground hover:text-primary">Guides & Tutorials</Link>
              <Link to="/odysseus-llm-directory" onClick={() => setIsMenuOpen(false)} className="block py-1 text-left font-bold text-xs text-muted-foreground hover:text-primary">LLM Directory</Link>
            </div>
            
            {isAuthenticated ? (
              <div className="flex flex-col gap-2 mt-2">
                <Link to="/odysseus-dashboard" onClick={() => setIsMenuOpen(false)} className="w-full block py-2.5 text-left font-bold text-foreground hover:text-primary border-b border-border/40 flex items-center gap-2">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <button onClick={handleLogout} className="w-full py-2.5 text-left font-bold text-red-500 flex items-center gap-2">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={handleTryItFree}
                  className="w-full bg-primary text-white py-3 rounded-full font-bold shadow-[0_0_15px_rgba(231,58,90,0.4)] text-center"
                >
                  Whitelist
                </button>
                <Link
                  to="/odysseus-login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full bg-foreground/10 hover:bg-foreground/20 text-foreground py-3 rounded-full font-bold border border-border text-center flex items-center justify-center gap-1"
                >
                  <User size={16} /> Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
