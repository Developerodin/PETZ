import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "The Most Common Pet Health Problems We Catch Too Late — PETZ Blog",
  description: "PETZ uses AI and veterinary-informed health science to understand your pet's health.",
};

export default function BlogCommonPetHealthProblemsPage() {
  return (
    <SiteShell variant="inflow">
      <section className="section">
            <div className="container">
              <article className="blog-article reveal">
      <div className="article-hero"><img src="/assets/images/grey-cat.jpg" alt="" /></div>
      <div className="article-meta"><span>Prevention</span><span>August 2026</span></div>
      <h1 className="display-8">The Most Common Pet Health Problems We Catch Too Late</h1>

      <p>Preventive care focuses on problems that develop quietly — often until they are advanced and more costly to manage.</p>
      <h2>Dental disease</h2>
      <p>Periodontal disease affects most dogs and cats by middle age. Bad breath is not normal. Home brushing and professional cleanings reduce pain and systemic risk.</p>
      <h2>Obesity</h2>
      <p>Over half of companion pets are overweight. This amplifies arthritis, diabetes, and heart strain.</p>
      <h2>Chronic kidney disease</h2>
      <p>Especially in cats, CKD can progress before obvious symptoms. Routine bloodwork in senior pets catches changes earlier.</p>
      <h2>Arthritis and mobility</h2>
      <p>Stiffness after rest, slower stairs, or reluctance to play may be arthritis — not just ageing. Early intervention improves comfort.</p>
      <p>Earlier awareness does not replace veterinary care — it helps you act sooner with your vet.</p>

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
