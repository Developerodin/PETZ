import { compare, hash } from "bcryptjs";
import type { ObjectId } from "mongodb";
import clientPromise, { getMongoDbName } from "@/lib/mongodb-client";

export type AuthUserDoc = {
  _id: ObjectId;
  name?: string | null;
  email: string;
  image?: string | null;
  emailVerified?: Date | null;
  passwordHash?: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function usersCollection() {
  const client = await clientPromise;
  return client.db(getMongoDbName()).collection<AuthUserDoc>("users");
}

export async function findUserByEmail(email: string) {
  return (await usersCollection()).findOne({ email: normalizeEmail(email) });
}

export async function hashPassword(password: string) {
  return hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}

export async function createPasswordUser(input: { name: string; email: string; password: string }) {
  const col = await usersCollection();
  const email = normalizeEmail(input.email);
  const existing = await col.findOne({ email });

  if (existing?.passwordHash) {
    return { error: "exists" as const };
  }
  if (existing) {
    return { error: "google" as const };
  }

  const passwordHash = await hashPassword(input.password);
  const result = await col.insertOne({
    name: input.name.trim(),
    email,
    image: null,
    emailVerified: null,
    passwordHash,
  } as AuthUserDoc);
  return { userId: result.insertedId.toString() };
}
