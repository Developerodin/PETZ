import { SiteShell } from "@/components/SiteShell";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell variant="inflow">{children}</SiteShell>;
}
