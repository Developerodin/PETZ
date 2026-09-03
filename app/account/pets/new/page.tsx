import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PetFormWizard } from "@/components/PetFormWizard";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Add a pet — PETZ",
  description: "Create a pet profile for symptom checks and health tools.",
};

export default async function NewPetPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account/pets/new");

  return (
    <SiteShell variant="inflow">
      <section className="section pet-screen">
        <div className="container">
          <div className="account-wrap">
            <Link className="account-back" href="/account">
              ← Back to account
            </Link>
            <div className="pet-card">
              <PetFormWizard mode="create" cancelHref="/account" />
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
