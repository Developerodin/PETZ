import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Preventive Pet Care: What Should You Actually Be Doing? — PETZ Blog",
  description: "PETZ uses AI and veterinary-informed health science to understand your pet's health.",
};

export default function BlogPreventivePetCarePage() {
  return (
    <SiteShell variant="inflow">
      <section className="section">
            <div className="container">
              <article className="blog-article reveal">
      <div className="article-hero"><img src="/assets/images/two-dogs.jpg" alt="" /></div>
      <div className="article-meta"><span>Prevention</span><span>August 2026</span></div>
      <h1 className="display-8">Preventive Pet Care: What Should You Actually Be Doing?</h1>

      <p>Core preventive care includes annual exams, vaccinations per local guidelines, parasite prevention, dental care, and weight monitoring. Frequency increases for seniors and pets with chronic conditions.</p>
      <p>Use a simple checklist: vaccines, flea/tick, deworming, dental check, weight log. PETZ assessment can highlight which areas deserve attention between vet visits.</p>

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
