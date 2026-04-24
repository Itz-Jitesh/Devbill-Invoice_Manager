/**
 * InvoiceInsightRail component
 * @description Dynamic sidebar metrics for the Invoices and InvoiceDetail pages.
 * Pure presentational — no hooks.
 *
 * Default value added to metrics to handle InvoiceDetail page where no metrics
 * data is available (the original code would crash if metrics was undefined).
 */
const InvoiceInsightRail = ({
  metrics = { revenue: 0, pending: 0, overdue: 0, count: { pending: 0, overdue: 0 } },
}) => {
  const { revenue = 0, pending = 0, overdue = 0, count = { pending: 0, overdue: 0 } } = metrics;

  return (
    <aside className="fixed right-0 top-0 h-full w-[360px] bg-[var(--color-surface)] -[40px] border-l border-[var(--color-surface-border)] p-12 pt-32 space-y-14 z-30 shadow-2xl">
      <div>
        <h3 className="font-headline text-[var(--color-on-surface)] text-3xl font-bold tracking-tight mb-3">Financial Pulse</h3>
        <p className="text-on-surface-variant font-label text-[10px] uppercase tracking-[0.3em] opacity-50 font-bold">Real-time Metrics</p>
      </div>

      <div className="space-y-12">
        {/* Revenue */}
        <div className="group relative">
          <div className="flex items-center gap-3 text-secondary mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">payments</span>
            <span className="font-label font-bold tracking-[0.2em] text-[10px] uppercase">Net Revenue</span>
          </div>
          <p className="font-headline text-[var(--color-on-surface)] text-5xl font-bold tracking-tighter transition-all group-hover:scale-105 origin-left">
            ${revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <div className="mt-6 h-1.5 w-full bg-[var(--color-surface)] rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-secondary/40 to-secondary w-[85%] transition-all duration-1000 shadow-[0_0_15px_rgba(69,223,164,0.3)]" />
          </div>
        </div>

        {/* Pending */}
        <div className="group relative">
          <div className="flex items-center gap-3 text-tertiary mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-2xl group-hover:">pending_actions</span>
            <span className="font-label font-bold tracking-[0.2em] text-[10px] uppercase">Accounts Receivable</span>
          </div>
          <p className="font-headline text-[var(--color-on-surface)] text-5xl font-bold tracking-tighter transition-all group-hover:scale-105 origin-left">
            ${pending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-on-surface-variant text-xs mt-4 font-body tracking-wide opacity-60">
            {count.pending} invoice{count.pending !== 1 ? 's' : ''} awaiting settlement
          </p>
        </div>

        {/* Overdue */}
        <div className="group relative">
          <div className="flex items-center gap-3 text-[var(--color-on-surface)]rror mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">error</span>
            <span className="font-label font-bold tracking-[0.2em] text-[10px] uppercase">Overdue Liability</span>
          </div>
          <p className="font-headline text-[var(--color-on-surface)] text-5xl font-bold tracking-tighter transition-all group-hover:scale-105 origin-left">
            ${overdue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[var(--color-on-surface)]rror/70 text-xs mt-4 font-body font-bold tracking-wide">
            Action required on {count.overdue} item{count.overdue !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Quote Card */}
      <div className="pt-12 border-t border-[var(--color-surface-border)]">
        <div className="surface-card p-8 rounded-3xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors shadow-2xl group relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-sm font-body text-indigo-100/80 mb-6 italic leading-relaxed relative z-10 font-medium">
            &quot;Productivity is being able to do things that you were never able to do before.&quot;
          </p>
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[10px] font-label text-primary font-bold uppercase tracking-[0.2em] opacity-70">Kevin Kelly</span>
            <span className="material-symbols-outlined text-primary/30 group-hover:text-primary/100 transition-all text-3xl">format_quote</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default InvoiceInsightRail;
