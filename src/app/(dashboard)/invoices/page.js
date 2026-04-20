'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import InvoiceManagementTable from '@/components/invoices/InvoiceManagementTable';
import InvoiceSearchFilters from '@/components/invoices/InvoiceSearchFilters';
import InvoiceInsightRail from '@/components/invoices/InvoiceInsightRail';
import Button from '@/components/ui/Button';

/**
 * Invoices page
 * "use client" required: useData, useMemo, useRouter.
 */
export default function InvoicesPage() {
  const router = useRouter();
  const { invoices, loading, error, fetchInvoices } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Trigger one-time fetch on mount (handled by Context)
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Filtering logic
  const filteredInvoices = useMemo(() => {
    let result = [...invoices];
    
    // Hide cancelled invoices unless specifically requested
    if (selectedStatus === 'All') {
      result = result.filter(inv => inv.status !== 'cancelled');
    } else {
      result = result.filter((inv) => inv.status?.toLowerCase() === selectedStatus.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (inv) => 
          String(inv.invoiceNumber || '').toLowerCase().includes(q) || 
          inv.clientId?.name?.toLowerCase().includes(q) ||
          inv.title?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [searchQuery, selectedStatus, invoices]);

  // Derived metrics
  const metrics = useMemo(() => {
    return invoices.reduce(
      (acc, inv) => {
        if (inv.status === 'paid') acc.revenue += inv.amount;
        if (inv.status === 'pending') { acc.pending += inv.amount; acc.count.pending += 1; }
        // overdue logic can be added here if defined later
        return acc;
      },
      { revenue: 0, pending: 0, overdue: 0, count: { pending: 0, overdue: 0 } }
    );
  }, [invoices]);


  return (
    <div className="relative min-h-screen">
      <main className="pr-[360px] pt-8 pb-20 max-w-[1600px]">
        {/* Page Header */}
        <div className="flex justify-between items-end mb-16">
          <div className="max-w-2xl animate-fade-in transition-opacity duration-1000">
            <h2 className="font-headline text-6xl font-bold text-white tracking-tighter mb-4 leading-tight">Invoices</h2>
            <p className="text-on-surface-variant text-lg font-body leading-relaxed max-w-lg opacity-80">
              Manage your commercial relationships and monitor cash flow through our curated financial interface.
            </p>
          </div>
          <button
            onClick={() => router.push('/invoices/new')}
            className="bg-gradient-to-br from-primary to-primary-container text-on-primary-container px-10 py-5 rounded-2xl font-label font-bold text-sm tracking-[0.2em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_15px_40px_rgba(108,99,255,0.2)]"
          >
            + Create Invoice
          </button>
        </div>

        {/* Filters */}
        <InvoiceSearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />

        {/* Data Content */}
        {loading.invoices ? (
          <div className="glass-panel rounded-xl overflow-hidden mb-12 shadow-2xl border border-white/5 p-12">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-12 mb-10 last:mb-0 animate-pulse">
                <div className="h-4 w-32 bg-white/5 rounded-full" />
                <div className="h-4 w-48 bg-white/10 rounded-full" />
                <div className="h-4 w-24 bg-white/5 rounded-full ml-auto" />
                <div className="h-4 w-24 bg-white/10 rounded-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="glass-panel rounded-xl p-20 text-center border-error/10 mb-12 shadow-2xl bg-error/[0.02]">
            <span className="material-symbols-outlined text-6xl text-error/30 mb-6">sync_problem</span>
            <h3 className="text-2xl font-headline font-bold text-white mb-2">Systems Out of Sync</h3>
            <p className="text-on-surface-variant font-body mb-8 max-w-md mx-auto opacity-70">{error}</p>
            <Button variant="secondary" onClick={() => fetchInvoices(true)} className="px-8 py-4 opacity-80 hover:opacity-100">
              Retry Synchronization
            </Button>
          </div>
        ) : (
          <InvoiceManagementTable invoices={filteredInvoices} />
        )}
      </main>

      {/* Insight Rail */}
      <InvoiceInsightRail metrics={metrics} />

      {/* Background Glow */}
      <div className="fixed top-[-5%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-[150px] pointer-events-none -z-10 animate-pulse" />
    </div>
  );
}
