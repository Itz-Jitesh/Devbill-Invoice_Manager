'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const router = useRouter();

  const syncAuthState = useCallback(async (nextSession, reason = 'unknown') => {
    console.log('[AuthContext] Syncing auth state', {
      reason,
      hasSession: Boolean(nextSession),
      userId: nextSession?.user?.id ?? null,
      email: nextSession?.user?.email ?? null,
    });

    setSession(nextSession ?? null);

    if (nextSession?.user) {
      const supabaseUser = nextSession.user;
      const username = supabaseUser.user_metadata?.username;

      setUser({
        id: supabaseUser.id,
        name: username || supabaseUser.email,
        username: username || supabaseUser.email,
        email: supabaseUser.email,
      });
      setToken(nextSession.access_token);

      try {
        await fetch('/api/auth/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: nextSession.access_token }),
        });
      } catch (err) {
        console.error('Failed to sync auth cookie:', err);
      }
    } else {
      setUser(null);
      setToken(null);
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch (err) {
        console.error('Failed to clear auth cookie:', err);
      }
    }
    setLoading(false);
    setIsAuthReady(true);
  }, []);

  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session: currentSession },
        error,
      } = await supabase.auth.getSession();

      console.log('[AuthContext] Initial session fetch', {
        hasSession: Boolean(currentSession),
        userId: currentSession?.user?.id ?? null,
        error: error?.message ?? null,
      });

      await syncAuthState(currentSession, 'initial-session');

      const protectedPaths = ['/dashboard', '/clients', '/invoices', '/settings'];
      const isProtected = protectedPaths.some(p => window.location.pathname.startsWith(p));
      
      if (!currentSession && isProtected) {
        router.replace('/login');
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthContext] Auth state change event', {
        event,
        hasSession: Boolean(session),
        userId: session?.user?.id ?? null,
      });

      await syncAuthState(session, event);

      if (!session && window.location.pathname !== '/login') {
        router.replace('/login');
        return;
      }

      if (session && window.location.pathname === '/login') {
        router.replace('/dashboard');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, syncAuthState]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('[AuthContext] Login response', {
        userId: data?.session?.user?.id ?? null,
        error: error?.message ?? null,
      });

      if (error) throw error;
      
      await syncAuthState(data.session, 'login');
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

      console.log('[AuthContext] Signup response', {
        userId: data?.user?.id ?? null,
        hasSession: Boolean(data?.session),
        error: error?.message ?? null,
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
      setSession(null);
      setUser(null);
      setToken(null);
      router.replace('/login');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    token,
    loading,
    isAuthReady,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
