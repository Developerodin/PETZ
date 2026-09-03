import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Plans & Pricing — PETZ",
  description: "PETZ Digital and Care Program plans. Illustrative pricing for worldwide digital health assessment and UAE clinical tiers.",
};

export default function PlansPage() {
  return (
    <SiteShell variant="overlay">
      <section className="section">
            <div className="section-frame pd-top">
              <div className="section-card hero-top-pd">
                <div className="container">
                  <div className="page-hero-inner">
                    <h1 className="display-9">Choose your depth of care.</h1>
                    <p>Start with a free digital assessment. Add membership for ongoing insights, or explore UAE clinical care programs when available.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="container">
              <h2 className="display-8 reveal">Door 01 — PETZ Digital (worldwide)</h2>
              <div className="pricing-toggle reveal" id="digitalToggle">
                <button type="button" className="is-active" data-period="monthly">Monthly</button>
                <button type="button" data-period="annual">Annual</button>
              </div>
              <div className="pricing-grid stagger-group">
                <article className="pricing-card reveal-scale">
                  <p className="eyebrow">One-time</p>
                  <h3 className="display-5">PETZ Health Coach</h3>
                  <p className="price">$109 <span className="price-note">/ AED 400</span></p>
                  <p>Live online session + vet-reviewed Health Report (PDF) + 30-day app preview. Fully credited to an annual plan within 60 days.</p>
                  <div className="button-row" style={{marginTop: "24px"}}>
                    <a className="button is-secondary" href="/support"><span className="button-hover"></span><span className="button-label">Contact Us</span></a>
                  </div>
                </article>
                <article className="pricing-card reveal-scale">
                  <p className="eyebrow">Membership</p>
                  <h3 className="display-5">PETZ Digital</h3>
                  <p className="price" data-monthly="$22/mo · AED 81/mo" data-annual="$215/yr · AED 790/yr">$22/mo · AED 81/mo</p>
                  <p className="price-note">Cancel anytime</p>
                  <ul className="pricing-features">
                    <li>Unlimited AI assistant + symptom checker</li>
                    <li>Monthly Health Score and report</li>
                    <li>Reminders, tracking, records</li>
                    <li>Marketplace member prices</li>
                    <li>Up to two pet profiles</li>
                  </ul>
                  <div className="button-row" style={{marginTop: "24px"}}>
                    <a className="button is-primary" href="/assess"><span className="button-hover"></span><span className="button-label">Start free assessment</span></a>
                  </div>
                </article>
                <article className="pricing-card is-featured reveal-scale">
                  <p className="eyebrow">Flagship · 12 months</p>
                  <h3 className="display-5">PETZ Longevity+</h3>
                  <p className="price" data-monthly="$43/mo · AED 159/mo" data-annual="$433/yr · AED 1,590/yr">$43/mo · AED 159/mo</p>
                  <p className="price-note">Everything in Digital, plus:</p>
                  <ul className="pricing-features">
                    <li>Initial coach session + annual follow-up</li>
                    <li>Quarterly vet-reviewed plan and report</li>
                    <li>Bio-Age tracking and priority answers</li>
                    <li>10% off test kits with coach walkthrough</li>
                  </ul>
                  <div className="button-row" style={{marginTop: "24px"}}>
                    <a className="button is-primary" href="/waitlist"><span className="button-hover"></span><span className="button-label">Join waitlist</span></a>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section className="section section-band band-cream">
            <div className="container">
              <h2 className="display-8 reveal">Door 02 — Care Programs (UAE only)</h2>
              <p className="reveal" style={{maxWidth: "40rem", marginTop: "12px"}}>In-clinic diagnostics coordinated by PETZ. Available from September 2026. Indicative pricing — partner lab rates may vary.</p>
              <div className="pricing-toggle reveal" id="seniorToggle">
                <button type="button" className="is-active" data-tier="junior">Junior</button>
                <button type="button" data-tier="senior">Senior 7+</button>
              </div>
              <div className="pricing-grid" style={{gridTemplateColumns: "1fr 1fr"}}>
                <article className="pricing-card reveal">
                  <h3 className="display-5">Essential</h3>
                  <p className="price" data-junior="from $575/yr · AED 2,110/yr" data-senior="from $575/yr · AED 2,110/yr">from $575/yr · AED 2,110/yr</p>
                  <ul className="pricing-features">
                    <li>PETZ Digital + Longevity+ software</li>
                    <li>Essential panel — 40+ parameters</li>
                    <li>Municipality registration handled</li>
                    <li>1 coach session per year</li>
                    <li>One full diagnostic work-up per year</li>
                  </ul>
                </article>
                <article className="pricing-card is-featured reveal">
                  <h3 className="display-5">Complete</h3>
                  <p className="price" data-junior="from $978/yr · AED 3,590/yr" data-senior="from $978/yr · AED 3,590/yr">from $978/yr · AED 3,590/yr</p>
                  <ul className="pricing-features">
                    <li>Everything in Essential</li>
                    <li>Complete panel — 60+ parameters</li>
                    <li>Heart, liver, thyroid, inflammation markers</li>
                    <li>Coach walkthrough of every result</li>
                    <li id="seniorNote" hidden>Senior: 2 coach sessions + 6-month recheck</li>
                  </ul>
                </article>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="container">
              <h2 className="display-8 reveal">Add-ons (member pricing)</h2>
              <table className="addon-table reveal">
                <thead>
                  <tr><th>Add-on</th><th>USD</th><th>AED</th></tr>
                </thead>
                <tbody>
                  <tr><td>Bio-Age (epigenetic clock)</td><td>$208</td><td>765</td></tr>
                  <tr><td>Breed &amp; Health DNA</td><td>$172</td><td>630</td></tr>
                  <tr><td>Gut health (microbiome)</td><td>$184</td><td>675</td></tr>
                  <tr><td>Annual vaccinations &amp; parasite pack</td><td>from $218</td><td>from 800</td></tr>
                  <tr><td>Dental COHAT</td><td>$351</td><td>1,290</td></tr>
                </tbody>
              </table>
              <p className="price-disclaimer reveal">All AED prices include VAT. USD converted at 3.6725. Pricing is illustrative and may change. Clinical programs are UAE-only from September 2026.</p>
              <div className="button-row reveal" style={{marginTop: "24px"}}>
                <a className="text-link" href="/gift-cards">View gift cards
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
              </div>
            </div>
          </section>
    </SiteShell>
  );
}
