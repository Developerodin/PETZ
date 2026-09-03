import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Marketplace — PETZ",
  description: "PETZ uses AI and veterinary-informed health science to understand your pet's health.",
};

export default function MarketplacePage() {
  return (
    <SiteShell variant="inflow">
      <section className="section">
            <div className="container">
              <div className="inner-container-center measure-wide reveal">
                <h1 className="display-8">Vetted pet-health marketplace</h1>
                <p>Evidence review → veterinary sign-off → outcome tracking. No pay-to-play listings.</p>
              </div>
              <div className="pipeline reveal" style={{marginTop: "32px"}} aria-label="Vetting flow">
                <span>Evidence review</span><i>→</i><span>Vet sign-off</span><i>→</i><span>Outcome tracking</span><i>→</i><span>Member booking</span>
              </div>
              <div className="grid-3 cols-1-tablet stagger-group" style={{marginTop: "40px"}}>
                <article className="icon-top-card reveal"><h3 className="display-4">Vet clinics</h3><p>GP, internal medicine, dental, dermatology, and more.</p></article>
                <article className="icon-top-card reveal"><h3 className="display-4">Diagnostics</h3><p>Test kits and lab panels matched to your pet's plan.</p></article>
                <article className="icon-top-card reveal"><h3 className="display-4">Nutrition</h3><p>Supplements and food brands vetted for evidence.</p></article>
                <article className="icon-top-card reveal"><h3 className="display-4">Insurance</h3><p>Coverage options for preventive and clinical care.</p></article>
                <article className="icon-top-card reveal"><h3 className="display-4">Relocation</h3><p>Travel and import support for UAE pet parents.</p></article>
                <article className="icon-top-card reveal"><h3 className="display-4">Specialist care</h3><p>Cardiology, oncology, hydrotherapy, physiotherapy.</p></article>
              </div>
            </div>
          </section>
    </SiteShell>
  );
}
