import Input from '@/components/ui/Input';

/**
 * InvoiceForm component
 * @description Handles basic invoice fields: client selection, number, and dates.
 * No hooks of its own — handlers/state passed as props from parent (NewInvoice page).
 */
const InvoiceForm = ({ invoice, setInvoice, clients }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="surface-card p-10 rounded-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Client Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest px-1">
            Select Client
          </label>
          <div className="relative group">
            <select
              name="clientId"
              value={invoice.clientId}
              onChange={handleChange}
              className="w-full bg-surface-container-highest/40 border border-[var(--color-surface-border)] rounded-xl px-4 py-4 text-on-surface font-body appearance-none focus:ring-2 focus:ring-primary/40 focus:outline-none transition-all cursor-pointer"
            >
              <option value="" disabled>Select a client</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id} className="bg-surface text-on-surface">
                  {client.name} {client.company ? `(${client.company})` : ''}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
              expand_more
            </span>
          </div>
        </div>

        {/* Invoice Title */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest px-1">
            Invoice Title
          </label>
          <Input name="title" value={invoice.title} onChange={handleChange} placeholder="e.g. Website Development" className="!mb-0" />
        </div>

        {/* Invoice Number */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest px-1">
            Invoice Number (Optional)
          </label>
          <Input name="invoiceNumber" value={invoice.invoiceNumber} onChange={handleChange} placeholder="Auto-generated if empty" className="!mb-0" />
        </div>

        {/* Issue Date */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest px-1">
            Issue Date
          </label>
          <Input type="date" name="issueDate" value={invoice.issueDate} onChange={handleChange} className="!mb-0 [color-scheme:dark]" />
        </div>

        {/* Due Date */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest px-1">
            Due Date
          </label>
          <Input type="date" name="dueDate" value={invoice.dueDate} onChange={handleChange} className="!mb-0 [color-scheme:dark]" />
        </div>
      </div>
    </section>
  );
};

export default InvoiceForm;
