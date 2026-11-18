export function AdminSearchForm({
  action,
  q = "",
  status,
  showStatus = false,
}: {
  action: string;
  q?: string;
  status?: string;
  showStatus?: boolean;
}) {
  return (
    <form className="admin-toolbar" action={action} method="get">
      <div className="form-field admin-search-field">
        <label htmlFor="admin-q" className="visually-hidden">
          Search
        </label>
        <input
          id="admin-q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Search…"
        />
      </div>
      {showStatus ? (
        <div className="form-field admin-filter-field">
          <label htmlFor="admin-status" className="visually-hidden">
            Status
          </label>
          <select id="admin-status" name="status" defaultValue={status || ""}>
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="subscribed">Subscribed</option>
          </select>
        </div>
      ) : null}
      <button className="button is-secondary" type="submit">
        <span className="button-label">Search</span>
        <span className="button-hover" aria-hidden="true">
          Search
        </span>
      </button>
    </form>
  );
}
