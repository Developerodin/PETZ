import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { BlogIndex } from "@/components/BlogIndex";
import { getFormUser } from "@/lib/form-user";

export const metadata: Metadata = {
  title: "Blog — PETZ",
  description:
    "Practical, evidence-informed guidance for better nutrition, prevention, behaviour, ageing and everyday pet care.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const user = await getFormUser();
  const params = await searchParams;
  const initialCategory = String(params.category || "all").trim().toLowerCase() || "all";

  return (
    <SiteShell variant="inflow">
      <BlogIndex
        initialCategory={initialCategory}
        intro={
          <>
            <h1 className="display-9">The smarter way to learn about your pet&apos;s health.</h1>
            <p className="dek">
              Practical, evidence-informed guidance for better nutrition, prevention, behaviour, ageing and everyday pet
              care.
            </p>
          </>
        }
      />

      <section className="section">
        <div className="section-frame">
          <div className="section-card cta-background newsletter-cta reveal">
            <div className="container">
              <div className="newsletter-cta-row">
                <div>
                  <h2 className="display-8">Subscribe to our weekly newsletter</h2>
                  <p className="newsletter-cta-dek">Receive pet health tips, guides, and updates from PETZ.</p>
                </div>
                <div>
                  <form
                    className="newsletter-form small-input-single"
                    method="post"
                    action="/api/newsletter"
                    data-newsletter-form
                    noValidate
                  >
                    <div className="hp-field" aria-hidden="true">
                      <label htmlFor="nlBlogCompany">Company</label>
                      <input type="text" id="nlBlogCompany" name="company" tabIndex={-1} autoComplete="off" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      autoComplete="email"
                      required
                      aria-label="Email address"
                      defaultValue={user.email}
                    />
                    <button type="submit" className="newsletter-submit" aria-label="Subscribe">
                      <svg viewBox="0 0 16 16" fill="none" width="16" height="16" aria-hidden="true">
                        <path
                          d="M3 8h10M9 4l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <label className="newsletter-consent">
                      <input type="checkbox" name="consent" value="1" required />
                      <span>
                        I agree to receive emails from PETZ and accept the <a href="/privacy">Privacy Policy</a>.
                      </span>
                    </label>
                    <p className="field-error newsletter-error" hidden></p>
                  </form>
                  <p className="newsletter-success" hidden>
                    Thanks for subscribing! We&apos;ll be in touch soon.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
