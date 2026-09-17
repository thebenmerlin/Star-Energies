import { z } from "zod";

export const enquiryStatusSchema = z.enum(["new", "contacted", "quoted", "closed", "archived"]);
export type EnquiryStatus = z.infer<typeof enquiryStatusSchema>;

export type EnquiryNote = {
  id: string;
  createdAt: string;
  author: string;
  text: string;
};

export type AdminEnquiry = {
  id: string;
  submittedAt: string;
  status: EnquiryStatus;
  contactPerson: string;
  companyName: string;
  phone: string;
  email: string;
  whatsapp?: string;
  coalRequirement: string;
  gradeGcv?: string;
  size?: string;
  quantity: string;
  unit: string;
  deliveryCity: string;
  state: string;
  pincode?: string;
  timeline?: string;
  message?: string;
  notes: EnquiryNote[];
};

export type AdminSaveState = "idle" | "dirty" | "saving" | "saved" | "published" | "error";
