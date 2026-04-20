import mongoose from 'mongoose';

/**
 * InvoiceCounter Model
 * @description Manages sequential invoice numbers per user to prevent race conditions.
 */
const InvoiceCounterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  nextNumber: {
    type: Number,
    default: 1
  }
});

export default mongoose.models.InvoiceCounter || mongoose.model('InvoiceCounter', InvoiceCounterSchema);
