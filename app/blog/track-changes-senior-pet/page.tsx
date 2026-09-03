import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "What Changes Should You Track as Your Pet Gets Older? — PETZ Blog",
  description: "PETZ uses AI and veterinary-informed health science to understand your pet's health.",
};

export default function BlogTrackChangesSeniorPetPage() {
  return (
    <SiteShell variant="inflow">
      <section className="section">
            <div className="container">
              <article className="blog-article reveal">
      <div className="article-hero"><img src="/assets/images/husky.jpg" alt="" /></div>
      <div className="article-meta"><span>Ageing</span><span>August 2026</span></div>
      <h1 className="display-8">What Changes Should You Track as Your Pet Gets Older?</h1>

      <p>Monitor weight, mobility, appetite, thirst, bathroom habits, and behaviour. Senior pets benefit from twice-yearly vet visits and baseline bloodwork.</p>
      <p>Photo timelines help spot coat, posture, and body-shape changes over months — useful for vet discussions.</p>

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
