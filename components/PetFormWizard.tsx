"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  APPETITE,
  BEHAVIOUR,
  ENERGY,
  EXERCISE,
  FOOD_TYPE,
  HUMAN_FOOD,
  LIVING_ENVIRONMENT,
  MEAL_PATTERN,
  MUSCLE_TONE,
  SLEEP,
  TREATS_SHARE,
  WATER_SOURCES,
  WEIGHT_TREND,
} from "@/lib/pet-options";
import { parseDateOfBirth, type PetRecord } from "@/lib/pet-utils";

type Step = "basics" | "lifestyle";

type FormState = {
  name: string;
  species: "dog" | "cat" | "";
  breed: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  dobUnknown: boolean;
  ageYears: string;
  weightKg: string;
  livingEnvironment: string;
  foodType: string;
  foodBrand: string;
  waterSources: string;
  mealPattern: string;
  humanFood: string;
  treatsShare: string;
  exerciseMinsDay: string;
  muscleTone: string;
  energyLevel: string;
  appetite: string;
  sleepQuality: string;
  behaviourMood: string;
  weightTrend: string;
  existingConditions: string;
};

function emptyForm(): FormState {
  return {
    name: "",
    species: "",
    breed: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    dobUnknown: false,
    ageYears: "",
    weightKg: "",
    livingEnvironment: "",
    foodType: "",
    foodBrand: "",
    waterSources: "",
    mealPattern: "",
    humanFood: "",
    treatsShare: "",
    exerciseMinsDay: "",
    muscleTone: "",
    energyLevel: "",
    appetite: "",
    sleepQuality: "",
    behaviourMood: "",
    weightTrend: "",
    existingConditions: "",
  };
}

function fromPet(pet: PetRecord): FormState {
  let dobDay = "";
  let dobMonth = "";
  let dobYear = "";
  if (pet.dateOfBirth) {
    const [y, m, d] = pet.dateOfBirth.split("-");
    dobDay = d || "";
    dobMonth = m || "";
    dobYear = y || "";
  }
  return {
    name: pet.name,
    species: pet.species,
    breed: pet.breed || "",
    dobDay,
    dobMonth,
    dobYear,
    dobUnknown: Boolean(pet.dobEstimated),
    ageYears: pet.ageYears != null ? String(pet.ageYears) : "",
    weightKg: pet.weightKg != null ? String(pet.weightKg) : "",
    livingEnvironment: pet.livingEnvironment || "",
    foodType: pet.foodType || "",
    foodBrand: pet.foodBrand || "",
    waterSources: pet.waterSources || "",
    mealPattern: pet.mealPattern || "",
    humanFood: pet.humanFood || "",
    treatsShare: pet.treatsShare || "",
    exerciseMinsDay: pet.exerciseMinsDay || "",
    muscleTone: pet.muscleTone || "",
    energyLevel: pet.energyLevel || "",
    appetite: pet.appetite || "",
    sleepQuality: pet.sleepQuality || "",
    behaviourMood: pet.behaviourMood || "",
    weightTrend: pet.weightTrend || "",
    existingConditions: pet.existingConditions || "",
  };
}

function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="pet-field">
      <span className="pet-label">{label}</span>
      <div className="pet-chips">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`pet-chip${value === option ? " is-selected" : ""}`}
            onClick={() => onChange(value === option ? "" : option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PetFormWizard({
  mode,
  petId,
  initialPet,
  cancelHref,
  onSaved,
  showLifestyleStep = true,
  startStep = "basics",
  submitBasicsLabel = "Continue",
  submitLifestyleLabel = "Save pet profile",
}: {
  mode: "create" | "edit";
  petId?: string;
  initialPet?: PetRecord;
  cancelHref: string;
  onSaved?: (pet: PetRecord) => void;
  showLifestyleStep?: boolean;
  startStep?: Step;
  submitBasicsLabel?: string;
  submitLifestyleLabel?: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(startStep);
  const [form, setForm] = useState<FormState>(() => (initialPet ? fromPet(initialPet) : emptyForm()));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const petName = form.name.trim() || "your pet";

  const payload = useMemo(() => {
    const dateOfBirth = form.dobUnknown ? null : parseDateOfBirth(form.dobDay, form.dobMonth, form.dobYear);
    return {
      name: form.name.trim(),
      species: form.species,
      breed: form.breed.trim(),
      dateOfBirth,
      dobEstimated: form.dobUnknown,
      ageYears: form.dobUnknown && form.ageYears ? Number(form.ageYears) : undefined,
      weightKg: form.weightKg ? Number(form.weightKg) : null,
      livingEnvironment: form.livingEnvironment,
      foodType: form.foodType,
      foodBrand: form.foodBrand.trim(),
      waterSources: form.waterSources,
      mealPattern: form.mealPattern,
      humanFood: form.humanFood,
      treatsShare: form.treatsShare,
      exerciseMinsDay: form.exerciseMinsDay,
      muscleTone: form.muscleTone,
      energyLevel: form.energyLevel,
      appetite: form.appetite,
      sleepQuality: form.sleepQuality,
      behaviourMood: form.behaviourMood,
      weightTrend: form.weightTrend,
      existingConditions: form.existingConditions.trim(),
    };
  }, [form]);

  function validateBasics() {
    if (!form.name.trim()) return "Enter your pet's name.";
    if (form.species !== "dog" && form.species !== "cat") return "Choose dog or cat.";
    if (!form.dobUnknown) {
      const dob = parseDateOfBirth(form.dobDay, form.dobMonth, form.dobYear);
      if (!dob) return "Enter a valid date of birth or choose Don't know.";
    } else if (!form.ageYears || Number(form.ageYears) < 0) {
      return "Enter an approximate age in years.";
    }
    return "";
  }

  async function savePet() {
    setBusy(true);
    setError("");
    try {
      const url = mode === "edit" && petId ? `/api/pets/${petId}` : "/api/pets";
      const method = mode === "edit" ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { pet?: PetRecord; error?: string };
      if (!res.ok) {
        setError(data.error || "Could not save pet.");
        setBusy(false);
        return null;
      }
      setBusy(false);
      if (onSaved && data.pet) {
        onSaved(data.pet);
        return data.pet;
      }
      return data.pet ?? null;
    } catch {
      setError("Something went wrong. Try again.");
      setBusy(false);
      return null;
    }
  }

  async function handleBasicsSubmit(e: React.FormEvent) {
    e.preventDefault();
    const message = validateBasics();
    if (message) {
      setError(message);
      return;
    }
    if (showLifestyleStep && step === "basics") {
      setError("");
      setStep("lifestyle");
      return;
    }
    const pet = await savePet();
    if (pet && !onSaved) router.push(cancelHref);
  }

  async function handleLifestyleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const pet = await savePet();
    if (pet && !onSaved) router.push(cancelHref);
  }

  return (
    <div className="pet-wizard">
      <div className="pet-wizard-steps" aria-label="Progress">
        <span className={`pet-wizard-step${step === "basics" ? " is-active" : " is-done"}`}>1. Pet</span>
        {showLifestyleStep ? (
          <span className={`pet-wizard-step${step === "lifestyle" ? " is-active" : ""}`}>2. Profile</span>
        ) : null}
      </div>

      {step === "basics" ? (
        <form className="pet-form" onSubmit={handleBasicsSubmit} noValidate>
          <h1 className="display-6">About your pet</h1>
          <p className="pet-lede">Species, name, and age are all we need to start.</p>

          <div className="pet-field">
            <span className="pet-label">Type of pet *</span>
            <div className="species-toggle">
              <button
                type="button"
                className={`species-option${form.species === "dog" ? " is-selected" : ""}`}
                onClick={() => setForm((f) => ({ ...f, species: "dog" }))}
              >
                <span aria-hidden="true">🐕</span>
                Dog
              </button>
              <button
                type="button"
                className={`species-option${form.species === "cat" ? " is-selected" : ""}`}
                onClick={() => setForm((f) => ({ ...f, species: "cat" }))}
              >
                <span aria-hidden="true">🐈</span>
                Cat
              </button>
            </div>
          </div>

          <div className="pet-field">
            <label htmlFor="petName">Pet&apos;s name *</label>
            <input
              id="petName"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Max"
            />
          </div>

          <div className="pet-field">
            <div className="pet-field-head">
              <span className="pet-label">Date of birth *</span>
              <button
                type="button"
                className="pet-link-btn"
                onClick={() => setForm((f) => ({ ...f, dobUnknown: !f.dobUnknown, dobDay: "", dobMonth: "", dobYear: "" }))}
              >
                {form.dobUnknown ? "Enter date" : "Don't know?"}
              </button>
            </div>
            {form.dobUnknown ? (
              <div className="pet-field" style={{ marginTop: 4 }}>
                <label htmlFor="petAgeYears">Approximate age (years)</label>
                <input
                  id="petAgeYears"
                  inputMode="numeric"
                  placeholder="e.g. 3"
                  value={form.ageYears}
                  onChange={(e) => setForm((f) => ({ ...f, ageYears: e.target.value }))}
                />
              </div>
            ) : (
              <div className="pet-dob-row">
                <input
                  inputMode="numeric"
                  placeholder="Day"
                  value={form.dobDay}
                  onChange={(e) => setForm((f) => ({ ...f, dobDay: e.target.value }))}
                />
                <input
                  inputMode="numeric"
                  placeholder="Month"
                  value={form.dobMonth}
                  onChange={(e) => setForm((f) => ({ ...f, dobMonth: e.target.value }))}
                />
                <input
                  inputMode="numeric"
                  placeholder="Year"
                  value={form.dobYear}
                  onChange={(e) => setForm((f) => ({ ...f, dobYear: e.target.value }))}
                />
              </div>
            )}
          </div>

          <div className="pet-field">
            <label htmlFor="petBreed">Breed (optional)</label>
            <input
              id="petBreed"
              value={form.breed}
              onChange={(e) => setForm((f) => ({ ...f, breed: e.target.value }))}
              placeholder="e.g. Labrador"
            />
          </div>

          <div className="pet-field">
            <label htmlFor="petWeight">Weight (kg, optional)</label>
            <input
              id="petWeight"
              inputMode="decimal"
              placeholder="e.g. 12.5"
              value={form.weightKg}
              onChange={(e) => setForm((f) => ({ ...f, weightKg: e.target.value }))}
            />
          </div>

          {error ? <p className="auth-error">{error}</p> : null}

          <div className="pet-form-actions">
            <Link className="button is-secondary" href={cancelHref}>
              <span className="button-hover"></span>
              <span className="button-label">Back</span>
            </Link>
            <button className="button is-primary pet-continue" type="submit" disabled={busy}>
              <span className="button-hover"></span>
              <span className="button-label">{busy ? "Saving…" : submitBasicsLabel}</span>
            </button>
          </div>
        </form>
      ) : (
        <form className="pet-form" onSubmit={handleLifestyleSubmit} noValidate>
          <p className="pet-badge">Personalised check — optional</p>
          <h1 className="display-6">Help us know {petName} better</h1>
          <p className="pet-lede">
            The more we know, the more accurate the symptom check. Every field is optional — skip anything you
            don&apos;t know.
          </p>

          <ChipGroup
            label="Living environment"
            options={LIVING_ENVIRONMENT}
            value={form.livingEnvironment}
            onChange={(value) => setForm((f) => ({ ...f, livingEnvironment: value }))}
          />
          <ChipGroup
            label="Primary food type"
            options={FOOD_TYPE}
            value={form.foodType}
            onChange={(value) => setForm((f) => ({ ...f, foodType: value }))}
          />
          <div className="pet-field">
            <label htmlFor="foodBrand">Food brand (optional)</label>
            <input
              id="foodBrand"
              value={form.foodBrand}
              onChange={(e) => setForm((f) => ({ ...f, foodBrand: e.target.value }))}
              placeholder="e.g. Royal Canin, Acana..."
            />
          </div>
          <ChipGroup
            label="Water sources"
            options={WATER_SOURCES}
            value={form.waterSources}
            onChange={(value) => setForm((f) => ({ ...f, waterSources: value }))}
          />
          <ChipGroup
            label="Meal pattern"
            options={MEAL_PATTERN}
            value={form.mealPattern}
            onChange={(value) => setForm((f) => ({ ...f, mealPattern: value }))}
          />
          <ChipGroup
            label="Human food / table scraps"
            options={HUMAN_FOOD}
            value={form.humanFood}
            onChange={(value) => setForm((f) => ({ ...f, humanFood: value }))}
          />
          <ChipGroup
            label="Treats (share of daily food)"
            options={TREATS_SHARE}
            value={form.treatsShare}
            onChange={(value) => setForm((f) => ({ ...f, treatsShare: value }))}
          />
          <ChipGroup
            label="Daily exercise"
            options={EXERCISE}
            value={form.exerciseMinsDay}
            onChange={(value) => setForm((f) => ({ ...f, exerciseMinsDay: value }))}
          />
          <ChipGroup
            label="Muscle tone (how they look & feel)"
            options={MUSCLE_TONE}
            value={form.muscleTone}
            onChange={(value) => setForm((f) => ({ ...f, muscleTone: value }))}
          />
          <ChipGroup
            label="Typical energy"
            options={ENERGY}
            value={form.energyLevel}
            onChange={(value) => setForm((f) => ({ ...f, energyLevel: value }))}
          />
          <ChipGroup
            label="Weight trend (last 12 months)"
            options={WEIGHT_TREND}
            value={form.weightTrend}
            onChange={(value) => setForm((f) => ({ ...f, weightTrend: value }))}
          />
          <ChipGroup
            label="Appetite"
            options={APPETITE}
            value={form.appetite}
            onChange={(value) => setForm((f) => ({ ...f, appetite: value }))}
          />
          <ChipGroup
            label="Sleep"
            options={SLEEP}
            value={form.sleepQuality}
            onChange={(value) => setForm((f) => ({ ...f, sleepQuality: value }))}
          />
          <ChipGroup
            label="Behaviour at home"
            options={BEHAVIOUR}
            value={form.behaviourMood}
            onChange={(value) => setForm((f) => ({ ...f, behaviourMood: value }))}
          />
          <div className="pet-field">
            <label htmlFor="existingConditions">Existing conditions or past issues (optional)</label>
            <textarea
              id="existingConditions"
              rows={3}
              value={form.existingConditions}
              onChange={(e) => setForm((f) => ({ ...f, existingConditions: e.target.value }))}
              placeholder="e.g. early arthritis, sensitive stomach"
            />
          </div>

          {error ? <p className="auth-error">{error}</p> : null}

          <div className="pet-form-actions">
            <button className="button is-secondary" type="button" onClick={() => setStep("basics")} disabled={busy}>
              <span className="button-hover"></span>
              <span className="button-label">Back</span>
            </button>
            <button className="button is-primary pet-continue" type="submit" disabled={busy}>
              <span className="button-hover"></span>
              <span className="button-label">{busy ? "Saving…" : submitLifestyleLabel}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
