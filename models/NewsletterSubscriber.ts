import { Schema, model, models } from "mongoose";

const NewsletterSubscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: ["pending", "subscribed"], default: "pending" },
    confirmTokenHash: { type: String, default: null },
    confirmTokenExpiresAt: { type: Date, default: null },
    consentedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const NewsletterSubscriber =
  models.NewsletterSubscriber || model("NewsletterSubscriber", NewsletterSubscriberSchema);
