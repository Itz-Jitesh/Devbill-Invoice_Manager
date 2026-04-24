import Button from '@/components/ui/Button';

/**
 * InvoiceSummaryCard component
 * @description Shows invoice totals, tax, discount, status toggle, and action buttons.
 * No hooks of its own — all state handled by parent (NewInvoice page).
 */
const InvoiceSummaryCard = ({ invoice, setInvoice, subtotal, total, onSave, onPreview }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const setStatus = (status) => {
    setInvoice((prev) => ({ ...prev, status }));
  };

  return (
    <aside className="sticky top-12 flex flex-col gap-8">
      {/* Status Toggle */}
      <div className="surface-card p-2 rounded-full flex items-center">
        {['pending', 'sent', 'paid'].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatus(status)}
            className={`flex-1 py-3 text-xs font-label font-bold tracking-widest rounded-full transition-all uppercase ${
              invoice.status === status
                ? 'bg-white/10 text-[var(--color-on-surface)] shadow-lg shadow-white/5'
                : 'text-on-surface-variant hover:text-[var(--color-on-surface)]'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Summary Card */}
      <div className="surface-card p-8 rounded-xl flex flex-col gap-6 shadow-2xl shadow-black/40 border-primary/10">
        <h4 className="text-xs font-label text-on-surface-variant uppercase tracking-[0.2em] font-bold">Summary</h4>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center text-on-surface-variant">
            <span className="font-body text-sm">Subtotal</span>
            <span className="font-body text-sm text-[var(--color-on-surface)] font-semibold">
              ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between items-center text-on-surface-variant">
            <span className="font-body text-sm">Tax (%)</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="tax"
                value={invoice.tax}
                onChange={handleChange}
                className="w-16 bg-[var(--color-surface)] border border-[var(--color-surface-border)] rounded-lg px-2 py-1 text-xs text-right text-[var(--color-on-surface)] focus:outline-none focus:border-primary/50"
              />
              <span className="text-xs">%</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-on-surface-variant">
            <span className="font-body text-sm">Discount ($)</span>
            <div className="flex items-center gap-2">
              <span className="text-xs">$</span>
              <input
                type="number"
                name="discount"
                value={invoice.discount}
                onChange={handleChange}
                className="w-24 bg-[var(--color-surface)] border border-[var(--color-surface-border)] rounded-lg px-2 py-1 text-xs text-right text-[var(--color-on-surface)] focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>
        </div>

        <div className="h-[1px] w-full bg-white/10 mt-2" />

        <div className="flex justify-between items-end mt-2">
          <span className="font-headline font-bold text-[var(--color-on-surface)] text-lg">Total</span>
          <div className="text-right">
            <span className="block text-[2.5rem] font-headline font-bold text-[var(--color-on-surface)] leading-none">
              ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] font-label text-primary uppercase tracking-widest font-semibold mt-2 block">USD (Incl. Tax)</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <Button
            variant="primary"
            onClick={onSave}
            className="w-full py-5 rounded-xl font-label font-bold tracking-widest uppercase text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-transform"
          >
            Save Invoice
          </Button>
          <Button
            variant="outline"
            onClick={onPreview}
            className="w-full py-5 rounded-xl border-[var(--color-surface-border)] text-on-surface font-label font-bold tracking-widest uppercase text-sm hover:bg-[var(--color-surface)] transition-all"
          >
            Preview
          </Button>
        </div>
      </div>

      {/* Quote */}
      <div className="px-4 text-[var(--color-on-surface-variant)]enter">
        <p className="text-[11px] font-label text-on-surface-variant/50 italic leading-relaxed">
          &quot;Precision in billing is the signature of excellence.&quot;<br />
          Invoice will be automatically formatted for PDF export.
        </p>
      </div>
    </aside>
  );
};

export default InvoiceSummaryCard;
