import type { Metadata } from "next";
import { Suspense } from "react";
import { auth } from "@/auth";
import { SiteShell } from "@/components/SiteShell";
import { SymptomCheckerFlow } from "@/components/SymptomCheckerFlow";
import { getSavedPets } from "@/lib/saved-pets";

export const metadata: Metadata = {
  title: "Symptom Checker — PETZ",
  description: "AI-assisted symptom checker for urgency guidance. Not a diagnosis.",
};

export default async function SymptomCheckerPage() {
  const session = await auth();
  const signedIn = Boolean(session?.user);
  const initialPets = signedIn ? await getSavedPets() : [];

  return (
    <SiteShell variant="inflow">
      <section className="section sc-screen">
        <div className="container">
          <Suspense fallback={<p>Loading the symptom checker…</p>}>
            <SymptomCheckerFlow signedIn={signedIn} initialPets={initialPets} petsPreloaded={signedIn} />
          </Suspense>
        </div>
      </section>
    </SiteShell>
  );
}
