
import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

const AdminAuthContext = createContext();

const INACTIVITY_LIMIT_MS = 30 * 60 * 1000; // 30 minutes

export const AdminAuthProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(() => {
    // Correctly check against the 'admins' collection based on the schema
    if (pb.authStore.isValid && pb.authStore.model?.collectionName === 'admins') {
      return pb.authStore.model;
    }
    return null;
  });
  
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Keep internal state in sync with PocketBase auth store
    const unsubscribe = pb.authStore.onChange((token, model) => {
      if (!isMounted) return;
      if (model?.collectionName === 'admins') {
        setCurrentAdmin(model);
      } else {
        setCurrentAdmin(null);
      }
    });

    // Ensure state on initial mount
    if (pb.authStore.isValid && pb.authStore.model?.collectionName === 'admins') {
      setCurrentAdmin(pb.authStore.model);
    } else {
      setCurrentAdmin(null);
    }
    
    setIsAuthLoading(false);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Handle Session Timeout due to Inactivity
  useEffect(() => {
    if (!currentAdmin) return;

    const updateActivity = () => setLastActivity(Date.now());
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];

    events.forEach(event => window.addEventListener(event, updateActivity));

    const checkTimeout = setInterval(() => {
      if (Date.now() - lastActivity > INACTIVITY_LIMIT_MS) {
        logout();
        window.location.href = '/admin-login?timeout=1';
      }
    }, 60000); // Check every minute

    return () => {
      events.forEach(event => window.removeEventListener(event, updateActivity));
      clearInterval(checkTimeout);
    };
  }, [currentAdmin, lastActivity]);

  const login = async (email, password, rememberMe = false) => {
    try {
      // Authenticate exclusively against the 'admins' collection
      const authData = await pb.collection('admins').authWithPassword(email, password, { $autoCancel: false });
      
      if (authData.record?.collectionName !== 'admins') {
        throw new Error('Unauthorized collection access.');
      }
      
      setCurrentAdmin(authData.record);

      if (rememberMe) {
        localStorage.setItem('admin_remembered_email', email);
      } else {
        localStorage.removeItem('admin_remembered_email');
      }

      return { success: true };
    } catch (err) {
      console.error('Admin login error:', err);
      // Clean up internal error messages for user-friendly display
      let errorMessage = 'Invalid admin credentials.';
      if (err.status === 400) errorMessage = 'Invalid email or password.';
      if (err.status === 403) errorMessage = 'Access forbidden.';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    // Only clear the auth store if the current model is an admin
    // This prevents accidentally logging out a standard user if we have separate sessions
    if (pb.authStore.model?.collectionName === 'admins') {
      pb.authStore.clear();
    }
    setCurrentAdmin(null);
  };

  const refreshToken = async () => {
    try {
      if (pb.authStore.isValid && pb.authStore.model?.collectionName === 'admins') {
        const authData = await pb.collection('admins').authRefresh({ $autoCancel: false });
        setCurrentAdmin(authData.record);
      }
    } catch (error) {
      console.error('Admin token refresh failed:', error);
      logout();
    }
  };

  const isAuthenticated = !!currentAdmin;

  return (
    <AdminAuthContext.Provider value={{ currentAdmin, isAuthenticated, isAuthLoading, login, logout, refreshToken }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
