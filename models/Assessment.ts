import { Schema, model, models, type InferSchemaType } from "mongoose";

const AssessmentSchema = new Schema(
  {
    userId: { type: String, index: true },
    ownerEmail: { type: String, required: true, index: true },
    petId: { type: Schema.Types.ObjectId, ref: "Pet" },
    petName: { type: String, default: "" },
    species: { type: String, enum: ["dog", "cat", ""], default: "" },
    payload: { type: Schema.Types.Mixed, required: true },
    summary: { type: Schema.Types.Mixed, required: true },
    score: { type: Number, required: true },
  },
  { timestamps: true },
);

export type AssessmentDocument = InferSchemaType<typeof AssessmentSchema> & { _id: string };

export const Assessment = models.Assessment || model("Assessment", AssessmentSchema);
