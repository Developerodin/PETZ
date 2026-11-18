import { Schema, model, models } from "mongoose";

const PartnerApplicationSchema = new Schema(
  {
    partnerType: { type: String, required: true },
    organisation: { type: String, required: true },
    contactName: { type: String, default: "" },
    email: { type: String, required: true, index: true },
    phone: { type: String, default: "" },
    city: { type: String, required: true },
    message: { type: String, default: "" },
  },
  { timestamps: true },
);

export const PartnerApplication = models.PartnerApplication || model("PartnerApplication", PartnerApplicationSchema);
