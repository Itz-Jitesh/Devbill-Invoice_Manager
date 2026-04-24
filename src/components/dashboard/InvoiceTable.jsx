'use client';

import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/Icon';
import FormattedDate from '@/components/ui/FormattedDate';

const InvoiceTable = ({ invoices }) => {
  const router = useRouter();

  return (
    <div className="surface-card rounded-xl overflow-hidden mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[var(--color-surface-hover)] border-b border-[var(--color-surface-border)]">
              <th className="px-6 py-4 text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Client</th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Invoice #</th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-surface-border)]">
            {invoices?.map((invoice) => (
              <tr
                key={invoice?._id || 'unknown'}
                className="hover:bg-[var(--color-surface-hover)] transition-colors group cursor-pointer"
                onClick={() => router.push(`/invoices/${invoice._id}`)}
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-md bg-[var(--color-surface)] border border-[var(--color-surface-border)] flex items-center justify-center">
                      <span className="text-[var(--color-on-surface)] font-medium text-sm">{invoice?.clientId?.name?.charAt(0) || '?'}</span>
                    </div>
                    <div>
                      <div className="font-medium text-sm text-[var(--color-on-surface)]">{invoice?.clientId?.name || 'Unknown'}</div>
                      <div className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{invoice?.title || 'Untitled'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm text-[var(--color-on-surface-variant)] font-mono bg-[var(--color-surface)] border border-[var(--color-surface-border)] px-2 py-1 rounded">
                    {invoice?.invoiceNumber || '---'}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="font-medium text-sm text-[var(--color-on-surface)]">${invoice?.amount?.toLocaleString?.() || '0'}</div>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border ${
                    invoice?.status?.toLowerCase() === 'paid' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20' :
                    invoice?.status?.toLowerCase() === 'pending' || invoice?.status?.toLowerCase() === 'sent' ? 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20' :
                    'bg-[var(--color-surface)] text-[var(--color-on-surface-variant)] border-[var(--color-surface-border)]'
                  }`}>
                    {invoice?.status?.toLowerCase() === 'pending' ? 'Sent' : invoice?.status || 'unknown'}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm text-[var(--color-on-surface-variant)]">
                  {invoice?.date ? <FormattedDate date={invoice.date} /> : 'N/A'}
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      className="p-2 rounded-md text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface)] border border-transparent hover:border-[var(--color-surface-border)]"
                      onClick={(e) => { e.stopPropagation(); router.push(`/invoices/${invoice?._id}`); }}
                    >
                      <Icon name="visibility" size="sm" />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-md text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface)] border border-transparent hover:border-[var(--color-surface-border)]"
                      onClick={(e) => { e.stopPropagation(); router.push(`/invoices/${invoice?._id}`); }}
                    >
                      <Icon name="edit" size="sm" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceTable;
