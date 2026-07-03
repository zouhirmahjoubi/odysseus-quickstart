
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';

const ProtectedAdminRoute = () => {
  const { isAuthenticated, isAuthLoading } = useAdminAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col items-center justify-center p-4 w-full">
        <div className="bg-[hsl(var(--card))] border-[4px] border-black p-8 flex flex-col items-center gap-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-md">
          <div className="w-12 h-12 border-[4px] border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin"></div>
          <p className="font-black uppercase tracking-widest text-sm text-[hsl(var(--card-foreground))]">Verifying Clearance...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Preserve the intended destination in the query parameters
    return <Navigate to={`/odysseus-admin-login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
