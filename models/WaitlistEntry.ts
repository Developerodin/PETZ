import { Schema, model, models } from "mongoose";

const WaitlistSchema = new Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    country: { type: String, required: true },
  },
  { timestamps: true },
);

export const WaitlistEntry = models.WaitlistEntry || model("WaitlistEntry", WaitlistSchema);
