'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

/**
 * ProtectedRoute Component
 * @description Ensures routes are only accessible to authenticated users.
 * Prevents flickering during initial auth restoration from localStorage.
 *
 * "use client" required: uses useAuth (context with state) and useRouter.
 * Replaces: react-router-dom <Navigate> with next/navigation useRouter.
 *
 * @param {React.ReactNode} children - Component to render if authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { user, isAuthReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthReady && !user) {
      router.replace('/login');
    }
  }, [isAuthReady, user, router]);

  // 1. Auth state is still being restored from localStorage — show spinner
  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 2. No authenticated user — redirect to login
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 3. Authenticated — render the protected content
  return children;
};

export default ProtectedRoute;
