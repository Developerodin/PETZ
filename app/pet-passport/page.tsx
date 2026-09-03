import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Pet Passport — PETZ",
  description: "PETZ uses AI and veterinary-informed health science to understand your pet's health.",
};

export default function PetPassportPage() {
  return (
    <SiteShell variant="inflow">
      <section className="section">
            <div className="container">
              <div className="inner-container-center measure-wide reveal">
                <h1 className="display-8">India Pet Passport planner</h1>
                <p>Vaccination and registration schedule for dogs and cats in India. WSAVA-aligned defaults — pending veterinary sign-off.</p>
              </div>
              <form id="passportForm" className="form-card reveal" noValidate>
                <div className="wizard-stepper">
                  <div className="wizard-step is-active">Pet</div>
                  <div className="wizard-step">History</div>
                  <div className="wizard-step">Schedule</div>
                  <div className="wizard-step">Travel</div>
                  <div className="wizard-step">Record</div>
                </div>
                <div className="wizard-panel is-active" data-step="1">
                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor="ppSpecies">Species</label>
                      <select id="ppSpecies" data-validate="required" data-label="Species" required>
                        <option value="">Select</option>
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                      </select>
                      <p className="field-error"></p>
                    </div>
                    <div className="form-field">
                      <label htmlFor="ppAge">Age (years)</label>
                      <input type="number" id="ppAge" min="0" max="30" data-validate="required" data-label="Age" required />
                      <p className="field-error"></p>
                    </div>
                    <div className="form-field">
                      <label htmlFor="ppState">State</label>
                      <select id="ppState" data-validate="required" data-label="State" required>
                        <option value="">Select</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Other India">Other India</option>
                      </select>
                      <p className="field-error"></p>
                    </div>
                  </div>
                  <div className="form-actions is-end"><button type="button" className="button is-primary" data-pp-next>Continue</button></div>
                </div>
                <div className="wizard-panel" hidden data-step="2">
                  <p>Which core vaccines has your pet received?</p>
                  <div className="form-check"><input type="checkbox" id="ppRabies" /><label htmlFor="ppRabies">Rabies</label></div>
                  <div className="form-check"><input type="checkbox" id="ppCore" /><label htmlFor="ppCore">Core vaccines (DHP / FVRCP)</label></div>
                  <div className="form-actions"><button type="button" className="button is-secondary" data-pp-prev>Back</button><button type="button" className="button is-primary" data-pp-next>Continue</button></div>
                </div>
                <div className="wizard-panel" hidden data-step="3">
                  <h3 className="display-5">Suggested schedule (mock)</h3>
                  <ul className="pricing-features" style={{marginTop: "16px"}}>
                    <li>Rabies — Due soon (annual)</li>
                    <li>Core booster — Upcoming in 3 months</li>
                    <li>Parasite prevention — Needs attention</li>
                  </ul>
                  <div className="form-actions"><button type="button" className="button is-secondary" data-pp-prev>Back</button><button type="button" className="button is-primary" data-pp-next>Continue</button></div>
                </div>
                <div className="wizard-panel" hidden data-step="4">
                  <div className="form-field">
                    <label htmlFor="ppTravel">Travel plans</label>
                    <select id="ppTravel">
                      <option value="None">No travel planned</option>
                      <option value="Leaving India">Leaving India</option>
                      <option value="Into India">Importing into India</option>
                    </select>
                  </div>
                  <div className="form-actions"><button type="button" className="button is-secondary" data-pp-prev>Back</button><button type="button" className="button is-primary" data-pp-next>Continue</button></div>
                </div>
                <div className="wizard-panel" hidden data-step="5">
                  <div className="form-success">
                    <h2 className="display-6">Passport preview ready</h2>
                    <p>Share this illustrative record with your vet for sign-off. Not a government document.</p>
                    <a className="button is-primary" href="/assess"><span className="button-hover"></span><span className="button-label">Complete health assessment</span></a>
                  </div>
                </div>
              </form>
            </div>
          </section>
    </SiteShell>
  );
}
