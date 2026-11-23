export function AdminExportButton({ href, label = "Download Excel" }: { href: string; label?: string }) {
  return (
    <a className="button is-primary" href={href}>
      <span className="button-hover"></span>
      <span className="button-label">{label}</span>
    </a>
  );
}
