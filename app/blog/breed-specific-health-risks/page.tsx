import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Breed-Specific Health Risks Every Pet Parent Should Know — PETZ Blog",
  description: "PETZ uses AI and veterinary-informed health science to understand your pet's health.",
};

export default function BlogBreedSpecificHealthRisksPage() {
  return (
    <SiteShell variant="inflow">
      <section className="section">
            <div className="container">
              <article className="blog-article reveal">
      <div className="article-hero"><img src="/assets/images/corgi.jpg" alt="" /></div>
      <div className="article-meta"><span>Breed Health</span><span>August 2026</span></div>
      <h1 className="display-8">Breed-Specific Health Risks Every Pet Parent Should Know</h1>

      <p>Large breeds face joint and cardiac risks; brachycephalic breeds face breathing and heat issues; some cat breeds have higher kidney or heart disease prevalence.</p>
      <p>Know your breed baseline risks — then personalize with your individual pet history, weight, and lifestyle. PETZ incorporates breed context in health assessments.</p>

                <div className="button-row" style={{marginTop: "40px"}}>
                  <a className="button is-primary" href="/assess"><span className="button-hover"></span><span className="button-label">Assess My Pet</span></a>
                  <a className="text-link" href="/blog">All articles <svg viewBox="0 0 16 16" fill="none" width="16" height="16"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" /></svg></a>
                </div>
              </article>
            </div>
          </section>
    </SiteShell>
  );
}
