import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Partners — PETZ",
  description: "PETZ brings together technology, pet parents, veterinarians, researchers and pet-health businesses.",
};

export default function PartnersPage() {
  return (
    <SiteShell variant="overlay">
      <section className="section">
            <div className="section-frame pd-top">
              <div className="section-card hero-top-pd hero-flush">
                <div className="container">
                  <div className="page-hero-inner">
                    <h1 className="display-9">Better pet health takes a better ecosystem.</h1>
                    <p>PETZ brings together technology, pet parents, veterinarians, researchers and pet-health businesses around one goal: helping pets live healthier lives for longer.</p>
                  </div>
                  <div className="grid-4 contact-links-layout">
                    <a className="contact-card reveal" href="/partner-apply">
                      <div>
                        <h3 className="display-4">Veterinary Partners</h3>
                        <p>Help pet parents move from digital insights to professional care when it matters.</p>
                      </div>
                      <svg className="arrow" width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </a>
                    <a className="contact-card reveal" href="/partner-apply">
                      <div>
                        <h3 className="display-4">Diagnostic Partners</h3>
                        <p>Bring deeper health data into the PETZ ecosystem as the platform evolves.</p>
                      </div>
                      <svg className="arrow" width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </a>
                    <a className="contact-card reveal" href="/partner-apply">
                      <div>
                        <h3 className="display-4">Pet Health Brands</h3>
                        <p>Connect pet parents with products and services that genuinely support their health goals.</p>
                      </div>
                      <svg className="arrow" width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </a>
                    <a className="contact-card reveal" href="/partner-apply">
                      <div>
                        <h3 className="display-4">Research &amp; Science Partners</h3>
                        <p>Help strengthen the evidence behind the way we understand pet health and ageing.</p>
                      </div>
                      <svg className="arrow" width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </a>
                  </div>
                  <div className="inner-container-center">
                    <a className="button is-primary" href="/partner-apply"><span className="button-hover"></span><span className="button-label">Partner With PETZ</span></a>
                    <p className="reassurance">We're building the pet-health ecosystem of tomorrow.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
    </SiteShell>
  );
}
