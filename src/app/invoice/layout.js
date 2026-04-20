/**
 * Public Invoice Layout
 * @description Layout for public invoice routes - NO authentication required.
 * This is intentionally minimal since it's a public-facing page.
 */
export const metadata = {
  title: 'Invoice - DevBill',
  description: 'View your invoice details',
};

export default function InvoiceLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-on-surface font-body">
      {children}
    </div>
  );
}
