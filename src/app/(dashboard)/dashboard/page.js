'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import StatCard from '@/components/ui/StatCard';
import InvoiceTable from '@/components/dashboard/InvoiceTable';
import Button from '@/components/ui/Button';

/**
 * Dashboard page
 * "use client" required: useData, useEffect, useRouter.
 */
export default function DashboardPage() {
  const router = useRouter();
  const { invoices, clients, stats, loading, fetchInvoices } = useData();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const displayName = user?.name || user?.username || 'Alex';

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Show welcome toast after login redirect
  useEffect(() => {
    const shouldShowToast = sessionStorage.getItem('showWelcomeToast');
    if (shouldShowToast) {
      showToast('Welcome back! You have successfully logged in.', 'success');
      sessionStorage.removeItem('showWelcomeToast');
    }
  }, [showToast]);

  const dashboardStats = [
    { title: 'Total Earned', value: `$${stats.totalRevenue.toLocaleString()}`, trendValue: 'Income', trendColor: 'text-[#34D399]', bgColor: 'bg-[#34D399]/10' },
    { title: 'Invoices Sent', value: stats.totalProjects.toString(), trendValue: 'Total', trendColor: 'text-primary', bgColor: 'bg-primary/10' },
    { title: 'Pending Amount', value: `$${stats.pendingAmount.toLocaleString()}`, trendValue: 'Due', trendColor: 'text-[#FBBF24]', bgColor: 'bg-[#FBBF24]/10' },
    { title: 'Due Payments', value: stats.duePaymentsCount.toString(), trendValue: 'Action needed', trendColor: 'text-teal-400', bgColor: 'bg-teal-400/10' },
  ];

  // Filter recent invoices by search term (title, client name, status)
  const filteredRecentInvoices = useMemo(() => {
    let result = invoices.slice(0, 5); // Show last 5 instead of 3
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = invoices.filter(inv =>
        inv.title?.toLowerCase().includes(term) ||
        inv.clientId?.name?.toLowerCase().includes(term) ||
        inv.status?.toLowerCase().includes(term) ||
        inv.invoiceNumber?.toLowerCase().includes(term)
      ).slice(0, 5);
    }
    return result;
  }, [invoices, searchTerm]);

  return (
    <div className="space-y-12">
      {/* Greeting */}
      <section>
        <h2 className="text-5xl font-headline font-light tracking-tight text-on-surface mb-2">Good morning, {displayName} 👋</h2>
        <p className="text-on-surface-variant max-w-2xl font-body leading-relaxed">
          {loading.invoices ? (
            'Loading your business performance...'
          ) : (
            `You have ${stats.duePaymentsCount} pending invoice${stats.duePaymentsCount !== 1 ? 's' : ''} that need attention.`
          )}
        </p>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </section>

      {/* Recent Invoices */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h3 className="text-2xl font-headline font-light text-on-surface">Recent Invoices</h3>
            <p className="text-on-surface-variant text-sm mt-1">Manage your latest billing activities and statuses.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="glass-card rounded-xl flex items-center px-4 py-2.5 min-w-[240px]">
              <span className="material-symbols-outlined text-on-surface-variant/60 mr-3">search</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search invoices..."
                className="bg-transparent border-none focus:ring-0 text-sm font-body w-full placeholder:text-on-surface-variant/40 text-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-on-surface-variant/50 hover:text-on-surface transition-colors ml-2"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              )}
            </div>
            <Button
              variant="primary"
              className="flex items-center gap-2 px-6 shadow-lg shadow-primary/10 whitespace-nowrap"
              onClick={() => router.push('/invoices/new')}
            >
              <span>Create Invoice</span>
            </Button>
          </div>
        </div>
        <InvoiceTable invoices={filteredRecentInvoices} />
        {searchTerm && filteredRecentInvoices.length === 0 && (
          <div className="text-center py-8 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
            <p>No invoices found matching &quot;{searchTerm}&quot;</p>
          </div>
        )}
      </section>
    </div>
  );
}
