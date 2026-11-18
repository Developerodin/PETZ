import { jsonError, jsonOk, withDb } from "@/lib/api-utils";
import { assertFormRateLimit } from "@/lib/form-rate-limit";
import {
  clientIp,
  honeypotFilled,
  MESSAGE_MIN,
  normalizeEmail,
  validateCity,
  validateEmail,
  validateIndianMobile,
  validateMessage,
  validateName,
  validateRequired,
} from "@/lib/form-schema";
import { SupportMessage } from "@/models/SupportMessage";

type SupportBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
  subject?: string;
  message?: string;
  company?: string;
};

export async function POST(request: Request) {
  let body: SupportBody;
  try {
    body = (await request.json()) as SupportBody;
  } catch {
    return jsonError("Invalid JSON body.");
  }

  if (honeypotFilled(body.company)) {
    return jsonOk({ ok: true }, 200);
  }

  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const email = normalizeEmail(body.email);
  const phone = String(body.phone ?? "").trim();
  const city = String(body.city ?? "").trim();
  const subject = String(body.subject ?? "").trim();
  const message = String(body.message ?? "").trim();

  const firstErr = validateName(firstName, "First name");
  if (firstErr) return jsonError(firstErr);
  const lastErr = validateName(lastName, "Last name");
  if (lastErr) return jsonError(lastErr);
  const emailErr = validateEmail(email);
  if (emailErr) return jsonError(emailErr);
  const phoneErr = validateIndianMobile(phone);
  if (phoneErr) return jsonError(phoneErr);
  const cityErr = validateCity(city);
  if (cityErr) return jsonError(cityErr);
  const subjectErr = validateRequired(subject, "Subject");
  if (subjectErr) return jsonError(subjectErr);
  if (subject.length > 120) return jsonError("Subject must be 120 characters or fewer.");
  const messageErr = validateMessage(message, "Message", { min: MESSAGE_MIN });
  if (messageErr) return jsonError(messageErr);

  return withDb(async () => {
    const limited = await assertFormRateLimit("support", clientIp(request));
    if (limited) return jsonError(limited, 429);

    await SupportMessage.create({
      firstName,
      lastName,
      email,
      phone,
      city,
      subject,
      message,
    });

    return jsonOk({ ok: true }, 201);
  });
}
