import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { verifyAuth } from '@/lib/auth';

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

    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('*, clientId:clients(name, email, company)')
      .eq('user_id', auth.user._id)
      .neq('status', 'cancelled')
      .order('date', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    // Normalize for frontend
    const normalizedInvoices = invoices.map(inv => ({
      ...inv,
      _id: inv.id,
      userId: inv.user_id,
      invoiceNumber: inv.invoice_number,
      dueDate: inv.due_date,
      clientId: inv.clientId ? { ...inv.clientId, _id: inv.client_id } : null
    }));

    return NextResponse.json(normalizedInvoices);
  } catch (error) {
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
    const requiredFields = ['title', 'amount', 'clientId'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // 2. Ownership Check: Verify client belongs to this user
    const { data: client, error: clientError } = await supabase
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
    let invoiceNumber = body.invoiceNumber;
    if (!invoiceNumber) {
      const { data: nextNum, error: rpcError } = await supabase
        .rpc('increment_invoice_number', { target_user_id: auth.user._id });

      if (rpcError) {
        throw new Error('Failed to generate invoice number: ' + rpcError.message);
      }
      // Formatting to professional style: INV- followed by 4+ digits
      invoiceNumber = `INV-${String(nextNum).padStart(4, '0')}`;
    }

    // 4. Server-side totals calculation (if items present)
    let amount = body.amount;
    if (body.items && Array.isArray(body.items)) {
      amount = body.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice)), 0);
    }

    // 5. Create invoice
    const invoiceData = {
      title: body.title,
      amount: amount,
      status: body.status || 'sent',
      client_id: body.clientId,
      date: body.date || new Date(),
      due_date: body.dueDate,
      invoice_number: invoiceNumber,
      user_id: auth.user._id
    };


    const { data: invoice, error: insertError } = await supabase
      .from('invoices')
      .insert([invoiceData])
      .select('*, clientId:clients(name, email, company)')
      .single();

    if (insertError) {
      // Handle unique constraint violation
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'Invoice number already exists for this user' },
          { status: 400 }
        );
      }
      throw new Error(insertError.message);
    }

    // Normalize for frontend
    const normalizedInvoice = {
      ...invoice,
      _id: invoice.id,
      userId: invoice.user_id,
      invoiceNumber: invoice.invoice_number,
      dueDate: invoice.due_date,
      clientId: { ...invoice.clientId, _id: invoice.client_id }
    };

    return NextResponse.json(normalizedInvoice, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create invoice: ' + error.message },
      { status: 500 }
    );
  }
}
