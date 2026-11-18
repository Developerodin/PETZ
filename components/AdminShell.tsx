import Link from "next/link";
import { AdminSignOutButton } from "@/components/AdminSignOutButton";

const NAV: Array<{ href: string; label: string; exact?: boolean }> = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/profiles", label: "Profiles" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/waitlist", label: "Waitlist" },
  { href: "/admin/contact", label: "Contact" },
];

export function AdminShell({
  children,
  pathname,
  email,
}: {
  children: React.ReactNode;
  pathname: string;
  email: string;
}) {
  return (
    <div className="admin-screen">
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <Link href="/admin" className="admin-brand">
            PETZ Admin
          </Link>
          <nav className="admin-nav" aria-label="Admin">
            {NAV.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-link${active ? " is-active" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="admin-topbar-meta">
            <span className="admin-email">{email}</span>
            <AdminSignOutButton />
          </div>
        </div>
      </header>
      <main className="admin-main">
        <div className="admin-wrap">{children}</div>
      </main>
    </div>
  );
}
