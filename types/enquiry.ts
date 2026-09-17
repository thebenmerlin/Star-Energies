import { z } from "zod";

export const enquiryStatusSchema = z.enum(["new", "contacted", "quoted", "closed", "archived"]);
export type EnquiryStatus = z.infer<typeof enquiryStatusSchema>;

export const enquirySourceSchema = z.enum(["website_quote_form"]);
export type EnquirySource = z.infer<typeof enquirySourceSchema>;

const optionalText = (maximum: number) => z.preprocess(
  (value) => typeof value === "string" && value.trim() === "" ? undefined : value,
  z.string().trim().max(maximum).optional(),
);

const phoneSchema = z.string()
  .trim()
  .min(7, "Enter a valid phone number.")
  .max(32, "Enter a valid phone number.")
  .refine((value) => /^[+0-9()\s.-]+$/.test(value) && value.replace(/\D/g, "").length >= 7, "Enter a valid phone number.");

const quantitySchema = z.preprocess(
  (value) => typeof value === "string" ? value.replace(/,/g, "").trim() : value,
  z.coerce.number().finite().positive("Quantity must be greater than zero.").max(10_000_000, "Enter a practical quantity."),
);

/**
 * The public form and the server use this same contract. Optional technical
 * fields intentionally remain optional: an enquiry starts a conversation,
 * not an online transaction.
 */
export const enquirySubmissionSchema = z.object({
  contactPerson: z.string().trim().min(2, "Enter the contact person's name.").max(120),
  companyName: z.string().trim().min(2, "Enter the company name.").max(160),
  phone: phoneSchema,
  email: z.preprocess(
    (value) => typeof value === "string" && value.trim() === "" ? undefined : value,
    z.string().trim().email("Enter a valid email address.").max(254).optional(),
  ),
  whatsapp: optionalText(32).refine((value) => !value || (phoneSchema.safeParse(value).success), "Enter a valid WhatsApp number."),
  coalRequirement: z.string().trim().min(2, "Tell us the coal requirement or type.").max(240),
  gradeGcv: optionalText(120),
  size: optionalText(120),
  quantity: quantitySchema,
  unit: z.enum(["Tonnes", "MT", "Other"], { message: "Select a unit." }),
  deliveryCity: z.string().trim().min(2, "Enter the delivery city.").max(120),
  state: z.string().trim().min(2, "Enter the delivery state.").max(120),
  pincode: optionalText(24),
  timeline: optionalText(160),
  message: optionalText(2_000),
});
export type EnquirySubmission = z.infer<typeof enquirySubmissionSchema>;

/** Browser-only anti-abuse fields are validated again on the server. */
export const publicEnquiryRequestSchema = enquirySubmissionSchema.extend({
  clientSubmissionId: z.string().uuid("Please refresh the form and try again."),
  website: z.string().max(200).optional().default(""),
  formStartedAt: z.coerce.number().int().positive(),
});
export type PublicEnquiryRequest = z.infer<typeof publicEnquiryRequestSchema>;

export const enquiryNoteInputSchema = z.object({
  enquiryId: z.string().uuid(),
  note: z.string().trim().min(1, "Write a note before saving.").max(2_000, "Keep notes under 2,000 characters."),
});

export const enquiryStatusUpdateSchema = z.object({
  enquiryId: z.string().uuid(),
  status: enquiryStatusSchema,
});

export type EnquiryNote = {
  id: string;
  createdAt: string;
  author: string;
  text: string;
};

/** Admin-safe read model. It deliberately omits submission metadata such as IP hashes. */
export type AdminEnquiry = {
  id: string;
  submittedAt: string;
  updatedAt: string;
  status: EnquiryStatus;
  source: EnquirySource;
  contactPerson: string;
  companyName: string;
  phone: string;
  email?: string;
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

export type EnquiryListResult = {
  enquiries: AdminEnquiry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
