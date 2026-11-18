import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { getNewsletter } from "@/lib/admin-data";
import { formatDisplayDate } from "@/lib/admin-format";
import { getAdminSession } from "@/lib/admin-session";

type Params = Promise<{ id: string }>;

export default async function AdminNewsletterDetailPage({ params }: { params: Params }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const { id } = await params;
  const row = await getNewsletter(id);
  if (!row) notFound();

  return (
    <AdminShell pathname="/admin/newsletter" email={session.email}>
      <Link href="/admin/newsletter" className="admin-back">
        ← Back to newsletter
      </Link>
      <div className="admin-header">
        <div>
          <h1>{row.email}</h1>
          <p>Newsletter registration</p>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-detail">
          <dl className="admin-detail-grid">
            <div className="admin-detail-item">
              <dt>Email</dt>
              <dd>{row.email}</dd>
            </div>
            <div className="admin-detail-item">
              <dt>Status</dt>
              <dd>{row.status}</dd>
            </div>
            <div className="admin-detail-item">
              <dt>Consented</dt>
              <dd>{formatDisplayDate(row.consentedAt)}</dd>
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
