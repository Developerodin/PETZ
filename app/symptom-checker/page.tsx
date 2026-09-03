import type { Metadata } from "next";
import { Suspense } from "react";
import { auth } from "@/auth";
import { SiteShell } from "@/components/SiteShell";
import { SymptomCheckerFlow } from "@/components/SymptomCheckerFlow";

export const metadata: Metadata = {
  title: "Symptom Checker — PETZ",
  description: "AI-assisted symptom checker for urgency guidance. Not a diagnosis.",
};

export default async function SymptomCheckerPage() {
  const session = await auth();

  return (
    <SiteShell variant="inflow">
      <section className="section sc-screen">
        <div className="container">
          <Suspense fallback={<p>Loading the symptom checker…</p>}>
            <SymptomCheckerFlow signedIn={Boolean(session?.user)} />
          </Suspense>
        </div>
      </section>
    </SiteShell>
  );
}
