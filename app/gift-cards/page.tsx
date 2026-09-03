import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Gift Cards — PETZ",
  description: "PETZ uses AI and veterinary-informed health science to understand your pet's health.",
};

export default function GiftCardsPage() {
  return (
    <SiteShell variant="inflow">
      <section className="section">
            <div className="container">
              <div className="inner-container-center measure-wide reveal">
                <h1 className="display-8">Give the gift of better pet health</h1>
                <p>Email instantly or print a physical card. Redeem in the PETZ app. No expiry. Any pet.</p>
              </div>
              <div className="pricing-grid stagger-group" style={{marginTop: "40px"}}>
                <article className="pricing-card reveal-scale">
                  <h3 className="display-5">Starter Kit</h3>
                  <p className="price">₹7,499</p>
                  <p>One Starter Kit for a dog or cat.</p>
                </article>
                <article className="pricing-card is-featured reveal-scale">
                  <h3 className="display-5">Pro Kit</h3>
                  <p className="price">₹12,499</p>
                  <p>One Pro Kit including vet-reviewed report.</p>
                </article>
                <article className="pricing-card reveal-scale">
                  <h3 className="display-5">Custom</h3>
                  <p className="price">₹16,999</p>
                  <p>Kits, subscriptions, or partner services.</p>
                </article>
              </div>
              <p className="price-disclaimer reveal" style={{maxWidth: "40rem", margin: "32px auto 0"}}>Checkout coming with app launch. Gift cards apply to kits, subscriptions, and selected partner services.</p>
            </div>
          </section>
    </SiteShell>
  );
}
