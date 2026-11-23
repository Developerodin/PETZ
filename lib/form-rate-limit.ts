import { FormRateLimit } from "@/models/FormRateLimit";

const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_MAX_POSTS = 5;

/** Public forms stay tight; admin login is used more often during local setup. */
const ROUTE_LIMITS: Record<string, { max: number; windowMs: number }> = {
  "admin-login": { max: 50, windowMs: DEFAULT_WINDOW_MS },
};

/** Default: 5 posts / 15 minutes / route / IP. Returns an error message when limited. */
export async function assertFormRateLimit(route: string, ip: string) {
  const limits = ROUTE_LIMITS[route] || { max: DEFAULT_MAX_POSTS, windowMs: DEFAULT_WINDOW_MS };
  const key = `${route}:${ip || "unknown"}`;
  const now = Date.now();
  const existing = await FormRateLimit.findOne({ key });

  if (!existing) {
    await FormRateLimit.create({ key, count: 1, windowStartsAt: new Date(now) });
    return "";
  }

  const started = existing.windowStartsAt?.getTime?.() ?? 0;
  if (now - started > limits.windowMs) {
    existing.count = 1;
    existing.windowStartsAt = new Date(now);
    await existing.save();
    return "";
  }

  if (existing.count >= limits.max) {
    return "Too many submissions. Please try again in a few minutes.";
  }

  existing.count += 1;
  await existing.save();
  return "";
}
