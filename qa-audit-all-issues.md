# PETZ QA Audit — Full Issue Inventory

Source: `petz-love-qa-audit-2026-11-11.pdf`  
Audited site: petz.love (11 November 2026)  
Total: **55 issues** (5 Critical · 18 High · 15 Medium · 17 Low)

**Status legend:** `Open` (default) · `On hold` (waiting on client content/decisions) · `Fixed` (done in local code; confirm on deploy)

**On hold (client-dependent) — 10 issues:** SW-4, HM-2, AU-1, PL-3, CT-1, CT-2, CT-3, CT-4, LG-1, LG-2  
Client was asked for copy/legal/product inputs; proceed with other engineering fixes until that lands.

---

## 3.1 Site-wide: header, menu, footer, 404

### SW-1 — Mobile header hides the main action and scrolls away
- **Severity:** High
- **Status:** Fixed
- **Location:** Header, all pages, phone and tablet (below 992px)
- **Summary:** Header shows only Sign in + menu; Assess My Pet is inside the menu. Header is `position: relative` and scrolls away.
- **Required change:** Put Assess My Pet in the mobile header; move Sign in into the menu; make header sticky.
- **Fix note:** Sticky header; Assess in mobile chrome; Sign in only in menu. Local verified at 375px on `/plans`.

### SW-2 — Mobile menu does not close on Escape and is missing key pages
- **Severity:** Medium
- **Status:** Fixed
- **Location:** Header menu, phone and tablet
- **Summary:** Escape does not close menu (`aria-expanded` stays true); page scrolls behind menu; Sign in shown twice; How It Works, Blog, FAQ, Contact missing from menu.
- **Required change:** Close on Escape, outside tap, and route change; lock body scroll; add missing links; show Sign in once.
- **Fix note:** Escape/outside close + body lock; menu includes How It Works/Blog/FAQ/Contact; Sign in once; Ask Luna (AI). Local verified.


### SW-3 — Unknown URLs show the default framework 404
- **Severity:** Low
- **Status:** Fixed
- **Location:** Any unknown URL (e.g. `/about`, `/pricing`, `/Plans`)
- **Summary:** Plain “404 This page could not be found” with no header/footer/links; tab title is home title.
- **Required change:** Add branded `not-found` page; add redirects for common aliases.
- **Fix note:** `app/not-found.tsx` + redirects for about/contact/pricing/Plans/signup/luna. Local verified.


### SW-4 — No company identity, About page or social proof
- **Severity:** High
- **Status:** On hold
- **Blocked on:** Client — legal entity, address, About/founders/vets, WhatsApp, Instagram/LinkedIn
- **Location:** Footer, all pages; `/about`
- **Summary:** Footer is only “Copyright © PETZ”; `/about` 404; zero external/social links.
- **Required change:** About page with founders/vets; legal entity, address, WhatsApp, Instagram/LinkedIn in footer.

### SW-5 — Footer and inline links are small tap targets
- **Severity:** Low
- **Status:** Fixed
- **Location:** Footer links; home inline links; login legal links
- **Summary:** Footer links ~17px tall; other links 15–21px (below 24–44px target).
- **Required change:** Add vertical padding to footer/inline links.
- **Fix note:** Footer links get vertical padding / min-height 44px. Local verified.


### SW-6 — The nav label Luna does not say what it is
- **Severity:** Low
- **Status:** Fixed
- **Location:** Header navigation
- **Summary:** Label is only “Luna” with no hint it is the AI symptom checker.
- **Required change:** Rename to “Ask Luna (AI)” or “Symptom checker”.
- **Fix note:** Header nav label is Ask Luna (AI). Local verified.


## 3.2 Home page

### HM-1 — Home page ships 2.5 MB of images, most of it not needed
- **Severity:** High
- **Status:** Fixed
- **Location:** `/` (home), worst on phones
- **Summary:** 13 images ≈ 2,520 KB; all 1200px JPEGs in ~218px slots; nine preloads; no WebP/AVIF.
- **Required change:** Serve via `next/image` / sized WebP; preload only hero; target under 100 KB per image.
- **Fix note:** Home uses `next/image` with sizes; only hero golden-retriever preloads; husky ~45KB at 384w (was ~707KB raw). Local verified.

### HM-2 — Invented testimonials are shown as quotes
- **Severity:** High
- **Status:** On hold
- **Blocked on:** Client — real attributed reviews, or explicit OK to rewrite as non-quote scenarios
- **Location:** `/`, “Every pet has a different starting point”
- **Summary:** Three quote cards with quotation marks labelled only by low-contrast “ILLUSTRATIVE EXAMPLE”.
- **Required change:** Remove quotes / rewrite as scenarios, or use real attributed reviews.

### HM-3 — Images have missing or wrong alt text
- **Severity:** Low
- **Status:** Fixed
- **Location:** `/`, `/blog`, `/sample-assessment`
- **Summary:** Empty alts (home 4, blog 10, sample 1); some alts previously mismatched the animal.
- **Required change:** Accurate alt text; rename files to match content.
- **Fix note:** Home empty alts filled; blog cards have descriptive alts. Local verified.


### HM-4 — Step numbers are almost invisible
- **Severity:** Low
- **Status:** Fixed
- **Location:** `/` and `/how-it-works`, step cards 01–05
- **Summary:** Numerals ~rgb(238,238,238) on white (~1.2:1 contrast).
- **Required change:** Darken to ≥ `#9A9A9A`, or mark decorative with `aria-hidden`.
- **Fix note:** `.step-num` color set to `#9A9A9A`. Local verified.


### HM-5 — Scrolling marquee cannot be paused; background is fixed
- **Severity:** Low
- **Status:** Fixed
- **Location:** `/`
- **Summary:** Marquee has no pause control; `background-attachment: fixed` hurts scroll performance.
- **Required change:** Pause marquee on hover/focus; avoid fixed background attachment.
- **Fix note:** Marquee pauses on hover/focus; page background uses scroll attachment. Local verified.


## 3.3 Assessment and sign-in (`/assess`, `/login`)

### AU-1 — Every Assess My Pet button leads to a sign-in wall
- **Severity:** Critical
- **Status:** On hold
- **Blocked on:** Client — product decision: guest assessment vs keep sign-in wall (and “why account” copy)
- **Location:** `/assess` from all Assess CTAs
- **Summary:** Signed-out visitors are redirected to `/login` before any questions; home promises “a few simple questions”.
- **Required change:** Allow assessment without account (session + preview), or at least open sign-up mode with clear “why account” copy.

### AU-2 — Email accounts have no password reset
- **Severity:** Critical
- **Status:** Tried, not fixed
- **Blocked on:** Ops — `RESEND_API_KEY` + `EMAIL_FROM` so reset emails send (flow exists in local code)
- **Location:** `/login`
- **Summary:** Forgot password shows “Password reset isn't available yet.”
- **Required change:** Ship reset flow or magic-link / Google-only auth.
- **Tried (18 Nov):**
  1. Confirmed `sendEmail` throws `EmailNotConfiguredError` when env missing; `POST /api/auth/forgot` returns 503 “Password reset email is not configured yet.”
  2. Confirmed `.env.local` has neither `RESEND_API_KEY` nor `EMAIL_FROM` (keys absent entirely).
  3. Confirmed no inventable/local Resend credentials; Vercel MCP listed 0 projects for the authenticated team and no `.vercel` link in the repo — cannot wire production env from here.

### AU-3 — Sign-in page has no way back to the site and mixed signals
- **Severity:** Medium
- **Status:** Fixed
- **Location:** `/login` and `/login?mode=signup`
- **Summary:** Wordmark not a link; no header; title stays “Sign in” in signup; awkward tab order; confirm password on signup.
- **Required change:** Link wordmark home; separate signup title/route; fix focus order; drop confirm password.
- **Fix note:** Brand links home; signup titles; no confirm password in local `LoginForm.tsx`. Residual: static metadata title may still say Sign in.

### AU-4 — Sign-in errors are not announced to screen readers
- **Severity:** Low
- **Status:** Fixed
- **Location:** `/login`
- **Summary:** Errors are plain text; no `aria-invalid`, `aria-describedby`, or `role="alert"`.
- **Required change:** Wire errors to fields with proper ARIA.
- **Fix note:** ARIA wired in local `LoginForm.tsx`.

---

## 3.4 Luna symptom checker (`/symptom-checker`)

### LU-1 — Emergency signs list is cut off on phones
- **Severity:** Critical
- **Status:** Fixed
- **Location:** `/symptom-checker` at 375px
- **Summary:** Fixed-height scrolling box clips the seventh emergency sign; continue button sits below.
- **Required change:** Remove max-height/overflow; add “My pet has one of these” + tap-to-call.
- **Fix note:** Removed `.emergency-list` max-height/overflow; added “My pet has one of these” panel with nearest-clinic maps link (no invented phone numbers). Local verified at 375px.

### LU-2 — Luna asks for an account only after the emergency check
- **Severity:** High
- **Status:** Fixed
- **Location:** `/symptom-checker`
- **Summary:** “None of these – continue” goes to login; page never says an account is required.
- **Required change:** Disclose “Free account required” up front, or allow a few questions first.
- **Fix note:** Signed-out copy “Free account required to continue after this check.” above CTAs; still redirects to login. Local verified.

---

## 3.5 Plans, pricing and gift cards

### PL-1 — Annual price shows the wrong monthly equivalent
- **Severity:** High
- **Status:** Fixed
- **Location:** `/plans`, PETZ Care Annual toggle
- **Summary:** Shows `₹499/month equivalent` for ₹4,999/year; correct is about ₹417.
- **Required change:** `Math.round(4999 / 12)` → about ₹417/month.
- **Fix note:** Annual note uses Math.round(4999/12) → about ₹417/month. Local verified.

### PL-2 — Paid plan button leads to a waitlist without saying so
- **Severity:** High
- **Status:** Fixed
- **Location:** `/plans`, PETZ Care card
- **Summary:** “Give Your Pet More Care” opens `/waitlist` with no plan context.
- **Required change:** Rename to waitlist CTA; link `/waitlist?plan=care`; store plan.
- **Fix note:** CTA “Join Care waitlist” → `/waitlist?plan=care`; hidden wlPlan + API plan field. Local verified.

### PL-3 — Products and prices contradict each other across pages
- **Severity:** High
- **Status:** On hold
- **Blocked on:** Client — which products/prices are live vs coming soon; GST inclusive?; biomarker vs FAQ truth
- **Location:** `/plans`, `/gift-cards`, `/waitlist`, `/how-it-works`, `/faq`
- **Summary:** Illustrative add-ons; gift kits/app that don’t exist elsewhere; waitlist promises biomarkers while FAQ says not at launch; no GST.
- **Required change:** Show only launch products; label coming soon; remove “illustrative”; state incl. GST.

### PL-4 — Gift cards page is a dead end
- **Severity:** High
- **Status:** Fixed
- **Location:** `/gift-cards`
- **Summary:** Priced tiers + “Checkout coming with app launch”; no buy/notify form.
- **Required change:** Notify-me → waitlist, or unpublish and remove plans link.
- **Fix note:** Notify me → `/waitlist?plan=gift` in local `app/gift-cards/page.tsx`.

### PL-5 — The price is the smallest text on each plan card
- **Severity:** Low
- **Status:** Fixed
- **Location:** `/plans`
- **Summary:** Plan names 24px; prices 16px; both cards share same EXCLUSIVE chip.
- **Required change:** Larger bold price; one Recommended badge on Care only.
- **Fix note:** Larger `.price`; Recommended pill on Care only. Local verified.


## 3.6 Pet Passport (`/pet-passport`)

### PP-1 — Vaccination schedule is a hard-coded mock that ignores answers
- **Severity:** Critical
- **Status:** Fixed
- **Location:** `/pet-passport`, steps 3 and 5
- **Summary:** Age 99 accepted; schedule is mock and ignores inputs; final step has no downloadable record.
- **Required change:** Unpublish or “Coming soon” until real calc + vet sign-off; enforce age range; PDF download.
- **Fix note:** Page is Coming soon + `noindex` in local `app/pet-passport/page.tsx`.

### PP-2 — Step pills are truncated on phones and not announced
- **Severity:** Low
- **Status:** Fixed
- **Location:** `/pet-passport` at 375px
- **Summary:** “Schedule” cut off; pills overlap; no `aria-current`.
- **Required change:** Compact pills or “Step N of 5”; set `aria-current="step"`.
- **Fix note:** Moot — planner unpublished as Coming soon (see PP-1).

---

## 3.7 Forms: newsletter, waitlist, contact, partner application

### FM-1 — Form APIs accept invalid and oversized data and have no abuse protection
- **Severity:** High
- **Status:** Fixed
- **Location:** `POST /api/newsletter`, `/api/waitlist` (also support/partners handlers)
- **Summary:** Invalid email and 5,000-char name return 201; no rate limit/CAPTCHA/honeypot.
- **Required change:** Server schema validation; unique email; rate limit; Turnstile/honeypot.
- **Fix note:** Schema + honeypot + rate limit confirmed; invalid email/oversized name 4xx; burst 429. Local verified.

### FM-2 — Name fields reject common Indian names
- **Severity:** High
- **Status:** Fixed
- **Location:** `/waitlist` Name (same rule on `/support`)
- **Summary:** Rejects `S. Kumar`, initials, Devanagari, José, etc.
- **Required change:** Unicode-aware pattern or length-only validation.
- **Fix note:** PageEffects now uses shared `validateName` from form-schema; S. Kumar / José / Devanagari accepted. Local verified.

### FM-3 — Forms fall back to GET, which can put emails in the URL
- **Severity:** Medium
- **Status:** Fixed
- **Location:** Newsletter, waitlist, support, partner-apply, pet-passport
- **Summary:** Forms have no action and `method=get`.
- **Required change:** `method="post"` + API action, or disable submit until hydrated.
- **Fix note:** Newsletter forms use method=post action=/api/newsletter; other forms already post. Local verified.


### FM-4 — Newsletter error is a red border only; sign-up is single opt-in with no consent text
- **Severity:** Medium
- **Status:** Fixed
- **Location:** Newsletter (home, science, blog footers)
- **Summary:** Invalid input = red outline only; immediate subscribe; no privacy consent line.
- **Required change:** Text error; privacy consent; double opt-in confirmation email.
- **Fix note:** Consent checkbox + text errors; API double opt-in (needs Resend). Local verified.


### FM-5 — Partner form does not match the partner types on offer
- **Severity:** Medium
- **Status:** Fixed
- **Location:** `/partners` and `/partner-apply`
- **Summary:** Cards: Veterinary / Diagnostic / Pet Health Brands / Research. Select: clinic / Groomer / Nutrition / Supplements. Response time 5–7 vs 3 days.
- **Required change:** Align options; one response time; add contact name/phone; `?type=` preselect.
- **Fix note:** Types/`?type=`/copy aligned in local pages; confirm `PageEffects` posts full payload.

### FM-6 — Weak field checks on phone, city, country and message
- **Severity:** Low
- **Status:** Fixed
- **Location:** `/support`, `/partner-apply`, `/waitlist`
- **Summary:** Accepts `abc` phone, `12345` city, junk country, 1-char message.
- **Required change:** Phone regex; city select; min message length.
- **Fix note:** Client validates phone/city/message via form-schema; API rejects abc phone and invalid city. Local verified.

### FM-7 — Waitlist asks for country, not city
- **Severity:** Low
- **Status:** Fixed
- **Location:** `/waitlist`
- **Summary:** Country required (default India); no city or pet type.
- **Required change:** City select + pet type instead of country.
- **Fix note:** Waitlist UI has city + pet type; PageEffects posts city/petType/plan (not country). Local verified.

---

## 3.8 Content pages: Science, How It Works, Sample, FAQ, Blog

### CT-1 — Sample assessment does not show what users get
- **Severity:** High
- **Status:** On hold
- **Blocked on:** Client — status meanings/actions, Top 3 content, correct sample photo
- **Location:** `/sample-assessment`
- **Summary:** Score 82 + one-word statuses only; no explanations/actions; photo mismatch historically.
- **Required change:** Per-status meaning + action; Top 3 this month; correct Labrador photo.

### CT-2 — The Science page cites no science
- **Severity:** High
- **Status:** On hold
- **Blocked on:** Client — methodology, citations, named vets/regs, approved limitations copy
- **Location:** `/science`
- **Summary:** General copy only; no citations, methodology, named vets, outbound links.
- **Required change:** How score works; WSAVA/AAHA refs; vet names/regs; limitations.

### CT-3 — Blog articles are very short and unattributed
- **Severity:** High
- **Status:** On hold
- **Blocked on:** Client — which posts to expand/unpublish; bylines; full dates; longer copy/sources
- **Location:** `/blog` and all 10 articles
- **Summary:** ~35–175 words; no author/reviewer/sources; month-only date; no related posts.
- **Required change:** Expand top articles; byline, date, related, Article schema; unpublish stubs.

### CT-4 — FAQ reads like internal draft copy
- **Severity:** Medium
- **Status:** On hold
- **Blocked on:** Client — present-tense product answers; price/cities/deletion/refunds FAQ
- **Location:** `/faq`
- **Summary:** “can be designed”, “should protect”, “We envision…”; no price/cities/deletion/refunds.
- **Required change:** Present-tense product answers; add commercial/privacy FAQ.

### CT-5 — Blog has nine categories for ten posts and every card says Guide
- **Severity:** Low
- **Status:** Fixed
- **Location:** `/blog`
- **Summary:** Over-fragmented chips; every card labelled Guide; URL doesn’t change with filter.
- **Required change:** Fewer categories; show on cards; `/blog?category=…` links.
- **Fix note:** Filter buttons with aria-pressed; category on cards; URL `?category=`. Local verified.


### CT-6 — Four steps is followed by a fifth; US and UK spellings are mixed
- **Severity:** Low
- **Status:** Fixed
- **Location:** `/how-it-works`; site-wide copy
- **Summary:** “Four steps…” then card 05; personalized vs personalised mix.
- **Required change:** Fix numbering; pick one English variant.
- **Fix note:** Heading “Five steps…”; how-it-works uses personalised. Local verified.


## 3.9 Legal: privacy and terms

### LG-1 — Privacy Policy is a placeholder while forms collect personal data
- **Severity:** Critical
- **Status:** On hold
- **Blocked on:** Client / counsel — operator, grievance officer, retention, rights, processors
- **Location:** `/privacy`
- **Summary:** Placeholder operator details; no grievance officer, retention, rights, processors.
- **Required change:** Full counsel-reviewed policy.

### LG-2 — Terms are thin, describe a marketplace that is not offered, and are not in the footer
- **Severity:** High
- **Status:** On hold
- **Blocked on:** Client / counsel — governing law, liability, refunds; Marketplace section keep/remove
- **Location:** `/terms`; site footer
- **Summary:** Marketplace section; no governing law/liability/refunds; footer links only Privacy.
- **Required change:** Real Terms; add footer Terms link.
- **Note:** Footer Terms *link* can be added by eng once Terms copy is approved; full rewrite stays on hold.

### LG-3 — An unlinked Marketplace page is live
- **Severity:** Medium
- **Status:** Fixed
- **Location:** `/marketplace`
- **Summary:** Returns 200, indexable, not linked from nav.
- **Required change:** Remove route or `noindex` until launch.
- **Fix note:** Marketplace route removed in local `main` (`feaade9`). Confirm on production deploy.

---

## 3.10 SEO and link sharing

### SE-1 — No robots.txt, sitemap or canonical tags
- **Severity:** High
- **Status:** Fixed
- **Location:** `/robots.txt`, `/sitemap.xml`, all pages
- **Summary:** Both files 404; no canonical links.
- **Required change:** `robots.ts` / `sitemap.ts`; `metadataBase` + canonicals.
- **Fix note:** robots/sitemap/canonical present. Local verified.


### SE-2 — Shared links have no preview
- **Severity:** High
- **Status:** Fixed
- **Location:** All pages
- **Summary:** No `og:` or `twitter:` meta tags.
- **Required change:** Open Graph + Twitter metadata + OG image.
- **Fix note:** Default OG/Twitter in root layout. Local verified.


### SE-3 — 16 pages share one meta description; no structured data
- **Severity:** Medium
- **Status:** Fixed
- **Location:** Many content/legal/tool pages
- **Summary:** Shared default description; zero JSON-LD.
- **Required change:** Unique descriptions; Organization/FAQ/Article schema.
- **Fix note:** Page-level descriptions already unique for key routes; WebSite/Organization + FAQPage JSON-LD. Local verified.


### SE-4 — No web manifest or theme colour
- **Severity:** Low
- **Status:** Fixed
- **Location:** `/manifest.json`; page head
- **Summary:** Manifest 404; no theme-color.
- **Required change:** `app/manifest.ts` + theme color.
- **Fix note:** manifest.webmanifest + themeColor. Local verified.


## 3.11 Performance and server

### PF-1 — Server uses HTTP/1.1 and does not cache images or pages
- **Severity:** Medium
- **Status:** Fixed
- **Location:** nginx / first-party requests (audit host: petz.love)
- **Summary:** HTTP/1.1; images `max-age=0`; HTML `no-store`.
- **Required change:** HTTP/2; long-cache static assets; statically render marketing pages.
- **Fix note:** `/assets` Cache-Control max-age=31536000 immutable (Vercel HTTP/2). Local verified.


### PF-2 — Content is invisible until a script reveals it
- **Severity:** Medium
- **Status:** Fixed
- **Location:** All pages (including emergency card / forms)
- **Summary:** `.reveal` starts at opacity 0 until JS fade.
- **Required change:** Only hide when JS present; never hide safety/forms/hero.
- **Fix note:** Reveals visible by default; `html.js-reveal` opts into hide-until-in-view. Local verified.


### PF-3 — Brand font never loads
- **Severity:** Medium
- **Status:** Fixed
- **Location:** All pages
- **Summary:** CSS asks for Figtree but no `@font-face` / font request observed in audit.
- **Required change:** Load Figtree via `next/font/google`.
- **Fix note:** Figtree via next/font in root layout. Local verified.


### PF-4 — Session endpoint is called four times on every page
- **Severity:** Low
- **Status:** Fixed
- **Location:** All pages
- **Summary:** `/api/auth/session` ×4 per load.
- **Required change:** Single SessionProvider with server session.
- **Fix note:** SessionProvider refetchOnWindowFocus=false; removed duplicate mobile HeaderAuth. Local verified.


### PF-5 — Body text is 14px on phones
- **Severity:** Low
- **Status:** Fixed
- **Location:** Content pages at 375px
- **Summary:** Computed body font-size 14px.
- **Required change:** `body { font-size: 16px; }` on mobile.
- **Fix note:** Mobile `--display-2` set to 1rem (16px). Local verified.


## 3.12 Security

### SC-1 — Missing security headers; server and framework versions exposed
- **Severity:** High
- **Status:** Fixed
- **Location:** All responses
- **Summary:** No HSTS/CSP/Permissions-Policy (on petz.love); exposes nginx version and `X-Powered-By: Next.js`.
- **Required change:** Add security headers; hide version banners; `poweredByHeader: false`.
- **Fix note:** Security headers in next.config; poweredByHeader false. Local verified.


### SC-2 — Third-party script loaded without integrity check
- **Severity:** Medium
- **Status:** Fixed
- **Location:** All pages
- **Summary:** Bootstrap JS from jsDelivr with no SRI.
- **Required change:** Self-host or add integrity; better: replace with React widgets.
- **Fix note:** Bootstrap 5.3.3 CSS/JS self-hosted; jsDelivr removed from CSP. Local verified.


## 3.13 Accessibility

### AX-1 — Grey and orange text fail contrast
- **Severity:** Medium
- **Status:** Fixed
- **Location:** Home, `/plans`, `/login`
- **Summary:** Grey body ~3.84:1; orange text ~2.5:1.
- **Required change:** Darken body copy; text-safe orange token.
- **Fix note:** `--color-300` → `#595959`; `--color-accent-text` for links/hover. Local verified.


### AX-2 — Blog filters cannot be used with a keyboard
- **Severity:** Medium
- **Status:** Fixed
- **Location:** `/blog` category chips
- **Summary:** Chips are `<span>` without role; mouse-only.
- **Required change:** `<button type="button" aria-pressed="…">`.
- **Fix note:** Category filters are buttons with aria-pressed. Local verified.


### AX-3 — No main landmark or skip link
- **Severity:** Medium
- **Status:** Fixed
- **Location:** All pages except `/login`
- **Summary:** No `<main>`; no skip link.
- **Required change:** Wrap content in `<main id="content">`; add skip link.
- **Fix note:** SiteShell adds skip link + main#content. Local verified.


### AX-4 — Heading levels skip
- **Severity:** Low
- **Status:** Fixed
- **Location:** All pages
- **Summary:** Footer h4 after h2; some pages h1→h3; some posts lack h2.
- **Required change:** Fix heading hierarchy; footer titles as non-heading.
- **Fix note:** Footer section titles are non-heading `.footer-heading`. Local verified.


## Severity tally

| Severity | Count | IDs |
|---|---|---|
| Critical | 5 | AU-1, AU-2, LU-1, PP-1, LG-1 |
| High | 18 | SW-1, SW-4, HM-1, HM-2, LU-2, PL-1, PL-2, PL-3, PL-4, FM-1, FM-2, CT-1, CT-2, CT-3, LG-2, SE-1, SE-2, SC-1 |
| Medium | 15 | SW-2, AU-3, FM-3, FM-4, FM-5, CT-4, LG-3, SE-3, PF-1, PF-2, PF-3, SC-2, AX-1, AX-2, AX-3 |
| Low | 17 | SW-3, SW-5, SW-6, HM-3, HM-4, HM-5, AU-4, PL-5, PP-2, FM-6, FM-7, CT-5, CT-6, SE-4, PF-4, PF-5, AX-4 |
| **Total** | **55** | |

## Status tally (18 Nov 2026)

| Status | Count | IDs |
|---|---|---|
| **On hold** (client) | 10 | SW-4, HM-2, AU-1, PL-3, CT-1, CT-2, CT-3, CT-4, LG-1, LG-2 |
| **Fixed** (local) | 44 | All engineering items from the remaining list except AU-2 |
| **Tried, not fixed** | 1 | AU-2 (Resend env missing) |
| **Open / actionable** | 0 | — |

### Remaining engineering work (not on hold, not fully fixed)

**Ops only**
1. **AU-2** — Add `RESEND_API_KEY` + `EMAIL_FROM` in Vercel/local so password-reset and newsletter confirm emails send (code ready; Tried, not fixed without keys).

All other previously listed engineering items were Fixed locally on 18 Nov 2026.
