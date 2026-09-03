import { Schema, model, models } from "mongoose";

const PartnerApplicationSchema = new Schema(
  {
    partnerType: { type: String, required: true },
    organisation: { type: String, required: true },
    email: { type: String, required: true, index: true },
    city: { type: String, required: true },
    message: { type: String, default: "" },
  },
  { timestamps: true },
);

export const PartnerApplication = models.PartnerApplication || model("PartnerApplication", PartnerApplicationSchema);
