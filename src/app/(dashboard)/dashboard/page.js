'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import StatCard from '@/components/ui/StatCard';
import InvoiceTable from '@/components/dashboard/InvoiceTable';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

/**
 * Dashboard page
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

  // Filter recent invoices by search term
  const filteredRecentInvoices = useMemo(() => {
    let result = invoices.slice(0, 5); 
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
    <div className="space-y-16 py-8">
      {/* Greeting */}
      <section className="animate-in fade-in slide-in-from-top-4 duration-1000">
        <h2 className="text-7xl font-headline font-bold tracking-tighter text-on-surface mb-4 leading-tight text-shadow-glow">
          Good morning, {displayName}
        </h2>
        <p className="text-on-surface-variant text-xl max-w-2xl font-body leading-relaxed opacity-60">
          {loading.invoices ? (
            'Loading your business performance...'
          ) : (
            `You have ${stats.duePaymentsCount} pending invoice${stats.duePaymentsCount !== 1 ? 's' : ''} that need attention.`
          )}
        </p>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 stagger-load">
        {dashboardStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </section>

      {/* Recent Invoices */}
      <section className="space-y-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6">
          <div>
            <h3 className="text-3xl font-headline font-bold text-on-surface tracking-tight">Recent Invoices</h3>
            <p className="text-on-surface-variant text-sm mt-2 font-body opacity-60">Manage your latest billing activities and statuses.</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="glass-panel px-5 py-3 rounded-2xl flex items-center min-w-[320px] focus-within:border-primary/50 transition-all border border-white/5">
              <Icon name="search" size="lg" className="text-on-surface-variant opacity-40 mr-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Find an invoice..."
                className="bg-transparent border-none focus:ring-0 text-sm font-body w-full placeholder:text-on-surface-variant/30 text-white"
              />
            </div>
            <Button
              variant="primary"
              className="flex items-center gap-3 px-8 shadow-2xl"
              onClick={() => router.push('/invoices/new')}
            >
              <Icon name="add" size="sm" />
              Create
            </Button>
          </div>
        </div>
        
        <div className="stagger-load">
          <InvoiceTable invoices={filteredRecentInvoices} />
        </div>

        {searchTerm && filteredRecentInvoices.length === 0 && (
          <div className="text-center py-24 glass-panel rounded-3xl border-white/5">
            <Icon name="search_off" size="xl" className="text-on-surface-variant/20 mb-6" />
            <p className="text-on-surface-variant font-headline text-lg">No invoices found matching &quot;{searchTerm}&quot;</p>
          </div>
        )}
      </section>
    </div>
  );
}

