'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

/**
 * Public Invoice View Page
 * @description Public-facing invoice view that does NOT require authentication.
 * Route: /invoice/[id]/view
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
        <div className="glass-panel rounded-3xl p-12 text-center max-w-md">
          <span className="material-symbols-outlined text-6xl text-error/50 mb-4">receipt_long</span>
          <h1 className="font-headline text-2xl font-bold text-on-surface mb-2">Invoice Not Found</h1>
          <p className="text-on-surface-variant font-body mb-6">
            {error || 'This invoice may have been deleted or the link is incorrect.'}
          </p>
          <p className="text-on-surface-variant/50 text-sm font-body">
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
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'pending':
      case 'sent':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'overdue':
        return 'bg-error/20 text-error border-error/30';
      default:
        return 'bg-white/10 text-on-surface-variant border-white/20';
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Invoice Card */}
        <div className="glass-panel rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="bg-surface-container-low/50 p-8 sm:p-10 border-b border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <p className="text-on-surface-variant/60 font-label text-xs uppercase tracking-widest mb-1">
                  Invoice
                </p>
                <h1 className="font-headline text-3xl sm:text-4xl font-bold text-on-surface">
                  {invoice.invoiceNumber || `#${invoice._id?.slice(-6).toUpperCase()}`}
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
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
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
              <div className="pt-6 border-t border-white/5">
                <p className="text-on-surface-variant/60 font-label text-xs uppercase tracking-widest mb-2">
                  Description
                </p>
                <p className="font-body text-on-surface">{invoice.title}</p>
              </div>
            )}

            {/* Amount */}
            <div className="pt-8 border-t border-white/5">
              <div className="flex items-center justify-between">
                <p className="text-on-surface-variant/60 font-label text-xs uppercase tracking-widest">
                  Total Amount
                </p>
                <p className="font-headline text-4xl font-bold text-primary">
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

          {/* Footer */}
          <div className="bg-surface-container-low/30 p-6 text-center border-t border-white/5">
            <p className="text-on-surface-variant/40 font-body text-xs">
              Powered by DevBill • Secure Invoice Sharing
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-on-surface-variant/30 font-body text-xs flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-sm">lock</span>
            This is a secure, view-only invoice link
          </p>
        </div>
      </div>
    </div>
  );
}
