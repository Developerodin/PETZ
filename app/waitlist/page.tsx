import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { getFormUser } from "@/lib/form-user";

export const metadata: Metadata = {
  title: "Join the Waitlist — PETZ",
  description: "PETZ uses AI and veterinary-informed health science to understand your pet's health.",
};

export default async function WaitlistPage() {
  const user = await getFormUser();

  return (
    <SiteShell variant="inflow">
      <section className="section">
            <div className="container">
              <div className="inner-container-center measure-wide reveal">
                <h1 className="display-8">Join the PETZ waitlist</h1>
                <p>Early access to biomarker kits, the mobile app, and clinical care in India.</p>
              </div>
              <form id="waitlistForm" className="form-card reveal" noValidate>
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="wlName">Name (optional)</label>
                    <input type="text" id="wlName" name="wlName" data-validate="name" data-label="Name" data-optional="true" defaultValue={user.name} />
                    <p className="field-error"></p>
                  </div>
                  <div className="form-field">
                    <label htmlFor="wlEmail">Email</label>
                    <input type="email" id="wlEmail" name="wlEmail" data-validate="email" required defaultValue={user.email} readOnly={user.signedIn} />
                    <p className="field-error"></p>
                  </div>
                  <div className="form-field">
                    <label htmlFor="wlCountry">Country</label>
                    <input type="text" id="wlCountry" name="wlCountry" data-validate="required" data-label="Country" required defaultValue="India" />
                    <p className="field-error"></p>
                  </div>
                </div>
                <div className="form-actions is-end">
                  <button type="submit" className="button is-primary"><span className="button-hover"></span><span className="button-label">Join waitlist</span></button>
                </div>
                <div className="form-success-panel" hidden>
                  <div className="form-success">
                    <h2 className="display-6">You're on the list</h2>
                    <p>We'll email you when PETZ launches in India. Meanwhile, try our free assessment.</p>
                    <a className="button is-primary mt-3" href="/assess"><span className="button-hover"></span><span className="button-label">Assess My Pet</span></a>
                  </div>
                </div>
              </form>
            </div>
          </section>
    </SiteShell>
  );
}
