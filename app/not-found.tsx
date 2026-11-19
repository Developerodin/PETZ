import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Page not found - PETZ",
};

export default function NotFound() {
  return (
    <SiteShell variant="inflow">
      <section className="section">
        <div className="container">
          <div className="inner-container-center measure-wide" style={{ paddingBlock: "72px", textAlign: "center" }}>
            <p className="eyebrow">404</p>
            <h1 className="display-8">Page not found</h1>
            <p>That link does not match a page on PETZ. Try one of these instead.</p>
            <div className="button-row is-center-aligned" style={{ marginTop: 24 }}>
              <Link className="button is-primary" href="/">
                <span className="button-hover"></span>
                <span className="button-label">Home</span>
              </Link>
              <Link className="button is-secondary" href="/plans">
                <span className="button-hover"></span>
                <span className="button-label">Plans</span>
              </Link>
              <Link className="button is-secondary" href="/support">
                <span className="button-hover"></span>
                <span className="button-label">Contact</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
