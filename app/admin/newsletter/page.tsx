import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminExportButton } from "@/components/AdminExportButton";
import { AdminPagination } from "@/components/AdminPagination";
import { AdminSearchForm } from "@/components/AdminSearchForm";
import { AdminShell } from "@/components/AdminShell";
import { listNewsletter } from "@/lib/admin-data";
import { formatDisplayDate } from "@/lib/admin-format";
import { getAdminSession } from "@/lib/admin-session";

type SearchParams = Promise<{ q?: string; status?: string; page?: string }>;

export default async function AdminNewsletterPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const params = await searchParams;
  const q = String(params.q || "").trim();
  const status = String(params.status || "").trim();
  const page = Math.max(1, Number(params.page) || 1);

  let data = { rows: [], total: 0, page, pageSize: 25 } as Awaited<
    ReturnType<typeof listNewsletter>
  >;
  try {
    data = await listNewsletter({ q, status, page });
  } catch (error) {
    console.error("admin newsletter list failed", error);
  }

  return (
    <AdminShell pathname="/admin/newsletter" email={session.email}>
      <div className="admin-header">
        <div>
          <h1>Newsletter</h1>
          <p>Email subscribers and confirmation status.</p>
        </div>
        <div className="admin-header-actions">
          <AdminExportButton href="/api/admin/export/newsletter" />
        </div>
      </div>

      <div className="admin-card">
        <AdminSearchForm action="/admin/newsletter" q={q} status={status} showStatus />
        {data.rows.length === 0 ? (
          <p className="admin-empty">No newsletter registrations found.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Consented</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <Link href={`/admin/newsletter/${row.id}`}>{row.email}</Link>
                    </td>
                    <td>{row.status}</td>
                    <td>{formatDisplayDate(row.consentedAt)}</td>
                    <td>{formatDisplayDate(row.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <AdminPagination
          base="/admin/newsletter"
          page={data.page}
          total={data.total}
          pageSize={data.pageSize}
          q={q}
          status={status}
        />
      </div>
    </AdminShell>
  );
}
