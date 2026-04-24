function formatCurrency(value) {
  return Number(value ?? 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(value) {
  const date = value ? new Date(value) : null;

  if (!date || Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function resolveDueDate(invoice) {
  const explicitDueDate = formatDate(invoice?.dueDate);
  if (explicitDueDate) {
    return explicitDueDate;
  }

  const sourceDate = invoice?.date ? new Date(invoice.date) : new Date();
  if (Number.isNaN(sourceDate.getTime())) {
    return formatDate(new Date());
  }

  sourceDate.setDate(sourceDate.getDate() + 15);
  return formatDate(sourceDate);
}

function getLineItems(invoice) {
  if (Array.isArray(invoice?.items) && invoice.items.length > 0) {
    return invoice.items.map((item, index) => {
      const quantity = Number(item.quantity ?? 1);
      const rate = Number(item.rate ?? item.unitPrice ?? 0);
      const total = Number(item.total ?? quantity * rate);

      return {
        key: item.id ?? index,
        description: item.description || item.title || `Service ${index + 1}`,
        quantity,
        rate,
        total,
      };
    });
  }

  const amount = Number(invoice?.amount ?? 0);

  return [
    {
      key: invoice?._id || invoice?.id || 'line-item',
      description: invoice?.title || 'Professional Web Services',
      quantity: 1,
      rate: amount,
      total: amount,
    },
  ];
}

function buildInvoiceMarkup(invoice) {
  const invoiceNumber = invoice?.invoiceNumber || invoice?._id || invoice?.id || 'invoice';
  const issuedDate = formatDate(invoice?.date) || formatDate(new Date());
  const dueDate = resolveDueDate(invoice);
  const clientName = invoice?.clientId?.name || 'Valued Client';
  const clientEmail = invoice?.clientId?.email || 'contact@client.com';
  const clientCompany = invoice?.clientId?.company || 'Commercial Partner';
  const lineItems = getLineItems(invoice);
  const totalAmount = Number(
    invoice?.amount ?? lineItems.reduce((sum, item) => sum + item.total, 0)
  );
  const subtotal = totalAmount / 1.18;
  const tax = totalAmount - subtotal;

  const itemRows = lineItems
    .map(
      (item) => `
        <tr>
          <td>${item.description}</td>
          <td class="text-[var(--color-on-surface-variant)]enter">${item.quantity}</td>
          <td class="text-right">$${formatCurrency(item.rate)}</td>
          <td class="text-right">$${formatCurrency(item.total)}</td>
        </tr>
      `
    )
    .join('');

  return `
    <div class="devbill-pdf-root">
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
            <p>Issued: <strong>${issuedDate}</strong></p>
            <p>Due: <strong>${dueDate}</strong></p>
          </div>
        </div>
        <div class="details-grid">
          <div class="detail-block">
            <h3>Bill To</h3>
            <p class="client-name">${clientName}</p>
            <p>${clientEmail}</p>
            <p class="muted-company">${clientCompany}</p>
          </div>
          <div class="detail-block">
            <h3>From</h3>
            <p class="client-name">Jitz</p>
            <p>hello@jitz.dev</p>
            <p class="muted-company">Professional Web Development Services</p>
          </div>
        </div>
        <div class="services-section">
          <table>
            <thead>
              <tr>
                <th>Service Description</th>
                <th class="text-[var(--color-on-surface-variant)]enter">Qty</th>
                <th class="text-right">Rate</th>
                <th class="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
          </table>
        </div>
        <div class="summary-section">
          <div class="summary-box">
            <div class="summary-row">
              <label>Subtotal</label>
              <span class="amount">$${formatCurrency(subtotal)}</span>
            </div>
            <div class="summary-row">
              <label>Tax (18% GST)</label>
              <span class="amount">$${formatCurrency(tax)}</span>
            </div>
            <div class="summary-row total">
              <label>Total</label>
              <span class="amount">$${formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>
        <div class="thank-you-section">
          <p><strong>Thank you for your business!</strong> We appreciate the opportunity to work with you. If you have any questions, please reach out.</p>
        </div>
        <div class="footer-info">
          <p>DevBill - Professional Invoice Generator | Powered by Jitz (Jitesh N)</p>
          <p>hello@jitz.dev | www.jitz.dev | Computer Generated</p>
        </div>
      </div>
    </div>
  `;
}

function buildInvoiceStyles() {
  return `
    .devbill-pdf-root,
    .devbill-pdf-root * {
      box-sizing: border-box;
    }

    .devbill-pdf-root {
      width: 940px;
      background-color: #f5f5f5;
      padding: 20px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #34495e;
    }

    .devbill-pdf-root .invoice-container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }

    .devbill-pdf-root .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 2px solid #2c3e50;
    }

    .devbill-pdf-root .company-info h1 {
      margin: 0 0 5px;
      color: #2c3e50;
      font-size: 28px;
    }

    .devbill-pdf-root .company-info p,
    .devbill-pdf-root .invoice-meta p {
      margin: 0;
      color: #7f8c8d;
      font-size: 14px;
    }

    .devbill-pdf-root .agency-name {
      margin-top: 8px;
      color: #3498db;
      font-size: 16px;
      font-weight: 600;
    }

    .devbill-pdf-root .invoice-meta {
      text-align: right;
    }

    .devbill-pdf-root .invoice-meta h2 {
      margin: 0 0 10px;
      color: #2c3e50;
      font-size: 24px;
    }

    .devbill-pdf-root .invoice-number {
      font-weight: 600;
      color: #2c3e50;
    }

    .devbill-pdf-root .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 40px;
    }

    .devbill-pdf-root .detail-block h3 {
      margin: 0 0 10px;
      color: #2c3e50;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }

    .devbill-pdf-root .detail-block p {
      margin: 3px 0;
      color: #34495e;
      font-size: 14px;
    }

    .devbill-pdf-root .detail-block .client-name {
      font-size: 16px;
      font-weight: 600;
      color: #2c3e50;
    }

    .devbill-pdf-root .detail-block .muted-company {
      margin-top: 10px;
      color: #7f8c8d;
      font-size: 13px;
    }

    .devbill-pdf-root table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }

    .devbill-pdf-root thead {
      background-color: #34495e;
      color: white;
    }

    .devbill-pdf-root th {
      padding: 15px;
      text-align: left;
      font-weight: 600;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .devbill-pdf-root tbody tr {
      border-bottom: 1px solid #ecf0f1;
    }

    .devbill-pdf-root td {
      padding: 15px;
      font-size: 14px;
      color: #34495e;
    }

    .devbill-pdf-root .text-right {
      text-align: right;
    }

    .devbill-pdf-root .text-[var(--color-on-surface-variant)]enter {
      text-align: center;
    }

    .devbill-pdf-root .summary-section {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 40px;
    }

    .devbill-pdf-root .summary-box {
      width: 300px;
      border: 1px solid #ecf0f1;
      border-radius: 6px;
      padding: 20px;
    }

    .devbill-pdf-root .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 14px;
    }

    .devbill-pdf-root .summary-row.total {
      border-top: 2px solid #3498db;
      padding-top: 12px;
      margin-top: 12px;
      font-size: 18px;
    }

    .devbill-pdf-root .thank-you-section {
      background-color: #f8f9fa;
      padding: 25px;
      border-radius: 6px;
      margin-bottom: 30px;
      border-left: 4px solid #3498db;
    }

    .devbill-pdf-root .thank-you-section p {
      margin: 0;
    }

    .devbill-pdf-root .footer-info {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #ecf0f1;
      color: #95a5a6;
      font-size: 12px;
    }

    .devbill-pdf-root .footer-info p {
      margin: 0;
    }
  `;
}

function renderCanvasPages(canvas, pagePixelHeight) {
  const pages = [];
  let offsetY = 0;

  while (offsetY < canvas.height) {
    const sliceHeight = Math.min(pagePixelHeight, canvas.height - offsetY);
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeight;

    const context = pageCanvas.getContext('2d');
    context.drawImage(
      canvas,
      0,
      offsetY,
      canvas.width,
      sliceHeight,
      0,
      0,
      canvas.width,
      sliceHeight
    );

    pages.push(pageCanvas);
    offsetY += sliceHeight;
  }

  return pages;
}

export async function downloadInvoicePdf(invoice) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.left = '-10000px';
  wrapper.style.top = '0';
  wrapper.style.width = '940px';
  wrapper.style.zIndex = '-1';
  wrapper.style.pointerEvents = 'none';
  wrapper.innerHTML = `<style>${buildInvoiceStyles()}</style>${buildInvoiceMarkup(invoice)}`;

  document.body.appendChild(wrapper);

  try {
    const target = wrapper.querySelector('.devbill-pdf-root');
    const canvas = await html2canvas(target, {
      scale: 2,
      backgroundColor: '#f5f5f5',
      useCORS: true,
      logging: false,
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;
    const pagePixelHeight = Math.floor((usableHeight * canvas.width) / usableWidth);
    const pages = renderCanvasPages(canvas, pagePixelHeight);

    pages.forEach((pageCanvas, index) => {
      if (index > 0) {
        pdf.addPage();
      }

      const imageHeight = (pageCanvas.height * usableWidth) / pageCanvas.width;
      pdf.addImage(
        pageCanvas.toDataURL('image/png'),
        'PNG',
        margin,
        margin,
        usableWidth,
        imageHeight
      );
    });

    const invoiceNumber = invoice?.invoiceNumber || invoice?._id || invoice?.id || 'invoice';
    const safeInvoiceNumber = String(invoiceNumber).replace(/[^\w-]+/g, '_');
    pdf.save(`Invoice_${safeInvoiceNumber}.pdf`);
  } finally {
    document.body.removeChild(wrapper);
  }
}
