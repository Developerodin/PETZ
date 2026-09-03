import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Academy — PETZ",
  description: "PETZ uses AI and veterinary-informed health science to understand your pet's health.",
};

export default function AcademyPage() {
  return (
    <SiteShell variant="inflow">
      <section className="section">
            <div className="container">
              <div className="inner-container-center measure-wide reveal">
                <h1 className="display-8">PETZ Academy</h1>
                <p>Longevity education modules — understand how pets age and what you can track at home.</p>
              </div>
              <div className="grid-2 stagger-group" style={{marginTop: "40px"}}>
                <article className="icon-top-card reveal">
                  <div className="step-num display-10" style={{color: "var(--color-600)"}}>01</div>
                  <h3 className="display-4">Calendar age isn't the whole story</h3>
                  <p>The "one human year = seven dog years" myth misses how small and large breeds age differently.</p>
                </article>
                <article className="icon-top-card reveal">
                  <div className="step-num display-10" style={{color: "var(--color-600)"}}>02</div>
                  <h3 className="display-4">Four physical signs vets watch</h3>
                  <p>Body shape, eyes, coat, and dental health reveal more than a birthday.</p>
                </article>
                <article className="icon-top-card reveal">
                  <div className="step-num display-10" style={{color: "var(--color-600)"}}>03</div>
                  <h3 className="display-4">Biological age &amp; DNA methylation</h3>
                  <p>Epigenetic clocks are emerging tools for understanding how fast a pet is ageing.</p>
                </article>
                <article className="icon-top-card reveal">
                  <div className="step-num display-10" style={{color: "var(--color-600)"}}>04</div>
                  <h3 className="display-4">Why tracking over time matters</h3>
                  <p>PETZ stores photos and flags patterns — snapshots become a longitudinal story.</p>
                </article>
              </div>
            </div>
          </section>
    </SiteShell>
  );
}
