'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const ToastContext = createContext();

/**
 * ToastProvider — Manages global toast notifications and persistent history
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Add a new toast and record in history
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now().toString();
    const timestamp = new Date();
    
    const toast = { id, message, type, timestamp };
    
    // Add to active toasts (auto-dismiss)
    setToasts((prev) => [...prev, toast]);
    
    // Add to persistent history
    setNotifications((prev) => [
      { id, message, type, timestamp, read: false },
      ...prev.slice(0, 49) // Keep last 50 notifications
    ]);

    // Auto dismiss toast after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);

    return id;
  }, []);

  const clearNotifications = useCallback(() => setNotifications([]), []);
  
  const markAsRead = useCallback(() => {
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Remove a specific toast
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      toasts,
      notifications,
      showToast,
      removeToast,
      clearNotifications,
      markAsRead,
      unreadCount: notifications.filter(n => !n.read).length
    }),
    [toasts, notifications, showToast, removeToast, clearNotifications, markAsRead]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

