import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Invoice from '@/models/Invoice';
import Client from '@/models/Client';
import InvoiceCounter from '@/models/InvoiceCounter';
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

    await connectDB();
    const invoices = await Invoice.find({ 
      userId: auth.user._id,
      status: { $ne: 'cancelled' } // 🛡️ Hide cancelled invoices in global list
    })
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
 * Create a new invoice for the authenticated user.
 */
export async function POST(request) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await connectDB();
    const body = await request.json();
    
    // 1. Validate required fields
    const requiredFields = ['title', 'amount', 'clientId'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // 2. Ownership Check: Verify client belongs to this user
    const clientId = new mongoose.Types.ObjectId(body.clientId);
    const userId = new mongoose.Types.ObjectId(auth.user._id);

    const client = await Client.findOne({ _id: clientId, userId: userId });
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found or access denied' },
        { status: 404 }
      );
    }

    // 3. Atomic counter for sequential invoice number
    let invoiceNumber = body.invoiceNumber;
    if (!invoiceNumber) {
      const counter = await InvoiceCounter.findOneAndUpdate(
        { userId: auth.user._id },
        { $inc: { nextNumber: 1 } },
        { upsert: true, new: true }
      );
      invoiceNumber = counter.nextNumber;
    }

    // 4. Server-side totals calculation (if items present)
    let amount = body.amount;
    if (body.items && Array.isArray(body.items)) {
      amount = body.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice)), 0);
    }

    // 5. Create invoice
    const invoice = await Invoice.create({
      ...body,
      amount,
      invoiceNumber,
      userId: auth.user._id
    });
    
    const populatedInvoice = await invoice.populate('clientId', 'name email company');
    
    return NextResponse.json(populatedInvoice, { status: 201 });
  } catch (error) {
    // Handle duplicate key error for invoiceNumber
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Invoice number already exists for this user' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create invoice: ' + error.message },
      { status: 500 }
    );
  }
}
