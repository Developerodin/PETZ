import { jsonError, jsonOk, withDb } from "@/lib/api-utils";
import { SupportMessage } from "@/models/SupportMessage";

type SupportBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
};

export async function POST(request: Request) {
  return withDb(async () => {
    let body: SupportBody;
    try {
      body = (await request.json()) as SupportBody;
    } catch {
      return jsonError("Invalid JSON body.");
    }

    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const subject = String(body.subject ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!firstName) return jsonError("First name is required.");
    if (!lastName) return jsonError("Last name is required.");
    if (!email) return jsonError("Email is required.");
    if (!subject) return jsonError("Subject is required.");
    if (!message) return jsonError("Message is required.");

    await SupportMessage.create({
      firstName,
      lastName,
      email,
      phone: String(body.phone ?? "").trim(),
      subject,
      message,
    });

    return jsonOk({ ok: true }, 201);
  });
}
