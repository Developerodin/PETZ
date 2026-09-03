import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import { auth } from "@/auth";
import { AccountPets } from "@/components/AccountPets";
import { SignOutButton } from "@/components/SignOutButton";
import { UserAvatar } from "@/components/UserAvatar";
import clientPromise, { getMongoDbName } from "@/lib/mongodb-client";
import { connectDb } from "@/lib/mongoose";
import { formatMemberSince } from "@/lib/user-display";
import { petCompleteness, serializePet } from "@/lib/pet-utils";
import { Assessment } from "@/models/Assessment";
import { ChatSession } from "@/models/ChatSession";
import { Pet } from "@/models/Pet";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Account — PETZ",
  description: "Your PETZ account — pet profiles and assessment history.",
};

async function loadAccountData(userId: string, email?: string | null) {
  await connectDb();
  const [pets, assessments, symptomChecks, memberSince] = await Promise.all([
    Pet.find({ userId }).sort({ updatedAt: -1 }).lean(),
    Assessment.find({ userId }).sort({ createdAt: -1 }).limit(20).lean(),
    ChatSession.countDocuments({ userId }),
    (async () => {
      try {
        const client = await clientPromise;
        const doc = await client.db(getMongoDbName()).collection("users").findOne({ email: email || "" });
        return formatMemberSince(doc?._id?.getTimestamp?.() ?? null);
      } catch {
        return "";
      }
    })(),
  ]);

  return {
    pets: pets.map((pet) => {
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
    }),
    assessments,
    symptomChecks,
    memberSince,
  };
}

function isNextControlFlowError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest: unknown }).digest === "string" &&
    ((error as { digest: string }).digest.startsWith("NEXT_REDIRECT") ||
      (error as { digest: string }).digest.startsWith("NEXT_NOT_FOUND"))
  );
}

function AccountLoadMessage() {
  return (
    <p className="account-load-error">
      We couldn&apos;t load your account just now.{" "}
      <a href="/account">Refresh</a> to try again.
    </p>
  );
}

export default async function AccountPage() {
  let session: Session | null = null;
  try {
    session = await auth();
  } catch (error) {
    if (isNextControlFlowError(error)) throw error;
    console.error("account auth failed", error);
    return (
      <section className="section account-screen">
        <div className="container">
          <div className="account-wrap">
            <AccountLoadMessage />
          </div>
        </div>
      </section>
    );
  }

  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  let petItems: Awaited<ReturnType<typeof loadAccountData>>["pets"] = [];
  let assessmentCount = 0;
  let symptomChecks = 0;
  let memberSince = "";
  let loadError = false;

  try {
    const data = await loadAccountData(session.user.id, session.user.email);
    petItems = data.pets;
    assessmentCount = data.assessments.length;
    symptomChecks = data.symptomChecks;
    memberSince = data.memberSince;
  } catch (error) {
    console.error("account data load failed", error);
    loadError = true;
  }

  return (
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

          {loadError ? <AccountLoadMessage /> : null}

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
              <strong>{assessmentCount}</strong>
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
  );
}
