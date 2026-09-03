import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Privacy Policy — PETZ",
  description: "PETZ uses AI and veterinary-informed health science to understand your pet's health.",
};

export default function PrivacyPage() {
  return (
    <SiteShell variant="inflow">
      <section className="section">
            <div className="container">
              <article className="blog-article white-card reveal" style={{padding: "40px"}}>
                <h1 className="display-8">Privacy Policy</h1>
                <p className="article-meta">Effective date: August 2026 · Placeholder for PETZ operator details</p>
                <p>PETZ ("we", "us") operates the PETZ preventive pet-health platform. This policy describes what information we collect, why we use it, and how we protect it.</p>
                <h2>Information we collect</h2>
                <ul>
                  <li>Account information: name, email, country</li>
                  <li>Pet profile: species, breed, age, weight, photos, health history</li>
                  <li>Usage data: device type, approximate location from IP, cookies</li>
                  <li>Communications: support messages and marketing preferences</li>
                </ul>
                <h2>How we use information</h2>
                <p>We use data to provide the platform, improve our services, send communications you opt into, and — with appropriate safeguards — improve AI models using de-identified data.</p>
                <h2>We do not sell personal information</h2>
                <p>PETZ does not sell personal information or use it for cross-context behavioural advertising.</p>
                <h2>AI and health information</h2>
                <p>PETZ uses AI for health scoring and recommendations. Outputs are educational and do not constitute veterinary diagnosis or treatment.</p>
                <h2>Contact</h2>
                <p>Privacy inquiries: <a href="mailto:privacy@petz.love">privacy@petz.love</a></p>
                <p><em>Operator legal entity details to be updated when finalised.</em></p>
              </article>
            </div>
          </section>
    </SiteShell>
  );
}
