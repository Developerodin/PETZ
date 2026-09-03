"use client";

import { isCompactFooter } from "@/lib/chrome";
import { ASSISTANT_NAME } from "@/lib/assistant";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const compact = isCompactFooter(pathname);
  const legalHref = pathname === "/privacy" ? "/terms" : "/privacy";
  const legalLabel = pathname === "/privacy" ? "Terms" : "Privacy Policy";
  const bottomStyle =
    pathname === "/assess/results"
      ? { borderTop: "none", paddingTop: 0 }
      : compact
        ? { borderTop: "none" }
        : undefined;

  if (compact) {
    return (
      <footer className="footer-wrapper">
        <div className="container">
          <div className="footer-bottom" style={bottomStyle}>
            <span>Copyright © PETZ</span>
            <Link href={legalHref}>{legalLabel}</Link>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-top">
          <div className="footer-top-content">
            <div className="footer-sidebar">
              <Link className="brand" href="/">
                PETZ
              </Link>
              <p className="footer-lede">
                AI-powered preventive pet-health assessment. Understand your pet&apos;s health earlier.
              </p>
            </div>
            <nav className="footer-nav" aria-label="Footer">
              <div>
                <h4>Main</h4>
                <ul>
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <Link href="/how-it-works">How It Works</Link>
                  </li>
                  <li>
                    <Link href="/plans">Plans</Link>
                  </li>
                  <li>
                    <Link href="/science">Science</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4>Learn</h4>
                <ul>
                  <li>
                    <Link href="/blog">Blog</Link>
                  </li>
                  <li>
                    <Link href="/faq">FAQ</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4>Tools</h4>
                <ul>
                  <li>
                    <Link href="/symptom-checker">{ASSISTANT_NAME}</Link>
                  </li>
                  <li>
                    <Link href="/pet-passport">Pet Passport</Link>
                  </li>
                  <li>
                    <Link href="/waitlist">Waitlist</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4>Company</h4>
                <ul>
                  <li>
                    <Link href="/partners">Partners</Link>
                  </li>
                  <li>
                    <Link href="/support">Contact Us</Link>
                  </li>
                  <li>
                    <Link href="/assess">Assess My Pet</Link>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
        <div className="footer-bottom">
          <span>Copyright © PETZ</span>
          <Link href="/privacy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
