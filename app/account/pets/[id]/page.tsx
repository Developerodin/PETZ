import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PetFormWizard } from "@/components/PetFormWizard";
import { SiteShell } from "@/components/SiteShell";
import { connectDb } from "@/lib/mongoose";
import { serializePet } from "@/lib/pet-utils";
import { Pet } from "@/models/Pet";
import { Types } from "mongoose";

export const metadata: Metadata = {
  title: "Edit pet — PETZ",
  description: "Update your pet profile.",
};

export default async function EditPetPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account");

  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) redirect("/account");

  await connectDb();
  const petDoc = await Pet.findOne({ _id: id, userId: session.user.id }).lean();
  if (!petDoc) redirect("/account");

  const pet = serializePet(petDoc);

  return (
    <SiteShell variant="inflow">
      <section className="section pet-screen">
        <div className="container">
          <div className="account-wrap">
            <Link className="account-back" href="/account">
              ← Back to account
            </Link>
            <div className="pet-card">
              <PetFormWizard mode="edit" petId={pet.id} initialPet={pet} cancelHref="/account" />
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
