import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { verifyAuth } from '@/lib/auth';

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
    
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select('*, clientId:clients(name, email, company)')
      .eq('id', id)
      .eq('user_id', auth.user._id)
      .single();

    if (error || !invoice) {
      return NextResponse.json({ error: 'Invoice not found or access denied' }, { status: 404 });
    }

    const normalizedInvoice = {
      ...invoice,
      _id: invoice.id,
      userId: invoice.user_id,
      clientId: { ...invoice.clientId, _id: invoice.client_id }
    };

    return NextResponse.json(normalizedInvoice);
  } catch (error) {
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

    const { data: updatedInvoice, error } = await supabase
      .from('invoices')
      .update(body)
      .eq('id', id)
      .eq('user_id', auth.user._id)
      .select('*, clientId:clients(name, email, company)')
      .single();

    if (error || !updatedInvoice) {
      return NextResponse.json({ error: 'Invoice not found or access denied' }, { status: 404 });
    }

    const normalizedInvoice = {
      ...updatedInvoice,
      _id: updatedInvoice.id,
      userId: updatedInvoice.user_id,
      clientId: { ...updatedInvoice.clientId, _id: updatedInvoice.client_id }
    };

    return NextResponse.json(normalizedInvoice);
  } catch (error) {
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

    const { data: deletedInvoice, error } = await supabase
      .from('invoices')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .eq('user_id', auth.user._id)
      .neq('status', 'cancelled')
      .select()
      .single();

    if (error || !deletedInvoice) {
      return NextResponse.json({ error: 'Invoice not found or already cancelled' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Invoice cancelled successfully', id });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete invoice: ' + error.message },
      { status: 500 }
    );
  }
}
