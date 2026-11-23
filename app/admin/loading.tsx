export default function AdminLoading() {
  return (
    <div className="admin-login-screen">
      <div className="admin-loading" role="status" aria-live="polite">
        <span className="admin-spinner" aria-hidden="true" />
        <p>Loading…</p>
      </div>
    </div>
  );
}
