import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { getAdminProfile } from "@/lib/admin-data";
import { formatDisplayDate, formatSignInMethod } from "@/lib/admin-format";
import { getAdminSession } from "@/lib/admin-session";

type Params = Promise<{ id: string }>;

export default async function AdminProfileDetailPage({ params }: { params: Params }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const { id } = await params;
  const profile = await getAdminProfile(id);
  if (!profile) notFound();

  return (
    <AdminShell pathname="/admin/profiles" email={session.email}>
      <Link href="/admin/profiles" className="admin-back">
        ← Back to profiles
      </Link>
      <div className="admin-header">
        <div>
          <h1>{profile.name || profile.email}</h1>
          <p>{profile.email}</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-detail">
          <dl className="admin-detail-grid">
            <div className="admin-detail-item">
              <dt>Sign-in method</dt>
              <dd>{formatSignInMethod(profile.signInMethod)}</dd>
            </div>
            <div className="admin-detail-item">
              <dt>Email verified</dt>
              <dd>{formatDisplayDate(profile.emailVerified)}</dd>
            </div>
            <div className="admin-detail-item">
              <dt>Created</dt>
              <dd>{formatDisplayDate(profile.createdAt)}</dd>
            </div>
            <div className="admin-detail-item">
              <dt>Latest score</dt>
              <dd>{profile.latestScore ?? "—"}</dd>
            </div>
          </dl>
        </div>

        <section className="admin-section">
          <h2>Pets ({profile.pets.length})</h2>
          {profile.pets.length === 0 ? (
            <p className="admin-empty">No pets on this account.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Species</th>
                    <th>Breed</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.pets.map((pet) => (
                    <tr key={pet.id}>
                      <td>{pet.name || "—"}</td>
                      <td>{pet.species || "—"}</td>
                      <td>{pet.breed || "—"}</td>
                      <td>{formatDisplayDate(pet.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="admin-section">
          <h2>Assessments ({profile.assessments.length})</h2>
          {profile.assessments.length === 0 ? (
            <p className="admin-empty">No assessments on this account.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Pet</th>
                    <th>Species</th>
                    <th>Score</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.assessments.map((row) => (
                    <tr key={row.id}>
                      <td>{row.petName || "—"}</td>
                      <td>{row.species || "—"}</td>
                      <td>{row.score}</td>
                      <td>{formatDisplayDate(row.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
