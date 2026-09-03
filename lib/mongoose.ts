import mongoose from "mongoose";

const connectOptions = {
  bufferCommands: false,
  serverSelectionTimeoutMS: 8000,
  connectTimeoutMS: 8000,
  maxPoolSize: 5,
  tls: true,
  family: 4,
} as const;

export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2) {
    await mongoose.connection.asPromise();
    return mongoose.connection;
  }

  try {
    await mongoose.connect(uri, connectOptions);
  } catch {
    await mongoose.disconnect().catch(() => undefined);
    await new Promise((resolve) => setTimeout(resolve, 400));
    await mongoose.connect(uri, connectOptions);
  }

  return mongoose.connection;
}
