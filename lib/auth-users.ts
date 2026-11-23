import { createHash, randomBytes } from "crypto";
import { compare, hash } from "bcryptjs";
import type { ObjectId } from "mongodb";
import { getAdminEmail, getAdminPassword } from "@/lib/admin-auth";
import clientPromise, { getMongoDbName } from "@/lib/mongodb-client";

export type AuthUserDoc = {
  _id: ObjectId;
  name?: string | null;
  email: string;
  image?: string | null;
  emailVerified?: Date | null;
  passwordHash?: string;
  role?: "admin";
  resetTokenHash?: string | null;
  resetTokenExpiresAt?: Date | null;
};

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

/** Deterministic hash so a presented token can be looked up by its stored hash. */
function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

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

export async function findAdminByEmail(email: string) {
  return (await usersCollection()).findOne({
    email: normalizeEmail(email),
    role: "admin",
  });
}

/** Upsert the env-defined admin into Mongo so /admin can authenticate against users. */
export async function ensureAdminUser() {
  const email = getAdminEmail();
  const password = getAdminPassword();
  if (!email || !password) return null;

  const col = await usersCollection();
  const existing = await col.findOne({ email });

  if (existing) {
    const passwordOk = existing.passwordHash
      ? await verifyPassword(password, existing.passwordHash)
      : false;
    const passwordHash = passwordOk && existing.passwordHash
      ? existing.passwordHash
      : await hashPassword(password);
    if (existing.role === "admin" && passwordOk) {
      return existing;
    }
    await col.updateOne(
      { _id: existing._id },
      {
        $set: {
          role: "admin" as const,
          passwordHash,
          name: existing.name || "Admin",
        },
      },
    );
    return { ...existing, role: "admin" as const, passwordHash };
  }

  const passwordHash = await hashPassword(password);
  const result = await col.insertOne({
    name: "Admin",
    email,
    image: null,
    emailVerified: null,
    passwordHash,
    role: "admin",
  } as AuthUserDoc);

  return {
    _id: result.insertedId,
    name: "Admin",
    email,
    image: null,
    emailVerified: null,
    passwordHash,
    role: "admin" as const,
  };
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

  if (email === getAdminEmail() || existing?.role === "admin") {
    return { error: "exists" as const };
  }
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

/**
 * Issue a single-use password reset token, storing only its hash + a 30-minute
 * expiry. Returns the raw token only for accounts that actually have a password
 * (Google-only accounts and unknown emails get `null`). Callers must keep the
 * public response identical regardless of the result (no account enumeration).
 */
export async function createPasswordResetToken(email: string) {
  const col = await usersCollection();
  const user = await col.findOne({ email: normalizeEmail(email) });
  if (!user || !user.passwordHash || user.role === "admin") {
    return null;
  }

  const token = randomBytes(32).toString("hex");
  const resetTokenHash = hashResetToken(token);
  const resetTokenExpiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await col.updateOne(
    { _id: user._id },
    { $set: { resetTokenHash, resetTokenExpiresAt } },
  );

  return { token };
}

/**
 * Consume a reset token: set the new password hash and delete the token so it
 * can only be used once. Returns `{ error: "invalid" }` for missing/expired
 * tokens.
 */
export async function resetPasswordWithToken(token: string, newPassword: string) {
  if (!token) return { error: "invalid" as const };

  const col = await usersCollection();
  const resetTokenHash = hashResetToken(token);
  const user = await col.findOne({ resetTokenHash });

  if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt.getTime() < Date.now()) {
    return { error: "invalid" as const };
  }

  const passwordHash = await hashPassword(newPassword);
  await col.updateOne(
    { _id: user._id },
    {
      $set: { passwordHash },
      $unset: { resetTokenHash: "", resetTokenExpiresAt: "" },
    },
  );

  return { ok: true as const };
}
