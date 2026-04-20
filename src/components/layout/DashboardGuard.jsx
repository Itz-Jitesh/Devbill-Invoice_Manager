'use client';

import { useRouter } from 'next/navigation';
import DashboardLayout from './DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

/**
 * DashboardGuard — Client-side wrapper used by the (dashboard) layout.
 *
 * The (dashboard)/layout.js is a Server Component (so it can export metadata
 * and be composed with other server segments). It delegates the client-side
 * auth guard and layout shell to this component.
 */
const DashboardGuard = ({ children }) => {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
};

export default DashboardGuard;
