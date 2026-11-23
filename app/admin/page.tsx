import Link from "next/link";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { AdminShell } from "@/components/AdminShell";
import { adminCredentialsConfigured } from "@/lib/admin-auth";
import { getAdminCounts } from "@/lib/admin-data";
import { getAdminSession } from "@/lib/admin-session";

export default async function AdminHomePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getAdminSession();
  const params = await searchParams;

  if (!session) {
    return (
      <div className="admin-login-screen">
        <div className="admin-login-wrap">
          <div className="auth-card">
            <div className="auth-card-body">
              <p className="auth-brand">PETZ</p>
              <h1 className="auth-title">Admin sign in</h1>
              <p className="auth-lede">Separate from pet-owner accounts. One admin only.</p>
              {!adminCredentialsConfigured() ? (
                <p className="auth-error" role="alert">
                  Admin login is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD.
                </p>
              ) : (
                <AdminLoginForm error={params.error} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  let counts = { profiles: 0, newsletter: 0, waitlist: 0, contact: 0 };
  try {
    counts = await getAdminCounts();
  } catch (error) {
    console.error("admin counts failed", error);
  }

  const cards = [
    { href: "/admin/profiles", label: "Registered profiles", value: counts.profiles },
    { href: "/admin/newsletter", label: "Newsletter", value: counts.newsletter },
    { href: "/admin/waitlist", label: "Waitlist", value: counts.waitlist },
    { href: "/admin/contact", label: "Contact us", value: counts.contact },
  ];

  return (
    <AdminShell pathname="/admin" email={session.email}>
      <div className="admin-header">
        <div>
          <h1>Overview</h1>
          <p>Read-only views of registered users and form submissions.</p>
        </div>
      </div>
      <div className="admin-stats">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="admin-stat">
            <span className="admin-stat-label">{card.label}</span>
            <span className="admin-stat-value">{card.value}</span>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
