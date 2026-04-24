import Icon from '@/components/ui/Icon';

// Pure presentational — handlers passed from parent (Invoices page)
const InvoiceSearchFilters = ({ searchQuery, setSearchQuery, selectedStatus, setSelectedStatus }) => {
  const statuses = ['All', 'Sent', 'Paid', 'Overdue'];


  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
      {/* Search Input */}
      <div className="flex items-center surface-card bg-[var(--color-surface)] border border-[var(--color-surface-border)] px-5 py-3.5 rounded-2xl w-full md:w-[420px] shadow-2xl focus-within:border-primary/50 transition-all transition-colors group">
        <Icon name="search" size="lg" className="text-on-surface-variant group-focus-within:text-primary transition-colors mr-3" />
        <input
          className="bg-transparent border-none focus:ring-0 text-sm text-on-surface placeholder:text-on-surface-variant/40 w-full font-label tracking-wide"
          placeholder="Search number or client..."
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Status Segmented Control */}
      <div className="flex items-center gap-4">
        <div className="surface-card p-1.5 rounded-2xl flex gap-1 bg-[var(--color-surface)] border border-[var(--color-surface-border)] shadow-lg">
          {statuses.map((status) => {
            const isActive = selectedStatus === status;
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-6 py-2.5 rounded-xl text-sm transition-all duration-300 font-label ${
                  isActive
                    ? 'bg-white/10 text-[var(--color-on-surface)] shadow-inner font-bold tracking-tight scale-[1.02]'
                    : 'text-on-surface-variant hover:text-[var(--color-on-surface)] hover:bg-white/[0.03]'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 ml-2">
          <button 
            onClick={() => alert('Filter options coming soon!')}
            className="surface-card p-3.5 rounded-xl hover:bg-white/10 transition-all text-on-surface-variant hover:text-[var(--color-on-surface)] border border-[var(--color-surface-border)] shadow-lg group"
          >
            <Icon name="filter_list" size="lg" className="group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={() => alert('Download feature coming soon!')}
            className="surface-card p-3.5 rounded-xl hover:bg-white/10 transition-all text-on-surface-variant hover:text-[var(--color-on-surface)] border border-[var(--color-surface-border)] shadow-lg group"
          >
            <Icon name="download" size="lg" className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSearchFilters;
