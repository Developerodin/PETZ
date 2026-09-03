import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "5 Things Your Pet Can't Tell You About Their Health — PETZ Blog",
  description: "PETZ uses AI and veterinary-informed health science to understand your pet's health.",
};

export default function Blog5ThingsYourPetCantTellYouPage() {
  return (
    <SiteShell variant="inflow">
      <section className="section">
            <div className="container">
              <article className="blog-article reveal">
      <div className="article-hero"><img src="/assets/images/cat-guide.jpg" alt="" /></div>
      <div className="article-meta"><span>Pet Health</span><span>August 2026</span></div>
      <h1 className="display-8">5 Things Your Pet Can't Tell You About Their Health</h1>

      <p>Pets communicate through behaviour, appetite, and energy — not words. Many early health shifts hide in everyday habits until they become harder to ignore.</p>
      <h2>1. Subtle appetite changes</h2>
      <p>A dog that skips breakfast once may be fine. A pattern of eating less, begging more, or shifting meal interest can reflect dental pain, nausea, or metabolic shifts worth noting.</p>
      <h2>2. Weight creeping up or down</h2>
      <p>Gradual weight change is one of the most overlooked signals. Monthly weigh-ins or body-condition checks help you spot trends before they become clinical problems.</p>
      <h2>3. Sleep and rest patterns</h2>
      <p>Senior pets sleep more — but sudden lethargy or restlessness can indicate pain, anxiety, or organ changes.</p>
      <h2>4. Coat and skin</h2>
      <p>Dull coat, excessive shedding, or scratching may reflect nutrition, allergies, or endocrine issues — not just grooming needs.</p>
      <h2>5. Behaviour that seems like personality</h2>
      <p>Hiding, clinginess, or irritability can be pain or discomfort expressed as mood. Track context: when did it start? What changed at home?</p>
      <p>PETZ helps organize these signals into a clearer picture — not a diagnosis, but a structured starting point for preventive care and vet conversations.</p>

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
