'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '@/services/auth.service';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

/**
 * Authentication Provider
 * @description Manages global authentication state and persistent user sessions
 * via the 'devbill_auth' localStorage key.
 *
 * Marked "use client" because it uses useState, useEffect, and localStorage.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Initialize auth state from localStorage on application mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedAuth = localStorage.getItem('devbill_auth');

        if (storedAuth) {
          const { user, token } = JSON.parse(storedAuth);
          setUser(user);
          setToken(token);
        }
      } catch (error) {
        console.error('Failed to parse auth data from localStorage:', error);
        localStorage.removeItem('devbill_auth');
      } finally {
        // Critical: Set readiness to true even if no data is found
        setIsAuthReady(true);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login handler
   * @param {string} email
   * @param {string} password
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);

      if (data.token) {
        setUser(data.user);
        setToken(data.token);
        // localStorage is already handled by authService.login
        return { success: true };
      }
      return { success: false, message: 'Authentication failed' };
    } catch (error) {
      console.error('Login error:', error.message);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Signup handler
   * @param {string} name
   * @param {string} email
   * @param {string} password
   */
  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await authService.signup(name, email, password);

      if (data.message) {
        // Backend doesn't return a token on signup — redirect to login after
        return { success: true, message: 'Account created successfully! Please log in.' };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (error) {
      console.error('Signup error:', error.message);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout handler
   */
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    }
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const value = {
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
