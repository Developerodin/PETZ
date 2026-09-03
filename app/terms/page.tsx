import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Terms of Service — PETZ",
  description: "PETZ uses AI and veterinary-informed health science to understand your pet's health.",
};

export default function TermsPage() {
  return (
    <SiteShell variant="inflow">
      <section className="section">
            <div className="container">
              <article className="blog-article white-card reveal" style={{padding: "40px"}}>
                <h1 className="display-8">Terms of Service</h1>
                <p className="article-meta">Last updated: August 2026</p>
                <p>PETZ is a wellness and education platform. We are not a veterinary practice, medical device, or seller of marketplace goods. Independent licensed providers deliver clinical care.</p>
                <h2>Not veterinary advice</h2>
                <p>PETZ does not provide veterinary medical advice, diagnosis, prescriptions, or treatment. Digital tools are not a substitute for examination by a licensed veterinarian.</p>
                <h2>Subscriptions</h2>
                <p>Digital memberships auto-renew until cancelled. Refund policies follow applicable consumer law in your region.</p>
                <h2>Marketplace</h2>
                <p>PETZ facilitates bookings and payments with independent providers via payment processors. PETZ is not the seller of third-party goods or clinical services.</p>
                <h2>Emergencies</h2>
                <p>If your pet may be experiencing an emergency, go to the nearest open veterinary clinic immediately.</p>
                <h2>Contact</h2>
                <p><a href="mailto:legal@petz.love">legal@petz.love</a></p>
              </article>
            </div>
          </section>
    </SiteShell>
  );
}
