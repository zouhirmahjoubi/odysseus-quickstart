import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, ShoppingBag, Users, BarChart2, Settings, LogOut, Star } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import LogoComponent from '@/components/LogoComponent.jsx';

const AdminSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();
  const { logout } = useAdminAuth();

  const links = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Blog Management', path: '/admin/blog', icon: FileText },
    { name: 'Product Management', path: '/admin/products', icon: ShoppingBag },
    { name: 'Testimonials', path: '/admin/testimonials', icon: Star },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart2 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLinkClick = () => {
    if (window.innerWidth < 1024 && setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  // Close sidebar on route change for mobile
  useEffect(() => {
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  }, [location.pathname, setIsMobileOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 bg-[hsl(var(--card))] border-r-[4px] border-black flex flex-col w-72 transform transition-transform duration-300 z-50 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        aria-label="Admin Navigation"
      >
        <div className="h-20 border-b-[4px] border-black flex items-center justify-center px-4 bg-[hsl(var(--primary))]">
          <div className="scale-75 origin-center">
            <LogoComponent />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {links.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/admin' && location.pathname.startsWith(link.path));
            return (
              <Link 
                key={link.name} 
                to={link.path}
                onClick={handleLinkClick}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-3 px-4 py-3 border-[3px] font-black uppercase transition-all duration-200 rounded-lg text-sm tracking-wide ${
                  isActive 
                    ? 'bg-[hsl(var(--active-green))] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black translate-x-1 translate-y-1' 
                    : 'bg-white border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-[hsl(var(--light-blue))]'
                }`}
              >
                <link.icon size={20} strokeWidth={3} aria-hidden="true" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t-[4px] border-black bg-[hsl(var(--background))] mt-auto">
          <button 
            onClick={() => {
              logout();
              handleLinkClick();
            }}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 font-black uppercase border-[3px] border-black bg-[hsl(var(--destructive))] text-white rounded-lg hover:-translate-y-1 hover:-translate-x-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 text-sm active:translate-y-0 active:translate-x-0 active:shadow-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Logout from admin panel"
          >
            <LogOut size={20} strokeWidth={3} aria-hidden="true" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
