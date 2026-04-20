import mongoose from 'mongoose';

/**
 * User Schema
 * @description Defines the user structure for authentication and profile management.
 * Identical to the original Backend model — no logic changed.
 */
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please add a username'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

// Prevent model re-compilation during hot-reload in Next.js dev mode
export default mongoose.models.User || mongoose.model('User', UserSchema);
