import { jsonError, jsonOk, withDb } from "@/lib/api-utils";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";

type NewsletterBody = {
  email?: string;
};

export async function POST(request: Request) {
  return withDb(async () => {
    let body: NewsletterBody;
    try {
      body = (await request.json()) as NewsletterBody;
    } catch {
      return jsonError("Invalid JSON body.");
    }

    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    if (!email) return jsonError("Email is required.");

    await NewsletterSubscriber.findOneAndUpdate(
      { email },
      { email },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return jsonOk({ ok: true }, 201);
  });
}
