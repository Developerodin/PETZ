import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { getFormUser } from "@/lib/form-user";
import { INDIA_CITIES } from "@/lib/form-schema";

export const metadata: Metadata = {
  title: "Join the Waitlist — PETZ",
  description: "Join the PETZ waitlist for early access in India.",
};

export default async function WaitlistPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const user = await getFormUser();
  const params = await searchParams;
  const plan = String(params.plan || "").trim().toLowerCase();

  return (
    <SiteShell variant="inflow">
      <section className="section">
        <div className="container">
          <div className="inner-container-center measure-wide reveal">
            <h1 className="display-8">Join the PETZ waitlist</h1>
            <p>
              {plan === "care"
                ? "Join the PETZ Care waitlist for early access when membership opens in India."
                : plan === "gift"
                  ? "Get notified when PETZ gift cards are available. Gift kits are not available at launch."
                  : "Early access to the mobile app and PETZ Care membership in India. Biomarker kits are not available at launch."}
            </p>
          </div>
          <form id="waitlistForm" className="form-card reveal" method="post" noValidate>
            <input type="hidden" id="wlPlan" name="wlPlan" value={plan} />
            <div className="hp-field" aria-hidden="true">
              <label htmlFor="wlCompany">Company</label>
              <input type="text" id="wlCompany" name="wlCompany" tabIndex={-1} autoComplete="off" />
            </div>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="wlName">Name (optional)</label>
                <input
                  type="text"
                  id="wlName"
                  name="wlName"
                  data-validate="name"
                  data-label="Name"
                  data-optional="true"
                  maxLength={80}
                  defaultValue={user.name}
                />
                <p className="field-error"></p>
              </div>
              <div className="form-field">
                <label htmlFor="wlEmail">Email</label>
                <input
                  type="email"
                  id="wlEmail"
                  name="wlEmail"
                  data-validate="email"
                  required
                  defaultValue={user.email}
                  readOnly={user.signedIn}
                />
                <p className="field-error"></p>
              </div>
              <div className="form-field">
                <label htmlFor="wlCity">City</label>
                <select id="wlCity" name="wlCity" data-validate="city" data-label="City" required defaultValue="">
                  <option value="">Select</option>
                  {INDIA_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <p className="field-error"></p>
              </div>
              <div className="form-field">
                <label htmlFor="wlPetType">Pet type</label>
                <select id="wlPetType" name="wlPetType" data-validate="petType" data-label="Pet type" required defaultValue="">
                  <option value="">Select</option>
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                </select>
                <p className="field-error"></p>
              </div>
            </div>
            <div className="form-actions is-end">
              <button type="submit" className="button is-primary" disabled>
                <span className="button-hover"></span>
                <span className="button-label">Join waitlist</span>
              </button>
            </div>
            <div className="form-success-panel" hidden>
              <div className="form-success">
                <h2 className="display-6">You&apos;re on the list</h2>
                <p>We&apos;ll email you when PETZ launches in India. Meanwhile, try our free assessment.</p>
                <a className="button is-primary mt-3" href="/assess">
                  <span className="button-hover"></span>
                  <span className="button-label">Assess My Pet</span>
                </a>
              </div>
            </div>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}
