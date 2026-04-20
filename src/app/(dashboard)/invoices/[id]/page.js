'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import InvoiceDetailHeader from '@/components/invoices/InvoiceDetailHeader';
import InvoiceMainCard from '@/components/invoices/InvoiceMainCard';
import StatusTimeline from '@/components/invoices/StatusTimeline';

/**
 * Invoice Detail page — /invoices/[id]
 * "use client" required: useState, useEffect, useParams, useRouter.
 */
export default function InvoiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { invoices, loading, error: dataError, fetchInvoices, updateInvoice } = useData();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    amount: '',
    status: '',
  });

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const invoice = useMemo(
    () => invoices.find((inv) => String(inv._id) === String(id)) || null,
    [invoices, id]
  );

  const isLoading = loading.invoices && !invoice;
  const error = !isLoading && !invoice ? (dataError || 'Invoice not found') : null;

  const handleEdit = () => {
    if (!invoice) return;

    setEditForm({
      title: invoice.title || '',
      amount: invoice.amount || '',
      status: invoice.status || 'pending',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const { success, error: updateError } = await updateInvoice(id, {
      title: editForm.title,
      amount: Number(editForm.amount),
      status: editForm.status,
    });

    if (success) {
      setIsEditModalOpen(false);
    } else {
      alert('Error updating invoice: ' + updateError);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
        <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-8" />
        <p className="text-on-surface-variant font-body text-lg tracking-wide uppercase text-xs font-bold font-label">
          Retrieving Invoice Data...
        </p>
      </div>
    );
  }

  // Error state
  if (error || !invoice) {
    return (
      <div className="glass-card p-16 rounded-[40px] text-center border-error/20 max-w-2xl mx-auto mt-20">
        <span className="material-symbols-outlined text-error text-8xl mb-8 opacity-40">error</span>
        <h3 className="text-3xl font-headline font-bold text-white mb-4">Invoice Not Found</h3>
        <p className="text-on-surface-variant font-body mb-10 leading-relaxed">{error}</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-3 px-10 py-5 bg-white/5 hover:bg-white/10 rounded-2xl text-white font-bold transition-all mx-auto tracking-widest uppercase text-xs"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-24">
      {/* Sticky Header */}
      <InvoiceDetailHeader
        invoiceNumber={invoice.invoiceNumber || invoice._id}
        status={invoice.status}
        onEdit={handleEdit}
      />

      {/* Content Layout - Full width, no sidebar */}
      <main className="px-8 pt-8 space-y-16 max-w-6xl mx-auto w-full">
        <InvoiceMainCard invoice={invoice} />
        <StatusTimeline />
      </main>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl p-8 max-w-lg w-full border border-white/10">
            <h3 className="font-headline text-2xl font-bold text-on-surface mb-6">Edit Invoice</h3>
            <form onSubmit={handleSaveEdit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-label uppercase tracking-[0.2em] text-on-surface-variant/60">
                  Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary/40 transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-label uppercase tracking-[0.2em] text-on-surface-variant/60">
                  Amount ($)
                </label>
                <input
                  type="number"
                  value={editForm.amount}
                  onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                  className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary/40 transition-all"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-label uppercase tracking-[0.2em] text-on-surface-variant/60">
                  Status
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary/40 transition-all"
                >
                  <option value="sent">Sent</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-on-surface-variant hover:bg-white/5 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary-container font-semibold hover:opacity-90 transition-opacity"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Background Glows */}
      <div className="fixed top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none -z-10 animate-pulse" />
      <div className="fixed bottom-[10%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-secondary-container/5 blur-[100px] pointer-events-none -z-10" />
    </div>
  );
}
