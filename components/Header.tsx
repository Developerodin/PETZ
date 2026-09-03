"use client";

import { getNavMode } from "@/lib/chrome";
import { HeaderAuth } from "@/components/HeaderAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const FULL_NAV = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/plans", label: "Plans" },
  { href: "/science", label: "Science" },
  { href: "/partners", label: "Partners" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/symptom-checker", label: "PETZ's AI" },
];

const BLOG_NAV = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/assess", label: "Assess My Pet" },
];

const PRIVACY_NAV = [
  { href: "/", label: "Home" },
  { href: "/faq", label: "FAQ" },
];

const TERMS_NAV = [
  { href: "/", label: "Home" },
  { href: "/privacy", label: "Privacy" },
];

export function Header({ variant }: { variant: "overlay" | "inflow" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const navMode = getNavMode(pathname);
  const links =
    navMode === "blog" ? BLOG_NAV : navMode === "privacy" ? PRIVACY_NAV : navMode === "terms" ? TERMS_NAV : FULL_NAV;
  const showCta = navMode === "full";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const header = (
    <header className={`header-component${variant === "inflow" ? " header-inflow" : ""}`}>
      <div className="container">
        <div className="header-container">
          <Link className="brand" href="/">
            PETZ
          </Link>
          <div className="header-auth-mobile">
            <HeaderAuth compact />
          </div>
          <button
            className={`header-menu-box${open ? " is-open" : ""}`}
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span></span>
            <span></span>
          </button>
          <div className={`header-end header-collapse${open ? " show" : ""}`} id="mainNav">
            <ul className="nav-links">
              {links.map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <Link className={isActive(item.href) ? "is-active" : undefined} href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <HeaderAuth />
            {showCta ? (
              <Link className="button is-primary" href="/assess">
                <span className="button-hover"></span>
                <span className="button-label">Assess My Pet</span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );

  if (variant === "overlay") {
    return <div className="section-frame absolute-nav">{header}</div>;
  }

  return header;
}
