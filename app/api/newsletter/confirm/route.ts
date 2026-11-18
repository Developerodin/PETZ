import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { withDb } from "@/lib/api-utils";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function GET(request: Request) {
  return withDb(async () => {
    const token = new URL(request.url).searchParams.get("token") || "";
    const base = (process.env.AUTH_URL || new URL(request.url).origin).replace(/\/$/, "");

    if (!token) {
      return NextResponse.redirect(`${base}/?newsletter=invalid`);
    }

    const confirmTokenHash = hashToken(token);
    const subscriber = await NewsletterSubscriber.findOne({ confirmTokenHash });

    if (
      !subscriber ||
      !subscriber.confirmTokenExpiresAt ||
      subscriber.confirmTokenExpiresAt.getTime() < Date.now()
    ) {
      return NextResponse.redirect(`${base}/?newsletter=invalid`);
    }

    subscriber.status = "subscribed";
    subscriber.confirmTokenHash = null;
    subscriber.confirmTokenExpiresAt = null;
    await subscriber.save();

    return NextResponse.redirect(`${base}/?newsletter=confirmed`);
  });
}
