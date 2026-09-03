import { MongoClient, type MongoClientOptions } from "mongodb";

export const mongoClientOptions: MongoClientOptions = {
  serverSelectionTimeoutMS: 8000,
  connectTimeoutMS: 8000,
  maxPoolSize: 5,
  tls: true,
  family: 4,
  autoSelectFamily: false,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }
  return uri;
}

export function getMongoDbName() {
  try {
    const pathname = new URL(getMongoUri()).pathname.replace(/^\//, "");
    const name = pathname.split("/")[0];
    return name || "petz";
  } catch {
    return "petz";
  }
}

function createClientPromise() {
  const client = new MongoClient(getMongoUri(), mongoClientOptions);
  return client.connect();
}

const clientPromise = global._mongoClientPromise ?? (global._mongoClientPromise = createClientPromise());

export default clientPromise;
