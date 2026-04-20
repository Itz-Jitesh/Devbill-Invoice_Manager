import DashboardGuard from '@/components/layout/DashboardGuard';

export const metadata = {
  title: 'DevBill – Dashboard',
};

/**
 * (dashboard) route group layout
 * Server Component: delegates client-side auth guard + dashboard shell
 * to DashboardGuard (which is "use client").
 *
 * All routes in this group (dashboard, clients, invoices, ...) are
 * automatically protected and wrapped in DashboardLayout.
 */
export default function DashboardGroupLayout({ children }) {
  return <DashboardGuard>{children}</DashboardGuard>;
}
