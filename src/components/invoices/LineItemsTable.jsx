import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

/**
 * LineItemsTable component
 * @description Dynamic line items editor. Allows add/remove rows and live recalculation.
 * No hooks of its own — state managed by parent (NewInvoice page).
 */
const LineItemsTable = ({ items, setItems }) => {
  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), description: '', quantity: 1, rate: 0, total: 0 }]);
  };

  const handleUpdateItem = (id, field, value) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updatedItem.total =
              (parseFloat(updatedItem.quantity) || 0) * (parseFloat(updatedItem.rate) || 0);
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id) => {
    // Keep at least one item
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <h3 className="text-2xl font-headline font-bold text-[var(--color-on-surface)] px-2">Line Items</h3>
      <div className="surface-card rounded-xl overflow-hidden shadow-2xl shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface)] border-b border-[var(--color-surface-border)]">
                <th className="px-6 py-5 text-xs font-label text-on-surface-variant uppercase tracking-widest font-semibold">Description</th>
                <th className="px-6 py-5 text-xs font-label text-on-surface-variant uppercase tracking-widest font-semibold w-24 text-[var(--color-on-surface-variant)]enter">Qty</th>
                <th className="px-6 py-5 text-xs font-label text-on-surface-variant uppercase tracking-widest font-semibold w-40">Rate</th>
                <th className="px-6 py-5 text-xs font-label text-on-surface-variant uppercase tracking-widest font-semibold w-40 text-right">Amount</th>
                <th className="px-6 py-5 w-16" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((item) => (
                <tr key={item.id} className="group hover:bg-[var(--color-surface)] transition-colors">
                  <td className="px-6 py-6">
                    <input
                      type="text"
                      placeholder="Service or product description"
                      value={item.description}
                      onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                      className="w-full bg-surface-container-highest/30 border border-[var(--color-surface-border)] rounded-lg px-4 py-2 text-sm font-body text-on-surface focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </td>
                  <td className="px-6 py-6 text-[var(--color-on-surface-variant)]enter">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)}
                      className="w-full bg-surface-container-highest/30 border border-[var(--color-surface-border)] rounded-lg px-2 py-2 text-sm font-body text-on-surface text-[var(--color-on-surface-variant)]enter focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </td>
                  <td className="px-6 py-6">
                    <div className="relative group/input">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => handleUpdateItem(item.id, 'rate', e.target.value)}
                        className="w-full bg-surface-container-highest/30 border border-[var(--color-surface-border)] rounded-lg pl-8 pr-4 py-2 text-sm font-body text-on-surface focus:outline-none focus:border-primary/50 transition-all"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right font-body font-semibold text-[var(--color-on-surface)]">
                    ${(item.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-6 text-[var(--color-on-surface-variant)]enter">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-on-surface-variant/40 hover:text-[var(--color-on-surface)]rror transition-colors cursor-pointer flex justify-center"
                    >
                      <Icon name="delete" size="md" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-[var(--color-surface-border)]">
          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center gap-2 text-primary hover:text-[var(--color-on-surface)] font-label text-sm font-bold tracking-wide transition-all group"
          >
            <Icon name="add_circle" size="lg" className="group-hover:scale-110 transition-transform" />
            Add Line Item
          </button>
        </div>
      </div>
    </section>
  );
};

export default LineItemsTable;
