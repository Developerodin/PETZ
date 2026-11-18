import { Schema, model, models } from "mongoose";

const WaitlistSchema = new Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    country: { type: String, default: "India" },
    city: { type: String, default: "" },
    petType: { type: String, default: "" },
    plan: { type: String, default: "" },
  },
  { timestamps: true },
);

export const WaitlistEntry = models.WaitlistEntry || model("WaitlistEntry", WaitlistSchema);
