import OpenAI from "openai";
import { ASSISTANT_NAME } from "@/lib/assistant";
import { jsonError, jsonOk, requireUser, withDb } from "@/lib/api-utils";
import { petContextSummary, serializePet } from "@/lib/pet-utils";
import { ChatSession } from "@/models/ChatSession";
import { Pet } from "@/models/Pet";
import { Types } from "mongoose";

const MODEL = "gpt-4o-mini";

function buildSystemPrompt(petSummary: string, petName: string) {
  return `You are ${ASSISTANT_NAME}, PETZ's preventive pet-health assistant helping a pet parent assess symptoms for ${petName}.

Use the pet profile below as context when relevant:
${petSummary}

Rules:
- You do NOT diagnose, prescribe medication, or replace a veterinarian.
- Give practical, calm guidance in plain language.
- End every response with exactly one urgency label on its own line using one of these formats:
  **Emergency — act now**
  **Vet attention needed**
  **Routine — book when it suits you**
- If information is missing, ask one focused follow-up question before deciding urgency.
- Mention when emergency clinic care is appropriate.`;
}

export async function POST(request: Request) {
  return withDb(async () => {
    const user = await requireUser();
    if (!user) return jsonError("Sign in required.", 401);

    if (!process.env.OPENAI_API_KEY) {
      return jsonError("AI chat is not configured yet.", 503);
    }

    let body: { petId?: string; sessionId?: string; message?: string };
    try {
      body = (await request.json()) as typeof body;
    } catch {
      return jsonError("Invalid JSON body.");
    }

    const message = String(body.message || "").trim();
    const petId = String(body.petId || "").trim();
    if (!message) return jsonError("Message is required.");
    if (!petId || !Types.ObjectId.isValid(petId)) return jsonError("Valid petId is required.");

    const petDoc = await Pet.findOne({ _id: petId, userId: user.id }).lean();
    if (!petDoc) return jsonError("Pet not found.", 404);
    const pet = serializePet(petDoc);

    let session =
      body.sessionId && Types.ObjectId.isValid(body.sessionId)
        ? await ChatSession.findOne({ _id: body.sessionId, userId: user.id, petId })
        : null;

    if (!session) {
      session = await ChatSession.create({
        userId: user.id,
        petId,
        messages: [],
      });
    }

    session.messages.push({ role: "user", content: message });

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const history = session.messages.map((item: { role: string; content: string }) => ({
      role: item.role as "user" | "assistant",
      content: item.content,
    }));

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: buildSystemPrompt(petContextSummary(pet), pet.name) },
        ...history,
      ],
      temperature: 0.4,
    });

    const reply = completion.choices[0]?.message?.content?.trim();
    if (!reply) return jsonError("No response from AI.", 502);

    session.messages.push({ role: "assistant", content: reply });
    await session.save();

    return jsonOk({
      sessionId: session._id.toString(),
      reply,
    });
  });
}

export async function GET(request: Request) {
  return withDb(async () => {
    const user = await requireUser();
    if (!user) return jsonError("Sign in required.", 401);

    const petId = new URL(request.url).searchParams.get("petId") || "";
    if (!petId || !Types.ObjectId.isValid(petId)) return jsonError("Valid petId is required.", 400);

    const sessions = await ChatSession.find({ userId: user.id, petId })
      .sort({ updatedAt: -1 })
      .limit(10)
      .lean();

    return jsonOk({
      sessions: sessions.map((session) => ({
        id: session._id.toString(),
        petId: session.petId,
        messageCount: session.messages.length,
        updatedAt: session.updatedAt,
      })),
    });
  });
}
