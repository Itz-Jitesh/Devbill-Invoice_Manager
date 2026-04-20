'use client';

import { useToast } from '@/context/ToastContext';
import { useNotifications } from '@/context/NotificationContext';

/**
 * useToastWithNotification — Combined hook for toast + notification sync
 * @description Shows a toast and adds to notification panel when toast dismisses
 */
export const useToastWithNotification = () => {
  const { showToast } = useToast();
  const { addNotification } = useNotifications();

  const notify = (message, type = 'info') => {
    // Show toast immediately
    showToast(message, type);

    // Add to notifications after a short delay (simulating "after toast disappears")
    // We use 4.5s to ensure it appears right after toast animation
    setTimeout(() => {
      addNotification(message, type);
    }, 4500);
  };

  return { notify };
};
