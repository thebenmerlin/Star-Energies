import "server-only";

import { Resend } from "resend";

import type { AdminEnquiry } from "@/types/enquiry";

type NotificationOptions = {
  enquiry: AdminEnquiry;
  recipientEmail?: string;
  appUrl?: string;
};

const configured = () => Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);

const value = (item?: string) => item?.trim() || "Not provided";
const subjectValue = (item: string) => item.replace(/[\r\n]/g, " ").trim().slice(0, 120);

function enquiryDetails(enquiry: AdminEnquiry, appUrl?: string) {
  const link = appUrl?.replace(/\/$/, "") ? `\nOpen in admin: ${appUrl.replace(/\/$/, "")}/admin/enquiries/${enquiry.id}` : "";
  return `
Contact person: ${enquiry.contactPerson}
Company type: ${enquiry.companyType}
Role: ${enquiry.role}
Company / firm: ${value(enquiry.companyName)}
Phone: ${enquiry.phone}
Email: ${value(enquiry.email)}
WhatsApp: ${value(enquiry.whatsapp)}

Coal requirement: ${enquiry.coalRequirement}
Grade / GCV: ${value(enquiry.gradeGcv)}
Size: ${value(enquiry.size)}
Quantity: ${enquiry.quantity} ${enquiry.unit}
Requirement frequency: ${enquiry.requirementFrequency}

Delivery location: ${enquiry.deliveryCity}, ${enquiry.state}${enquiry.pincode ? ` (${enquiry.pincode})` : ""}
Desired timeline: ${value(enquiry.timeline)}
Additional requirement: ${value(enquiry.message)}
Lab report: ${enquiry.labReportName ? `${enquiry.labReportName} (available privately in admin)` : "Not attached"}

Submitted: ${new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(enquiry.submittedAt))} IST
Source: Website quote form${link}`.trim();
}

/**
 * Delivery is deliberately isolated from enquiry persistence. A mail outage
 * must never turn a successfully stored commercial requirement into a failure
 * for the visitor.
 */
export async function sendEnquiryNotifications({ enquiry, recipientEmail, appUrl }: NotificationOptions) {
  if (!configured()) {
    console.warn("Enquiry email notification skipped: Resend is not configured.");
    return { admin: "skipped", acknowledgement: "skipped" } as const;
  }
  if (!recipientEmail) {
    console.warn("Enquiry email notification skipped: no recipient email is configured in site settings.");
    return { admin: "skipped", acknowledgement: "skipped" } as const;
  }

  const resend = new Resend(process.env.RESEND_API_KEY!);
  const from = process.env.RESEND_FROM_EMAIL!;
  const adminResult = await resend.emails.send({
    from,
    to: [recipientEmail],
    replyTo: enquiry.email || undefined,
    subject: `New Quote Enquiry — ${subjectValue(enquiry.companyName ?? enquiry.contactPerson)}`,
    text: enquiryDetails(enquiry, appUrl),
  }, { idempotencyKey: `star-energies-enquiry-admin/${enquiry.id}` });

  if (adminResult.error) throw new Error(`Admin enquiry email was rejected: ${adminResult.error.message}`);

  if (!enquiry.email) return { admin: "sent", acknowledgement: "skipped" } as const;

  const acknowledgement = await resend.emails.send({
    from,
    to: [enquiry.email],
    replyTo: recipientEmail,
    subject: "Your Star Energies requirement has been received",
    text: `Hello ${enquiry.contactPerson},

Thank you for sharing your coal requirement with Star Energies. We have received it and will contact you to discuss availability and quotation.

Submitting this form does not confirm pricing, material availability, supply, delivery or commercial terms. Those details will be discussed directly.

Regards,
Star Energies`,
  }, { idempotencyKey: `star-energies-enquiry-acknowledgement/${enquiry.id}` });

  if (acknowledgement.error) throw new Error(`Customer acknowledgement email was rejected: ${acknowledgement.error.message}`);
  return { admin: "sent", acknowledgement: "sent" } as const;
}
