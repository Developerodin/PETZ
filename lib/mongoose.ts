import mongoose from "mongoose";

function getConnectOptions(uri: string) {
  const needsTls =
    uri.startsWith("mongodb+srv://") ||
    /[?&](tls|ssl)=true/i.test(uri) ||
    /\.mongodb\.net/i.test(uri);

  return {
    bufferCommands: false,
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
    maxPoolSize: 5,
    family: 4,
    ...(needsTls ? { tls: true } : {}),
  } as const;
}

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

  const connectOptions = getConnectOptions(uri);

  try {
    await mongoose.connect(uri, connectOptions);
  } catch {
    await mongoose.disconnect().catch(() => undefined);
    await new Promise((resolve) => setTimeout(resolve, 400));
    await mongoose.connect(uri, connectOptions);
  }

  return mongoose.connection;
}
