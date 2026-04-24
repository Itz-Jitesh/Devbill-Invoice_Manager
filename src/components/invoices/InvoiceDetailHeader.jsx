'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import { downloadInvoicePdf } from '@/lib/invoice-pdf';

/**
 * InvoiceDetailHeader component
 * @description Sticky top bar for the invoice detail page.
 * "use client" required: useRouter for breadcrumb navigation.
 * useNavigate → useRouter().push()
 */
const InvoiceDetailHeader = ({ invoiceNumber, status, onEdit, invoiceData }) => {
  const router = useRouter();
  const { id } = useParams();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/invoice/${id}/view`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  const handleDownload = () => {
    downloadInvoicePdf({
        ...invoiceData,
        invoiceNumber,
      }).catch((error) => {
      console.error('Failed to generate PDF invoice:', error);
      });
  };


  return (

    <header className="sticky top-0 z-40 bg-background/80  flex justify-between items-center w-full px-10 py-4 shadow-lg border-b border-[var(--color-surface-border)]">
      {/* Left: Invoice ID & Status */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <nav className="flex items-center gap-2 text-[10px] font-label text-on-surface-variant mb-1 tracking-widest uppercase cursor-pointer">
            <span onClick={() => router.push('/dashboard')} className="hover:text-[var(--color-on-surface)] transition-colors">Dashboard</span>
            <Icon name="chevron_right" size="xs" />
            <span onClick={() => router.push('/invoices')} className="hover:text-[var(--color-on-surface)] transition-colors">Invoices</span>
            <Icon name="chevron_right" size="xs" />
            <span className="text-[var(--color-on-surface)]/60">Details</span>
          </nav>
          <h2 className="text-2xl font-bold font-headline text-primary tracking-tight">#{invoiceNumber}</h2>
        </div>
        <span className={`px-4 py-1 rounded-full text-[10px] font-label font-bold uppercase tracking-widest border ${
          status === 'Paid' ? 'bg-emerald-500/10 text-[var(--color-on-surface)]merald-400 border-emerald-500/20' :
          status === 'Sent' ? 'bg-primary/10 text-primary border-primary/20' :
          'bg-slate-500/10 text-slate-400 border-slate-500/20'
        }`}>
          {status}
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-on-surface-variant hover:bg-[var(--color-surface)] hover:text-[var(--color-on-surface)] transition-all duration-300 group"
        >
          <Icon name="edit" size="lg" className="group-hover:scale-110 transition-transform" />
          <span className="font-body text-sm font-medium">Edit</span>
        </button>
        <button
          onClick={handleShare}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 group ${
            copied
              ? 'bg-secondary/20 text-secondary'
              : 'text-on-surface-variant hover:bg-[var(--color-surface)] hover:text-[var(--color-on-surface)]'
          }`}
        >
            {copied ? <Icon name="check_circle" size="lg" /> : <Icon name="link" size="lg" className="group-hover:scale-110 transition-transform" />}
          <span className="font-body text-sm font-medium">{copied ? 'Copied!' : 'Share Link'}</span>
        </button>
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-on-surface-variant hover:bg-[var(--color-surface)] hover:text-[var(--color-on-surface)] transition-all duration-300 group mr-6"
        >
          <Icon name="download" size="lg" className="group-hover:scale-110 transition-transform" />
          <span className="font-body text-sm font-medium">Download PDF</span>
        </button>

      </div>
    </header>

  );
};

export default InvoiceDetailHeader;
