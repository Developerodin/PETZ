import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Pet Passport — Coming soon — PETZ",
  description: "The PETZ Pet Passport planner is coming soon.",
  robots: { index: false, follow: false },
};

export default function PetPassportPage() {
  return (
    <SiteShell variant="inflow">
      <section className="section">
        <div className="container">
          <div className="inner-container-center measure-wide reveal">
            <span className="example-chip">Coming soon</span>
            <h1 className="display-8">Pet Passport</h1>
            <p>
              A vaccination and registration planner for dogs and cats in India is on the way. We are not showing a
              mock schedule at launch — when this tool opens, it will be built with veterinary review.
            </p>
            <div className="button-row is-center-aligned" style={{ marginTop: 28 }}>
              <Link className="button is-primary" href="/waitlist">
                <span className="button-hover"></span>
                <span className="button-label">Join the waitlist</span>
              </Link>
              <Link className="button is-secondary" href="/assess">
                <span className="button-hover"></span>
                <span className="button-label">Assess My Pet</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
