import { auth } from "@/auth";
import { jsonError, jsonOk, withDb } from "@/lib/api-utils";
import { computeAssessment } from "@/lib/assessment-score";
import { buildPetPayload, MAX_PETS, type PetProfileInput, type PetSpecies } from "@/lib/pet-utils";
import { Assessment } from "@/models/Assessment";
import { Pet } from "@/models/Pet";
import { Types } from "mongoose";

type AssessmentBody = {
  owner?: { name?: string; email?: string; marketing?: boolean };
  pet?: {
    id?: string;
    species?: string;
    name?: string;
    age?: string;
    dateOfBirth?: string;
    dobEstimated?: boolean;
    weight?: string;
    breed?: string;
    diet?: string;
    meals?: string;
    living?: string;
    livingEnvironment?: string;
    exercise?: string;
    energy?: string;
    muscle?: string;
    bcs?: string;
    weightTrend?: string;
    vaccines?: string;
    vetVisits?: string;
    appetite?: string;
    sleep?: string;
    behaviour?: string;
    conditions?: string;
    meds?: string;
    symptoms?: string;
  };
  summary?: Record<string, string>;
};

function normalizeEmail(value?: string) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function assessmentToPetInput(pet: NonNullable<AssessmentBody["pet"]>): PetProfileInput {
  const species = pet.species === "cat" || pet.species === "dog" ? (pet.species as PetSpecies) : undefined;
  const ageYears = pet.age != null && pet.age !== "" ? Number(pet.age) : null;
  const weightKg = pet.weight != null && pet.weight !== "" ? Number(pet.weight) : null;
  return {
    name: pet.name,
    species,
    breed: pet.breed,
    dateOfBirth: pet.dobEstimated ? null : pet.dateOfBirth || null,
    dobEstimated: Boolean(pet.dobEstimated),
    ageYears: Number.isNaN(Number(ageYears)) ? null : ageYears,
    weightKg: Number.isNaN(Number(weightKg)) ? null : weightKg,
    livingEnvironment: pet.living || pet.livingEnvironment,
    foodType: pet.diet,
    mealPattern: pet.meals,
    exerciseMinsDay: pet.exercise,
    muscleTone: pet.muscle,
    energyLevel: pet.energy,
    appetite: pet.appetite,
    sleepQuality: pet.sleep,
    behaviourMood: pet.behaviour,
    weightTrend: pet.weightTrend,
    existingConditions: pet.conditions,
  };
}

export async function POST(request: Request) {
  return withDb(async () => {
    const session = await auth();
    let body: AssessmentBody;

    try {
      body = (await request.json()) as AssessmentBody;
    } catch {
      return jsonError("Invalid JSON body.");
    }

    const email = normalizeEmail(body.owner?.email);
    if (!email) return jsonError("Owner email is required.");
    if (!body.pet?.name) return jsonError("Pet name is required.");

    const species = body.pet.species === "cat" ? "cat" : body.pet.species === "dog" ? "dog" : "";
    const score = computeAssessment(body.pet).overall;

    let petId;
    if (session?.user?.id && species) {
      try {
        const name = body.pet.name.trim();
        const requestedId = String(body.pet.id || "").trim();
        const existing = requestedId && Types.ObjectId.isValid(requestedId)
          ? await Pet.findOne({ _id: requestedId, userId: session.user.id })
          : await Pet.findOne({
              userId: session.user.id,
              species,
              name: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
            });
        const input = assessmentToPetInput(body.pet);
        if (existing) {
          const payload = buildPetPayload(
            {
              name,
              species,
              breed: input.breed || existing.breed,
              dateOfBirth: input.dobEstimated
                ? null
                : input.dateOfBirth || existing.dateOfBirth?.toISOString().slice(0, 10),
              dobEstimated: input.dobEstimated || (!input.dateOfBirth && existing.dobEstimated),
              ageYears: input.ageYears ?? existing.ageYears,
              weightKg: input.weightKg ?? existing.weightKg,
              gender: existing.gender,
              neuteredSpayed: existing.neuteredSpayed,
              city: existing.city,
              livingEnvironment: input.livingEnvironment || existing.livingEnvironment,
              foodType: input.foodType || existing.foodType,
              foodBrand: existing.foodBrand,
              waterSources: existing.waterSources,
              mealPattern: input.mealPattern || existing.mealPattern,
              humanFood: existing.humanFood,
              treatsShare: existing.treatsShare,
              exerciseMinsDay: input.exerciseMinsDay || existing.exerciseMinsDay,
              muscleTone: input.muscleTone || existing.muscleTone,
              energyLevel: input.energyLevel || existing.energyLevel,
              appetite: input.appetite || existing.appetite,
              sleepQuality: input.sleepQuality || existing.sleepQuality,
              behaviourMood: input.behaviourMood || existing.behaviourMood,
              weightTrend: input.weightTrend || existing.weightTrend,
              existingConditions: input.existingConditions || existing.existingConditions,
            },
            session.user.id,
          );
          Object.assign(existing, payload);
          await existing.save();
          petId = existing._id;
        } else {
          const count = await Pet.countDocuments({ userId: session.user.id });
          if (count < MAX_PETS) {
            const pet = await Pet.create(buildPetPayload(input, session.user.id));
            petId = pet._id;
          }
        }
      } catch {
        petId = undefined;
      }
    }

    const assessment = await Assessment.create({
      userId: session?.user?.id,
      ownerEmail: email,
      petId,
      petName: body.pet.name.trim(),
      species,
      payload: body,
      summary: body.summary ?? {},
      score,
    });

    return jsonOk(
      {
        id: assessment._id.toString(),
        score,
        petId: petId?.toString(),
      },
      201,
    );
  });
}

export async function GET() {
  return withDb(async () => {
    const session = await auth();
    if (!session?.user?.id) return jsonError("Sign in required.", 401);

    const assessments = await Assessment.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return jsonOk({
      assessments: assessments.map((item) => ({
        id: item._id.toString(),
        petName: item.petName,
        species: item.species,
        score: item.score,
        createdAt: item.createdAt,
      })),
    });
  });
}
