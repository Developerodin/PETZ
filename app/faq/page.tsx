import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "FAQ — PETZ",
  description: "Answers about PETZ, the AI-powered preventive pet-health platform.",
};

export default function FaqPage() {
  return (
    <SiteShell variant="overlay">
      <section className="section">
            <div className="section-frame pd-top">
              <div className="section-card hero-top-pd hero-flush overflow-visible">
                <div className="container">
                  <div className="page-hero-inner">
                    <h1 className="display-9">Frequently asked questions.</h1>
                    <p>Clear answers about how PETZ works, what it is for, and how it relates to veterinary care.</p>
                  </div>
                </div>
                <div className="container">
                  <div className="faq-card">
                    <div className="accordion accordion-flush" id="faqAccordion">
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1" aria-expanded="true">What is PETZ?</button>
                        </h2>
                        <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                          <div className="accordion-body">PETZ is an AI-powered preventive pet-health platform that helps pet parents understand their pet's health, identify areas that may need attention and receive personalized recommendations based on the information they provide.</div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">How does PETZ work?</button>
                        </h2>
                        <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                          <div className="accordion-body">You answer a series of questions about your pet, including their age, breed, weight, diet, lifestyle, activity, medical history and other health information. PETZ analyzes those inputs and generates personalized health insights and recommendations.</div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">Does PETZ diagnose diseases?</button>
                        </h2>
                        <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                          <div className="accordion-body">No. PETZ is designed for health education, preventive awareness and personalized guidance. It does not replace a veterinarian or provide a medical diagnosis. If you believe your pet is unwell, you should consult a licensed veterinarian.</div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">What kind of information do I need to provide?</button>
                        </h2>
                        <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                          <div className="accordion-body">Depending on your pet, PETZ may ask about age, breed, weight, diet, exercise, lifestyle, vaccination history, medical history, existing conditions, medication, behaviour, and symptoms or changes you've noticed.</div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq5">Is PETZ only for dogs?</button>
                        </h2>
                        <div id="faq5" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                          <div className="accordion-body">No. PETZ can be designed for multiple companion animals, beginning with dogs and cats and potentially expanding to other pets in the future.</div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq6">Can PETZ help if my pet already has a health problem?</button>
                        </h2>
                        <div id="faq6" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                          <div className="accordion-body">PETZ can help you organize information about an existing issue and identify areas that may deserve attention or discussion with your veterinarian. It should not be used to self-diagnose, treat or replace professional veterinary care.</div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq7">What if my pet is completely healthy?</button>
                        </h2>
                        <div id="faq7" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                          <div className="accordion-body">That's exactly when preventive care can be most valuable. PETZ can help identify opportunities to improve nutrition, activity, weight management, preventive care and other aspects of your pet's long-term health.</div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq8">Will PETZ use blood tests or biomarkers?</button>
                        </h2>
                        <div id="faq8" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                          <div className="accordion-body">Not at the initial launch. PETZ will initially build its health assessment using information provided by the pet parent. Over time, we plan to introduce deeper health-data layers, potentially including diagnostic testing and biomarkers.</div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq9">How accurate is PETZ?</button>
                        </h2>
                        <div id="faq9" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                          <div className="accordion-body">PETZ is designed to provide evidence-informed health insights based on the information available. However, AI-generated information can never capture everything about an individual animal. Veterinary examination and professional clinical judgment remain essential where medical concerns exist.</div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq10">Is my pet's information private?</button>
                        </h2>
                        <div id="faq10" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                          <div className="accordion-body">PETZ should protect personal and pet information using appropriate security and privacy practices. See our <a href="/privacy" className="text-link">Privacy Policy</a> for what information is collected, why it is collected and how it is used.</div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq11">How often should I use PETZ?</button>
                        </h2>
                        <div id="faq11" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                          <div className="accordion-body">Your pet's health changes over time. We envision PETZ becoming more useful as you continue updating your pet's profile and health information rather than treating the assessment as a one-time result.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
    </SiteShell>
  );
}
