"use client";

import { useState } from "react";
import { ASSISTANT_NAME } from "@/lib/assistant";

const DIGITAL_MONTHLY = [
  `Unlimited ${ASSISTANT_NAME} + Symptom Checker`,
  "Monthly Health Score & Health Report",
  "Health reminders, tracking & digital records",
  "Marketplace member pricing",
  "Up to 2 pet profiles",
];

const DIGITAL_ANNUAL = [
  `Unlimited ${ASSISTANT_NAME} + Symptom Checker`,
  "Monthly Health Score & Health Report",
  "Health reminders, tracking & digital records",
  "Marketplace member pricing",
  "Up to 2 pet profiles",
  "Personalized 12-month Wellness Roadmap",
  "Annual PETZ Health Review",
  "Digital PETZ Health Passport",
  "12-month Health Journey & progress tracking",
  `Annual Health Summary from ${ASSISTANT_NAME}`,
  "Priority Member Support",
  "Exclusive annual-member offers & partner benefits",
  "Early access to new PETZ features & programs",
  "Founding Member pricing/benefits",
];

const LONGEVITY_MONTHLY = [
  "Everything included in PETZ Digital",
  "Initial PETZ Health Coach session",
  "Annual Health Coach follow-up",
  "Quarterly vet-reviewed Health Plan",
  "Quarterly Health Reports",
  "Bio-Age tracking & priority answers",
  "10% off test kits",
];

const LONGEVITY_ANNUAL = [
  "Everything included in PETZ Digital Annual",
  "Initial PETZ Health Coach session",
  "Mid-year Wellness Check-in",
  "Annual Health Coach follow-up",
  "Quarterly vet-reviewed Health Plan",
  "Quarterly Health Reports",
  "Personalized PETZ Longevity Profile",
  "Bio-Age tracking & annual Bio-Age review",
  "Priority Health Answers",
  "Annual PETZ Longevity Dossier",
  "Annual test-kit credit",
  "10% off test kits",
  "Priority access to new PETZ health programs",
  "Exclusive Longevity+ member benefits",
  "Founding Member pricing/benefits",
];

function LaunchLabel() {
  return <p className="launch-pill">Exclusive launch plan</p>;
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="pricing-features">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function PlansView() {
  const [period, setPeriod] = useState<"monthly" | "annual">("monthly");
  const isAnnual = period === "annual";

  return (
    <>
      <section className="section">
        <div className="section-frame pd-top">
          <div className="section-card hero-top-pd">
            <div className="container">
              <div className="page-hero-inner">
                <h1 className="display-9">Choose your depth of care.</h1>
                <p>
                  Start with a free digital assessment. Exclusive launch plans in INR — billed monthly or annually.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="display-8 reveal">PETZ Digital plans</h2>

          <aside className="pricing-save reveal">
            <p className="eyebrow">Save more with annual membership</p>
            <p className="pricing-save-title">Exclusive launch pricing</p>
            <div className="pricing-save-row">
              <p>
                PETZ Digital — <strong>₹4,999/year</strong>
                <span>Save ₹989 vs monthly</span>
              </p>
              <p>
                PETZ Longevity+ — <strong>₹9,999/year</strong>
                <span>Save ₹1,989 vs monthly</span>
              </p>
            </div>
          </aside>

          <div className="pricing-toggle reveal" role="tablist" aria-label="Billing period">
            <button
              type="button"
              className={period === "monthly" ? "is-active" : undefined}
              aria-pressed={period === "monthly"}
              onClick={() => setPeriod("monthly")}
            >
              Monthly
            </button>
            <button
              type="button"
              className={period === "annual" ? "is-active" : undefined}
              aria-pressed={period === "annual"}
              onClick={() => setPeriod("annual")}
            >
              Annual
            </button>
          </div>

          <div className="pricing-grid stagger-group">
            <article className="pricing-card reveal-scale">
              <LaunchLabel />
              <p className="eyebrow">One-time</p>
              <h3 className="display-5">PETZ Health Coach</h3>
              <p className="price">₹1,499</p>
              <p className="price-note">One-time session</p>
              <p>
                Live online session + vet-reviewed Health Report (PDF) + 30-day app preview. Fully credited to an
                annual plan within 60 days.
              </p>
              <div className="button-row" style={{ marginTop: "24px" }}>
                <a className="button is-primary" href="/support">
                  <span className="button-hover"></span>
                  <span className="button-label">Contact Us</span>
                </a>
              </div>
            </article>

            <article className="pricing-card reveal-scale">
              <LaunchLabel />
              <p className="eyebrow">Membership</p>
              <h3 className="display-5">PETZ Digital</h3>
              <p className="price">{isAnnual ? "₹4,999/year" : "₹499/month"}</p>
              <p className="price-note">{isAnnual ? "Billed annually" : "Cancel anytime"}</p>
              <FeatureList items={isAnnual ? DIGITAL_ANNUAL : DIGITAL_MONTHLY} />
              <div className="button-row" style={{ marginTop: "24px" }}>
                <a className="button is-primary" href="/assess">
                  <span className="button-hover"></span>
                  <span className="button-label">Start free assessment</span>
                </a>
              </div>
            </article>

            <article className="pricing-card is-featured reveal-scale">
              <LaunchLabel />
              <p className="eyebrow">Flagship</p>
              <h3 className="display-5">PETZ Longevity+</h3>
              <p className="price">{isAnnual ? "₹9,999/year" : "₹999/month"}</p>
              <p className="price-note">{isAnnual ? "Billed annually" : "Cancel anytime"}</p>
              <FeatureList items={isAnnual ? LONGEVITY_ANNUAL : LONGEVITY_MONTHLY} />
              <div className="button-row" style={{ marginTop: "24px" }}>
                <a className="button is-primary" href="/waitlist">
                  <span className="button-hover"></span>
                  <span className="button-label">Join waitlist</span>
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="display-8 reveal">Add-ons (member pricing)</h2>
          <table className="addon-table reveal">
            <thead>
              <tr>
                <th>Add-on</th>
                <th>INR</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Bio-Age (epigenetic clock)</td>
                <td>₹17,600</td>
              </tr>
              <tr>
                <td>Breed &amp; Health DNA</td>
                <td>₹14,500</td>
              </tr>
              <tr>
                <td>Gut health (microbiome)</td>
                <td>₹15,500</td>
              </tr>
              <tr>
                <td>Annual vaccinations &amp; parasite pack</td>
                <td>from ₹18,400</td>
              </tr>
              <tr>
                <td>Dental COHAT</td>
                <td>₹29,700</td>
              </tr>
            </tbody>
          </table>
          <p className="price-disclaimer reveal">
            Exclusive launch plans in India. All prices in INR. Pricing is illustrative and may change.
          </p>
          <div className="button-row reveal" style={{ marginTop: "24px" }}>
            <a className="text-link" href="/gift-cards">
              View gift cards
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
