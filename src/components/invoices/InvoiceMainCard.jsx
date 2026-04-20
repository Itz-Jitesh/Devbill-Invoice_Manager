// Pure presentational — no hooks
const InvoiceMainCard = ({ invoice }) => {
  return (
    <section className="glass-card rounded-[32px] p-16 relative overflow-hidden shadow-2xl shadow-black/40 border-primary/5">
      {/* Brand Accent Glows */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header: Bill To & Invoice Details */}
      <div className="flex justify-between items-start mb-20 relative z-10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-label mb-5 font-bold">Bill To</p>
          <h3 className="text-3xl font-bold font-headline text-white mb-3 tracking-tight">{invoice.clientName}</h3>
          <p className="text-on-surface-variant font-body text-sm">{invoice.clientEmail || 'billing@client.com'}</p>
          <p className="text-on-surface-variant font-body text-sm mt-3 leading-relaxed max-w-xs opacity-70">
            {invoice.clientAddress || '1200 Pacific Ave, Suite 300\nSan Francisco, CA 94109'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-label mb-5 font-bold">Invoice Details</p>
          <div className="space-y-3">
            <div className="flex justify-end gap-10">
              <span className="text-on-surface-variant font-body text-sm">Invoice Number</span>
              <span className="text-white font-body font-bold text-sm tracking-widest">{invoice.invoiceNumber || invoice.id}</span>
            </div>
            <div className="flex justify-end gap-10">
              <span className="text-on-surface-variant font-body text-sm">Issue Date</span>
              <span className="text-white font-body font-bold text-sm">{invoice.date || 'Oct 24, 2023'}</span>
            </div>
            <div className="flex justify-end gap-10">
              <span className="text-on-surface-variant font-body text-sm">Due Date</span>
              <span className="text-white font-body font-bold text-sm opacity-90">{invoice.dueDate || 'Nov 07, 2023'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="relative z-10 mb-20">
        <div className="grid grid-cols-12 pb-5 mb-6 border-b border-white/10 opacity-70">
          <div className="col-span-6 text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-label font-bold">Description</div>
          <div className="col-span-2 text-center text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-label font-bold">Qty</div>
          <div className="col-span-2 text-right text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-label font-bold">Rate</div>
          <div className="col-span-2 text-right text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-label font-bold">Amount</div>
        </div>
        <div className="space-y-4">
          {invoice.items ? (
            invoice.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 items-center p-6 rounded-2xl hover:bg-white/5 transition-all duration-300 group border border-transparent hover:border-white/5">
                <div className="col-span-6">
                  <h4 className="text-white font-body font-semibold tracking-tight group-hover:text-primary transition-colors">{item.description}</h4>
                  {item.subtext && <p className="text-xs text-on-surface-variant mt-2 opacity-60 font-body">{item.subtext}</p>}
                </div>
                <div className="col-span-2 text-center text-white/80 font-body text-sm">{item.quantity}</div>
                <div className="col-span-2 text-right text-white/80 font-body text-sm">${item.rate.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                <div className="col-span-2 text-right text-white font-body font-bold tracking-tight">${item.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              </div>
            ))
          ) : (
            <div className="grid grid-cols-12 items-center p-6 rounded-2xl hover:bg-white/5 transition-all duration-300 group">
              <div className="col-span-6">
                <h4 className="text-white font-body font-semibold tracking-tight">Web Infrastructure Design</h4>
                <p className="text-xs text-on-surface-variant mt-2 opacity-60">Architecture and cloud deployment planning</p>
              </div>
              <div className="col-span-2 text-center text-white/80 font-body text-sm">1</div>
              <div className="col-span-2 text-right text-white/80 font-body text-sm">$4,500.00</div>
              <div className="col-span-2 text-right text-white font-body font-bold tracking-tight">$4,500.00</div>
            </div>
          )}
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end relative z-10 pt-10 border-t border-white/10">
        <div className="w-80 space-y-5">
          <div className="flex justify-between items-center px-4">
            <span className="text-on-surface-variant font-body text-sm">Subtotal</span>
            <span className="text-white font-body font-semibold">${(invoice.subtotal || 10020).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center px-4">
            <span className="text-on-surface-variant font-body text-sm text-shadow-glow">Tax (8%)</span>
            <span className="text-white font-body font-semibold">${(invoice.taxAmount || 801.60).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center pt-8 border-t border-white/20 mt-4 px-4 bg-primary/5 rounded-2xl py-6">
            <span className="text-white font-headline text-xl opacity-80 uppercase tracking-widest text-xs font-bold font-label">Grand Total</span>
            <span className="text-white font-headline text-4xl font-bold tracking-tighter text-shadow-glow">
              ${(invoice.total || 10821.60).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvoiceMainCard;
