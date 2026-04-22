'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import InvoiceManagementTable from '@/components/invoices/InvoiceManagementTable';
import InvoiceSearchFilters from '@/components/invoices/InvoiceSearchFilters';
import Icon from '@/components/ui/Icon';
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

  // Trigger one-time fetch on mount
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Filtering logic
  const filteredInvoices = useMemo(() => {
    let result = [...invoices];
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

  return (
    <div className="relative min-h-screen">
      <main className="max-w-[1400px] mx-auto pt-8 pb-20">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20 animate-in slide-in-from-top-4 duration-1000">
          <div className="max-w-2xl">
            <h2 className="font-headline text-7xl font-bold text-white tracking-tighter mb-6 leading-tight text-shadow-glow">
              Invoices
            </h2>
            <p className="text-on-surface-variant text-xl font-body leading-relaxed max-w-lg opacity-60">
              Manage your commercial relationships and monitor cash flow through our curated financial interface.
            </p>
          </div>
          <button
            onClick={() => router.push('/invoices/new')}
            className="group relative bg-white/[0.03] hover:bg-white/[0.08] text-white border border-white/10 px-10 py-5 rounded-2xl font-label font-bold text-sm tracking-[0.2em] uppercase transition-all hover:scale-105 active:scale-95 shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <span className="relative z-10 flex items-center gap-3">
              <Icon name="add" size="sm" />
              Create Invoice
            </span>
          </button>
        </div>

        {/* Filters */}
        <div className="mb-12 glass-card p-2 rounded-2xl">
          <InvoiceSearchFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
        </div>

        {/* Data Content */}
        {loading.invoices ? (
          <div className="glass-panel rounded-3xl overflow-hidden mb-12 shadow-2xl border border-white/5 p-12 space-y-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-12 animate-pulse">
                <div className="h-12 w-12 bg-white/5 rounded-xl" />
                <div className="space-y-3 flex-1">
                  <div className="h-3 w-48 bg-white/10 rounded-full" />
                  <div className="h-2 w-32 bg-white/5 rounded-full" />
                </div>
                <div className="h-8 w-24 bg-white/5 rounded-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="glass-panel rounded-3xl p-20 text-center border-error/10 mb-12 shadow-2xl bg-error/[0.02] backdrop-blur-3xl">
            <div className="h-20 w-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-error/20">
              <Icon name="sync_problem" size="lg" className="text-error" />
            </div>
            <h3 className="text-3xl font-headline font-bold text-white mb-3 tracking-tight">Systems Out of Sync</h3>
            <p className="text-on-surface-variant font-body mb-10 max-w-md mx-auto opacity-70 leading-relaxed">{error}</p>
            <Button variant="outline" onClick={() => fetchInvoices(true)} className="px-10 py-5 rounded-2xl border-error/30 text-error hover:bg-error/10">
              Retry Synchronization
            </Button>
          </div>
        ) : (
          <div className="stagger-load">
            <InvoiceManagementTable invoices={filteredInvoices} />
          </div>
        )}
      </main>

      {/* Background Decor */}
      <div className="fixed top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/[0.03] blur-[180px] pointer-events-none -z-10" />
    </div>
  );
}

