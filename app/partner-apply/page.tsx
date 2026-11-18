import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { getFormUser } from "@/lib/form-user";
import { INDIA_CITIES, PARTNER_TYPES } from "@/lib/form-schema";

export const metadata: Metadata = {
  title: "Partner Application — PETZ",
  description: "Apply to partner with PETZ across veterinary, diagnostic, brand, and research programmes.",
};

const TYPE_ALIASES: Record<string, (typeof PARTNER_TYPES)[number]> = {
  veterinary: "Veterinary",
  diagnostic: "Diagnostic",
  brands: "Pet Health Brands",
  "pet-health-brands": "Pet Health Brands",
  brand: "Pet Health Brands",
  research: "Research",
};

export default async function PartnerApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const user = await getFormUser();
  const params = await searchParams;
  const rawType = String(params.type || "").trim();
  const preselected =
    (PARTNER_TYPES as readonly string[]).includes(rawType)
      ? rawType
      : TYPE_ALIASES[rawType.toLowerCase()] || "";

  return (
    <SiteShell variant="inflow">
      <section className="section">
        <div className="container">
          <div className="inner-container-center measure-wide reveal">
            <h1 className="display-8">Partner with PETZ</h1>
            <p>
              Open to veterinary clinics, diagnostic labs, pet health brands, and research partners. Our partnerships
              team will reply within 3 business days.
            </p>
          </div>
          <form id="partnerForm" className="form-card reveal" method="post" noValidate>
            <div className="hp-field" aria-hidden="true">
              <label htmlFor="paCompany">Company</label>
              <input type="text" id="paCompany" name="paCompany" tabIndex={-1} autoComplete="off" />
            </div>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="paType">Partner type</label>
                <select
                  id="paType"
                  name="paType"
                  data-validate="partnerType"
                  data-label="Partner type"
                  required
                  defaultValue={preselected}
                >
                  <option value="">Select</option>
                  {PARTNER_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <p className="field-error"></p>
              </div>
              <div className="form-field">
                <label htmlFor="paOrg">Organisation name</label>
                <input
                  type="text"
                  id="paOrg"
                  name="paOrg"
                  data-validate="required"
                  data-label="Organisation name"
                  required
                  maxLength={120}
                />
                <p className="field-error"></p>
              </div>
              <div className="form-field">
                <label htmlFor="paContact">Contact name</label>
                <input
                  type="text"
                  id="paContact"
                  name="paContact"
                  data-validate="name"
                  data-label="Contact name"
                  required
                  maxLength={80}
                  defaultValue={user.name}
                />
                <p className="field-error"></p>
              </div>
              <div className="form-field">
                <label htmlFor="paEmail">Email</label>
                <input
                  type="email"
                  id="paEmail"
                  name="paEmail"
                  data-validate="email"
                  required
                  defaultValue={user.email}
                  readOnly={user.signedIn}
                />
                <p className="field-error"></p>
              </div>
              <div className="form-field">
                <label htmlFor="paPhone">Phone</label>
                <input type="tel" id="paPhone" name="paPhone" data-validate="phone" data-label="Phone" required />
                <p className="field-error"></p>
              </div>
              <div className="form-field">
                <label htmlFor="paCity">City</label>
                <select id="paCity" name="paCity" data-validate="city" data-label="City" required defaultValue="">
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
                <label htmlFor="paMessage">Tell us about your practice</label>
                <textarea
                  id="paMessage"
                  name="paMessage"
                  rows={4}
                  data-validate="message"
                  data-label="Message"
                  maxLength={2000}
                ></textarea>
                <p className="field-error"></p>
              </div>
            </div>
            <div className="form-actions is-end">
              <button type="submit" className="button is-primary" disabled>
                <span className="button-hover"></span>
                <span className="button-label">Submit application</span>
              </button>
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
