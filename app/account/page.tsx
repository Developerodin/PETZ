import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AccountPets } from "@/components/AccountPets";
import { SignOutButton } from "@/components/SignOutButton";
import { SiteShell } from "@/components/SiteShell";
import { UserAvatar } from "@/components/UserAvatar";
import clientPromise from "@/lib/mongodb-client";
import { connectDb } from "@/lib/mongoose";
import { formatMemberSince } from "@/lib/user-display";
import { petCompleteness, serializePet } from "@/lib/pet-utils";
import { Assessment } from "@/models/Assessment";
import { ChatSession } from "@/models/ChatSession";
import { Pet } from "@/models/Pet";

export const metadata: Metadata = {
  title: "My Account — PETZ",
  description: "Your PETZ account — pet profiles and assessment history.",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  await connectDb();
  const [pets, assessments, symptomChecks, memberSince] = await Promise.all([
    Pet.find({ userId: session.user.id }).sort({ updatedAt: -1 }).lean(),
    Assessment.find({ userId: session.user.id }).sort({ createdAt: -1 }).limit(20).lean(),
    ChatSession.countDocuments({ userId: session.user.id }),
    (async () => {
      try {
        const client = await clientPromise;
        const doc = await client.db().collection("users").findOne({ email: session.user.email });
        return formatMemberSince(doc?._id?.getTimestamp?.() ?? null);
      } catch {
        return "";
      }
    })(),
  ]);

  const petItems = pets.map((pet) => {
    const record = serializePet(pet);
    return {
      id: record.id,
      name: record.name,
      species: record.species,
      breed: record.breed,
      dateOfBirth: record.dateOfBirth,
      dobEstimated: record.dobEstimated,
      ageYears: record.ageYears,
      completeness: petCompleteness(record),
    };
  });

  return (
    <SiteShell variant="inflow">
      <section className="section account-screen">
        <div className="container">
          <div className="account-wrap">
          <Link className="account-back" href="/">
            ← Back to home
          </Link>

          <div className="account-card account-profile">
            <UserAvatar
              className="account-profile-avatar"
              name={session.user.name}
              email={session.user.email}
              image={session.user.image}
              size={64}
            />
            <div>
              <h1>{session.user.name || "PETZ member"}</h1>
              <p className="account-email">{session.user.email}</p>
              {memberSince ? <p className="account-member">Member since {memberSince}</p> : null}
              <SignOutButton />
            </div>
          </div>

          <div className="account-stats">
            <div className="account-card account-stat">
              <span className="account-stat-icon" aria-hidden="true">
                ⌕
              </span>
              <strong>{symptomChecks}</strong>
              <span>Symptom checks</span>
            </div>
            <div className="account-card account-stat">
              <span className="account-stat-icon" aria-hidden="true">
                ♡
              </span>
              <strong>{assessments.length}</strong>
              <span>Health assessments</span>
            </div>
          </div>

          <AccountPets pets={petItems} />

          <nav className="account-links" aria-label="Account tools">
            <Link className="account-card account-link" href="/symptom-checker">
              <span>Symptom Checker</span>
              <span aria-hidden="true">›</span>
            </Link>
            <Link className="account-card account-link" href="/assess">
              <span>Health assessment</span>
              <span aria-hidden="true">›</span>
            </Link>
            <Link className="account-card account-link account-link-wide" href="/faq">
              <span>Health check notice &amp; emergency guidance</span>
              <span aria-hidden="true">›</span>
            </Link>
          </nav>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
