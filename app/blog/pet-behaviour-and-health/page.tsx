import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "What Does Your Pet's Behaviour Say About Their Health? — PETZ Blog",
  description: "PETZ uses AI and veterinary-informed health science to understand your pet's health.",
};

export default function BlogPetBehaviourAndHealthPage() {
  return (
    <SiteShell variant="inflow">
      <section className="section">
            <div className="container">
              <article className="blog-article reveal">
      <div className="article-hero"><img src="/assets/images/orange-cat.jpg" alt="" /></div>
      <div className="article-meta"><span>Behaviour</span><span>August 2026</span></div>
      <h1 className="display-8">What Does Your Pet's Behaviour Say About Their Health?</h1>

      <p>Behaviour is health data. Changes in sleep, appetite, play, or social interaction often precede obvious physical signs.</p>
      <h2>Anxiety vs pain</h2>
      <p>Both can cause hiding or aggression. Pain-related behaviour often ties to movement, touch, or specific activities. Anxiety may link to triggers like noise or separation.</p>
      <h2>Cognitive changes in seniors</h2>
      <p>Disorientation, altered sleep cycles, or house-soiling in older pets can reflect cognitive dysfunction — manageable with vet support.</p>
      <h2>Enrichment and routine</h2>
      <p>Predictable routines reduce stress. Mental stimulation supports wellbeing in indoor cats and working breeds alike.</p>
      <p>Track behaviour alongside physical signs. PETZ helps you organize both for a fuller picture.</p>

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
