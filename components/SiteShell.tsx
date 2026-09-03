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
      <Header variant={variant} />
      {children}
      <Footer />
      <PageEffects />
    </div>
  );
}
