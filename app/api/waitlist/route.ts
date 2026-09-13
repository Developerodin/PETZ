import { jsonError, jsonOk, withDb } from "@/lib/api-utils";
import { WaitlistEntry } from "@/models/WaitlistEntry";

type WaitlistBody = {
  //* TODO: Add phone number
  name?: string;
  email?: string;
  country?: string;
};

export async function POST(request: Request) {
  return withDb(async () => {
    let body: WaitlistBody;
    try {
      body = (await request.json()) as WaitlistBody;
    } catch {
      return jsonError("Invalid JSON body.");
    }

    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const country = String(body.country ?? "").trim();

    if (!email) return jsonError("Email is required.");
    if (!country) return jsonError("Country is required.");

    await WaitlistEntry.findOneAndUpdate(
      { email },
      { email, country, name: String(body.name ?? "").trim() },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return jsonOk({ ok: true }, 201);
  });
}
