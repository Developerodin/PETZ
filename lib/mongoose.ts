import mongoose from "mongoose";
import { mongoClientOptions } from "@/lib/mongodb-client";

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: typeof mongoose | null | undefined;
}

export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (global._mongooseConn) {
    return global._mongooseConn.connection;
  }

  await mongoose.connect(uri, {
    ...mongoClientOptions,
    bufferCommands: false,
  });

  global._mongooseConn = mongoose;

  return mongoose.connection;
}
