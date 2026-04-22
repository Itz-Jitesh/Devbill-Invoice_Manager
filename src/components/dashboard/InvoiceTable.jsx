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
    <div className="glass-card rounded-2xl overflow-hidden mt-6 shadow-2xl border-white/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-white/2">
              <th className="px-8 py-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] opacity-40">Client</th>
              <th className="px-8 py-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] opacity-40">Invoice #</th>
              <th className="px-8 py-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] opacity-40">Amount</th>
              <th className="px-8 py-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] opacity-40">Status</th>
              <th className="px-8 py-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] opacity-40">Date</th>
              <th className="px-8 py-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] opacity-40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {invoices?.map((invoice) => (
              <tr
                key={invoice?._id || 'unknown'}
                className="hover:bg-white/10 transition-all group cursor-pointer"
                onClick={() => router.push(`/invoices/${invoice._id}`)}
              >
                <td className="px-8 py-7">
                  <div className="flex items-center gap-4">
                    <div className="h-11 w-11 rounded-xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center shadow-lg">
                      <span className="text-primary font-bold text-xs">{invoice?.clientId?.name?.charAt(0) || '?'}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-on-surface tracking-tight">{invoice?.clientId?.name || 'Unknown'}</div>
                      <div className="text-[10px] text-on-surface-variant/60 font-medium tracking-wide uppercase mt-0.5">{invoice?.title || 'Untitled'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-7">
                  <div className="font-mono text-[10px] text-primary/70 font-bold bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10 inline-block tracking-tighter whitespace-nowrap">
                    {invoice?.invoiceNumber || '---'}
                  </div>
                </td>

                <td className="px-8 py-7">
                  <div className="font-bold text-sm text-on-surface tracking-tight">${invoice?.amount?.toLocaleString?.() || '0'}</div>
                </td>
                <td className="px-8 py-7">
                  <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
                    invoice?.status?.toLowerCase() === 'paid' ? 'bg-[#34D399]/5 text-[#34D399] border-[#34D399]/10' :
                    invoice?.status?.toLowerCase() === 'pending' || invoice?.status?.toLowerCase() === 'sent' ? 'bg-primary/5 text-primary border-primary/20' :
                    'bg-white/5 text-on-surface-variant border-white/5'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 opacity-50" />
                    {invoice?.status?.toLowerCase() === 'pending' ? 'Sent' : invoice?.status || 'unknown'}
                  </span>
                </td>

                <td className="px-8 py-7 text-xs text-on-surface-variant font-medium tracking-wide">{invoice?.date ? <FormattedDate date={invoice.date} /> : 'N/A'}</td>
                <td className="px-8 py-7 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    <button
                      type="button"
                      className="p-2.5 glass-card rounded-xl text-on-surface-variant hover:text-primary hover:border-primary/20"
                      onClick={(e) => { e.stopPropagation(); router.push(`/invoices/${invoice?._id}`); }}
                    >
                      <Icon name="visibility" size="sm" />
                    </button>
                    <button
                      type="button"
                      className="p-2.5 glass-card rounded-xl text-on-surface-variant hover:text-primary hover:border-primary/20"
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
