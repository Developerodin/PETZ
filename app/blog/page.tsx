import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { getFormUser } from "@/lib/form-user";

export const metadata: Metadata = {
  title: "Blog — PETZ",
  description: "Practical, evidence-informed guidance for better nutrition, prevention, behaviour, ageing and everyday pet care.",
};

export default async function BlogPage() {
  const user = await getFormUser();

  return (
    <SiteShell variant="inflow">
      <section>
            <div className="container">
              <div className="blog-intro">
                <h1 className="display-9">The smarter way to learn about your pet's health.</h1>
                <p className="dek">Practical, evidence-informed guidance for better nutrition, prevention, behaviour, ageing and everyday pet care.</p>
              </div>
              <div className="category-nav" aria-label="Categories">
                <span className="category-link is-current" data-category="all">All</span>
                <span className="category-link" data-category="pet-health">Pet Health</span>
                <span className="category-link" data-category="nutrition">Nutrition</span>
                <span className="category-link" data-category="prevention">Prevention</span>
                <span className="category-link" data-category="ageing">Ageing</span>
                <span className="category-link" data-category="breed-health">Breed Health</span>
                <span className="category-link" data-category="behaviour">Behaviour</span>
                <span className="category-link" data-category="pet-parents">Pet Parents</span>
                <span className="category-link" data-category="science">Science</span>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="container">
              <div className="section-top-content-wrapper">
                <h2 className="display-8">Latest articles</h2>
              </div>
              <div className="grid-3 posts-grid stagger-group">
                <a className="post-item reveal" data-category="pet-health" href="/blog/5-things-your-pet-cant-tell-you">
                  <div className="image-wrapper is-border-radius-medium"><img src="/assets/images/cat-guide.jpg" alt="" width="1200" height="800" decoding="async" loading="lazy" /></div>
                  <div className="post-meta"><span>Guide</span></div>
                  <h3 className="display-4">5 Things Your Pet Can't Tell You About Their Health</h3>
                </a>
                <a className="post-item reveal" data-category="nutrition" href="/blog/is-your-dog-at-healthy-weight">
                  <div className="image-wrapper is-border-radius-medium"><img src="/assets/images/labrador.jpg" alt="" width="1200" height="800" decoding="async" loading="lazy" /></div>
                  <div className="post-meta"><span>Guide</span></div>
                  <h3 className="display-4">Is Your Dog Actually at a Healthy Weight?</h3>
                </a>
                <a className="post-item reveal" data-category="prevention" href="/blog/common-pet-health-problems">
                  <div className="image-wrapper is-border-radius-medium"><img src="/assets/images/grey-cat.jpg" alt="" width="1200" height="826" decoding="async" loading="lazy" /></div>
                  <div className="post-meta"><span>Guide</span></div>
                  <h3 className="display-4">The Most Common Pet Health Problems We Catch Too Late</h3>
                </a>
                <a className="post-item reveal" data-category="nutrition" href="/blog/nutrition-long-term-health">
                  <div className="image-wrapper is-border-radius-medium"><img src="/assets/images/puppy-grass.jpg" alt="" width="1200" height="800" decoding="async" loading="lazy" /></div>
                  <div className="post-meta"><span>Guide</span></div>
                  <h3 className="display-4">How Nutrition Affects Your Pet's Long-Term Health</h3>
                </a>
                <a className="post-item reveal" data-category="behaviour" href="/blog/pet-behaviour-and-health">
                  <div className="image-wrapper is-border-radius-medium"><img src="/assets/images/orange-cat.jpg" alt="" width="1200" height="1680" decoding="async" loading="lazy" /></div>
                  <div className="post-meta"><span>Guide</span></div>
                  <h3 className="display-4">What Does Your Pet's Behaviour Say About Their Health?</h3>
                </a>
                <a className="post-item reveal" data-category="prevention" href="/blog/preventive-pet-care">
                  <div className="image-wrapper is-border-radius-medium"><img src="/assets/images/two-dogs.jpg" alt="" width="1200" height="801" decoding="async" loading="lazy" /></div>
                  <div className="post-meta"><span>Guide</span></div>
                  <h3 className="display-4">Preventive Pet Care: What Should You Actually Be Doing?</h3>
                </a>
                <a className="post-item reveal" data-category="pet-parents" href="/blog/healthier-routine-for-dog">
                  <div className="image-wrapper is-border-radius-medium"><img src="/assets/images/dog-running.jpg" alt="" width="1200" height="800" decoding="async" loading="lazy" /></div>
                  <div className="post-meta"><span>Guide</span></div>
                  <h3 className="display-4">How to Build a Healthier Routine for Your Dog</h3>
                </a>
                <a className="post-item reveal" data-category="ageing" href="/blog/track-changes-senior-pet">
                  <div className="image-wrapper is-border-radius-medium"><img src="/assets/images/husky.jpg" alt="" width="1200" height="1600" decoding="async" loading="lazy" /></div>
                  <div className="post-meta"><span>Guide</span></div>
                  <h3 className="display-4">What Changes Should You Track as Your Pet Gets Older?</h3>
                </a>
                <a className="post-item reveal" data-category="breed-health" href="/blog/breed-specific-health-risks">
                  <div className="image-wrapper is-border-radius-medium"><img src="/assets/images/corgi.jpg" alt="" width="1200" height="1811" decoding="async" loading="lazy" /></div>
                  <div className="post-meta"><span>Guide</span></div>
                  <h3 className="display-4">Breed-Specific Health Risks Every Pet Parent Should Know</h3>
                </a>
                <a className="post-item reveal" data-category="science" href="/blog/biological-age-for-pets">
                  <div className="image-wrapper is-border-radius-medium"><img src="/assets/images/tabby-cat.jpg" alt="" width="1200" height="1200" decoding="async" loading="lazy" /></div>
                  <div className="post-meta"><span>Guide</span></div>
                  <h3 className="display-4">What Is Biological Age — And Could It Matter for Pets?</h3>
                </a>
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
