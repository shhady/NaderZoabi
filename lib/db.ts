import mongoose from 'mongoose';

interface CachedMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare a global variable for caching the connection
declare global {
  // Ensure this is only added to the global object during development
  var mongoose: CachedMongoose | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Use a global variable to maintain the cache in development
let cached: CachedMongoose = global.mongoose || { conn: null, promise: null };

if (process.env.NODE_ENV !== 'production') {
  global.mongoose = cached;
}

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Creating new MongoDB connection');
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'NaderZoabi'
    });
  }

  cached.conn = await cached.promise;
  console.log('MongoDB connected');
  return cached.conn;
};
