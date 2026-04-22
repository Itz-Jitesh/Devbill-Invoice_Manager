'use client';

import { useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import Icon from '@/components/ui/Icon';
import FormattedDate from '@/components/ui/FormattedDate';

/**
 * InvoiceManagementTable component
 */
const InvoiceManagementTable = ({ invoices }) => {
  const router = useRouter();
  const { deleteInvoice, updateInvoice } = useData();

  const handleMarkAsPaid = async (e, id) => {
    e.stopPropagation();
    const { success, error } = await updateInvoice(id, { status: 'paid' });
    if (!success) alert('Error updating status: ' + error);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this invoice?')) {
      const { success, error } = await deleteInvoice(id);
      if (!success) alert('Error deleting invoice: ' + error);
    }
  };

  return (
    <div className="glass-panel rounded-xl overflow-x-auto mb-12 shadow-2xl border border-white/5">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 bg-white/[0.02]">
            <th className="px-8 py-6 text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant font-bold">Invoice Number</th>
            <th className="px-8 py-6 text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant font-bold">Client Name</th>
            <th className="px-8 py-6 text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant font-bold">Amount</th>
            <th className="px-8 py-6 text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant font-bold text-center">Status</th>
            <th className="px-8 py-6 text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant font-bold">Issue Date</th>
            <th className="px-8 py-6 text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant font-bold">Due Date</th>
            <th className="px-8 py-6 text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant font-bold text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <tr
                key={invoice._id}
                className="group hover:bg-white/[0.03] transition-colors cursor-pointer"
                onClick={() => router.push(`/invoices/${invoice._id}`)}
              >
                <td className="px-8 py-8">
                  <div className="font-mono text-xs text-on-surface-variant font-bold bg-white/5 px-2 py-1 rounded border border-white/5 inline-block">
                    #{invoice.invoiceNumber || '---'}
                  </div>
                </td>
                <td className="px-8 py-8">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded flex items-center justify-center text-[10px] font-bold border border-white/5 ${
                      invoice.status === 'paid' ? 'bg-secondary/10 text-secondary' :
                      invoice.status === 'overdue' ? 'bg-error/10 text-error' :
                      invoice.status === 'pending' || invoice.status === 'sent' ? 'bg-tertiary/10 text-tertiary' :
                      'bg-surface-variant text-on-surface-variant'
                    }`}>
                      {invoice.clientId?.name?.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || '??'}
                    </div>
                    <span className="font-body text-on-surface group-hover:text-primary transition-colors">{invoice.clientId?.name || 'Unknown Client'}</span>
                  </div>
                </td>
                <td className="px-8 py-8 font-headline text-lg font-bold text-white">
                  ${(invoice.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-8 py-8 text-center">
                  <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                    invoice.status?.toLowerCase() === 'paid' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                    invoice.status?.toLowerCase() === 'pending' || invoice.status?.toLowerCase() === 'sent' ? 'bg-primary/10 text-primary border-primary/20' :
                    invoice.status?.toLowerCase() === 'overdue' ? 'bg-error/10 text-error border-error/20' :
                    'bg-white/5 text-on-surface-variant border-white/10'
                  }`}>
                    {invoice.status?.toLowerCase() === 'pending' ? 'Sent' : invoice.status}
                  </span>
                </td>

                <td className="px-8 py-8 text-on-surface-variant font-label text-sm opacity-80"><FormattedDate date={invoice.date} /></td>
                <td className="px-8 py-8 text-on-surface-variant font-label text-sm opacity-80">{invoice.dueDate ? <FormattedDate date={invoice.dueDate} /> : 'N/A'}</td>
                <td className="px-8 py-8 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    {invoice.status !== 'paid' && (
                      <button
                        type="button"
                        className="p-2 hover:bg-secondary/20 rounded-lg transition-colors text-secondary"
                        onClick={(e) => handleMarkAsPaid(e, invoice._id)}
                        title="Mark as Paid"
                      >
                        <Icon name="check_circle" size="lg" />
                      </button>
                    )}
                    <button
                      type="button"
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-on-surface-variant hover:text-white"
                      onClick={(e) => { e.stopPropagation(); router.push(`/invoices/${invoice._id}`); }}
                      title="View Details"
                    >
                      <Icon name="visibility" size="lg" />
                    </button>
                    <button
                      type="button"
                      className="p-2 hover:bg-error/20 rounded-lg transition-colors text-error"
                      onClick={(e) => handleDelete(e, invoice._id)}
                      title="Delete Invoice"
                    >
                      <Icon name="delete" size="lg" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-8 py-20 text-center">
                <div className="flex flex-col items-center gap-4 opacity-30">
                  <Icon name="receipt_long" size="xl" className="scale-150 mb-4" />
                  <p className="font-label uppercase tracking-[0.2em] text-[10px] font-bold">No records found</p>
                </div>

              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceManagementTable;
