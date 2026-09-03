import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Sample Assessment — PETZ",
  description: "PETZ uses AI and veterinary-informed health science to understand your pet's health.",
};

export default function SampleAssessmentPage() {
  return (
    <SiteShell variant="inflow">
      <section className="section">
            <div className="container">
              <div className="inner-container-center measure-wide reveal">
                <span className="example-chip">Illustrative example</span>
                <h1 className="display-8">Bella's health profile</h1>
                <p>Labrador Retriever · Female · 4 years · Sample assessment preview</p>
              </div>
              <div className="dashboard-mock reveal">
                <div className="dashboard-mock__top">
                  <div className="dashboard-pet">
                    <img src="/assets/images/labrador.jpg" alt="" width="1200" height="800" />
                    <div>
                      <div className="display-4">Bella</div>
                      <p>Illustrative health profile</p>
                    </div>
                  </div>
                  <div style={{textAlign: "center"}}>
                    <div className="score-ring" style={{background: "conic-gradient(var(--color-accent) 0 82%, var(--color-600) 0)"}}><span>82</span></div>
                    <p className="mt-2" style={{fontWeight: 600, color: "var(--color-100)"}}>PETZ Health Score</p>
                    <p className="display-4" style={{color: "var(--color-accent)", marginTop: "8px"}}>Appears healthy</p>
                  </div>
                </div>
                <div className="dash-rows">
                  <div className="dash-row"><span className="label">Nutrition</span><div className="bar"><span className="is-accent" style={{width: "86%"}}></span></div><span className="val">Strong</span></div>
                  <div className="dash-row"><span className="label">Body Condition</span><div className="bar"><span style={{width: "70%"}}></span></div><span className="val">Monitor</span></div>
                  <div className="dash-row"><span className="label">Activity</span><div className="bar"><span style={{width: "64%"}}></span></div><span className="val">Monitor</span></div>
                  <div className="dash-row"><span className="label">Preventive Care</span><div className="bar"><span className="is-accent" style={{width: "90%"}}></span></div><span className="val">On track</span></div>
                  <div className="dash-row"><span className="label">Behaviour &amp; Wellbeing</span><div className="bar"><span style={{width: "78%"}}></span></div><span className="val">Good</span></div>
                  <div className="dash-row"><span className="label">Health History</span><div className="bar"><span style={{width: "60%"}}></span></div><span className="val">Review</span></div>
                </div>
              </div>
              <div className="button-row is-center-aligned" style={{marginTop: "32px"}}>
                <a className="button is-primary" href="/assess"><span className="button-hover"></span><span className="button-label">Assess your pet</span></a>
              </div>
            </div>
          </section>
    </SiteShell>
  );
}
