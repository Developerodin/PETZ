import { jsonError, jsonOk, withDb } from "@/lib/api-utils";
import { assertFormRateLimit } from "@/lib/form-rate-limit";
import {
  clientIp,
  honeypotFilled,
  normalizeEmail,
  validateCity,
  validateEmail,
  validateName,
  validatePetType,
} from "@/lib/form-schema";
import { WaitlistEntry } from "@/models/WaitlistEntry";

type WaitlistBody = {
  name?: string;
  email?: string;
  city?: string;
  petType?: string;
  plan?: string;
  company?: string;
};

export async function POST(request: Request) {
  let body: WaitlistBody;
  try {
    body = (await request.json()) as WaitlistBody;
  } catch {
    return jsonError("Invalid JSON body.");
  }

  if (honeypotFilled(body.company)) {
    return jsonOk({ ok: true }, 200);
  }

  const email = normalizeEmail(body.email);
  const name = String(body.name ?? "").trim();
  const city = String(body.city ?? "").trim();
  const petType = String(body.petType ?? "").trim().toLowerCase();
  const plan = String(body.plan ?? "").trim().toLowerCase();

  const emailErr = validateEmail(email);
  if (emailErr) return jsonError(emailErr);
  const nameErr = validateName(name, "Name", { optional: true });
  if (nameErr) return jsonError(nameErr);
  const cityErr = validateCity(city);
  if (cityErr) return jsonError(cityErr);
  const petErr = validatePetType(petType);
  if (petErr) return jsonError(petErr);

  return withDb(async () => {
    const limited = await assertFormRateLimit("waitlist", clientIp(request));
    if (limited) return jsonError(limited, 429);

    const existing = await WaitlistEntry.findOne({ email });
    if (existing) {
      existing.name = name || existing.name;
      existing.city = city;
      existing.petType = petType;
      if (plan) existing.plan = plan;
      await existing.save();
      return jsonOk({ ok: true }, 200);
    }

    await WaitlistEntry.create({
      email,
      name,
      city,
      petType,
      plan,
      country: "India",
    });

    return jsonOk({ ok: true }, 201);
  });
}
