'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import InvoiceForm from '@/components/invoices/InvoiceForm';
import LineItemsTable from '@/components/invoices/LineItemsTable';
import InvoiceSummaryCard from '@/components/invoices/InvoiceSummaryCard';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

export default function NewInvoicePage() {
  const router = useRouter();
  const { clients, fetchClients, addInvoice, loading } = useData();

  const [invoice, setInvoice] = useState({
    clientId: '',
    title: 'Service Project',
    invoiceNumber: '',
    issueDate: '',
    dueDate: '',
    tax: 10,
    discount: 0,
    status: 'pending',
  });

  const [items, setItems] = useState([
    { id: 1, description: 'Service Description', quantity: 1, rate: 0, total: 0 },
  ]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInvoice((prev) => {
        if (prev.issueDate && prev.dueDate) {
          return prev;
        }

        const now = new Date();
        const dueDate = new Date(now);
        dueDate.setDate(dueDate.getDate() + 30);

        return {
          ...prev,
          issueDate: now.toISOString().split('T')[0],
          dueDate: dueDate.toISOString().split('T')[0],
        };
      });
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const taxAmount = subtotal * (invoice.tax / 100);
  const grandTotal = subtotal + taxAmount - invoice.discount;

  const handleSaveInvoice = async () => {
    if (!invoice.clientId || !invoice.title) {
      alert('Please select a client and provide a title.');
      return;
    }

    const { success, error } = await addInvoice({
      ...invoice,
      amount: grandTotal,
      date: invoice.issueDate,
    });

    if (success) {
      router.push('/invoices');
    } else {
      alert('Error saving invoice: ' + error);
    }
  };

  const handlePreview = () => {
    console.log('Previewing Invoice...');
    alert('Preview mode is under development.');
  };

  return (
    <div className="relative min-h-screen">
      {/* Header with Breadcrumbs */}
      <header className="flex justify-between items-center w-full mb-10">
        <div className="flex flex-col">
          <nav className="flex items-center gap-2 text-xs font-semibold text-[var(--color-on-surface-variant)] mb-3 tracking-widest uppercase">
            <span className="hover:text-[var(--color-primary)] transition-colors cursor-pointer" onClick={() => router.push('/dashboard')}>Dashboard</span>
            <Icon name="chevron_right" size="xs" />
            <span className="hover:text-[var(--color-primary)] transition-colors cursor-pointer" onClick={() => router.push('/invoices')}>Invoices</span>
            <Icon name="chevron_right" size="xs" />
            <span className="text-[var(--color-on-surface)]">New</span>
          </nav>
          <h2 className="text-[var(--color-on-surface-variant)]xl font-headline font-bold text-[var(--color-on-surface)] tracking-tight">New Invoice</h2>
        </div>
      </header>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20">
        {/* Left: Core Fields & Line Items */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <InvoiceForm invoice={invoice} setInvoice={setInvoice} clients={clients} />
          <LineItemsTable items={items} setItems={setItems} />
        </div>

        {/* Right: Summary & Actions */}
        <div className="lg:col-span-4">
          <InvoiceSummaryCard
            invoice={invoice}
            setInvoice={setInvoice}
            subtotal={subtotal}
            total={grandTotal}
            onSave={handleSaveInvoice}
            onPreview={handlePreview}
          />
        </div>
      </div>
    </div>
  );
}
