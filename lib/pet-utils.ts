export const MAX_PETS = 8;

export type PetSpecies = "dog" | "cat";

export type PetProfileInput = {
  name?: string;
  species?: PetSpecies;
  breed?: string;
  dateOfBirth?: string | null;
  dobEstimated?: boolean;
  ageYears?: number | null;
  weightKg?: number | null;
  gender?: string;
  neuteredSpayed?: boolean | null;
  city?: string;
  livingEnvironment?: string;
  foodType?: string;
  foodBrand?: string;
  waterSources?: string;
  mealPattern?: string;
  humanFood?: string;
  treatsShare?: string;
  exerciseMinsDay?: string;
  muscleTone?: string;
  energyLevel?: string;
  appetite?: string;
  sleepQuality?: string;
  behaviourMood?: string;
  weightTrend?: string;
  existingConditions?: string;
};

export type PetRecord = {
  id: string;
  name: string;
  species: PetSpecies;
  breed?: string;
  dateOfBirth?: string | null;
  dobEstimated?: boolean;
  ageYears?: number;
  weightKg?: number | null;
  gender?: string;
  neuteredSpayed?: boolean | null;
  city?: string;
  livingEnvironment?: string;
  foodType?: string;
  foodBrand?: string;
  waterSources?: string;
  mealPattern?: string;
  humanFood?: string;
  treatsShare?: string;
  exerciseMinsDay?: string;
  muscleTone?: string;
  energyLevel?: string;
  appetite?: string;
  sleepQuality?: string;
  behaviourMood?: string;
  weightTrend?: string;
  existingConditions?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export function formatPetAge(pet: {
  dateOfBirth?: string | Date | null;
  dobEstimated?: boolean;
  ageYears?: number | null;
}) {
  if (pet.dateOfBirth) {
    const dob = pet.dateOfBirth instanceof Date ? pet.dateOfBirth : new Date(pet.dateOfBirth);
    if (!Number.isNaN(dob.getTime())) {
      const now = new Date();
      let months = (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth());
      if (now.getDate() < dob.getDate()) months -= 1;
      if (months < 0) months = 0;
      const years = Math.floor(months / 12);
      const rem = months % 12;
      if (years > 0 && rem > 0) return `${years}yr ${rem}mo`;
      if (years > 0) return `${years}yr`;
      return `${Math.max(rem, 1)}mo`;
    }
  }
  if (pet.ageYears != null) return `${pet.ageYears}yr`;
  return "";
}

export function deriveAgeYears(dateOfBirth?: string | Date | null) {
  if (!dateOfBirth) return undefined;
  const dob = dateOfBirth instanceof Date ? dateOfBirth : new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return undefined;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) age -= 1;
  return age >= 0 ? age : 0;
}

export function parseDateOfBirth(day?: string, month?: string, year?: string) {
  const d = Number(day);
  const m = Number(month);
  const y = Number(year);
  if (!d || !m || !y || d < 1 || d > 31 || m < 1 || m > 12 || y < 1990 || y > new Date().getFullYear()) {
    return null;
  }
  const iso = new Date(Date.UTC(y, m - 1, d));
  if (iso.getUTCDate() !== d || iso.getUTCMonth() !== m - 1) return null;
  return iso.toISOString().slice(0, 10);
}

export function petCompleteness(pet: Partial<PetRecord>) {
  const fields = [
    Boolean(pet.name),
    Boolean(pet.species),
    Boolean(pet.dateOfBirth) || pet.dobEstimated === true,
    Boolean(pet.breed),
    pet.weightKg != null,
    Boolean(pet.livingEnvironment),
    Boolean(pet.foodType),
    Boolean(pet.exerciseMinsDay),
    Boolean(pet.muscleTone),
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

export function serializePet(pet: {
  _id: { toString(): string };
  name: string;
  species: PetSpecies;
  breed?: string;
  dateOfBirth?: Date | string | null;
  dobEstimated?: boolean;
  ageYears?: number;
  weightKg?: number | null;
  gender?: string;
  neuteredSpayed?: boolean | null;
  city?: string;
  livingEnvironment?: string;
  foodType?: string;
  foodBrand?: string;
  waterSources?: string;
  mealPattern?: string;
  humanFood?: string;
  treatsShare?: string;
  exerciseMinsDay?: string;
  muscleTone?: string;
  energyLevel?: string;
  appetite?: string;
  sleepQuality?: string;
  behaviourMood?: string;
  weightTrend?: string;
  existingConditions?: string;
  createdAt?: Date;
  updatedAt?: Date;
}): PetRecord {
  const dateOfBirth = pet.dateOfBirth
    ? pet.dateOfBirth instanceof Date
      ? pet.dateOfBirth.toISOString().slice(0, 10)
      : String(pet.dateOfBirth).slice(0, 10)
    : null;
  const ageYears = pet.ageYears ?? deriveAgeYears(dateOfBirth);
  return {
    id: pet._id.toString(),
    name: pet.name,
    species: pet.species,
    breed: pet.breed || "",
    dateOfBirth,
    dobEstimated: Boolean(pet.dobEstimated),
    ageYears,
    weightKg: pet.weightKg ?? null,
    gender: pet.gender || "",
    neuteredSpayed: pet.neuteredSpayed ?? null,
    city: pet.city || "",
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
    createdAt: pet.createdAt,
    updatedAt: pet.updatedAt,
  };
}

export function buildPetPayload(body: PetProfileInput, userId: string) {
  const name = String(body.name || "").trim();
  const species = body.species;
  if (!name) throw new Error("Pet name is required.");
  if (species !== "dog" && species !== "cat") throw new Error("Species must be dog or cat.");

  let dateOfBirth: Date | null = null;
  if (body.dateOfBirth) {
    const parsed = new Date(body.dateOfBirth);
    if (!Number.isNaN(parsed.getTime())) dateOfBirth = parsed;
  }

  const dobEstimated = Boolean(body.dobEstimated) && !dateOfBirth;
  const ageYears = dateOfBirth
    ? deriveAgeYears(dateOfBirth)
    : body.ageYears != null && !Number.isNaN(Number(body.ageYears))
      ? Number(body.ageYears)
      : undefined;

  return {
    userId,
    name,
    species,
    breed: String(body.breed ?? "").trim(),
    dateOfBirth,
    dobEstimated,
    ageYears,
    weightKg: body.weightKg != null && !Number.isNaN(Number(body.weightKg)) ? Number(body.weightKg) : undefined,
    gender: String(body.gender ?? "").trim(),
    neuteredSpayed: body.neuteredSpayed ?? null,
    city: String(body.city ?? "").trim(),
    livingEnvironment: String(body.livingEnvironment ?? "").trim(),
    foodType: String(body.foodType ?? "").trim(),
    foodBrand: String(body.foodBrand ?? "").trim(),
    waterSources: String(body.waterSources ?? "").trim(),
    mealPattern: String(body.mealPattern ?? "").trim(),
    humanFood: String(body.humanFood ?? "").trim(),
    treatsShare: String(body.treatsShare ?? "").trim(),
    exerciseMinsDay: String(body.exerciseMinsDay ?? "").trim(),
    muscleTone: String(body.muscleTone ?? "").trim(),
    energyLevel: String(body.energyLevel ?? "").trim(),
    appetite: String(body.appetite ?? "").trim(),
    sleepQuality: String(body.sleepQuality ?? "").trim(),
    behaviourMood: String(body.behaviourMood ?? "").trim(),
    weightTrend: String(body.weightTrend ?? "").trim(),
    existingConditions: String(body.existingConditions ?? "").trim(),
  };
}

export function petContextSummary(pet: PetRecord) {
  const lines = [
    `Name: ${pet.name}`,
    `Species: ${pet.species}`,
    pet.breed ? `Breed: ${pet.breed}` : "",
    formatPetAge(pet) ? `Age: ${formatPetAge(pet)}` : "",
    pet.weightKg != null ? `Weight: ${pet.weightKg} kg` : "",
    pet.gender ? `Gender: ${pet.gender}` : "",
    pet.neuteredSpayed != null ? `Neutered/spayed: ${pet.neuteredSpayed ? "yes" : "no"}` : "",
    pet.livingEnvironment ? `Living environment: ${pet.livingEnvironment}` : "",
    pet.foodType ? `Primary food: ${pet.foodType}` : "",
    pet.foodBrand ? `Food brand: ${pet.foodBrand}` : "",
    pet.waterSources ? `Water sources: ${pet.waterSources}` : "",
    pet.mealPattern ? `Meal pattern: ${pet.mealPattern}` : "",
    pet.humanFood ? `Human food/table scraps: ${pet.humanFood}` : "",
    pet.treatsShare ? `Treat share: ${pet.treatsShare}` : "",
    pet.exerciseMinsDay ? `Daily exercise: ${pet.exerciseMinsDay}` : "",
    pet.muscleTone ? `Muscle tone: ${pet.muscleTone}` : "",
    pet.energyLevel ? `Energy: ${pet.energyLevel}` : "",
    pet.appetite ? `Appetite: ${pet.appetite}` : "",
    pet.sleepQuality ? `Sleep: ${pet.sleepQuality}` : "",
    pet.behaviourMood ? `Behaviour: ${pet.behaviourMood}` : "",
    pet.weightTrend ? `Weight trend: ${pet.weightTrend}` : "",
    pet.existingConditions ? `Existing conditions: ${pet.existingConditions}` : "",
  ].filter(Boolean);
  return lines.join("\n");
}
