"use client";

import { useState } from "react";
import { ASSISTANT_NAME } from "@/lib/assistant";

const FREE_FEATURES = [
  "2 Health Reports / year",
  `${ASSISTANT_NAME} — AI Health Assistant`,
  "Ask questions and understand your pet’s health better",
  "Basic health insights based on your pet’s information",
];

const CARE_FEATURES = [
  "Unlimited Health Reports",
  `${ASSISTANT_NAME} — AI Health Assistant`,
  "Live Veterinary Guidance — connect with a real veterinarian for personalised suggestions",
  "Personalised Health Insights based on your pet’s evolving information",
  "Health Tracking & History — keep your pet’s health information and reports organised in one place",
  "Early Health Alerts & Recommendations — understand changes that may need attention",
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
                <h1 className="display-9">PETZ — Launch Plans</h1>
                <p>
                  Start free, or choose ongoing care. Exclusive launch plans in INR — billed monthly or annually.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="display-8 reveal">Choose your plan</h2>

          <aside className="pricing-save reveal">
            <p className="eyebrow">Save more with annual membership</p>
            <p className="pricing-save-title">Exclusive launch pricing</p>
            <div className="pricing-save-row pricing-save-row--single">
              <p>
                PETZ Care — <strong>₹4,999/year</strong>
                <span>Save ₹989 vs monthly</span>
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

          <div className="pricing-grid pricing-grid--two stagger-group">
            <article className="pricing-card reveal-scale">
              <LaunchLabel />
              <p className="eyebrow">Free</p>
              <h3 className="display-5">Free</h3>
              <p className="price">₹0</p>
              <p className="price-note">No credit card required</p>
              <p>For pet parents who want to start understanding their pet’s health.</p>
              <FeatureList items={FREE_FEATURES} />
              <div className="button-row">
                <a className="button is-primary" href="/assess">
                  <span className="button-hover"></span>
                  <span className="button-label">Start for Free</span>
                </a>
              </div>
            </article>

            <article className="pricing-card is-featured reveal-scale">
              <LaunchLabel />
              <p className="eyebrow">Membership</p>
              <h3 className="display-5">PETZ Care</h3>
              <p className="price">{isAnnual ? "₹4,999/year" : "₹499/month"}</p>
              <p className="price-note">
                {isAnnual ? "Billed annually · ₹499/month equivalent" : "₹4,999/year if billed annually"}
              </p>
              <p>For pet parents who want ongoing, more personalised health guidance.</p>
              <FeatureList items={CARE_FEATURES} />
              <div className="button-row">
                <a className="button is-primary" href="/waitlist">
                  <span className="button-hover"></span>
                  <span className="button-label">Give Your Pet More Care</span>
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
