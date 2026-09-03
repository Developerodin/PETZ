import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { getFormUser } from "@/lib/form-user";

export const metadata: Metadata = {
  title: "Contact Us — PETZ",
  description: "Get in touch with PETZ. Email, partner enquiries, and support for pet parents.",
};

export default async function SupportPage() {
  const user = await getFormUser();

  return (
    <SiteShell variant="overlay">
      <section className="section">
            <div className="section-frame pd-top">
              <div className="section-card hero-top-pd hero-flush">
                <div className="container">
                  <div className="page-hero-inner">
                    <h1 className="display-9">We're just a hello away</h1>
                    <p>Questions about your pet's assessment, partnerships, or anything else — reach out and we'll get back to you within one business day.</p>
                  </div>
                  <div className="grid-3 contact-links-layout">
                    <a className="contact-card reveal" href="mailto:hello@petz.love">
                      <div>
                        <h3 className="display-4">Send us an email</h3>
                        <p>hello@petz.love</p>
                      </div>
                      <svg className="arrow" width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </a>
                    <a className="contact-card reveal" href="/partner-apply">
                      <div>
                        <h3 className="display-4">Partners</h3>
                        <p>Apply to partner with PETZ</p>
                      </div>
                      <svg className="arrow" width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </a>
                    <a className="contact-card reveal" href="/faq">
                      <div>
                        <h3 className="display-4">FAQ</h3>
                        <p>Common questions answered</p>
                      </div>
                      <svg className="arrow" width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="container">
              <div className="contact-grid-v2">
                <div>
                  <div className="section-top-content-wrapper is-stack reveal">
                    <div>
                      <h2 className="display-8">Send us a message</h2>
                      <p>Fill in the form and our team will reply within one business day. Hours: 9am–9pm IST, Monday–Friday.</p>
                    </div>
                  </div>
                  <form id="supportForm" className="contact-form-card reveal" noValidate>
                    <div className="contact-form-layout">
                      <div className="form-field">
                        <label htmlFor="supFirstName">First name</label>
                        <input type="text" id="supFirstName" data-validate="name" data-label="First name" required defaultValue={user.firstName} />
                        <p className="field-error"></p>
                      </div>
                      <div className="form-field">
                        <label htmlFor="supLastName">Last name</label>
                        <input type="text" id="supLastName" data-validate="name" data-label="Last name" required defaultValue={user.lastName} />
                        <p className="field-error"></p>
                      </div>
                      <div className="form-field">
                        <label htmlFor="supEmail">Email</label>
                        <input type="email" id="supEmail" data-validate="email" required defaultValue={user.email} readOnly={user.signedIn} />
                        <p className="field-error"></p>
                      </div>
                      <div className="form-field">
                        <label htmlFor="supPhone">Phone <span style={{fontWeight: 400, color: "var(--color-300)"}}>(optional)</span></label>
                        <input type="tel" id="supPhone" />
                        <p className="field-error"></p>
                      </div>
                      <div className="form-field form-field--full">
                        <label htmlFor="supSubject">Subject</label>
                        <input type="text" id="supSubject" data-validate="required" data-label="Subject" required />
                        <p className="field-error"></p>
                      </div>
                      <div className="form-field form-field--full">
                        <label htmlFor="supMessage">Message</label>
                        <textarea id="supMessage" rows={5} data-validate="required" data-label="Message" required></textarea>
                        <p className="field-error"></p>
                      </div>
                    </div>
                    <div className="form-actions is-end" style={{marginTop: "24px"}}>
                      <button type="submit" className="button is-primary"><span className="button-hover"></span><span className="button-label">Send message</span></button>
                    </div>
                    <div className="form-success-panel" hidden>
                      <div className="form-success">
                        <h2 className="display-6">Thanks for reaching out!</h2>
                        <p>We've received your message and will reply within one business day.</p>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="department-cards">
                  <article className="department-card reveal">
                    <h3 className="display-4">Support</h3>
                    <p>Questions about assessments, results, or your account.</p>
                    <p><a href="mailto:hello@petz.love">hello@petz.love</a></p>
                  </article>
                  <article className="department-card reveal">
                    <h3 className="display-4">Partners</h3>
                    <p>Veterinary, diagnostic, and brand partnership enquiries.</p>
                    <p><a href="/partner-apply">Apply to partner</a></p>
                  </article>
                  <article className="department-card reveal">
                    <h3 className="display-4">Press</h3>
                    <p>Media and press enquiries.</p>
                    <p><a href="mailto:hello@petz.love">hello@petz.love</a></p>
                  </article>
                </div>
              </div>
            </div>
          </section>
    </SiteShell>
  );
}
