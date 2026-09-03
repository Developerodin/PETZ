import { jsonError, jsonOk, withDb } from "@/lib/api-utils";
import { PartnerApplication } from "@/models/PartnerApplication";

type PartnerBody = {
  partnerType?: string;
  organisation?: string;
  email?: string;
  city?: string;
  message?: string;
};

export async function POST(request: Request) {
  return withDb(async () => {
    let body: PartnerBody;
    try {
      body = (await request.json()) as PartnerBody;
    } catch {
      return jsonError("Invalid JSON body.");
    }

    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const partnerType = String(body.partnerType ?? "").trim();
    const organisation = String(body.organisation ?? "").trim();
    const city = String(body.city ?? "").trim();

    if (!partnerType) return jsonError("Partner type is required.");
    if (!organisation) return jsonError("Organisation name is required.");
    if (!email) return jsonError("Email is required.");
    if (!city) return jsonError("City is required.");

    await PartnerApplication.create({
      partnerType,
      organisation,
      email,
      city,
      message: String(body.message ?? "").trim(),
    });

    return jsonOk({ ok: true }, 201);
  });
}
