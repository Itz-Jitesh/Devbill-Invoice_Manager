import mongoose from 'mongoose';

/**
 * MongoDB Connection Singleton
 *
 * In Next.js (especially with hot-reloading in dev), module-level variables
 * are re-executed on every reload. We cache the connection on `global` to
 * reuse it across function invocations instead of opening a new connection
 * every time a route handler runs.
 */

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error('Missing MongoDB connection string. Set MONGODB_URI or MONGO_URI.');
}

// Preserve the cached connection across hot-reloads in development
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create a new connection promise if one doesn't exist yet
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(mongoUri, opts).then((mongooseInstance) => {
      console.log(`🍃 MongoDB Connected: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset the promise on failure so next call retries
    cached.promise = null;
    throw error;
  }

  return cached.conn;
};

export default connectDB;
