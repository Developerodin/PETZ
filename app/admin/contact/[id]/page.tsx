import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { getContact } from "@/lib/admin-data";
import { formatDisplayDate } from "@/lib/admin-format";
import { getAdminSession } from "@/lib/admin-session";

type Params = Promise<{ id: string }>;

export default async function AdminContactDetailPage({ params }: { params: Params }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const { id } = await params;
  const row = await getContact(id);
  if (!row) notFound();

  const fullName = [row.firstName, row.lastName].filter(Boolean).join(" ") || row.email;

  return (
    <AdminShell pathname="/admin/contact" email={session.email}>
      <Link href="/admin/contact" className="admin-back">
        ← Back to contact
      </Link>
      <div className="admin-header">
        <div>
          <h1>{fullName}</h1>
          <p>{row.subject || "Contact message"}</p>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-detail">
          <dl className="admin-detail-grid">
            <div className="admin-detail-item">
              <dt>First name</dt>
              <dd>{row.firstName || "—"}</dd>
            </div>
            <div className="admin-detail-item">
              <dt>Last name</dt>
              <dd>{row.lastName || "—"}</dd>
            </div>
            <div className="admin-detail-item">
              <dt>Email</dt>
              <dd>{row.email}</dd>
            </div>
            <div className="admin-detail-item">
              <dt>Phone</dt>
              <dd>{row.phone || "—"}</dd>
            </div>
            <div className="admin-detail-item">
              <dt>City</dt>
              <dd>{row.city || "—"}</dd>
            </div>
            <div className="admin-detail-item">
              <dt>Created</dt>
              <dd>{formatDisplayDate(row.createdAt)}</dd>
            </div>
            <div className="admin-detail-item is-full">
              <dt>Subject</dt>
              <dd>{row.subject || "—"}</dd>
            </div>
            <div className="admin-detail-item is-full">
              <dt>Message</dt>
              <dd className="admin-detail-message">{row.message || "—"}</dd>
            </div>
          </dl>
        </div>
      </div>
    </AdminShell>
  );
}
