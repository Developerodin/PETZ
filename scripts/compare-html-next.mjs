import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HTML_ROOT = path.resolve(__dirname, "../../petz.love");
const NEXT_ROOT = path.resolve(__dirname, "..");

const MAP = [
  ["index.html", "app/page.tsx", "/", "overlay", "full"],
  ["pages/academy.html", "app/academy/page.tsx", "/academy", "inflow", "compact"],
  ["pages/assess.html", "app/assess/page.tsx", "/assess", "inflow", "full"],
  ["pages/assess-results.html", "app/assess/results/page.tsx", "/assess/results", "inflow", "compact"],
  ["pages/blog.html", "app/blog/page.tsx", "/blog", "inflow", "full"],
  ["pages/faq.html", "app/faq/page.tsx", "/faq", "overlay", "full"],
  ["pages/gift-cards.html", "app/gift-cards/page.tsx", "/gift-cards", "inflow", "compact"],
  ["pages/how-it-works.html", "app/how-it-works/page.tsx", "/how-it-works", "overlay", "full"],
  ["pages/marketplace.html", "app/marketplace/page.tsx", "/marketplace", "inflow", "compact"],
  ["pages/partner-apply.html", "app/partner-apply/page.tsx", "/partner-apply", "inflow", "compact"],
  ["pages/partners.html", "app/partners/page.tsx", "/partners", "overlay", "full"],
  ["pages/pet-passport.html", "app/pet-passport/page.tsx", "/pet-passport", "inflow", "compact"],
  ["pages/plans.html", "app/plans/page.tsx", "/plans", "overlay", "full"],
  ["pages/privacy.html", "app/privacy/page.tsx", "/privacy", "inflow", "compact"],
  ["pages/sample-assessment.html", "app/sample-assessment/page.tsx", "/sample-assessment", "inflow", "compact"],
  ["pages/science.html", "app/science/page.tsx", "/science", "overlay", "full"],
  ["pages/support.html", "app/support/page.tsx", "/support", "overlay", "full"],
  ["pages/symptom-checker.html", "app/symptom-checker/page.tsx", "/symptom-checker", "inflow", "compact"],
  ["pages/team.html", "app/team/page.tsx", "/team", "inflow", "compact"],
  ["pages/terms.html", "app/terms/page.tsx", "/terms", "inflow", "compact"],
  ["pages/waitlist.html", "app/waitlist/page.tsx", "/waitlist", "inflow", "compact"],
  ["pages/blog/5-things-your-pet-cant-tell-you.html", "app/blog/5-things-your-pet-cant-tell-you/page.tsx", "/blog/5-things-your-pet-cant-tell-you", "inflow", "full-blog"],
  ["pages/blog/biological-age-for-pets.html", "app/blog/biological-age-for-pets/page.tsx", "/blog/biological-age-for-pets", "inflow", "full-blog"],
  ["pages/blog/breed-specific-health-risks.html", "app/blog/breed-specific-health-risks/page.tsx", "/blog/breed-specific-health-risks", "inflow", "full-blog"],
  ["pages/blog/common-pet-health-problems.html", "app/blog/common-pet-health-problems/page.tsx", "/blog/common-pet-health-problems", "inflow", "full-blog"],
  ["pages/blog/healthier-routine-for-dog.html", "app/blog/healthier-routine-for-dog/page.tsx", "/blog/healthier-routine-for-dog", "inflow", "full-blog"],
  ["pages/blog/is-your-dog-at-healthy-weight.html", "app/blog/is-your-dog-at-healthy-weight/page.tsx", "/blog/is-your-dog-at-healthy-weight", "inflow", "full-blog"],
  ["pages/blog/nutrition-long-term-health.html", "app/blog/nutrition-long-term-health/page.tsx", "/blog/nutrition-long-term-health", "inflow", "full-blog"],
  ["pages/blog/pet-behaviour-and-health.html", "app/blog/pet-behaviour-and-health/page.tsx", "/blog/pet-behaviour-and-health", "inflow", "full-blog"],
  ["pages/blog/preventive-pet-care.html", "app/blog/preventive-pet-care/page.tsx", "/blog/preventive-pet-care", "inflow", "full-blog"],
  ["pages/blog/track-changes-senior-pet.html", "app/blog/track-changes-senior-pet/page.tsx", "/blog/track-changes-senior-pet", "inflow", "full-blog"],
];

function extractMain(html) {
  const withoutScripts = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  const bodyMatch = withoutScripts.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  let body = bodyMatch ? bodyMatch[1] : withoutScripts;
  const footerIdx = body.search(/<footer\b/i);
  if (footerIdx !== -1) body = body.slice(0, footerIdx);
  body = body.replace(/<div class="page-wrapper">\s*/i, "");
  body = body.replace(/<div class="section-frame absolute-nav">[\s\S]*?<\/header>\s*<\/div>\s*/i, "");
  body = body.replace(/<header[\s\S]*?<\/header>\s*/i, "");
  return body;
}

function headings(src) {
  return [...src.matchAll(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi)].map((m) =>
    m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
  );
}

function images(src) {
  return [...src.matchAll(/\bsrc="([^"]+)"/gi)].map((m) =>
    m[1].replace(/^(\.\.\/)+/, "").replace(/^assets\//, "/assets/").replace(/^\/assets\//, "/assets/"),
  );
}

function ids(src) {
  return [...src.matchAll(/\bid="([^"]+)"/gi)].map((m) => m[1]).sort();
}

function forms(src) {
  return [...src.matchAll(/<form\b[^>]*>/gi)].map((m) => m[0]);
}

function hasFullFooter(tsx) {
  return tsx.includes("footer-nav") || tsx.includes("Footer");
}

const rows = [];
for (const [htmlRel, nextRel, route, expectedVariant, htmlFooter] of MAP) {
  const html = fs.readFileSync(path.join(HTML_ROOT, htmlRel), "utf8");
  const tsx = fs.readFileSync(path.join(NEXT_ROOT, nextRel), "utf8");
  const htmlMain = extractMain(html);
  const htmlH = headings(htmlMain);
  const nextH = headings(tsx);
  const missingH = htmlH.filter((h) => !nextH.includes(h));
  const extraH = nextH.filter((h) => !htmlH.includes(h));
  const htmlImgs = images(htmlMain).map((s) => s.replace(/^\.\.\/\.\.\//, "").replace(/^\.\.\//, ""));
  const nextImgs = images(tsx);
  const htmlImgBase = htmlImgs.map((s) => s.split("/").pop());
  const nextImgBase = nextImgs.map((s) => s.split("/").pop());
  const missingImg = htmlImgBase.filter((s) => !nextImgBase.includes(s));
  const htmlIds = ids(htmlMain);
  const nextIds = ids(tsx);
  const missingIds = htmlIds.filter((id) => !nextIds.includes(id));
  const htmlOverlay = html.includes("absolute-nav");
  const nextOverlay = tsx.includes('variant="overlay"');
  const htmlBlogNav = /nav-links[\s\S]*?is-active[\s\S]*?Blog/.test(html) && htmlRel.includes("/blog/");
  const compactHtmlFooter = /footer-bottom" style="border-top:none/.test(html) || htmlRel.includes("assess-results");
  const nextAlwaysFullFooter = hasFullFooter(tsx) && tsx.includes("SiteShell");

  rows.push({
    route,
    htmlRel,
    headingMatch: missingH.length === 0 && extraH.length === 0,
    missingHeadings: missingH,
    extraHeadings: extraH,
    htmlHeadingCount: htmlH.length,
    nextHeadingCount: nextH.length,
    missingImages: missingImg,
    missingIds,
    overlayMatch: htmlOverlay === nextOverlay,
    htmlOverlay,
    nextOverlay,
    htmlFooter: compactHtmlFooter ? "compact" : htmlFooter.includes("blog") ? "full-blog" : "full",
    nextFooter: nextAlwaysFullFooter ? "full (shared)" : "page-local",
    htmlFormCount: forms(htmlMain).length,
    nextFormCount: forms(tsx).length,
    blogSimplifiedNav: htmlRel.includes("pages/blog/") && htmlRel !== "pages/blog.html",
  });
}

const issues = [];
for (const r of rows) {
  if (!r.headingMatch) issues.push(`${r.route}: heading mismatch missing=${JSON.stringify(r.missingHeadings)} extra=${JSON.stringify(r.extraHeadings)}`);
  if (r.missingImages.length) issues.push(`${r.route}: missing images ${r.missingImages.join(", ")}`);
  if (r.missingIds.length) issues.push(`${r.route}: missing ids ${r.missingIds.join(", ")}`);
  if (!r.overlayMatch) issues.push(`${r.route}: overlay/inflow mismatch html=${r.htmlOverlay} next=${r.nextOverlay}`);
  if (r.htmlFormCount !== r.nextFormCount) issues.push(`${r.route}: form count html=${r.htmlFormCount} next=${r.nextFormCount}`);
}

console.log(JSON.stringify({ pageCount: rows.length, contentIssues: issues, pages: rows }, null, 2));
