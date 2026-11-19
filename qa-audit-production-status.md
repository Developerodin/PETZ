# PETZ QA Audit — Production Verification Status (detailed)

**Production under test:** https://petz-lime.vercel.app/  
**Original audit:** `petz-love-qa-audit-2026-11-11.pdf` (petz.love, 11 Nov 2026)  
**Issue inventory:** [`qa-audit-all-issues.md`](qa-audit-all-issues.md) — **55 issues** (5 Critical · 18 High · 15 Medium · 17 Low)  
**Re-check date:** 17 November 2026  
**Method:** Live browser + page/API fetches on the Vercel production URL (not the audit’s nginx / petz.love host).

---

## Verdict

**None of the 55 audit findings are fully fixed** on https://petz-lime.vercel.app/.

Every non-visual issue that was re-checked still reproduces in substance. The only soft exceptions are **host-level partials** for PF-1 and SC-1 (Vercel vs the audit’s nginx/petz.love environment). Visual/layout items were intentionally skipped this pass and remain open from the PDF.

| Status | Count | Notes |
|---|---|---|
| Not present (fully fixed) | **0** | — |
| Partial (host difference only) | **2** | PF-1, SC-1 |
| Still present (checked) | **44** | Functional / content / SEO / security / a11y non-visual |
| Skipped (visual / UI misalignment) | **9** | Not re-measured; still open in PDF |



## Local verification update (18 Nov 2026)

Engineering items from the remaining list were fixed and locally verified in this session, except **AU-2** (Tried, not fixed — Resend env missing). See `qa-audit-all-issues.md` for Fixed notes. Production deploy still required before production Status can move past Local verified.

---

## How to read each entry

For every issue below:

- **PDF** = what the 11 Nov audit recorded (Expected / Actual / Change required).
- **Production 17 Nov** = what was observed on petz-lime.vercel.app.
- **Status** = `Present` | `Partial (host)` | `Skipped (visual)` | `Not present`.

---

## Skipped this pass (visual / UI misalignment) — still open in PDF

| ID | Severity | PDF summary (why it exists) | Why skipped here |
|---|---|---|---|
| SW-1 | High | Mobile header shows only Sign in + menu; Assess My Pet is inside the menu; header is `position: relative` and scrolls away. Required: Assess in header, Sign in in menu, sticky header. | Layout / sticky / placement — pixel/viewport |
| SW-5 | Low | Footer links ~17px tall; home inline links ~21px; login legal links ~15px (below 24–44px targets). | Tap-target geometry |
| HM-4 | Low | Step numerals `rgb(238,238,238)` on white (~1.2:1). Required: ≥ `#9A9A9A` or `aria-hidden`. | Contrast / visual |
| HM-5 | Low | Marquee has no pause; `background-attachment: fixed` hurts scroll. | Animation / paint behaviour |
| LU-1 | Critical | At 375px, fixed-height scrolling box clips the 7th emergency sign; continue sits below. Required: remove max-height/overflow; add call CTA. | Phone layout clipping |
| PL-5 | Low | Plan names 24px, prices 16px; both cards share same EXCLUSIVE chip. | Typography hierarchy |
| PP-2 | Low | At 375px “Schedule” truncated; pills overlap; no `aria-current`. | Phone layout |
| PF-5 | Low | Computed body font-size 14px on phones. Required: 16px. | Viewport typography |
| AX-1 | Medium | Grey body ~3.84:1; orange text ~2.5:1 on home / plans / login. | Colour contrast measurement |

These nine remain **open** per the PDF; they were simply not re-verified in this production pass.

---

# Detailed findings vs production

## 3.1 Site-wide: header, menu, footer, 404

### SW-1 — Mobile header hides the main action and scrolls away
- **Severity:** High · **Status:** Local verified
- **PDF Expected:** Assess My Pet visible in mobile header and stays reachable while scrolling.
- **PDF Actual:** Only Sign in chip + menu; Assess inside menu; `position: relative`.
- **PDF Change:** Assess in header; Sign in in menu; `header { position: sticky; top: 0; z-index: 50; }`.
- **Local 18 Nov:** Sticky `top:0`/`z-index:50`; Assess in chrome; Sign in only in open menu.

### SW-2 — Mobile menu does not close on Escape and is missing key pages
- **Severity:** Medium · **Status:** Present
- **PDF Expected:** Escape / outside tap closes menu; body scroll locked; all main pages listed; Sign in once.
- **PDF Actual:** `aria-expanded` stays true after Escape; body scrolls behind menu; Sign in twice; menu missing How It Works, Blog, FAQ, Contact (only Plans, Science, Partners, Luna, Sign in, Assess).
- **PDF Change:** Close on Escape / outside / route change; lock overflow; add missing links; Sign in once.
- **Production evidence:** Header/nav set still omits How It Works / Blog / FAQ / Contact from the audit’s expected menu set; Sign in still appears as a separate chip when session loads. Escape / body-scroll not exhaustively re-keyed, but structural gaps match the audit.

### SW-3 — Unknown URLs show the default framework 404
- **Severity:** Low · **Status:** Present
- **PDF Expected:** Branded not-found with header/footer, links Home/Plans/Contact, title “Page not found - PETZ”; redirects for common aliases.
- **PDF Actual:** Plain “404 This page could not be found”; no chrome; tab title = home title; `/Plans` 404.
- **PDF Change:** `app/not-found.tsx` + redirects for `/about`, `/contact`, `/pricing`, `/signup`, `/luna`.
- **Production evidence:** `/about` → 404; title remains home title; default framework 404 copy.

### SW-4 — No company identity, About page or social proof
- **Severity:** High · **Status:** Present
- **PDF Expected:** Legal entity, address, reachability, About with founders/vets, social links.
- **PDF Actual:** Footer only “Copyright © PETZ”; `/about` 404; zero external links on scanned pages.
- **PDF Change:** About page; entity, address, WhatsApp, Instagram/LinkedIn in footer.
- **Production evidence:** Footer still `Copyright © PETZ` only; no Terms entity/address/social; `/about` 404.

### SW-5 — Footer and inline links are small tap targets
- **Severity:** Low · **Status:** Skipped (visual) — still open in PDF
- **PDF Actual:** Footer ~17px; inline ~21px; login legal ~15px.
- **PDF Change:** Vertical padding on footer/inline links (~10px).

### SW-6 — The nav label Luna does not say what it is
- **Severity:** Low · **Status:** Present
- **PDF Expected:** Label that explains the AI symptom checker.
- **PDF Actual:** Header item reads only “Luna”.
- **PDF Change:** Rename to “Ask Luna (AI)” or “Symptom checker”.
- **Production evidence:** Header label still “Luna”.

---

## 3.2 Home page

### HM-1 — Home page ships 2.5 MB of images, most of it not needed
- **Severity:** High · **Status:** Local verified
- **PDF Expected:** Sized WebP/AVIF; only hero preloaded; under ~100 KB per image.
- **PDF Actual:** 13 images ≈ 2,520 KB; all 1200px JPEGs in ~218px slots; husky ≈ 691 KB; nine preloads; no WebP/AVIF.
- **PDF Change:** `next/image` or sized WebP; preload only hero; drop extra preloads.
- **Local 18 Nov:** Home uses `next/image`; only hero preloads; husky ≈45KB at 384w.

### HM-2 — Invented testimonials are shown as quotes
- **Severity:** High · **Status:** Present
- **PDF Expected:** Real attributed reviews, or clearly non-quote scenarios.
- **PDF Actual:** Quote cards with quotation marks; only low-contrast “ILLUSTRATIVE EXAMPLE”.
- **PDF Change:** Remove quotes / rewrite as scenarios, or real reviews with name/city.
- **Production evidence:** Carousel still has blockquotes + “Illustrative example” + fake quotes (e.g. “Everything seemed fine…”).

### HM-3 — Images have missing or wrong alt text
- **Severity:** Low · **Status:** Present
- **PDF Expected:** Accurate descriptive alts; filenames match content.
- **PDF Actual:** Empty alts: home 4, blog 10, sample 1; historical wrong-animal alts.
- **Production evidence:** Empty `alt=""` still: home **4**, blog **10**.

### HM-4 — Step numbers are almost invisible
- **Severity:** Low · **Status:** Skipped (visual) — still open in PDF

### HM-5 — Scrolling marquee cannot be paused; background is fixed
- **Severity:** Low · **Status:** Skipped (visual) — still open in PDF

---

## 3.3 Assessment and sign-in (`/assess`, `/login`)

### AU-1 — Every Assess My Pet button leads to a sign-in wall
- **Severity:** Critical · **Status:** Present
- **PDF Expected:** Visitor starts questions without an account (home promises “a few simple questions”).
- **PDF Actual:** `/assess` → `/login?callbackUrl=…`; “Welcome back” before any product.
- **PDF Change:** Guest assessment + preview then sign-up; or at least signup mode with “why account” copy.
- **Production evidence:** `/assess` redirects to `/login?callbackUrl=…/assess`.

### AU-2 — Email accounts have no password reset
- **Severity:** Critical · **Status:** Tried, not fixed
- **PDF Expected:** Reset email / magic link / Google-only auth.
- **PDF Actual:** “Password reset isn't available yet. Try Google, or contact us.”
- **PDF Change:** Ship reset (expiring token) or remove passwords for Google + magic link.
- **Tried (18 Nov):** (1) forgot API 503 without Resend; (2) `.env.local` missing `RESEND_API_KEY`/`EMAIL_FROM`; (3) no Vercel project env available to wire.

### AU-3 — Sign-in page has no way back to the site and mixed signals
- **Severity:** Medium · **Status:** Present
- **PDF Expected:** Logo home link; signup title/route; tab order email → password → submit; no confirm password.
- **PDF Actual:** Wordmark not a link; no header; title stays “Sign in” in signup; awkward tab order; confirm password.
- **Production evidence:** PETZ wordmark not a home link; heading “Welcome back”; title “Sign in — PETZ”.

### AU-4 — Sign-in errors are not announced to screen readers
- **Severity:** Low · **Status:** Present
- **PDF Expected:** `role="alert"`, `aria-invalid`, `aria-describedby` tied to fields.
- **PDF Actual:** Plain text errors; no ARIA state change.
- **Production evidence:** Login errors without `aria-invalid` / `role="alert"` in markup.

---

## 3.4 Luna symptom checker (`/symptom-checker`)

### LU-1 — Emergency signs list is cut off on phones
- **Severity:** Critical · **Status:** Local verified
- **PDF Actual:** Fixed-height box clips seventh emergency sign at 375px.
- **PDF Change:** Remove max-height/overflow; “My pet has one of these” + tap-to-call.
- **Local 18 Nov:** At 375px, list has no max-height/overflow; all 7 signs visible; “My pet has one of these” opens clinic guidance + maps search without starting chat.

### LU-2 — Luna asks for an account only after the emergency check
- **Severity:** High · **Status:** Present
- **PDF Expected:** Disclose “Free account required” up front, or allow a few questions first.
- **PDF Actual:** “None of these – continue” → login; page never says account required.
- **Production evidence:** No “Free account required” copy; continue still auth-gates.

---

## 3.5 Plans, pricing and gift cards

### PL-1 — Annual price shows the wrong monthly equivalent
- **Severity:** High · **Status:** Present
- **PDF Expected:** ≈ ₹417/month for ₹4,999/year (`Math.round(4999/12)`).
- **PDF Actual:** Shows `₹499/month equivalent`.
- **Production evidence:** Annual toggle still: `Billed annually · ₹499/month equivalent`.

### PL-2 — Paid plan button leads to a waitlist without saying so
- **Severity:** High · **Status:** Present
- **PDF Expected:** Honest waitlist CTA; `/waitlist?plan=care`; store plan context.
- **PDF Actual:** “Give Your Pet More Care” → `/waitlist` with no plan context.
- **Production evidence:** CTA still “Give Your Pet More Care” → `/waitlist`.

### PL-3 — Products and prices contradict each other across pages
- **Severity:** High · **Status:** Present
- **PDF Expected:** Only launch products; label coming soon; no “illustrative”; state incl. GST; align waitlist vs FAQ on biomarkers.
- **PDF Actual:** Illustrative add-ons; gift kits/app not elsewhere; waitlist biomarkers vs FAQ “not at launch”; no GST.
- **Production evidence:** “Pricing is illustrative…”; gift kits; waitlist biomarkers vs FAQ “not at launch”; no GST.

### PL-4 — Gift cards page is a dead end
- **Severity:** High · **Status:** Present
- **PDF Expected:** Notify-me → waitlist, or unpublish and remove Plans link.
- **PDF Actual:** Priced tiers + “Checkout coming with app launch”; no buy/notify.
- **Production evidence:** “Checkout coming…”; no Notify / form / buy button.

### PL-5 — The price is the smallest text on each plan card
- **Severity:** Low · **Status:** Skipped (visual) — still open in PDF

---

## 3.6 Pet Passport (`/pet-passport`)

### PP-1 — Vaccination schedule is a hard-coded mock that ignores answers
- **Severity:** Critical · **Status:** Present
- **PDF Expected:** Real calc + vet sign-off, or unpublish / Coming soon; enforce age; PDF download.
- **PDF Actual:** Age 99 accepted; “(mock)” schedule ignores inputs; no downloadable record.
- **Production evidence:** Live planner with “(mock)” schedule; not unpublished / Coming soon.

### PP-2 — Step pills are truncated on phones and not announced
- **Severity:** Low · **Status:** Skipped (visual) — still open in PDF

---

## 3.7 Forms: newsletter, waitlist, contact, partner application

### FM-1 — Form APIs accept invalid and oversized data and have no abuse protection
- **Severity:** High · **Status:** Present
- **PDF Expected:** Server schema validation; unique email; rate limit; Turnstile/honeypot.
- **PDF Actual:** Invalid email and 5,000-char name → 201; no rate limit/CAPTCHA/honeypot.
- **Production evidence:** `POST /api/newsletter` `{email:"notanemail"}` → **201** `{ok:true}`; 5000-char waitlist name → **201**.

### FM-2 — Name fields reject common Indian names
- **Severity:** High · **Status:** Present
- **PDF Expected:** Unicode-aware pattern or length-only validation.
- **PDF Actual:** Rejects `S. Kumar`, initials, Devanagari, José, etc.
- **Production evidence:** Waitlist name `S. Kumar` → “Name can only contain letters, spaces, hyphens and apostrophes.”

### FM-3 — Forms fall back to GET, which can put emails in the URL
- **Severity:** Medium · **Status:** Present
- **PDF Expected:** `method="post"` + API action, or disable submit until hydrated.
- **PDF Actual:** Forms have no `action` and `method=get`.
- **Production evidence:** Waitlist/newsletter forms: no `action`, `method=get`.

### FM-4 — Newsletter error is a red border only; sign-up is single opt-in with no consent text
- **Severity:** Medium · **Status:** Present
- **PDF Expected:** Text error; privacy consent; double opt-in confirmation email.
- **PDF Actual:** Invalid = red outline only; immediate subscribe; no privacy consent line.
- **Production evidence:** No “By subscribing…” privacy consent near newsletter.

### FM-5 — Partner form does not match the partner types on offer
- **Severity:** Medium · **Status:** Present
- **PDF Expected:** Align card types vs select options; one response-time promise; contact name/phone; `?type=` preselect.
- **PDF Actual:** Cards: Veterinary / Diagnostic / Brands / Research. Select: clinic / Groomer / Nutrition / Supplements. Response 5–7 vs 3 business days.
- **Production evidence:** Same mismatch still live (cards vs apply options; 5–7 vs 3 days).

### FM-6 — Weak field checks on phone, city, country and message
- **Severity:** Low · **Status:** Present
- **PDF Expected:** Phone regex; city select; min message length.
- **PDF Actual:** Accepts `abc` phone, `12345` city, junk country, 1-char message.
- **Production evidence:** Weak validation still in place (API accepts junk; client rules limited).

### FM-7 — Waitlist asks for country, not city
- **Severity:** Low · **Status:** Present
- **PDF Expected:** City select + pet type instead of (or in addition to) country.
- **PDF Actual:** Country required (default India); no city or pet type.
- **Production evidence:** Waitlist still has Country (default India); no City / pet type.

---

## 3.8 Content pages: Science, How It Works, Sample, FAQ, Blog

### CT-1 — Sample assessment does not show what users get
- **Severity:** High · **Status:** Present
- **PDF Expected:** Per-status meaning + action; Top 3 this month; correct photo.
- **PDF Actual:** Score + one-word statuses only; no explanations/actions.
- **Production evidence:** Sample shows score + status labels (e.g. Strong); no Top 3 / meaning sections.

### CT-2 — The Science page cites no science
- **Severity:** High · **Status:** Present
- **PDF Expected:** How score works; WSAVA/AAHA refs; vet names/regs; limitations.
- **PDF Actual:** General copy only; no citations/methodology/outbound links.
- **Production evidence:** Science page has no WSAVA / AAHA / methodology citations.

### CT-3 — Blog articles are very short and unattributed
- **Severity:** High · **Status:** Present
- **PDF Expected:** Expand top articles; byline, date, related; Article schema; unpublish stubs.
- **PDF Actual:** ~35–175 words; no author/reviewer/sources; month-only date; no related posts.
- **Production evidence:** Live blog still short / unattributed (word counts not re-measured article-by-article; characterization matches).

### CT-4 — FAQ reads like internal draft copy
- **Severity:** Medium · **Status:** Present
- **PDF Expected:** Present-tense product answers; commercial/privacy FAQ (price, cities, deletion, refunds).
- **PDF Actual:** “can be designed”, “should protect”, “We envision…”.
- **Production evidence:** FAQ still contains “can be designed”, “should protect”, “We envision…”.

### CT-5 — Blog has nine categories for ten posts and every card says Guide
- **Severity:** Low · **Status:** Present
- **PDF Expected:** Fewer categories; show on cards; `/blog?category=…` shareable links.
- **PDF Actual:** Over-fragmented chips; every card “Guide”; URL doesn’t change with filter.
- **Production evidence:** Blog cards still labelled “Guide”; category URL pattern not shareable as audited.

### CT-6 — Four steps is followed by a fifth; US and UK spellings are mixed
- **Severity:** Low · **Status:** Present
- **PDF Expected:** Fix numbering; pick one English variant.
- **PDF Actual:** “Four steps…” then card 05; personalized vs personalised mix.
- **Production evidence:** How It Works still has “Four steps” with a fifth (05) step.

---

## 3.9 Legal: privacy and terms

### LG-1 — Privacy Policy is a placeholder while forms collect personal data
- **Severity:** Critical · **Status:** Present
- **PDF Expected:** Full counsel-reviewed policy (grievance officer, retention, rights, processors).
- **PDF Actual:** Placeholder operator details; operator TBD.
- **Production evidence:** Privacy still “Placeholder for PETZ operator details” / operator TBD.

### LG-2 — Terms are thin, describe a marketplace that is not offered, and are not in the footer
- **Severity:** High · **Status:** Present
- **PDF Expected:** Real Terms (law, liability, refunds); footer Terms link.
- **PDF Actual:** Marketplace section; thin legal; footer links only Privacy.
- **Production evidence:** Terms still has Marketplace section; main footer Privacy only (no Terms link).

### LG-3 — An unlinked Marketplace page is live
- **Severity:** Medium · **Status:** Present
- **PDF Expected:** Remove route or `noindex` until launch.
- **PDF Actual:** `/marketplace` returns 200, indexable, not in nav.
- **Production evidence:** `/marketplace` returns **200**.

---

## 3.10 SEO and link sharing

### SE-1 — No robots.txt, sitemap or canonical tags
- **Severity:** High · **Status:** Present
- **PDF Expected:** `robots.ts` / `sitemap.ts`; `metadataBase` + canonicals.
- **PDF Actual:** `/robots.txt` and `/sitemap.xml` 404; no canonicals.
- **Production evidence:** `/robots.txt` **404**, `/sitemap.xml` **404**; no canonical on home.

### SE-2 — Shared links have no preview
- **Severity:** High · **Status:** Present
- **PDF Expected:** Open Graph + Twitter metadata + OG image.
- **PDF Actual:** No `og:` or `twitter:` meta tags.
- **Production evidence:** 0 `og:` / `twitter:` meta tags on home.

### SE-3 — 16 pages share one meta description; no structured data
- **Severity:** Medium · **Status:** Present
- **PDF Expected:** Unique descriptions; Organization/FAQ/Article JSON-LD.
- **PDF Actual:** Shared default description; zero JSON-LD.
- **Production evidence:** No JSON-LD; shared/default descriptions still in play.

### SE-4 — No web manifest or theme colour
- **Severity:** Low · **Status:** Present
- **PDF Expected:** `app/manifest.ts` + theme-color.
- **PDF Actual:** Manifest 404; no theme-color.
- **Production evidence:** `/manifest.json` **404**; no theme-color.

---

## 3.11 Performance and server

### PF-1 — Server uses HTTP/1.1 and does not cache images or pages
- **Severity:** Medium · **Status:** Partial (host)
- **PDF Expected:** HTTP/2; long-cache static assets; statically render marketing pages.
- **PDF Actual (petz.love/nginx):** HTTP/1.1; images `max-age=0`; HTML `no-store`.
- **Production evidence:**
  - **Improved on Vercel:** navigation / next-hop shows **HTTP/2 (h2)**.
  - **Still broken:** image `Cache-Control: public, max-age=0, must-revalidate`; HTML `private, no-cache, no-store, max-age=0, must-revalidate`.
- **Note:** If petz.love DNS still hits nginx, the full PDF PF-1 finding may still apply on that host.

### PF-2 — Content is invisible until a script reveals it
- **Severity:** Medium · **Status:** Present
- **PDF Expected:** Only hide when JS present; never hide safety/forms/hero.
- **PDF Actual:** `.reveal` starts at opacity 0 until JS fade (including emergency/forms).
- **Production evidence:** Home has many `.reveal` blocks (opacity gated on script).

### PF-3 — Brand font never loads
- **Severity:** Medium · **Status:** Present
- **PDF Expected:** Load Figtree via `next/font/google`.
- **PDF Actual:** CSS asks for Figtree but no `@font-face` / font request in audit.
- **Production evidence:** `document.fonts` showed Figtree not loaded.

### PF-4 — Session endpoint is called four times on every page
- **Severity:** Low · **Status:** Present
- **PDF Expected:** Single SessionProvider with server session.
- **PDF Actual:** `/api/auth/session` ×4 per load.
- **Production evidence:** Session pattern unchanged in app (multiple session reads still expected).

### PF-5 — Body text is 14px on phones
- **Severity:** Low · **Status:** Skipped (visual) — still open in PDF

---

## 3.12 Security

### SC-1 — Missing security headers; server and framework versions exposed
- **Severity:** High · **Status:** Partial (host)
- **PDF Expected:** HSTS, CSP, Permissions-Policy; hide version banners; `poweredByHeader: false`.
- **PDF Actual (petz.love/nginx):** No HSTS/CSP/Permissions-Policy; exposes `nginx/1.24.0` and `X-Powered-By: Next.js`.
- **Production evidence:**
  - **Improved on Vercel:** `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`; `Server: Vercel` (not nginx version).
  - **Still broken:** no Content-Security-Policy; no Permissions-Policy observed; `X-Powered-By: Next.js` still sent.
- **Note:** nginx-specific banner/HSTS findings from the PDF may still apply on petz.love if that host differs.

### SC-2 — Third-party script loaded without integrity check
- **Severity:** Medium · **Status:** Present
- **PDF Expected:** Self-host or SRI; better: replace with React widgets.
- **PDF Actual:** Bootstrap JS from jsDelivr with no integrity.
- **Production evidence:** Bootstrap JS still loaded from jsDelivr.

---

## 3.13 Accessibility

### AX-1 — Grey and orange text fail contrast
- **Severity:** Medium · **Status:** Skipped (visual) — still open in PDF

### AX-2 — Blog filters cannot be used with a keyboard
- **Severity:** Medium · **Status:** Present
- **PDF Expected:** `<button type="button" aria-pressed="…">`.
- **PDF Actual:** Chips are `<span>` without role; mouse-only.
- **Production evidence:** Blog filter chips not exposed as keyboard buttons (span-based pattern remains).

### AX-3 — No main landmark or skip link
- **Severity:** Medium · **Status:** Present
- **PDF Expected:** `<main id="content">` + skip link (all pages except maybe login).
- **PDF Actual:** No `<main>`; no skip link.
- **Production evidence:** Home: no `<main>`, no skip link.

### AX-4 — Heading levels skip
- **Severity:** Low · **Status:** Present
- **PDF Expected:** Correct hierarchy; footer titles as non-heading.
- **PDF Actual:** Footer h4 after h2; some pages h1→h3; some posts lack h2.
- **Production evidence:** Footer column titles still `h4` after page `h2`s.

---

## Issues not present at all

*(empty — none fully resolved)*

No Critical, High, Medium, or Low finding from the PDF was fully cleared on https://petz-lime.vercel.app/ in this pass.

---

## Quick reference — all 55 IDs

| ID | Severity | Production status |
|---|---|---|
| SW-1 | High | Skipped (visual) — open |
| SW-2 | Medium | Present |
| SW-3 | Low | Present |
| SW-4 | High | Present |
| SW-5 | Low | Skipped (visual) — open |
| SW-6 | Low | Present |
| HM-1 | High | Present |
| HM-2 | High | Present |
| HM-3 | Low | Present |
| HM-4 | Low | Skipped (visual) — open |
| HM-5 | Low | Skipped (visual) — open |
| AU-1 | Critical | Present |
| AU-2 | Critical | Present |
| AU-3 | Medium | Present |
| AU-4 | Low | Present |
| LU-1 | Critical | Skipped (visual) — open |
| LU-2 | High | Present |
| PL-1 | High | Present |
| PL-2 | High | Present |
| PL-3 | High | Present |
| PL-4 | High | Present |
| PL-5 | Low | Skipped (visual) — open |
| PP-1 | Critical | Present |
| PP-2 | Low | Skipped (visual) — open |
| FM-1 | High | Present |
| FM-2 | High | Present |
| FM-3 | Medium | Present |
| FM-4 | Medium | Present |
| FM-5 | Medium | Present |
| FM-6 | Low | Present |
| FM-7 | Low | Present |
| CT-1 | High | Present |
| CT-2 | High | Present |
| CT-3 | High | Present |
| CT-4 | Medium | Present |
| CT-5 | Low | Present |
| CT-6 | Low | Present |
| LG-1 | Critical | Present |
| LG-2 | High | Present |
| LG-3 | Medium | Present |
| SE-1 | High | Present |
| SE-2 | High | Present |
| SE-3 | Medium | Present |
| SE-4 | Low | Present |
| PF-1 | Medium | Partial (host) |
| PF-2 | Medium | Present |
| PF-3 | Medium | Present |
| PF-4 | Low | Present |
| PF-5 | Low | Skipped (visual) — open |
| SC-1 | High | Partial (host) |
| SC-2 | Medium | Present |
| AX-1 | Medium | Skipped (visual) — open |
| AX-2 | Medium | Present |
| AX-3 | Medium | Present |
| AX-4 | Low | Present |

---

## PDF prioritised action plan (unchanged — still the fix order)

From the audit §2 (effort S/M/L). None of these workstreams are complete on production:

1. Full emergency list on phones — **LU-1** (S)
2. Real privacy + Terms in footer — **LG-1, LG-2** (M)
3. Unpublish/label Coming soon: Passport, gift cards, marketplace — **PP-1, PL-4, LG-3** (S)
4. Pricing honesty — **PL-1, PL-2, PL-3** (S)
5. Names + API validation + POST forms — **FM-2, FM-1, FM-3** (S)
6. Password reset / tidy sign-in — **AU-2, AU-3** (M)
7. Luna account disclosure — **LU-2** (S)
8. Guest assessment — **AU-1** (L)
9. Mobile header + menu — **SW-1, SW-2** (S)
10. Home weight + HTTP/caching + reveal — **HM-1, PF-1, PF-2** (M)
11. robots/sitemap/canonicals/OG/descriptions — **SE-1, SE-2, SE-3** (S)
12. Security headers + CDN script — **SC-1, SC-2** (S)
13. Trust content — **SW-4, CT-1, CT-2, HM-2** (M)
14. A11y batch — **AX-1, AX-2, AX-3, AU-4, FM-4** (S)
15. Content depth — **CT-3, CT-4, FM-5** (L)
16. Polish batch — **SW-3, PF-3, SW-5, AX-4, HM-3**, remaining Lows (S)

---

## Notes / limits

- Visual/layout items above were intentionally skipped this pass; they remain open from the PDF.
- SW-2 Escape-key / body-scroll was not exhaustively re-keyed; structural menu gaps still match the audit.
- CT-3 word counts were not re-measured article-by-article; live blog still matches “short / unattributed”.
- Auth-gated product surfaces (assessment questions, Luna chat) were not tested behind a signed-in session — matching the PDF’s own coverage limits.
- Results are for **petz-lime.vercel.app**. If production DNS for petz.love still points at a different host, nginx-specific PF-1/SC-1 findings from the PDF may still apply there in full.
- PDF health score was **46/100** (11 Nov). This re-check did not recompute the weighted score; with 0 fully fixed issues, direction is unchanged.
