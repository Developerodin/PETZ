import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { getWaitlist } from "@/lib/admin-data";
import { formatDisplayDate } from "@/lib/admin-format";
import { getAdminSession } from "@/lib/admin-session";

type Params = Promise<{ id: string }>;

export default async function AdminWaitlistDetailPage({ params }: { params: Params }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const { id } = await params;
  const row = await getWaitlist(id);
  if (!row) notFound();

  return (
    <AdminShell pathname="/admin/waitlist" email={session.email}>
      <Link href="/admin/waitlist" className="admin-back">
        ← Back to waitlist
      </Link>
      <div className="admin-header">
        <div>
          <h1>{row.name || row.email}</h1>
          <p>Waitlist registration</p>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-detail">
          <dl className="admin-detail-grid">
            <div className="admin-detail-item">
              <dt>Name</dt>
              <dd>{row.name || "—"}</dd>
            </div>
            <div className="admin-detail-item">
              <dt>Email</dt>
              <dd>{row.email}</dd>
            </div>
            <div className="admin-detail-item">
              <dt>Country</dt>
              <dd>{row.country || "—"}</dd>
            </div>
            <div className="admin-detail-item">
              <dt>City</dt>
              <dd>{row.city || "—"}</dd>
            </div>
            <div className="admin-detail-item">
              <dt>Pet type</dt>
              <dd>{row.petType || "—"}</dd>
            </div>
            <div className="admin-detail-item">
              <dt>Plan</dt>
              <dd>{row.plan || "—"}</dd>
            </div>
            <div className="admin-detail-item">
              <dt>Created</dt>
              <dd>{formatDisplayDate(row.createdAt)}</dd>
            </div>
            <div className="admin-detail-item">
              <dt>Updated</dt>
              <dd>{formatDisplayDate(row.updatedAt)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </AdminShell>
  );
}
