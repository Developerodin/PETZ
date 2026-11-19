import { Footer } from "./Footer";
import { Header } from "./Header";
import { PageEffects } from "./PageEffects";

export function SiteShell({
  variant,
  children,
}: {
  variant: "overlay" | "inflow";
  children: React.ReactNode;
}) {
  return (
    <div className="page-wrapper">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <Header variant={variant} />
      <main id="content">{children}</main>
      <Footer />
      <PageEffects />
    </div>
  );
}
