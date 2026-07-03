
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { ShieldAlert } from 'lucide-react';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isLoading: isUserLoading } = useAuth();
  const { isAdminAuthenticated, isLoading: isAdminLoading } = useAdminAuth();
  const location = useLocation();

  const isLoading = adminOnly ? isAdminLoading : (isUserLoading && isAdminLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] space-grotesk w-full">
        <div className="bg-[hsl(var(--card))] border-[4px] border-black p-[30px] flex flex-col items-center gap-[15px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-pulse">
          <ShieldAlert size={48} className="text-black" />
          <h2 className="text-[20px] font-black uppercase tracking-wider text-black">Verifying Clearance...</h2>
        </div>
      </div>
    );
  }

  if (adminOnly) {
    if (!isAdminAuthenticated) {
      return <Navigate to="/odysseus-admin-login" state={{ from: location }} replace />;
    }
    return children ? children : null;
  }

  // Regular protected route allows standard users OR admins
  if (!isAuthenticated && !isAdminAuthenticated) {
    return <Navigate to="/odysseus-login" state={{ from: location }} replace />;
  }

  return children ? children : null;
};

export default ProtectedRoute;
