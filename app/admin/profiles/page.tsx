import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminExportButton } from "@/components/AdminExportButton";
import { AdminPagination } from "@/components/AdminPagination";
import { AdminSearchForm } from "@/components/AdminSearchForm";
import { AdminShell } from "@/components/AdminShell";
import { listAdminProfiles } from "@/lib/admin-data";
import { formatDisplayDate, formatSignInMethod } from "@/lib/admin-format";
import { getAdminSession } from "@/lib/admin-session";

type SearchParams = Promise<{ q?: string; page?: string }>;

export default async function AdminProfilesPage({
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
    ReturnType<typeof listAdminProfiles>
  >;
  try {
    data = await listAdminProfiles({ q, page });
  } catch (error) {
    console.error("admin profiles list failed", error);
  }

  return (
    <AdminShell pathname="/admin/profiles" email={session.email}>
      <div className="admin-header">
        <div>
          <h1>Registered profiles</h1>
          <p>Accounts with pets and assessment summary.</p>
        </div>
        <div className="admin-header-actions">
          <AdminExportButton href="/api/admin/export/profiles" />
        </div>
      </div>

      <div className="admin-card">
        <AdminSearchForm action="/admin/profiles" q={q} />
        {data.rows.length === 0 ? (
          <p className="admin-empty">No profiles found.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Sign-in</th>
                  <th>Pets</th>
                  <th>Assessments</th>
                  <th>Latest score</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <Link href={`/admin/profiles/${row.id}`}>{row.name || "—"}</Link>
                    </td>
                    <td>{row.email}</td>
                    <td>{formatSignInMethod(row.signInMethod)}</td>
                    <td>
                      {row.petCount}
                      {row.petsSummary ? (
                        <div className="admin-email">{row.petsSummary}</div>
                      ) : null}
                    </td>
                    <td>{row.assessmentCount}</td>
                    <td>{row.latestScore ?? "—"}</td>
                    <td>{formatDisplayDate(row.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <AdminPagination
          base="/admin/profiles"
          page={data.page}
          total={data.total}
          pageSize={data.pageSize}
          q={q}
        />
      </div>
    </AdminShell>
  );
}
