function parseInvoiceSequence(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.trunc(value);
  }

  const trimmed = String(value).trim();

  if (/^\d+$/.test(trimmed)) {
    return Number.parseInt(trimmed, 10);
  }

  const match = trimmed.match(/^INV-(\d{4})-(\d+)$/i);
  if (match) {
    return Number.parseInt(match[2], 10);
  }

  return Number.NaN;
}

export function formatInvoiceNumber(value, invoiceDate) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsedSequence = parseInvoiceSequence(value);
  if (Number.isNaN(parsedSequence)) {
    return String(value);
  }

  const year = invoiceDate ? new Date(invoiceDate).getFullYear() : new Date().getFullYear();
  return `INV-${year}-${String(parsedSequence).padStart(4, '0')}`;
}

export function normalizeClientRecord(client) {
  if (!client) {
    return null;
  }

  const id = client.id ?? client._id ?? null;

  return {
    ...client,
    id,
    _id: id,
    userId: client.user_id ?? client.userId ?? null,
  };
}

export function normalizeInvoiceRecord(invoice) {
  if (!invoice) {
    return null;
  }

  const relatedClient = invoice.client ?? invoice.clientId ?? null;
  const id = invoice.id ?? invoice._id ?? null;

  return {
    ...invoice,
    id,
    _id: id,
    userId: invoice.user_id ?? invoice.userId ?? null,
    invoiceNumber: formatInvoiceNumber(invoice.invoice_number ?? invoice.invoiceNumber, invoice.date),
    dueDate: invoice.due_date ?? invoice.dueDate ?? null,
    clientId: relatedClient
      ? normalizeClientRecord({
          ...relatedClient,
          id: relatedClient.id ?? invoice.client_id ?? relatedClient._id,
        })
      : null,
  };
}

export function parseInvoiceNumberInput(value) {
  const parsedSequence = parseInvoiceSequence(value);
  return Number.isNaN(parsedSequence) ? null : parsedSequence;
}
