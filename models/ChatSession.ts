import { Schema, model, models, type InferSchemaType } from "mongoose";

const ChatMessageSchema = new Schema(
  {
    role: { type: String, enum: ["user", "assistant", "system"], required: true },
    content: { type: String, required: true },
  },
  { _id: false, timestamps: { createdAt: true, updatedAt: false } },
);

const ChatSessionSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    petId: { type: String, required: true, index: true },
    messages: { type: [ChatMessageSchema], default: [] },
  },
  { timestamps: true },
);

export type ChatSessionDocument = InferSchemaType<typeof ChatSessionSchema> & { _id: string };

export const ChatSession = models.ChatSession || model("ChatSession", ChatSessionSchema);
