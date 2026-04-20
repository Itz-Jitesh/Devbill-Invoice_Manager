import mongoose from 'mongoose';

/**
 * Invoice Model
 * @description Stores invoice information and relates it to a client.
 */
const InvoiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this invoice.'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount.'],
  },
  status: {
    type: String,
    enum: ['paid', 'pending', 'sent', 'overdue'],
    default: 'pending',
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Please associate this invoice with a client.'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
  },
  invoiceNumber: {
    type: Number,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true
});

// Composite index for unique invoice numbers per user
InvoiceSchema.index({ userId: 1, invoiceNumber: 1 }, { unique: true });
// Index for common user queries
InvoiceSchema.index({ userId: 1, status: 1 });
InvoiceSchema.index({ userId: 1, createdAt: -1 });

// Avoid re-compiling the model if it already exists
export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
