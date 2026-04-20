import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Invoice from '@/models/Invoice';

const validateInvoiceId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid invoice id' }, { status: 400 });
  }

  return null;
};

/**
 * GET /api/invoices/[id]
 * Fetch a single invoice by ID (public endpoint, no auth required).
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const invalidIdResponse = validateInvoiceId(id);
    if (invalidIdResponse) return invalidIdResponse;
    await connectDB();

    const invoice = await Invoice.findById(id).populate('clientId', 'name email company');

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json(invoice);
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
    const { id } = await params;
    const invalidIdResponse = validateInvoiceId(id);
    if (invalidIdResponse) return invalidIdResponse;
    await connectDB();
    const body = await request.json();

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).populate('clientId', 'name email company');

    if (!updatedInvoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update invoice: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/invoices/[id]
 * Delete an invoice.
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const invalidIdResponse = validateInvoiceId(id);
    if (invalidIdResponse) return invalidIdResponse;
    await connectDB();

    const deletedInvoice = await Invoice.findByIdAndDelete(id);

    if (!deletedInvoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Invoice deleted successfully', id });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete invoice: ' + error.message },
      { status: 500 }
    );
  }
}
