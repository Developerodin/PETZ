import { auth } from "@/auth";
import { connectDb } from "@/lib/mongoose";
import { serializePet, type PetRecord } from "@/lib/pet-utils";
import { Pet } from "@/models/Pet";

export async function getSavedPets(): Promise<PetRecord[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    await connectDb();
    const pets = await Pet.find({ userId: session.user.id }).sort({ updatedAt: -1 }).lean();
    return pets.map((pet) => serializePet(pet));
  } catch {
    return [];
  }
}
