
import React, { createContext, useContext } from 'react';
import { authClient } from '@/lib/auth-client';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { data: session, isPending: isLoading, refetch } = authClient.useSession();

  const user = session?.user || null;
  const isAuthenticated = !!session;

  const login = async (email, password) => {
    try {
      const res = await authClient.signIn.email({
        email,
        password,
      });
      if (res.error) {
        throw new Error(res.error.message || 'Login failed');
      }
      await refetch();
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message || 'Invalid credentials' };
    }
  };

  const signup = async (email, password, name) => {
    try {
      const res = await authClient.signUp.email({
        email,
        password,
        name,
      });
      if (res.error) {
        throw new Error(res.error.message || 'Registration failed');
      }
      await refetch();
      return { success: true };
    } catch (error) {
      console.error('Signup failed:', error);
      return { success: false, error: error.message || 'Failed to create account' };
    }
  };

  const loginWithOAuth = async (provider) => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: window.location.origin + '/dashboard',
      });
    } catch (error) {
      console.error(`${provider} OAuth failed:`, error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authClient.signOut();
      await refetch();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const value = {
    currentUser: user,
    user, // Alias for backwards compatibility
    isLoading,
    login,
    signup,
    loginWithOAuth,
    logout,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
