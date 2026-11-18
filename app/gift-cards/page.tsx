import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Gift Cards — PETZ",
  description: "Get notified when PETZ gift cards become available.",
};

const TIERS = [
  {
    name: "Starter Kit",
    price: "₹7,499",
    blurb: "One Starter Kit for a dog or cat.",
  },
  {
    name: "Pro Kit",
    price: "₹12,499",
    blurb: "One Pro Kit including vet-reviewed report.",
  },
  {
    name: "Custom",
    price: "₹16,999",
    blurb: "Kits, subscriptions, or partner services.",
  },
] as const;

export default function GiftCardsPage() {
  return (
    <SiteShell variant="inflow">
      <section className="section">
        <div className="container">
          <div className="inner-container-center measure-wide reveal">
            <h1 className="display-8">Gift cards are coming</h1>
            <p>
              PETZ gift cards are not available at launch. Join the waitlist and we&apos;ll email you when they open.
            </p>
          </div>
          <div className="pricing-grid stagger-group" style={{ marginTop: "40px" }}>
            {TIERS.map((tier) => (
              <article className="pricing-card reveal-scale" key={tier.name}>
                <h3 className="display-5">{tier.name}</h3>
                <p className="price">{tier.price}</p>
                <p>{tier.blurb}</p>
                <div className="button-row">
                  <a className="button is-primary" href="/waitlist?plan=gift">
                    <span className="button-hover"></span>
                    <span className="button-label">Notify me</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
          <p className="price-disclaimer reveal" style={{ maxWidth: "40rem", margin: "32px auto 0" }}>
            Gift kits and gift cards are not available at launch. Prices shown are planned launch amounts in INR,
            inclusive of GST, and may be confirmed before sale.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
