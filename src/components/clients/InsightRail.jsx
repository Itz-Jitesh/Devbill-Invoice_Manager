// Pure presentational — no hooks
const InsightRail = ({ activeProjects = '24', pendingInvoices = '08', growthPercent = '12%' }) => {
  return (
    <aside className="fixed right-0 top-0 h-screen w-80 py-16 px-10 flex flex-col gap-12 bg-[var(--color-surface)] -[20px] border-l border-[var(--color-surface-border)] z-40">
      {/* Active Projects */}
      <div className="space-y-1">
        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/40">Active Projects</span>
        <p className="font-headline text-5xl font-light text-indigo-100">{activeProjects}</p>
      </div>

      {/* Pending Invoices */}
      <div className="space-y-1">
        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/40">Pending Invoices</span>
        <p className="font-headline text-5xl font-light text-amber-200">{pendingInvoices}</p>
      </div>

      {/* Analytics Insight Card */}
      <div className="mt-auto">
        <div className="rounded-2xl surface-card p-6 overflow-hidden relative group">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-20 mix-blend-luminosity group-hover:opacity-30 transition-opacity bg-center bg-cover"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCLjbkAqJX_0kfG50p7CtcVoR-n_KkrApMU3-ZzTHYJd1IXnwxryxXs1a4MSnD_oegX12VrdgSVO9c9WVtCf8tv_F9eKpDtMaTYYAYFbHxh2Q9TFYKUJL75R3HjLy7otmLNNAtSriIsOnRIf_QeYwkWOVn_YQ0BYPqjEm-CD6lZUyKw6APU5b0A9-StPUNJHe2N9cskNObEHynnz8vFh1qGUiZb8aMN9UUs5fh8JBtcHu9BvGDzYp9l_SbzuzVR6Ju9EqXjvchsuHU")',
            }}
          />
          <div className="relative z-10">
            <p className="font-body text-xs text-on-surface-variant leading-relaxed">
              Client retention has increased by{' '}
              <span className="text-[#45dfa4] font-bold">{growthPercent}</span> this quarter.
            </p>
            <a href="#" className="inline-block mt-4 text-[10px] uppercase tracking-widest font-bold text-primary hover:text-[var(--color-on-surface)] transition-colors">
              View Analytics →
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default InsightRail;
