'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useData } from '@/context/DataContext';
import InvoiceManagementTable from '@/components/invoices/InvoiceManagementTable';
import InvoiceSearchFilters from '@/components/invoices/InvoiceSearchFilters';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';

export default function InvoicesPage() {
  const router = useRouter();
  const { invoices, loading, error, fetchInvoices } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const filteredInvoices = useMemo(() => {
    let result = [...invoices];
    if (selectedStatus === 'All') {
      result = result.filter(inv => inv.status !== 'cancelled');
    } else {
      result = result.filter((inv) => {
        const s = inv.status?.toLowerCase();
        const sel = selectedStatus.toLowerCase();
        if (sel === 'sent') return s === 'sent' || s === 'pending';
        return s === sel;
      });
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, ease: "easeOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 60, damping: 20 }
    }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="relative min-h-screen"
    >
      <main className="max-w-[1400px] mx-auto pt-8 pb-20">
        {/* Page Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
          <div className="max-w-2xl">
            <h2 className="font-headline text-[var(--color-on-surface-variant)]xl font-bold text-[var(--color-on-surface)] tracking-tighter mb-2 leading-tight">
              Invoices
            </h2>
            <p className="text-[var(--color-on-surface-variant)] text-lg font-body leading-relaxed max-w-lg">
              Manage your commercial relationships and monitor cash flow through our curated financial interface.
            </p>
          </div>
          <Button
            onClick={() => router.push('/invoices/new')}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Icon name="add" size="sm" />
            Create Invoice
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="mb-12">
          <InvoiceSearchFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
        </motion.div>

        {/* Data Content */}
        {loading.invoices ? (
          <motion.div variants={itemVariants} className="surface-card rounded-xl overflow-hidden mb-12 p-8 space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-6 opacity-50">
                <div className="h-10 w-10 bg-[var(--color-surface-border)] rounded-md animate-pulse" />
                <div className="space-y-2 flex-1 animate-pulse">
                  <div className="h-2 w-32 bg-[var(--color-surface-border)] rounded-full" />
                  <div className="h-2 w-24 bg-[var(--color-surface-border)] rounded-full" />
                </div>
              </div>
            ))}
          </motion.div>
        ) : error ? (
          <motion.div variants={itemVariants} className="surface-card rounded-xl p-16 text-center border-[var(--color-error)] mb-12 bg-[var(--color-error)]/5">
            <div className="h-16 w-16 bg-[var(--color-error)]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--color-error)]/20">
              <Icon name="sync_problem" size="lg" className="text-[var(--color-error)]" />
            </div>
            <h3 className="text-xl font-headline font-bold text-[var(--color-on-surface)] mb-2 tracking-tight">Systems Out of Sync</h3>
            <p className="text-[var(--color-on-surface-variant)] font-body mb-8 max-w-md mx-auto leading-relaxed">{error}</p>
            <Button variant="outline" onClick={() => fetchInvoices(true)} className="mx-auto text-[var(--color-error)] border-[var(--color-error)]/30 hover:bg-[var(--color-error)]/10">
              Retry Synchronization
            </Button>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants}>
            <InvoiceManagementTable invoices={filteredInvoices} />
          </motion.div>
        )}
      </main>
    </motion.div>
  );
}

