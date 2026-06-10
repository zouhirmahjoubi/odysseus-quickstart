
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Gamepad2, LogOut, LayoutDashboard, User, ShieldAlert, Menu, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';

const Header = ({ setIsCartOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const { isAuthenticated: isAdmin } = useAdminAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'PRODUCTS', path: '/products' },
    { name: 'BLOG', path: '/blog' },
    { name: 'CALCULATOR', path: '/calculator' },
    { name: 'WORKSPACE', path: '/workspace-simulator' },
    { name: 'RESOURCES', path: '/resources' },
    { name: 'TRIAGE WIZARD', path: '/triage-wizard' },
    { name: 'LAUNCH KIT', path: '/launch-kit' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Also try to trigger the sidebar if it exists for backwards compatibility
    const sidebarToggle = document.querySelector('[aria-label="Open Menu"]');
    if (sidebarToggle && !isMobileMenuOpen) {
      sidebarToggle.click();
    }
  };

  return (
    <header className="w-full bg-[hsl(var(--header-bg))] border-b-[8px] border-black px-[20px] py-[12px] h-[70px] flex justify-between items-center z-50 relative">
      
      {/* LEFT SECTION */}
      <div className="flex items-center gap-[16px] lg:gap-[20px]">
        {/* Mobile Hamburger Menu (hidden on desktop) */}
        <button 
          onClick={toggleMobileMenu}
          className="lg:hidden w-[40px] h-[40px] bg-white border-[4px] border-black rounded-[12px] p-[8px] flex flex-col justify-center items-center gap-[4px] transition-transform hover:-translate-y-1 active:translate-y-0 touch-target shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
        >
          {isMobileMenuOpen ? (
            <X size={24} strokeWidth={3} className="text-black" />
          ) : (
            <>
              <span className="w-[80%] h-[4px] bg-black rounded-full block"></span>
              <span className="w-[80%] h-[4px] bg-black rounded-full block"></span>
              <span className="w-[80%] h-[4px] bg-black rounded-full block"></span>
            </>
          )}
        </button>

        {/* Desktop Game Controller Icon */}
        <Link
          to="/workspace-simulator"
          className="hidden lg:flex w-[40px] h-[40px] bg-[hsl(var(--navy))] border-[4px] border-black rounded-[12px] items-center justify-center transition-transform hover:-translate-y-1 active:translate-y-0 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] touch-target"
          title="Workspace Simulator"
        >
          <Gamepad2 size={22} strokeWidth={3} className="text-white" />
        </Link>
        
        {/* Logo & Tagline Group */}
        <div className="flex flex-col justify-center transition-transform duration-300 hover:scale-[1.02] origin-left">
          <Link to="/" className="flex items-center gap-[6px] md:gap-[8px] focus:outline-none" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="font-[900] text-[20px] md:text-[24px] lg:text-[28px] tracking-[2px] text-black uppercase leading-none mt-1">
              ODYSSEUS
            </span>
            <span className="bg-[hsl(var(--orange))] text-black border-[4px] border-black rounded-[12px] px-[8px] py-[2px] font-[900] text-[14px] lg:text-[18px] uppercase leading-none flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              AI
            </span>
          </Link>
          <span className="text-[hsl(var(--orange))] font-[900] text-[12px] lg:text-[14px] tracking-[1px] leading-tight ml-1 mt-0.5">
            AI.AI
          </span>
        </div>
      </div>

      {/* CENTER SECTION - Desktop Navigation Menu (hidden on mobile/tablet) */}
      <nav className="hidden lg:flex items-center justify-center gap-[12px] xl:gap-[20px] flex-1 px-4 overflow-x-auto">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
          
          return (
            <Link 
              key={link.name} 
              to={link.path}
              className={`px-[12px] py-[6px] border-[4px] text-black nav-text text-[11px] xl:text-[13px] whitespace-nowrap rounded-[14px] transition-all duration-200 uppercase ${
                isActive 
                  ? 'bg-[hsl(var(--light-blue))] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                  : 'bg-transparent border-transparent hover:bg-[hsl(var(--light-blue))] hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              }`}
              title={link.name}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-[12px] md:gap-[16px] justify-end">
        
        {/* Auth Navigation */}
        <div className="hidden lg:flex items-center gap-[12px]">
          {isAdmin && (
            <Link 
              to="/admin"
              className="flex items-center gap-[6px] px-[16px] py-[8px] bg-[hsl(var(--destructive))] border-[4px] border-black text-white font-black text-[13px] xl:text-[15px] rounded-[14px] transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none uppercase"
              title="Admin Panel"
            >
              <ShieldAlert size={18} strokeWidth={3} />
              Admin
            </Link>
          )}

          {!isAuthenticated ? (
            <Link 
              to="/login"
              className="flex items-center gap-[6px] px-[16px] py-[8px] bg-[hsl(var(--primary))] border-[4px] border-black text-black font-black text-[13px] xl:text-[15px] rounded-[14px] transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none uppercase"
            >
              <User size={18} strokeWidth={3} />
              Login
            </Link>
          ) : (
            <>
              <Link 
                to="/dashboard"
                className="flex items-center gap-[6px] px-[16px] py-[8px] bg-[hsl(var(--active-green))] border-[4px] border-black text-black font-black text-[13px] xl:text-[15px] rounded-[14px] transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none uppercase"
              >
                <LayoutDashboard size={18} strokeWidth={3} />
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center w-[40px] h-[40px] bg-[hsl(var(--orange))] border-[4px] border-black text-black font-black rounded-[14px] transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
                title="Logout"
              >
                <LogOut size={18} strokeWidth={3} />
              </button>
            </>
          )}
        </div>

        {/* Shopping Cart Button */}
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative w-[40px] h-[40px] flex items-center justify-center bg-[hsl(var(--primary))] border-[4px] border-black rounded-[12px] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0 active:shadow-none focus:outline-none touch-target"
          aria-label="Open shopping cart"
          title="Shopping cart"
        >
          <ShoppingCart size={20} strokeWidth={3} className="text-black ml-[-2px]" />
          {cartCount > 0 && (
            <span className="absolute -top-[10px] -right-[10px] bg-white text-black border-[4px] border-black rounded-full w-[24px] h-[24px] flex items-center justify-center font-[900] text-[12px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-[70px] left-0 w-full bg-[hsl(var(--header-bg))] border-b-[8px] border-black flex flex-col p-4 gap-3 z-40 shadow-xl">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link 
                key={link.name} 
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-[16px] py-[12px] border-[4px] text-black font-black text-[14px] rounded-[14px] transition-all duration-200 uppercase ${
                  isActive 
                    ? 'bg-[hsl(var(--light-blue))] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                    : 'bg-white border-black hover:bg-[hsl(var(--light-blue))] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          
          <div className="h-[4px] bg-black rounded-full my-2 opacity-20"></div>
          
          {isAdmin && (
            <Link 
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-[8px] px-[16px] py-[12px] bg-[hsl(var(--destructive))] border-[4px] border-black text-white font-black text-[14px] rounded-[14px] uppercase"
            >
              <ShieldAlert size={18} strokeWidth={3} />
              Admin Panel
            </Link>
          )}

          {!isAuthenticated ? (
            <Link 
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-[8px] px-[16px] py-[12px] bg-[hsl(var(--primary))] border-[4px] border-black text-black font-black text-[14px] rounded-[14px] uppercase"
            >
              <User size={18} strokeWidth={3} />
              Login
            </Link>
          ) : (
            <>
              <Link 
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-[8px] px-[16px] py-[12px] bg-[hsl(var(--active-green))] border-[4px] border-black text-black font-black text-[14px] rounded-[14px] uppercase"
              >
                <LayoutDashboard size={18} strokeWidth={3} />
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-[8px] px-[16px] py-[12px] bg-[hsl(var(--orange))] border-[4px] border-black text-black font-black text-[14px] rounded-[14px] uppercase text-left"
              >
                <LogOut size={18} strokeWidth={3} />
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
