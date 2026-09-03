export const COMPACT_FOOTER_PATHS = new Set([
  "/academy",
  "/assess/results",
  "/gift-cards",
  "/marketplace",
  "/partner-apply",
  "/pet-passport",
  "/privacy",
  "/sample-assessment",
  "/symptom-checker",
  "/team",
  "/terms",
  "/waitlist",
  "/login",
  "/account",
  "/account/pets/new",
]);

export type NavMode = "full" | "blog" | "privacy" | "terms";

export function getNavMode(pathname: string): NavMode {
  if (pathname === "/privacy") return "privacy";
  if (pathname === "/terms") return "terms";
  if (pathname.startsWith("/blog/") && pathname !== "/blog") return "blog";
  return "full";
}

export function isCompactFooter(pathname: string) {
  return COMPACT_FOOTER_PATHS.has(pathname) || pathname.startsWith("/account/pets/");
}
