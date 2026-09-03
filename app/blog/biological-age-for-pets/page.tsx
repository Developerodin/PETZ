import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "What Is Biological Age — And Could It Matter for Pets? — PETZ Blog",
  description: "PETZ uses AI and veterinary-informed health science to understand your pet's health.",
};

export default function BlogBiologicalAgeForPetsPage() {
  return (
    <SiteShell variant="inflow">
      <section className="section">
            <div className="container">
              <article className="blog-article reveal">
      <div className="article-hero"><img src="/assets/images/tabby-cat.jpg" alt="" /></div>
      <div className="article-meta"><span>Science</span><span>August 2026</span></div>
      <h1 className="display-8">What Is Biological Age — And Could It Matter for Pets?</h1>

      <p>Calendar age counts birthdays. Biological age reflects how fast cells and organs are ageing — increasingly studied via epigenetic clocks in dogs.</p>
      <p>It is not a death predictor but a tool for understanding whether a pet is ageing faster or slower than expected — guiding preventive focus areas.</p>

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
