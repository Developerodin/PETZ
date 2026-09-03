"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatPetAge } from "@/lib/pet-utils";

type PetItem = {
  id: string;
  name: string;
  species: string;
  breed?: string;
  dateOfBirth?: string | null;
  dobEstimated?: boolean;
  ageYears?: number;
  completeness: number;
};

function petMeta(pet: PetItem) {
  const bits = [pet.species === "dog" ? "Dog" : "Cat"];
  const age = formatPetAge(pet);
  if (age) bits.push(age);
  else if (pet.ageYears != null) bits.push(`${pet.ageYears}yr`);
  if (pet.breed) bits.push(pet.breed);
  return bits.join(" · ");
}

export function AccountPets({ pets }: { pets: PetItem[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function removePet(id: string, name: string) {
    if (!confirm(`Remove ${name} from your account?`)) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/pets/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not remove pet.");
      router.refresh();
    } catch {
      setBusyId(null);
    }
  }

  return (
    <section className="account-block">
      <div className="account-block-head">
        <h2>My pets</h2>
        <Link className="account-add-pet" href="/account/pets/new">
          + Add a pet
        </Link>
      </div>

      {pets.length === 0 ? (
        <div className="account-card account-empty">
          <p>No saved pets yet. Add a profile to use the symptom checker with your pet&apos;s details on file.</p>
          <Link className="button is-primary" href="/account/pets/new">
            <span className="button-hover"></span>
            <span className="button-label">Add a pet</span>
          </Link>
        </div>
      ) : (
        <ul className="account-pet-list">
          {pets.map((pet) => (
            <li key={pet.id} className="account-card account-pet">
              <div className="account-pet-main">
                <span className={`account-pet-glyph is-${pet.species}`} aria-hidden="true">
                  {pet.species === "dog" ? "🐕" : "🐈"}
                </span>
                <div>
                  <strong>{pet.name}</strong>
                  <span>{petMeta(pet)}</span>
                </div>
                <div className="account-pet-actions">
                  <Link href={`/symptom-checker?petId=${pet.id}`} aria-label={`Check symptoms for ${pet.name}`}>
                    Check
                  </Link>
                  <Link href={`/account/pets/${pet.id}`} aria-label={`Edit ${pet.name}`}>
                    Edit
                  </Link>
                  <button
                    type="button"
                    disabled={busyId === pet.id}
                    onClick={() => removePet(pet.id, pet.name)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="account-pet-progress">
                <span className="account-pet-bar" aria-hidden="true">
                  <span style={{ width: `${pet.completeness}%` }} />
                </span>
                <span>{pet.completeness}% profile</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
