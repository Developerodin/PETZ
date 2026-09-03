import type { Metadata } from "next";
import { PlansView } from "@/components/PlansView";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Plans & Pricing — PETZ",
  description:
    "Exclusive launch plans in INR. PETZ Digital and Longevity+ monthly or annual, plus UAE clinical care programs.",
};

export default function PlansPage() {
  return (
    <SiteShell variant="overlay">
      <PlansView />
    </SiteShell>
  );
}
