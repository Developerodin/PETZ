import Link from "next/link";
import { buildPageHref, totalPages } from "@/lib/admin-format";

export function AdminPagination({
  base,
  page,
  total,
  pageSize,
  q,
  status,
}: {
  base: string;
  page: number;
  total: number;
  pageSize: number;
  q?: string;
  status?: string;
}) {
  const pages = totalPages(total, pageSize);
  if (pages <= 1) return null;

  const prev = page > 1 ? page - 1 : null;
  const next = page < pages ? page + 1 : null;

  return (
    <div className="admin-pagination">
      <span className="admin-pagination-meta">
        Page {page} of {pages} · {total} total
      </span>
      <div className="admin-pagination-links">
        {prev ? (
          <Link
            className="admin-page-link"
            href={buildPageHref(base, { q, status, page: prev })}
          >
            Previous
          </Link>
        ) : (
          <span className="admin-page-link is-disabled">Previous</span>
        )}
        {next ? (
          <Link
            className="admin-page-link"
            href={buildPageHref(base, { q, status, page: next })}
          >
            Next
          </Link>
        ) : (
          <span className="admin-page-link is-disabled">Next</span>
        )}
      </div>
    </div>
  );
}
