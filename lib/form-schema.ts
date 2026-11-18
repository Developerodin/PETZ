/** Shared client + server form validators for public PETZ forms. */

export const NAME_MAX = 80;
export const MESSAGE_MAX = 2000;
export const MESSAGE_MIN = 20;

/** Unicode letters, spaces, hyphens, apostrophes, periods (e.g. S. Kumar, José, देव). */
const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}\s\-'.]{0,79}$/u;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Indian mobile: optional +91 / 0, then 10 digits starting 6–9. */
const INDIAN_MOBILE_RE = /^(?:\+?91[\s-]?|0)?[6-9]\d{9}$/;

export const PARTNER_TYPES = [
  "Veterinary",
  "Diagnostic",
  "Pet Health Brands",
  "Research",
] as const;

export const WAITLIST_PET_TYPES = ["dog", "cat"] as const;

export const INDIA_CITIES = [
  "Ahmedabad",
  "Bengaluru",
  "Chennai",
  "Delhi",
  "Hyderabad",
  "Jaipur",
  "Kolkata",
  "Mumbai",
  "Pune",
  "Other",
] as const;

export function trim(value: unknown) {
  return String(value ?? "").trim();
}

export function normalizeEmail(value: unknown) {
  return trim(value).toLowerCase();
}

export function validateEmail(value: unknown) {
  const email = normalizeEmail(value);
  if (!email) return "Email is required.";
  if (email.length > 254) return "Email is too long.";
  if (!EMAIL_RE.test(email)) return "Enter a valid email address.";
  return "";
}

export function validateName(value: unknown, label = "Name", opts?: { optional?: boolean }) {
  const name = trim(value);
  if (!name) return opts?.optional ? "" : `${label} is required.`;
  if (name.length < 2) return `${label} must be at least 2 characters.`;
  if (name.length > NAME_MAX) return `${label} must be ${NAME_MAX} characters or fewer.`;
  if (!NAME_RE.test(name)) {
    return `${label} can only contain letters, spaces, hyphens, apostrophes, and periods.`;
  }
  return "";
}

export function validateMessage(
  value: unknown,
  label = "Message",
  opts?: { optional?: boolean; min?: number; max?: number },
) {
  const message = trim(value);
  const min = opts?.min ?? 0;
  const max = opts?.max ?? MESSAGE_MAX;
  if (!message) return opts?.optional ? "" : `${label} is required.`;
  if (message.length < min) return `${label} must be at least ${min} characters.`;
  if (message.length > max) return `${label} must be ${max} characters or fewer.`;
  return "";
}

export function validateRequired(value: unknown, label: string) {
  if (!trim(value)) return `${label} is required.`;
  return "";
}

export function validateIndianMobile(value: unknown, opts?: { optional?: boolean }) {
  const phone = trim(value).replace(/[\s-]/g, "");
  if (!phone) return opts?.optional ? "" : "Phone number is required.";
  if (!INDIAN_MOBILE_RE.test(phone)) return "Enter a valid Indian mobile number.";
  return "";
}

export function validateCity(value: unknown) {
  const city = trim(value);
  if (!city) return "City is required.";
  if (!(INDIA_CITIES as readonly string[]).includes(city)) {
    return "Choose a city from the list.";
  }
  return "";
}

export function validatePartnerType(value: unknown) {
  const type = trim(value);
  if (!type) return "Partner type is required.";
  if (!(PARTNER_TYPES as readonly string[]).includes(type)) {
    return "Choose a valid partner type.";
  }
  return "";
}

export function validatePetType(value: unknown) {
  const pet = trim(value).toLowerCase();
  if (!pet) return "Pet type is required.";
  if (!(WAITLIST_PET_TYPES as readonly string[]).includes(pet)) {
    return "Choose dog or cat.";
  }
  return "";
}

export function honeypotFilled(value: unknown) {
  return Boolean(trim(value));
}

export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
