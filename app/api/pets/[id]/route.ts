import { jsonError, jsonOk, requireUser, withDb } from "@/lib/api-utils";
import { buildPetPayload, serializePet, type PetProfileInput } from "@/lib/pet-utils";
import { Pet } from "@/models/Pet";
import { Types } from "mongoose";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  return withDb(async () => {
    const user = await requireUser();
    if (!user) return jsonError("Sign in required.", 401);

    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return jsonError("Pet not found.", 404);

    const pet = await Pet.findOne({ _id: id, userId: user.id }).lean();
    if (!pet) return jsonError("Pet not found.", 404);

    return jsonOk({ pet: serializePet(pet) });
  });
}

export async function PATCH(request: Request, { params }: Params) {
  return withDb(async () => {
    const user = await requireUser();
    if (!user) return jsonError("Sign in required.", 401);

    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return jsonError("Pet not found.", 404);

    let body: PetProfileInput;
    try {
      body = (await request.json()) as PetProfileInput;
    } catch {
      return jsonError("Invalid JSON body.");
    }

    const existing = await Pet.findOne({ _id: id, userId: user.id });
    if (!existing) return jsonError("Pet not found.", 404);

    try {
      const payload = buildPetPayload(
        {
          name: body.name ?? existing.name,
          species: body.species ?? existing.species,
          breed: body.breed ?? existing.breed,
          dateOfBirth: body.dateOfBirth ?? existing.dateOfBirth?.toISOString().slice(0, 10),
          dobEstimated: body.dobEstimated ?? existing.dobEstimated,
          ageYears: body.ageYears ?? existing.ageYears,
          weightKg: body.weightKg ?? existing.weightKg,
          gender: body.gender ?? existing.gender,
          neuteredSpayed: body.neuteredSpayed ?? existing.neuteredSpayed,
          city: body.city ?? existing.city,
          livingEnvironment: body.livingEnvironment ?? existing.livingEnvironment,
          foodType: body.foodType ?? existing.foodType,
          foodBrand: body.foodBrand ?? existing.foodBrand,
          waterSources: body.waterSources ?? existing.waterSources,
          mealPattern: body.mealPattern ?? existing.mealPattern,
          humanFood: body.humanFood ?? existing.humanFood,
          treatsShare: body.treatsShare ?? existing.treatsShare,
          exerciseMinsDay: body.exerciseMinsDay ?? existing.exerciseMinsDay,
          muscleTone: body.muscleTone ?? existing.muscleTone,
          energyLevel: body.energyLevel ?? existing.energyLevel,
          appetite: body.appetite ?? existing.appetite,
          sleepQuality: body.sleepQuality ?? existing.sleepQuality,
          behaviourMood: body.behaviourMood ?? existing.behaviourMood,
          weightTrend: body.weightTrend ?? existing.weightTrend,
          existingConditions: body.existingConditions ?? existing.existingConditions,
        },
        user.id,
      );

      Object.assign(existing, payload);
      await existing.save();
      return jsonOk({ pet: serializePet(existing) });
    } catch (error) {
      return jsonError(error instanceof Error ? error.message : "Could not update pet.", 400);
    }
  });
}

export async function DELETE(_request: Request, { params }: Params) {
  return withDb(async () => {
    const user = await requireUser();
    if (!user) return jsonError("Sign in required.", 401);

    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return jsonError("Pet not found.", 404);

    const result = await Pet.deleteOne({ _id: id, userId: user.id });
    if (result.deletedCount === 0) return jsonError("Pet not found.", 404);

    return jsonOk({ ok: true });
  });
}
