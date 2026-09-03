import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { getFormUser } from "@/lib/form-user";

export const metadata: Metadata = {
  title: "Partner Application — PETZ",
  description: "PETZ uses AI and veterinary-informed health science to understand your pet's health.",
};

export default async function PartnerApplyPage() {
  const user = await getFormUser();

  return (
    <SiteShell variant="inflow">
      <section className="section">
            <div className="container">
              <div className="inner-container-center measure-wide reveal">
                <h1 className="display-8">Partner with PETZ</h1>
                <p>Open to veterinary clinics, groomers, nutrition and supplement providers. Approval typically within 5–7 business days.</p>
              </div>
              <form id="partnerForm" className="form-card reveal" noValidate>
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="paType">Partner type</label>
                    <select id="paType" name="paType" data-validate="required" data-label="Partner type" required>
                      <option value="">Select</option>
                      <option value="Veterinary clinic">Veterinary clinic</option>
                      <option value="Groomer">Groomer</option>
                      <option value="Nutrition">Nutrition provider</option>
                      <option value="Supplements">Supplements provider</option>
                    </select>
                    <p className="field-error"></p>
                  </div>
                  <div className="form-field">
                    <label htmlFor="paOrg">Organisation name</label>
                    <input type="text" id="paOrg" name="paOrg" data-validate="required" data-label="Organisation name" required />
                    <p className="field-error"></p>
                  </div>
                  <div className="form-field">
                    <label htmlFor="paEmail">Email</label>
                    <input type="email" id="paEmail" name="paEmail" data-validate="email" required defaultValue={user.email} readOnly={user.signedIn} />
                    <p className="field-error"></p>
                  </div>
                  <div className="form-field">
                    <label htmlFor="paCity">City</label>
                    <input type="text" id="paCity" name="paCity" data-validate="required" data-label="City" required />
                    <p className="field-error"></p>
                  </div>
                  <div className="form-field">
                    <label htmlFor="paMessage">Tell us about your practice</label>
                    <textarea id="paMessage" name="paMessage" rows={4} data-validate="message"></textarea>
                    <p className="field-error"></p>
                  </div>
                </div>
                <div className="form-actions is-end">
                  <button type="submit" className="button is-primary"><span className="button-hover"></span><span className="button-label">Submit application</span></button>
                </div>
                <div className="form-success-panel" hidden>
                  <div className="form-success">
                    <h2 className="display-6">Application received</h2>
                    <p>Our partnerships team will reply within 3 business days.</p>
                  </div>
                </div>
              </form>
            </div>
          </section>
    </SiteShell>
  );
}
