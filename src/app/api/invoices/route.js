import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import {
  normalizeInvoiceRecord,
  parseInvoiceNumberInput,
} from '@/lib/data-normalizers';

/**
 * GET /api/invoices
 * Fetch all invoices belonging to the authenticated user.
 */
export async function GET(request) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { data: invoices, error } = await auth.supabase
      .from('invoices')
      .select('*, client:clients(id, name, email, company)')
      .eq('user_id', auth.user._id)
      .or('status.is.null,status.neq.cancelled')
      .order('date', { ascending: false });

    console.log('[api/invoices][GET] Fetch response', {
      userId: auth.user._id,
      count: invoices?.length ?? 0,
      error: error?.message ?? null,
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(invoices.map(normalizeInvoiceRecord));
  } catch (error) {
    console.error('[api/invoices][GET] Failed', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/invoices
 * Create a new invoice for the authenticated user.
 */
export async function POST(request) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    
    // 1. Validate required fields
    if (!body.title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    if (body.amount === undefined || body.amount === null) {
      return NextResponse.json({ error: 'amount is required' }, { status: 400 });
    }

    if (!body.clientId) {
      return NextResponse.json({ error: 'clientId is required' }, { status: 400 });
    }

    // 2. Ownership Check: Verify client belongs to this user
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

    // 3. Generate professional alphanumeric invoice number
    let invoiceSequence = parseInvoiceNumberInput(body.invoiceNumber);
    if (body.invoiceNumber && invoiceSequence === null) {
      return NextResponse.json(
        { error: 'Invoice number must be numeric or in INV-YYYY-XXXX format' },
        { status: 400 }
      );
    }

    if (invoiceSequence === null) {
      const { data: nextNum, error: rpcError } = await auth.supabase
        .rpc('increment_invoice_number', { target_user_id: auth.user._id });

      if (rpcError) {
        throw new Error('Failed to generate invoice number: ' + rpcError.message);
      }

      invoiceSequence = nextNum;
    }


    let amount = body.amount;
    if (body.items && Array.isArray(body.items)) {
      amount = body.items.reduce(
        (sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice ?? item.rate ?? 0)),
        0
      );
    }

    const invoiceData = {
      title: body.title,
      amount: Number(amount),
      status: body.status || 'sent',
      client_id: body.clientId,
      date: body.date || new Date().toISOString(),
      due_date: body.dueDate || null,
      invoice_number: invoiceSequence,
      user_id: auth.user._id,
    };

    const { data: invoice, error: insertError } = await auth.supabase
      .from('invoices')
      .insert([invoiceData])
      .select('*, client:clients(id, name, email, company)')
      .single();

    console.log('[api/invoices][POST] Insert response', {
      userId: auth.user._id,
      invoiceId: invoice?.id ?? null,
      invoiceNumber: invoice?.invoice_number ?? invoiceSequence,
      error: insertError?.message ?? null,
    });

    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'Invoice number already exists for this user' },
          { status: 400 }
        );
      }
      throw new Error(insertError.message);
    }

    return NextResponse.json(normalizeInvoiceRecord(invoice), { status: 201 });
  } catch (error) {
    console.error('[api/invoices][POST] Failed', error);
    return NextResponse.json(
      { error: 'Failed to create invoice: ' + error.message },
      { status: 500 }
    );
  }
}
