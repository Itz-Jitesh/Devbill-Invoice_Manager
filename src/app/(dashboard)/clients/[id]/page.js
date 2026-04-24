'use client';

import { useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import InvoiceManagementTable from '@/components/invoices/InvoiceManagementTable';
import Button from '@/components/ui/Button';

/**
 * Client Detail Page
 * @description Shows client-specific information and their associated invoices.
 */
export default function ClientDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { clients, invoices, loading, fetchClients, fetchInvoices } = useData();

  useEffect(() => {
    fetchClients();
    fetchInvoices();
  }, [fetchClients, fetchInvoices]);

  const client = useMemo(() => clients.find((c) => c._id === id), [clients, id]);
  
  const clientInvoices = useMemo(() => 
    invoices.filter((inv) => (inv.clientId._id || inv.clientId) === id), 
  [invoices, id]);

  const stats = useMemo(() => {
    return clientInvoices.reduce((acc, inv) => {
      if (inv.status === 'paid') acc.paid += inv.amount;
      else acc.pending += inv.amount;
      return acc;
    }, { paid: 0, pending: 0 });
  }, [clientInvoices]);

  if (loading.clients && !client) {
    return <div className="p-8 text-[var(--color-on-surface)]">Loading client details...</div>;
  }

  if (!client) {
    return (
      <div className="p-8 text-[var(--color-on-surface-variant)]enter">
        <h2 className="text-2xl text-[var(--color-on-surface)]">Client not found</h2>
        <Button className="mt-4" onClick={() => router.push('/clients')}>Back to Clients</Button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Client Header */}
      <section className="flex justify-between items-start">
        <div>
          <button 
            onClick={() => router.push('/clients')}
            className="text-on-surface-variant hover:text-primary mb-4 flex items-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Clients
          </button>
          <h1 className="text-5xl font-headline font-light text-on-surface tracking-tight">{client.name}</h1>
          <p className="text-on-surface-variant mt-2">{client.company} — {client.email}</p>
        </div>
        
        <div className="flex gap-4">
          <div className="surface-card px-6 py-4 rounded-2xl text-[var(--color-on-surface-variant)]enter">
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-1">Total Billed</p>
            <p className="text-2xl font-headline text-[var(--color-on-surface)]">${(stats.paid + stats.pending).toLocaleString()}</p>
          </div>
          <div className="surface-card px-6 py-4 rounded-2xl text-[var(--color-on-surface-variant)]enter border-primary/20 bg-primary/5">
            <p className="text-[10px] uppercase tracking-widest text-primary mb-1">Outstanding</p>
            <p className="text-2xl font-headline text-[var(--color-on-surface)]">${stats.pending.toLocaleString()}</p>
          </div>
        </div>
      </section>

      {/* Client's Invoices */}
      <section className="space-y-6">
        <h3 className="text-2xl font-headline font-light text-on-surface">Invoice History</h3>
        {clientInvoices.length > 0 ? (
          <InvoiceManagementTable invoices={clientInvoices} />
        ) : (
          <div className="surface-card p-20 text-[var(--color-on-surface-variant)]enter rounded-2xl border-[var(--color-surface-border)]">
            <span className="material-symbols-outlined text-6xl opacity-20 mb-4">receipt_long</span>
            <p className="text-on-surface-variant">No invoices found for this client.</p>
          </div>
        )}
      </section>
    </div>
  );
}
