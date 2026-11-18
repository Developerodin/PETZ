import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminExportButton } from "@/components/AdminExportButton";
import { AdminPagination } from "@/components/AdminPagination";
import { AdminSearchForm } from "@/components/AdminSearchForm";
import { AdminShell } from "@/components/AdminShell";
import { listContact } from "@/lib/admin-data";
import { formatDisplayDate } from "@/lib/admin-format";
import { getAdminSession } from "@/lib/admin-session";

type SearchParams = Promise<{ q?: string; page?: string }>;

export default async function AdminContactPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const params = await searchParams;
  const q = String(params.q || "").trim();
  const page = Math.max(1, Number(params.page) || 1);

  let data = { rows: [], total: 0, page, pageSize: 25 } as Awaited<
    ReturnType<typeof listContact>
  >;
  try {
    data = await listContact({ q, page });
  } catch (error) {
    console.error("admin contact list failed", error);
  }

  return (
    <AdminShell pathname="/admin/contact" email={session.email}>
      <div className="admin-header">
        <div>
          <h1>Contact us</h1>
          <p>Support form responses.</p>
        </div>
        <div className="admin-header-actions">
          <AdminExportButton href="/api/admin/export/contact" />
        </div>
      </div>

      <div className="admin-card">
        <AdminSearchForm action="/admin/contact" q={q} />
        {data.rows.length === 0 ? (
          <p className="admin-empty">No contact messages found.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>Subject</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <Link href={`/admin/contact/${row.id}`}>
                        {[row.firstName, row.lastName].filter(Boolean).join(" ") || "—"}
                      </Link>
                    </td>
                    <td>{row.email}</td>
                    <td>{row.city || "—"}</td>
                    <td>{row.subject || "—"}</td>
                    <td>{formatDisplayDate(row.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <AdminPagination
          base="/admin/contact"
          page={data.page}
          total={data.total}
          pageSize={data.pageSize}
          q={q}
        />
      </div>
    </AdminShell>
  );
}
