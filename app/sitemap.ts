import type { MetadataRoute } from "next";

const siteUrl = (process.env.AUTH_URL || "https://petz.love").replace(/\/$/, "");

const STATIC_PATHS = [
  "/",
  "/plans",
  "/science",
  "/partners",
  "/partner-apply",
  "/how-it-works",
  "/blog",
  "/faq",
  "/support",
  "/waitlist",
  "/symptom-checker",
  "/sample-assessment",
  "/gift-cards",
  "/academy",
  "/team",
  "/privacy",
  "/terms",
  "/assess",
];

const BLOG_SLUGS = [
  "5-things-your-pet-cant-tell-you",
  "is-your-dog-at-healthy-weight",
  "common-pet-health-problems",
  "nutrition-long-term-health",
  "pet-behaviour-and-health",
  "preventive-pet-care",
  "healthier-routine-for-dog",
  "track-changes-senior-pet",
  "breed-specific-health-risks",
  "biological-age-for-pets",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...STATIC_PATHS.map((path) => ({
      url: `${siteUrl}${path === "/" ? "" : path}`,
      lastModified: now,
      changeFrequency: path === "/" || path === "/blog" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : path === "/plans" || path === "/assess" ? 0.9 : 0.7,
    })),
    ...BLOG_SLUGS.map((slug) => ({
      url: `${siteUrl}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
