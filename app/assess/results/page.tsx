import type { Metadata } from "next";
import { AssessResultsView } from "@/components/AssessResultsView";
import { SiteShell } from "@/components/SiteShell";
import { getFormUser } from "@/lib/form-user";

export const metadata: Metadata = {
  title: "Your Health Insights — PETZ",
  description: "Personalized PETZ health insights based on your pet's profile.",
};

export default async function AssessResultsPage() {
  const user = await getFormUser();

  return (
    <SiteShell variant="inflow">
      <section className="section">
        <div className="container">
          <div className="assess-results-wrap">
            <AssessResultsView signedIn={user.signedIn} />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
