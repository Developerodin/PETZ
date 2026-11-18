import { Schema, model, models } from "mongoose";

const FormRateLimitSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    count: { type: Number, default: 0 },
    windowStartsAt: { type: Date, required: true },
  },
  { timestamps: true },
);

export const FormRateLimit = models.FormRateLimit || model("FormRateLimit", FormRateLimitSchema);
