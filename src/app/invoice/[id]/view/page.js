'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Icon from '@/components/ui/Icon';

/**
 * Public Invoice View Page
 */
export default function PublicInvoiceView() {
  const { id } = useParams();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/invoices/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Invoice not found');
        }

        setInvoice(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoice();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-on-surface-variant font-body text-sm">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="surface-card rounded-3xl p-12 text-[var(--color-on-surface-variant)]enter max-w-md ">
          <Icon name="receipt_long" size="xl" className="text-[var(--color-on-surface)]rror/30 mb-6 scale-150" />
          <h1 className="font-headline text-3xl font-bold text-[var(--color-on-surface)] mb-3 tracking-tight">Invoice Not Found</h1>
          <p className="text-on-surface-variant font-body mb-8 opacity-60 leading-relaxed">
            {error || 'This invoice may have been deleted or the link is incorrect.'}
          </p>
          <p className="text-[10px] text-on-surface-variant/40 font-label uppercase tracking-widest">
            Please contact the sender for assistance.
          </p>
        </div>
      </div>
    );
  }


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-emerald-500/20 text-[var(--color-on-surface)]merald-400 border-emerald-500/30';
      case 'pending':
      case 'sent':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'overdue':
        return 'bg-error/20 text-[var(--color-on-surface)]rror border-error/30';
      default:
        return 'bg-white/10 text-on-surface-variant border-white/20';
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Invoice Card */}
        <div className="surface-card rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="bg-surface-container-low/50 p-8 sm:p-10 border-b border-[var(--color-surface-border)]">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <p className="text-on-surface-variant/60 font-label text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">
                  Invoice
                </p>
                <h1 className="font-headline text-[var(--color-on-surface-variant)]xl sm:text-5xl font-bold text-[var(--color-on-surface)] tracking-tighter ">
                  {invoice.invoiceNumber || 'INV-0000'}
                </h1>
              </div>

              <span
                className={`inline-flex px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(
                  invoice.status
                )}`}
              >
                {invoice.status || 'Draft'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 sm:p-10 space-y-8">
            {/* Client Info */}
            <div className="space-y-1">
              <p className="text-on-surface-variant/60 font-label text-xs uppercase tracking-widest mb-2">
                Billed To
              </p>
              <h2 className="font-body text-xl font-semibold text-on-surface">
                {invoice.clientId?.name || 'Unknown Client'}
              </h2>
              {invoice.clientId?.email && (
                <p className="text-on-surface-variant font-body text-sm">{invoice.clientId.email}</p>
              )}
              {invoice.clientId?.company && (
                <p className="text-on-surface-variant/70 font-body text-sm">{invoice.clientId.company}</p>
              )}
            </div>

            {/* Invoice Details Grid */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[var(--color-surface-border)]">
              <div>
                <p className="text-on-surface-variant/60 font-label text-xs uppercase tracking-widest mb-1">
                  Issue Date
                </p>
                <p className="font-body text-on-surface">{formatDate(invoice.date)}</p>
              </div>
              <div>
                <p className="text-on-surface-variant/60 font-label text-xs uppercase tracking-widest mb-1">
                  Due Date
                </p>
                <p className="font-body text-on-surface">{formatDate(invoice.dueDate)}</p>
              </div>
            </div>

            {/* Description */}
            {invoice.title && (
              <div className="pt-6 border-t border-[var(--color-surface-border)]">
                <p className="text-on-surface-variant/60 font-label text-xs uppercase tracking-widest mb-2">
                  Description
                </p>
                <p className="font-body text-on-surface">{invoice.title}</p>
              </div>
            )}

            {/* Amount */}
            <div className="pt-8 border-t border-[var(--color-surface-border)]">
              <div className="flex items-center justify-between">
                <p className="text-on-surface-variant/60 font-label text-xs uppercase tracking-widest">
                  Total Amount
                </p>
                <p className="font-headline text-[var(--color-on-surface-variant)]xl font-bold text-primary">
                  {formatCurrency(invoice.amount || 0)}
                </p>
              </div>
            </div>

            {/* Payment CTA (if pending) */}
            {(invoice.status === 'pending' || invoice.status === 'sent') && (
              <div className="pt-6">
                <button className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary-container font-semibold rounded-xl hover:opacity-90 transition-opacity font-label uppercase tracking-wider text-sm">
                  Pay Now
                </button>
              </div>
            )}
          </div>

          <div className="bg-surface-container-low/30 p-8 text-[var(--color-on-surface-variant)]enter border-t border-[var(--color-surface-border)]">
            <p className="text-on-surface-variant/40 font-body text-[10px] uppercase tracking-[0.2em] font-bold leading-relaxed">
              Powered by DevBill • Professional Invoice Sharing<br/>
              Support: itsjitesh.work@gmail.com
            </p>
          </div>

        </div>

        {/* Security Notice */}
        <div className="mt-8 text-[var(--color-on-surface-variant)]enter  delay-500">
          <p className="text-on-surface-variant/30 font-body text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 font-bold">
            <Icon name="lock" size="sm" className="text-primary/40" />
            Secure view-only transaction
          </p>
        </div>

      </div>
    </div>
  );
}
