import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "How Nutrition Affects Your Pet's Long-Term Health — PETZ Blog",
  description: "PETZ uses AI and veterinary-informed health science to understand your pet's health.",
};

export default function BlogNutritionLongTermHealthPage() {
  return (
    <SiteShell variant="inflow">
      <section className="section">
            <div className="container">
              <article className="blog-article reveal">
      <div className="article-hero"><img src="/assets/images/puppy-grass.jpg" alt="" /></div>
      <div className="article-meta"><span>Nutrition</span><span>August 2026</span></div>
      <h1 className="display-8">How Nutrition Affects Your Pet's Long-Term Health</h1>

      <p>Food is daily medicine. Quality, quantity, and consistency shape weight, coat, energy, and disease risk over years.</p>
      <h2>Complete and balanced diets</h2>
      <p>Commercial foods labeled complete for your pet life stage meet baseline nutritional needs. Homemade diets need veterinary formulation to avoid deficiencies.</p>
      <h2>Portions and treats</h2>
      <p>Treats should be a small fraction of daily calories. Table scraps add up quickly — especially for small breeds.</p>
      <h2>Life-stage feeding</h2>
      <p>Puppies and kittens need growth formulas. Seniors may need adjusted protein and calories. Pregnancy and illness require vet-guided plans.</p>
      <h2>Reading labels</h2>
      <p>Look for named protein sources, AAFCO statement for species and life stage, and feeding guides adjusted to your pet actual weight and activity.</p>

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
