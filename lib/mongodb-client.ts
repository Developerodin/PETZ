import { MongoClient, type MongoClientOptions } from "mongodb";

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

/** Atlas / SRV need TLS; plain local `mongodb://` does not. */
export function getMongoClientOptions(uri = getMongoUri()): MongoClientOptions {
  const needsTls =
    uri.startsWith("mongodb+srv://") ||
    /[?&](tls|ssl)=true/i.test(uri) ||
    /\.mongodb\.net/i.test(uri);

  return {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
    maxPoolSize: 5,
    family: 4,
    autoSelectFamily: false,
    ...(needsTls ? { tls: true } : {}),
  };
}

export const mongoClientOptions: MongoClientOptions = getMongoClientOptions(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/petz",
);

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
  const uri = getMongoUri();
  const client = new MongoClient(uri, getMongoClientOptions(uri));
  const promise = client.connect();
  promise.catch(() => {
    if (global._mongoClientPromise === promise) {
      global._mongoClientPromise = undefined;
    }
  });
  return promise;
}

export function getClientPromise() {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createClientPromise();
  }
  return global._mongoClientPromise;
}

/** Always resolve a live connect — never reuse a rejected promise from a failed cold start. */
const clientPromise: Promise<MongoClient> = {
  then(onfulfilled, onrejected) {
    return getClientPromise().then(onfulfilled, onrejected);
  },
  catch(onrejected) {
    return getClientPromise().catch(onrejected);
  },
  finally(onfinally) {
    return getClientPromise().finally(onfinally);
  },
  [Symbol.toStringTag]: "Promise",
};

export default clientPromise;
