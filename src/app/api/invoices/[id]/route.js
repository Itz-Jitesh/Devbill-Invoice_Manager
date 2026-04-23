import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import {
  normalizeInvoiceRecord,
  parseInvoiceNumberInput,
} from '@/lib/data-normalizers';

/**
 * GET /api/invoices/[id]
 * Fetch a single invoice by ID (scoped to authenticated user).
 */
export async function GET(request, { params }) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    
    const { data: invoice, error } = await auth.supabase
      .from('invoices')
      .select('*, client:clients(id, name, email, company)')
      .eq('id', id)
      .eq('user_id', auth.user._id)
      .single();

    if (error || !invoice) {
      return NextResponse.json({ error: 'Invoice not found or access denied' }, { status: 404 });
    }

    console.log('[api/invoices/:id][GET] Fetch response', {
      userId: auth.user._id,
      invoiceId: invoice?.id ?? id,
      error: error?.message ?? null,
    });

    return NextResponse.json(normalizeInvoiceRecord(invoice));
  } catch (error) {
    console.error('[api/invoices/:id][GET] Failed', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/invoices/[id]
 * Update an existing invoice.
 */
export async function PUT(request, { params }) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const body = await request.json();

    const updates = {};

    if (body.title !== undefined) updates.title = body.title;
    if (body.amount !== undefined) updates.amount = body.amount;
    if (body.status !== undefined) updates.status = body.status;
    if (body.date !== undefined) updates.date = body.date;
    if (body.dueDate !== undefined) updates.due_date = body.dueDate;

    if (body.clientId !== undefined) {
      const { data: client, error: clientError } = await auth.supabase
        .from('clients')
        .select('id')
        .eq('id', body.clientId)
        .eq('user_id', auth.user._id)
        .single();

      if (clientError || !client) {
        return NextResponse.json(
          { error: 'Client not found or access denied' },
          { status: 404 }
        );
      }

      updates.client_id = body.clientId;
    }

    if (body.invoiceNumber !== undefined) {
      const invoiceSequence = parseInvoiceNumberInput(body.invoiceNumber);
      if (invoiceSequence === null) {
        return NextResponse.json(
          { error: 'Invoice number must be numeric or in INV-YYYY-XXXX format' },
          { status: 400 }
        );
      }
      updates.invoice_number = invoiceSequence;
    }

    const { data: updatedInvoice, error } = await auth.supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .eq('user_id', auth.user._id)
      .select('*, client:clients(id, name, email, company)')
      .single();

    if (error || !updatedInvoice) {
      return NextResponse.json({ error: 'Invoice not found or access denied' }, { status: 404 });
    }

    console.log('[api/invoices/:id][PUT] Update response', {
      userId: auth.user._id,
      invoiceId: updatedInvoice?.id ?? id,
      error: error?.message ?? null,
    });

    return NextResponse.json(normalizeInvoiceRecord(updatedInvoice));
  } catch (error) {
    console.error('[api/invoices/:id][PUT] Failed', error);
    return NextResponse.json(
      { error: 'Failed to update invoice: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/invoices/[id]
 * Soft delete an invoice.
 */
export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const { data: existingInvoice, error: existingInvoiceError } = await auth.supabase
      .from('invoices')
      .select('id, status')
      .eq('id', id)
      .eq('user_id', auth.user._id)
      .maybeSingle();

    console.log('[api/invoices/:id][DELETE] Existing invoice lookup', {
      userId: auth.user._id,
      invoiceId: id,
      status: existingInvoice?.status ?? null,
      error: existingInvoiceError?.message ?? null,
    });

    if (existingInvoiceError) {
      throw new Error(existingInvoiceError.message);
    }

    if (!existingInvoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (existingInvoice.status === 'cancelled') {
      return NextResponse.json({ message: 'Invoice already cancelled', id });
    }

    const { error } = await auth.supabase
      .from('invoices')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .eq('user_id', auth.user._id);

    console.log('[api/invoices/:id][DELETE] Update response', {
      userId: auth.user._id,
      invoiceId: id,
      error: error?.message ?? null,
    });

    if (error) {
      return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Invoice cancelled successfully', id });
  } catch (error) {
    console.error('[api/invoices/:id][DELETE] Failed', error);
    return NextResponse.json(
      { error: 'Failed to delete invoice: ' + error.message },
      { status: 500 }
    );
  }
}
