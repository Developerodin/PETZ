import { auth } from "@/auth";
import { connectDb } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function withDb<T>(handler: () => Promise<T>) {
  await connectDb();
  return handler();
}

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  return session.user;
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
