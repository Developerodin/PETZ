import { auth } from "@/auth";
import { jsonError, jsonOk, withDb } from "@/lib/api-utils";
import { Assessment } from "@/models/Assessment";
import { Pet } from "@/models/Pet";

export async function GET() {
  return withDb(async () => {
    const session = await auth();
    if (!session?.user) return jsonError("Sign in required.", 401);

    const [pets, assessments] = await Promise.all([
      Pet.find({ userId: session.user.id }).sort({ updatedAt: -1 }).limit(10).lean(),
      Assessment.find({ userId: session.user.id }).sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    return jsonOk({
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      },
      pets: pets.map((pet) => ({
        id: pet._id.toString(),
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
      })),
      assessments: assessments.map((item) => ({
        id: item._id.toString(),
        petName: item.petName,
        score: item.score,
        createdAt: item.createdAt,
      })),
    });
  });
}
