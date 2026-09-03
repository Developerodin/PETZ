import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Is Your Dog Actually at a Healthy Weight? — PETZ Blog",
  description: "PETZ uses AI and veterinary-informed health science to understand your pet's health.",
};

export default function BlogIsYourDogAtHealthyWeightPage() {
  return (
    <SiteShell variant="inflow">
      <section className="section">
            <div className="container">
              <article className="blog-article reveal">
      <div className="article-hero"><img src="/assets/images/labrador.jpg" alt="" /></div>
      <div className="article-meta"><span>Nutrition</span><span>August 2026</span></div>
      <h1 className="display-8">Is Your Dog Actually at a Healthy Weight?</h1>

      <p>Healthy weight is not a single number on a scale. Body condition score (BCS), muscle tone, and breed shape all matter.</p>
      <h2>Body condition scoring</h2>
      <p>On a 9-point scale, most dogs should sit around 4–5: ribs palpable with light cover, visible waist, abdominal tuck. Overweight dogs often lose the waist; underweight dogs show prominent ribs and spine.</p>
      <h2>Breed and age matter</h2>
      <p>A lean working breed may look thin to owners used to stockier pets. Puppies and seniors have different ideal ranges — compare to breed norms, not generic charts.</p>
      <h2>Why it matters long-term</h2>
      <p>Research consistently links lean body condition to longer, healthier lives. Excess weight strains joints, worsens metabolic disease risk, and can shorten lifespan.</p>
      <h2>What to do next</h2>
      <p>Measure portions, limit treats, and increase appropriate activity. If you are unsure, a vet can confirm BCS and help set realistic targets. PETZ assessment can flag body-condition areas to discuss.</p>

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
