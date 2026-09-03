import { Schema, model, models, type InferSchemaType } from "mongoose";

const PetSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    species: { type: String, enum: ["dog", "cat"], required: true },
    breed: { type: String, default: "" },
    dateOfBirth: { type: Date, default: null },
    dobEstimated: { type: Boolean, default: false },
    ageYears: { type: Number },
    weightKg: { type: Number },
    gender: { type: String, default: "" },
    neuteredSpayed: { type: Boolean, default: null },
    city: { type: String, default: "" },
    livingEnvironment: { type: String, default: "" },
    foodType: { type: String, default: "" },
    foodBrand: { type: String, default: "" },
    waterSources: { type: String, default: "" },
    mealPattern: { type: String, default: "" },
    humanFood: { type: String, default: "" },
    treatsShare: { type: String, default: "" },
    exerciseMinsDay: { type: String, default: "" },
    muscleTone: { type: String, default: "" },
    energyLevel: { type: String, default: "" },
    appetite: { type: String, default: "" },
    sleepQuality: { type: String, default: "" },
    behaviourMood: { type: String, default: "" },
    weightTrend: { type: String, default: "" },
    existingConditions: { type: String, default: "" },
  },
  { timestamps: true },
);

PetSchema.index({ userId: 1, name: 1, species: 1 });

export type PetDocument = InferSchemaType<typeof PetSchema> & { _id: string };

export const Pet = models.Pet || model("Pet", PetSchema);
