import type { Metadata } from "next";
import { PlansView } from "@/components/PlansView";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Plans & Pricing — PETZ",
  description:
    "Exclusive launch plans in India, priced in INR. Free and PETZ Care — monthly or annual.",
};

export default function PlansPage() {
  return (
    <SiteShell variant="overlay">
      <PlansView />
    </SiteShell>
  );
}
