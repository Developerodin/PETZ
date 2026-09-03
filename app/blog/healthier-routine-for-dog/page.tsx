import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "How to Build a Healthier Routine for Your Dog — PETZ Blog",
  description: "PETZ uses AI and veterinary-informed health science to understand your pet's health.",
};

export default function BlogHealthierRoutineForDogPage() {
  return (
    <SiteShell variant="inflow">
      <section className="section">
            <div className="container">
              <article className="blog-article reveal">
      <div className="article-hero"><img src="/assets/images/dog-running.jpg" alt="" /></div>
      <div className="article-meta"><span>Pet Parents</span><span>August 2026</span></div>
      <h1 className="display-8">How to Build a Healthier Routine for Your Dog</h1>

      <p>Consistent walk times, measured meals, fresh water, and predictable sleep support physical and mental health. Match exercise to breed, age, and joint status.</p>
      <p>Start small: five extra minutes of sniffing walks, one fewer treat per day, a monthly weight check. Sustainable habits beat occasional extremes.</p>

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
