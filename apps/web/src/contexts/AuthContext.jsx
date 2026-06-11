
import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Initialize state directly from PocketBase's synchronous authStore
  // This ensures persistence across page reloads without flashing unauthenticated state
  const [currentUser, setCurrentUser] = useState(pb.authStore.model);
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      // Check for token in URL from OAuth callback (if applicable)
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (token) {
        pb.authStore.save(token, null);
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      // If we have a valid token, verify it with the server
      if (pb.authStore.isValid) {
        try {
          // Attempt to refresh the token and get the latest user data
          const userData = await pb.collection('users').authRefresh({ $autoCancel: false });
          if (isMounted) {
            setCurrentUser(userData.record);
            setIsAuthenticated(true);
          }
        } catch (e) {
          console.error('Failed to refresh token, clearing session:', e);
          pb.authStore.clear();
          if (isMounted) {
            setCurrentUser(null);
            setIsAuthenticated(false);
          }
        }
      } else {
        if (isMounted) {
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      }
      
      if (isMounted) setIsLoading(false);
    };

    initAuth();

    // Subscribe to any external changes to the authStore (e.g., from other tabs)
    const unsubscribe = pb.authStore.onChange((token, model) => {
      if (isMounted) {
        setCurrentUser(model);
        setIsAuthenticated(!!token);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
      setCurrentUser(authData.record);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message || 'Invalid credentials' };
    }
  };

  const loginWithOAuth = async (provider) => {
    try {
      const response = await fetch(`/hcgi/api/oauth/${provider}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to initiate ${provider} login`);
      }

      const { authUrl } = await response.json();
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        throw new Error(`No authUrl returned for ${provider}`);
      }
    } catch (error) {
      console.error(`${provider} OAuth initialization failed:`, error);
      throw error;
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    currentUser,
    user: currentUser, // Alias for backwards compatibility
    isLoading,
    login,
    loginWithOAuth,
    logout,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
