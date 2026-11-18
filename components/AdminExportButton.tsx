export function AdminExportButton({ href, label = "Download Excel" }: { href: string; label?: string }) {
  return (
    <a className="button is-primary" href={href}>
      <span className="button-label">{label}</span>
      <span className="button-hover" aria-hidden="true">
        {label}
      </span>
    </a>
  );
}
