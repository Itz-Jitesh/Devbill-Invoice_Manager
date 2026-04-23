'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const router = useRouter();

  // Sync state and cookies
  const syncAuthState = async (session) => {
    if (session) {
      const { user: supabaseUser } = session;
      
      // Get additional metadata if available
      let username = supabaseUser.user_metadata?.username;
      
      // Update state
      setUser({
        id: supabaseUser.id,
        name: username || supabaseUser.email,
        username: username || supabaseUser.email,
        email: supabaseUser.email,
      });

      // Sync cookie for middleware/API
      try {
        await fetch('/api/auth/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: session.access_token }),
        });
      } catch (err) {
        console.error('Failed to sync auth cookie:', err);
      }
    } else {
      setUser(null);
      // Clear cookie
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch (err) {
        console.error('Failed to clear auth cookie:', err);
      }
    }
    setLoading(false);
    setIsAuthReady(true);
  };

  useEffect(() => {
    // 1. Initial session fetch
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await syncAuthState(session);
      
      if (!session && window.location.pathname.startsWith('/(dashboard)')) {
        router.push('/login');
      }
    };

    getInitialSession();

    // 2. Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change event:', event);
      
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        setLoading(false);
        router.push('/login');
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await syncAuthState(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      await syncAuthState(data.session);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error.message);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username: name }
        }
      });

      if (error) throw error;
      
      return { 
        success: true, 
        message: 'Registration successful! Check email for confirmation if required.' 
      };
    } catch (error) {
      console.error('Signup error:', error.message);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthReady,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
