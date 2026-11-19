"use client";

import { ASSISTANT_NAME } from "@/lib/assistant";
import { getNavMode } from "@/lib/chrome";
import { HeaderAuth } from "@/components/HeaderAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type NavItem = { href: string; label: string; mobileOnly?: boolean };

const FULL_NAV: NavItem[] = [
  { href: "/plans", label: "Plans" },
  { href: "/how-it-works", label: "How It Works", mobileOnly: true },
  { href: "/science", label: "Science" },
  { href: "/blog", label: "Blog", mobileOnly: true },
  { href: "/faq", label: "FAQ", mobileOnly: true },
  { href: "/partners", label: "Partners" },
  { href: "/symptom-checker", label: `Ask ${ASSISTANT_NAME} (AI)` },
  { href: "/support", label: "Contact", mobileOnly: true },
];

const BLOG_NAV: NavItem[] = [
  { href: "/assess", label: "Assess My Pet" },
];

const PRIVACY_NAV: NavItem[] = [];

const TERMS_NAV: NavItem[] = [
  { href: "/privacy", label: "Privacy" },
];

export function Header({ variant }: { variant: "overlay" | "inflow" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const navMode = getNavMode(pathname);
  const links =
    navMode === "blog" ? BLOG_NAV : navMode === "privacy" ? PRIVACY_NAV : navMode === "terms" ? TERMS_NAV : FULL_NAV;
  const showCta = navMode === "full";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    function onPointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node | null;
      if (!target || !headerRef.current) return;
      if (!headerRef.current.contains(target)) setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const assessCta = showCta ? (
    <Link className="button is-primary header-assess-cta" href="/assess">
      <span className="button-hover"></span>
      <span className="button-label">Assess My Pet</span>
    </Link>
  ) : null;

  const header = (
    <header
      ref={headerRef}
      className={`header-component${variant === "inflow" ? " header-inflow" : ""}`}
    >
      <div className="container">
        <div className="header-container">
          <Link className="brand" href="/">
            PETZ
          </Link>
          {showCta ? <div className="header-cta-mobile">{assessCta}</div> : null}
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
                <li
                  key={`${item.href}-${item.label}`}
                  className={item.mobileOnly ? "nav-mobile-only" : undefined}
                >
                  <Link className={isActive(item.href) ? "is-active" : undefined} href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <HeaderAuth />
            {assessCta}
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
