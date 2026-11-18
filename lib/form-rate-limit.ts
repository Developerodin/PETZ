import { FormRateLimit } from "@/models/FormRateLimit";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_POSTS = 5;

/** About 5 posts / 15 minutes / route / IP. Returns an error message when limited. */
export async function assertFormRateLimit(route: string, ip: string) {
  const key = `${route}:${ip || "unknown"}`;
  const now = Date.now();
  const existing = await FormRateLimit.findOne({ key });

  if (!existing) {
    await FormRateLimit.create({ key, count: 1, windowStartsAt: new Date(now) });
    return "";
  }

  const started = existing.windowStartsAt?.getTime?.() ?? 0;
  if (now - started > WINDOW_MS) {
    existing.count = 1;
    existing.windowStartsAt = new Date(now);
    await existing.save();
    return "";
  }

  if (existing.count >= MAX_POSTS) {
    return "Too many submissions. Please try again in a few minutes.";
  }

  existing.count += 1;
  await existing.save();
  return "";
}
