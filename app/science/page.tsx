import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { getFormUser } from "@/lib/form-user";

export const metadata: Metadata = {
  title: "Science — PETZ",
  description: "PETZ combines artificial intelligence with evidence-informed veterinary and animal-health research.",
};

export default async function SciencePage() {
  const user = await getFormUser();

  return (
    <SiteShell variant="overlay">
      <section className="section">
            <div className="section-frame pd-top">
              <div className="section-card hero-top-pd hero-flush">
                <div className="container">
                  <div className="page-hero-inner">
                    <h1 className="display-9">Pet health deserves better than guesswork.</h1>
                    <p>PETZ combines artificial intelligence with evidence-informed veterinary and animal-health research to turn everyday pet information into meaningful health insights.</p>
                    <div className="button-row is-center-aligned">
                      <a className="button is-primary" href="/assess"><span className="button-hover"></span><span className="button-label">Assess My Pet</span></a>
                      <a className="button is-secondary" href="/how-it-works"><span className="button-hover"></span><span className="button-label">How PETZ Works</span></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="container">
              <div className="grid-2 images-left-grid-v1">
                <div className="mockup-stack reveal">
                  <figure className="image-wrapper mock-main">
                    <img src="/assets/images/labrador.jpg" alt="Labrador" width="1200" height="800" decoding="async" loading="lazy" />
                  </figure>
                  <figure className="image-wrapper mock-float">
                    <img src="/assets/images/grey-cat.jpg" alt="Cat" width="1200" height="826" decoding="async" loading="lazy" />
                  </figure>
                </div>
                <div className="col-content-right">
                  <h2 className="display-8">Health isn't one number.</h2>
                  <p>A pet's health is influenced by multiple interconnected factors. PETZ looks at areas including:</p>
                  <div className="feature-list">
                    <div className="feature-list-item"><svg className="feature-tick" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="10" fill="currentColor" /><path d="M6 10.5l2.5 2.5L14 7.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>Nutrition</div>
                    <div className="feature-list-item"><svg className="feature-tick" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="10" fill="currentColor" /><path d="M6 10.5l2.5 2.5L14 7.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>Body condition</div>
                    <div className="feature-list-item"><svg className="feature-tick" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="10" fill="currentColor" /><path d="M6 10.5l2.5 2.5L14 7.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>Activity</div>
                    <div className="feature-list-item"><svg className="feature-tick" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="10" fill="currentColor" /><path d="M6 10.5l2.5 2.5L14 7.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>Medical history</div>
                    <div className="feature-list-item"><svg className="feature-tick" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="10" fill="currentColor" /><path d="M6 10.5l2.5 2.5L14 7.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>Behaviour</div>
                    <div className="feature-list-item"><svg className="feature-tick" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="10" fill="currentColor" /><path d="M6 10.5l2.5 2.5L14 7.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>Preventive care</div>
                    <div className="feature-list-item"><svg className="feature-tick" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="10" fill="currentColor" /><path d="M6 10.5l2.5 2.5L14 7.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>Age</div>
                    <div className="feature-list-item"><svg className="feature-tick" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="10" fill="currentColor" /><path d="M6 10.5l2.5 2.5L14 7.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>Breed</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="container">
              <div className="inner-container-center measure-wide">
                <h2 className="display-8">From data to decisions.</h2>
                <p>Information is only useful when it helps you make a better decision. PETZ is designed to translate complex health information into simple, understandable recommendations for pet parents.</p>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="section-frame">
              <div className="section-card">
                <div className="container">
                  <div className="trust-callout reveal" style={{maxWidth: "46rem", marginInline: "auto"}}>
                    <h2 className="display-8">AI assists. It doesn't replace your veterinarian.</h2>
                    <p>PETZ is designed to help pet parents understand their pet's health and make more informed decisions.</p>
                    <p>It does not replace a physical veterinary examination, diagnosis or treatment.</p>
                    <p>If your pet is sick, deteriorating or experiencing an emergency, a licensed veterinarian should always be your first point of care.</p>
                    <p className="text-dark" style={{fontWeight: 600}}>PETZ is an early-warning and wellness layer, not a replacement for veterinary care.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="container">
              <div className="inner-container-center measure-wide">
                <h2 className="display-8">Today, we start with what you know. Tomorrow, we go deeper.</h2>
                <p>A pet's health story doesn't end with a questionnaire. As PETZ evolves, we aim to bring together increasingly deeper layers of biological data — including laboratory diagnostics and biomarkers — to move from a snapshot of health toward a longitudinal understanding of how your pet is ageing.</p>
                <div className="pipeline" aria-label="Product evolution">
                  <span>Information</span><i>→</i>
                  <span>Insights</span><i>→</i>
                  <span>Biological data</span><i>→</i>
                  <span>Complete health profile</span>
                </div>
              </div>
            </div>
          </section>

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
                      <form className="newsletter-form small-input-single" data-newsletter-form noValidate>
                        <input type="email" name="email" placeholder="Enter your email" autoComplete="email" required aria-label="Email address" defaultValue={user.email} />
                        <button type="submit" className="newsletter-submit" aria-label="Subscribe">
                          <svg viewBox="0 0 16 16" fill="none" width="16" height="16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                      </form>
                      <p className="newsletter-success" hidden>Thanks for subscribing! We'll be in touch soon.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
    </SiteShell>
  );
}
