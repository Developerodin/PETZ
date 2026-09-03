import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Team — PETZ",
  description: "PETZ uses AI and veterinary-informed health science to understand your pet's health.",
};

export default function TeamPage() {
  return (
    <SiteShell variant="inflow">
      <section className="section">
            <div className="container">
              <div className="inner-container-center measure-wide reveal">
                <h1 className="display-8">The people behind PETZ</h1>
                <p>Building preventive pet-health intelligence so pet parents can understand health earlier — not only when symptoms appear.</p>
              </div>
              <div className="grid-3 cols-1-tablet stagger-group" style={{marginTop: "40px"}}>
                <article className="white-card reveal" style={{padding: "32px"}}>
                  <h3 className="display-4">Dr. Sarah Chen</h3>
                  <p className="eyebrow" style={{marginTop: "8px"}}>Chief Veterinary Advisor</p>
                  <p style={{marginTop: "12px"}}>15 years in companion-animal medicine. Leads evidence review for PETZ health insights.</p>
                </article>
                <article className="white-card reveal" style={{padding: "32px"}}>
                  <h3 className="display-4">James Okonkwo</h3>
                  <p className="eyebrow" style={{marginTop: "8px"}}>Head of Product</p>
                  <p style={{marginTop: "12px"}}>Former health-tech product lead. Focused on turning complex data into clear next steps for pet parents.</p>
                </article>
                <article className="white-card reveal" style={{padding: "32px"}}>
                  <h3 className="display-4">Maya Patel</h3>
                  <p className="eyebrow" style={{marginTop: "8px"}}>Lead AI Scientist</p>
                  <p style={{marginTop: "12px"}}>ML researcher specialising in veterinary informatics and preventive health pattern detection.</p>
                </article>
              </div>
              <p className="reveal" style={{marginTop: "40px", textAlign: "center"}}>Interested in joining? <a href="/support" className="text-link">Contact Us</a></p>
            </div>
          </section>
    </SiteShell>
  );
}
