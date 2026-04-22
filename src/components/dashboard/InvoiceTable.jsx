'use client';

import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/Icon';
import FormattedDate from '@/components/ui/FormattedDate';

/**
 * InvoiceTable component (Dashboard)
 * @description Displays a list of recent invoices in a stylized table format.
 * "use client" required: uses useRouter for row-click navigation.
 * useNavigate → useRouter().push()
 */
const InvoiceTable = ({ invoices }) => {
  const router = useRouter();

  return (
    <div className="glass-card rounded-xl overflow-hidden mt-6">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low/50">
            <th className="px-8 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Client</th>
            <th className="px-8 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Invoice #</th>
            <th className="px-8 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Amount</th>
            <th className="px-8 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
            <th className="px-8 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Date</th>
            <th className="px-8 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {invoices?.map((invoice) => (
            <tr
              key={invoice?._id || 'unknown'}
              className="hover:bg-white/5 transition-colors group cursor-pointer"
              onClick={() => router.push(`/invoices/${invoice._id}`)}
            >
              <td className="px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-surface-container-high border border-white/5 flex items-center justify-center">
                    <span className="text-primary font-bold text-xs">{invoice?.clientId?.name?.charAt(0) || '?'}</span>
                  </div>
                  <div>
                    <div className="font-medium text-on-surface">{invoice?.clientId?.name || 'Unknown'}</div>
                    <div className="text-xs text-on-surface-variant">{invoice?.title || 'Untitled'}</div>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6">
                <div className="font-mono text-xs text-on-surface-variant font-bold bg-white/5 px-2 py-1 rounded border border-white/5 inline-block">
                  #{invoice?.invoiceNumber || '---'}
                </div>
              </td>
              <td className="px-8 py-6">
                <div className="font-medium text-on-surface">${invoice?.amount?.toLocaleString?.() || '0'}</div>
              </td>
              <td className="px-8 py-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                  invoice?.status === 'paid' ? 'bg-[#34D399]/10 text-[#34D399]' :
                  invoice?.status === 'pending' || invoice?.status === 'sent' ? 'bg-primary/10 text-primary' :
                  'bg-slate-500/10 text-slate-400'
                }`}>
                  {invoice?.status || 'unknown'}
                </span>
              </td>
              <td className="px-8 py-6 text-sm text-on-surface-variant font-medium">{invoice?.date ? <FormattedDate date={invoice.date} /> : 'N/A'}</td>
              <td className="px-8 py-6 text-right">
                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    className="p-2 text-on-surface-variant hover:text-on-surface transition-colors"
                    onClick={(e) => { e.stopPropagation(); router.push(`/invoices/${invoice?._id}`); }}
                  >
                    <Icon name="visibility" size="sm" />
                  </button>
                  <button
                    type="button"
                    className="p-2 text-on-surface-variant hover:text-on-surface transition-colors"
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
  );
};

export default InvoiceTable;
