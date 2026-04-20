import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Invoice from '@/models/Invoice';
import Client from '@/models/Client'; // Required for populate

/**
 * GET /api/invoices
 * Fetch all invoices from the database, populated with client info.
 */
export async function GET() {
  try {
    await connectDB();
    const invoices = await Invoice.find({})
      .populate('clientId', 'name email company')
      .sort({ date: -1 });
    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch invoices: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/invoices
 * Create a new invoice.
 */
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const requiredFields = ['title', 'amount', 'clientId'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Optional: Generate an invoice number if not provided
    if (!body.invoiceNumber) {
      const count = await Invoice.countDocuments();
      body.invoiceNumber = `INV-${new Date().getFullYear()}-${(count + 1).toString().padStart(3, '0')}`;
    }

    const invoice = await Invoice.create(body);
    const populatedInvoice = await invoice.populate('clientId', 'name email company');
    
    return NextResponse.json(populatedInvoice, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create invoice: ' + error.message },
      { status: 500 }
    );
  }
}
