'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import Icon from '@/components/ui/Icon';

/**
 * InvoiceDetailHeader component
 * @description Sticky top bar for the invoice detail page.
 * "use client" required: useRouter for breadcrumb navigation.
 * useNavigate → useRouter().push()
 */
const InvoiceDetailHeader = ({ invoiceNumber, status, onEdit, invoiceData }) => {
  const router = useRouter();
  const { id } = useParams();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/invoice/${id}/view`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  const handleDownload = () => {
    // Dynamic Data Interpolation
    const year = new Date().getFullYear();
    const formattedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 15);
    const formattedDueDate = dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    const clientName = invoiceData?.clientId?.name || 'Valued Client';
    const clientEmail = invoiceData?.clientId?.email || 'contact@client.com';
    const clientCompany = invoiceData?.clientId?.company || 'Commercial Partner';
    const totalAmount = invoiceData?.amount || 0;
    const subtotal = totalAmount / 1.18;
    const tax = totalAmount - subtotal;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - ${invoiceNumber}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; padding: 20px; line-height: 1.6; }
        .invoice-container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); border-radius: 8px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 2px solid #2c3e50; }
        .company-info h1 { color: #2c3e50; font-size: 28px; margin-bottom: 5px; }
        .company-info p { color: #7f8c8d; font-size: 14px; }
        .company-info .agency-name { font-weight: 600; color: #3498db; margin-top: 8px; font-size: 16px; }
        .invoice-meta { text-align: right; }
        .invoice-meta h2 { color: #2c3e50; font-size: 24px; margin-bottom: 10px; }
        .invoice-meta p { color: #7f8c8d; font-size: 14px; margin: 5px 0; }
        .invoice-meta .invoice-number { font-weight: 600; color: #2c3e50; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        .detail-block h3 { color: #2c3e50; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; font-weight: 600; }
        .detail-block p { color: #34495e; font-size: 14px; margin: 3px 0; }
        .detail-block .client-name { font-size: 16px; font-weight: 600; color: #2c3e50; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        thead { background-color: #34495e; color: white; }
        th { padding: 15px; text-align: left; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
        tbody tr { border-bottom: 1px solid #ecf0f1; }
        td { padding: 15px; font-size: 14px; color: #34495e; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .summary-section { display: flex; justify-content: flex-end; margin-bottom: 40px; }
        .summary-box { width: 300px; border: 1px solid #ecf0f1; border-radius: 6px; padding: 20px; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
        .summary-row.total { border-top: 2px solid #3498db; padding-top: 12px; margin-top: 12px; font-size: 18px; }
        .thank-you-section { background-color: #f8f9fa; padding: 25px; border-radius: 6px; margin-bottom: 30px; border-left: 4px solid #3498db; }
        .footer-info { text-align: center; padding-top: 20px; border-top: 1px solid #ecf0f1; color: #95a5a6; font-size: 12px; }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <div class="company-info">
                <h1>DevBill</h1>
                <p>Powered by Jitz</p>
                <div class="agency-name">By Jitesh N</div>
            </div>
            <div class="invoice-meta">
                <h2>Invoice</h2>
                <p><span class="invoice-number">${invoiceNumber}</span></p>
                <p>Issued: <strong>${formattedDate}</strong></p>
                <p>Due: <strong>${formattedDueDate}</strong></p>
            </div>
        </div>
        <div class="details-grid">
            <div class="detail-block">
                <h3>Bill To</h3>
                <p class="client-name">${clientName}</p>
                <p>${clientEmail}</p>
                <p style="margin-top: 10px; color: #7f8c8d; font-size: 13px;">${clientCompany}</p>
            </div>
            <div class="detail-block">
                <h3>From</h3>
                <p class="client-name">Jitz</p>
                <p>itsjitesh.work@gmail.com</p>
                <p style="margin-top: 10px; color: #7f8c8d; font-size: 13px;">Professional Web Development Services</p>
            </div>
        </div>
        <div class="services-section">
            <table>
                <thead>
                    <tr>
                        <th>Service Description</th>
                        <th class="text-center">Qty</th>
                        <th class="text-right">Rate</th>
                        <th class="text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${invoiceData?.title || 'Professional Web Services'}</td>
                        <td class="text-center">1</td>
                        <td class="text-right">$${totalAmount.toLocaleString()}</td>
                        <td class="text-right">$${totalAmount.toLocaleString()}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="summary-section">
            <div class="summary-box">
                <div class="summary-row">
                    <label>Subtotal</label>
                    <span class="amount">$${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div class="summary-row">
                    <label>Tax (18% GST)</label>
                    <span class="amount">$${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div class="summary-row total">
                    <label>Total</label>
                    <span class="amount">$${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
            </div>
        </div>
        <div class="thank-you-section">
            <p><strong>Thank you for your business!</strong> We appreciate the opportunity to work with you. If you have any questions, please reach out.</p>
        </div>
        <div class="footer-info">
            <p>DevBill - Professional Invoice Generator | Powered by Jitz (Jitesh N)</p>
            <p>itsjitesh.work@gmail.com | www.jitz.dev | Computer Generated</p>
        </div>
    </div>
</body>
</html>
    `;
    
    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${invoiceNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  return (

    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl flex justify-between items-center w-full px-10 py-4 shadow-lg border-b border-white/5">
      {/* Left: Invoice ID & Status */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <nav className="flex items-center gap-2 text-[10px] font-label text-on-surface-variant mb-1 tracking-widest uppercase cursor-pointer">
            <span onClick={() => router.push('/dashboard')} className="hover:text-white transition-colors">Dashboard</span>
            <Icon name="chevron_right" size="xs" />
            <span onClick={() => router.push('/invoices')} className="hover:text-white transition-colors">Invoices</span>
            <Icon name="chevron_right" size="xs" />
            <span className="text-white/60">Details</span>
          </nav>
          <h2 className="text-2xl font-bold font-headline text-primary tracking-tight">#{invoiceNumber}</h2>
        </div>
        <span className={`px-4 py-1 rounded-full text-[10px] font-label font-bold uppercase tracking-widest border ${
          status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
          status === 'Sent' ? 'bg-primary/10 text-primary border-primary/20' :
          'bg-slate-500/10 text-slate-400 border-slate-500/20'
        }`}>
          {status}
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-on-surface-variant hover:bg-white/5 hover:text-white transition-all duration-300 group"
        >
          <Icon name="edit" size="lg" className="group-hover:scale-110 transition-transform" />
          <span className="font-body text-sm font-medium">Edit</span>
        </button>
        <button
          onClick={handleShare}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 group ${
            copied
              ? 'bg-secondary/20 text-secondary'
              : 'text-on-surface-variant hover:bg-white/5 hover:text-white'
          }`}
        >
            {copied ? <Icon name="check_circle" size="lg" /> : <Icon name="link" size="lg" className="group-hover:scale-110 transition-transform" />}
          <span className="font-body text-sm font-medium">{copied ? 'Copied!' : 'Share Link'}</span>
        </button>
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-on-surface-variant hover:bg-white/5 hover:text-white transition-all duration-300 group mr-6"
        >
          <Icon name="download" size="lg" className="group-hover:scale-110 transition-transform" />
          <span className="font-body text-sm font-medium">Download PDF</span>
        </button>

      </div>
    </header>

  );
};

export default InvoiceDetailHeader;
