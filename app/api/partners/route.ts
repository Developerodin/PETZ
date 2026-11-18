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
  validatePartnerType,
  validateRequired,
} from "@/lib/form-schema";
import { PartnerApplication } from "@/models/PartnerApplication";

type PartnerBody = {
  partnerType?: string;
  organisation?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  city?: string;
  message?: string;
  company?: string;
};

export async function POST(request: Request) {
  let body: PartnerBody;
  try {
    body = (await request.json()) as PartnerBody;
  } catch {
    return jsonError("Invalid JSON body.");
  }

  if (honeypotFilled(body.company)) {
    return jsonOk({ ok: true }, 200);
  }

  const partnerType = String(body.partnerType ?? "").trim();
  const organisation = String(body.organisation ?? "").trim();
  const contactName = String(body.contactName ?? "").trim();
  const email = normalizeEmail(body.email);
  const phone = String(body.phone ?? "").trim();
  const city = String(body.city ?? "").trim();
  const message = String(body.message ?? "").trim();

  const typeErr = validatePartnerType(partnerType);
  if (typeErr) return jsonError(typeErr);
  const orgErr = validateRequired(organisation, "Organisation name");
  if (orgErr) return jsonError(orgErr);
  if (organisation.length > 120) return jsonError("Organisation name must be 120 characters or fewer.");
  const nameErr = validateName(contactName, "Contact name");
  if (nameErr) return jsonError(nameErr);
  const emailErr = validateEmail(email);
  if (emailErr) return jsonError(emailErr);
  const phoneErr = validateIndianMobile(phone);
  if (phoneErr) return jsonError(phoneErr);
  const cityErr = validateCity(city);
  if (cityErr) return jsonError(cityErr);
  const messageErr = validateMessage(message, "Message", { min: MESSAGE_MIN });
  if (messageErr) return jsonError(messageErr);

  return withDb(async () => {
    const limited = await assertFormRateLimit("partners", clientIp(request));
    if (limited) return jsonError(limited, 429);

    await PartnerApplication.create({
      partnerType,
      organisation,
      contactName,
      email,
      phone,
      city,
      message,
    });

    return jsonOk({ ok: true }, 201);
  });
}
