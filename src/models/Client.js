import mongoose from 'mongoose';

/**
 * Client Model
 * @description Stores information about the clients being managed.
 */
const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this client.'],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  company: {
    type: String,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for fast fetching and security isolation
ClientSchema.index({ userId: 1 });
ClientSchema.index({ userId: 1, _id: 1 });
ClientSchema.index({ userId: 1, isActive: 1 });

// Avoid re-compiling the model if it already exists
export default mongoose.models.Client || mongoose.model('Client', ClientSchema);
