import { jsonError, jsonOk, requireUser, withDb } from "@/lib/api-utils";
import { buildPetPayload, MAX_PETS, serializePet, type PetProfileInput } from "@/lib/pet-utils";
import { Pet } from "@/models/Pet";

export async function GET() {
  return withDb(async () => {
    const user = await requireUser();
    if (!user) return jsonError("Sign in required.", 401);

    const pets = await Pet.find({ userId: user.id }).sort({ updatedAt: -1 }).lean();
    return jsonOk({ pets: pets.map((pet) => serializePet(pet)) });
  });
}

export async function POST(request: Request) {
  return withDb(async () => {
    const user = await requireUser();
    if (!user) return jsonError("Sign in required.", 401);

    let body: PetProfileInput;
    try {
      body = (await request.json()) as PetProfileInput;
    } catch {
      return jsonError("Invalid JSON body.");
    }

    const count = await Pet.countDocuments({ userId: user.id });
    if (count >= MAX_PETS) return jsonError(`You can save up to ${MAX_PETS} pet profiles.`, 409);

    try {
      const payload = buildPetPayload(body, user.id);
      const pet = await Pet.create(payload);
      return jsonOk({ pet: serializePet(pet) }, 201);
    } catch (error) {
      return jsonError(error instanceof Error ? error.message : "Could not create pet.", 400);
    }
  });
}
