import { Schema, model, models } from "mongoose";

const SupportMessageSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String, default: "" },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true },
);

export const SupportMessage = models.SupportMessage || model("SupportMessage", SupportMessageSchema);
