import { NextResponse } from "next/server";
import { z } from "zod";

import { attachLabReport, getEnquiryIpAddress, createPublicEnquiry, EnquiryRateLimitError, EnquiryValidationError } from "@/lib/enquiries";
import { deleteEnquiryLabReport, isCloudinaryConfigured, maxLabReportBytes, uploadEnquiryLabReport, validateEnquiryLabReport } from "@/lib/cloudinary";
import { sendEnquiryNotifications } from "@/lib/mail/enquiries";
import { getSiteSettings } from "@/lib/content";
import { publicEnquiryRequestSchema } from "@/types/enquiry";

export const runtime = "nodejs";

const successMessage = "Your requirement has been received. Star Energies will contact you to discuss availability and quotation.";
const maxEnquiryRequestBytes = maxLabReportBytes + (128 * 1024);
type EnquiryFormData = {
  get(name: string): string | File | null;
  entries(): IterableIterator<[string, string | File]>;
};

function validationResponse(error: z.ZodError) {
  const fields = Object.fromEntries(error.issues.map((issue) => [String(issue.path[0] ?? "form"), issue.message]));
  return NextResponse.json({ ok: false, message: "Please review the highlighted details and try again.", fields }, { status: 422 });
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > maxEnquiryRequestBytes) {
    return NextResponse.json({ ok: false, message: "This enquiry is too large. Lab reports must be 3 MB or smaller." }, { status: 413 });
  }

  let formData: EnquiryFormData | undefined;
  try {
    formData = await request.formData() as unknown as EnquiryFormData;
  } catch {
    return NextResponse.json({ ok: false, message: "We could not read the enquiry. Please try again." }, { status: 400 });
  }

  if (!formData) return NextResponse.json({ ok: false, message: "We could not read the enquiry. Please try again." }, { status: 400 });

  const labReportValue = formData.get("labReport");
  const labReport = labReportValue instanceof File && labReportValue.size > 0 ? labReportValue : undefined;
  if (labReport) {
    try {
      validateEnquiryLabReport(labReport);
    } catch (error) {
      return NextResponse.json({ ok: false, message: error instanceof Error ? error.message : "Choose a valid lab report.", fields: { labReport: error instanceof Error ? error.message : "Choose a valid lab report." } }, { status: 422 });
    }
  }
  if (labReport && !isCloudinaryConfigured()) {
    return NextResponse.json({ ok: false, message: "Lab report upload is not available right now. Please submit the enquiry without it or contact Star Energies directly." }, { status: 503 });
  }

  const payload = Object.fromEntries([...formData.entries()].filter(([, value]) => typeof value === "string"));
  const parsed = publicEnquiryRequestSchema.safeParse(payload);
  if (!parsed.success) return validationResponse(parsed.error);

  // A filled hidden field is treated as a successful no-op, which does not
  // teach automated callers how the anti-spam check is implemented.
  if (parsed.data.website.trim()) return NextResponse.json({ ok: true, message: successMessage });

  try {
    const result = await createPublicEnquiry(parsed.data, {
      ipAddress: getEnquiryIpAddress(request.headers),
      userAgent: request.headers.get("user-agent"),
    });

    let enquiry = result.enquiry;
    let attachmentWarning: string | undefined;
    if (labReport && enquiry && !enquiry.labReportName) {
      let uploadedPublicId: string | undefined;
      try {
        const upload = await uploadEnquiryLabReport(labReport, enquiry.id);
        uploadedPublicId = upload.publicId;
        enquiry = await attachLabReport(enquiry.id, upload);
      } catch (error) {
        if (uploadedPublicId) await deleteEnquiryLabReport(uploadedPublicId).catch(() => undefined);
        console.error("Enquiry lab report upload failed", error instanceof Error ? error.message : "Unknown error");
        attachmentWarning = "Your enquiry was received, but we could not attach the lab report. Please email or WhatsApp it to Star Energies.";
      }
    }

    if (enquiry && !result.duplicate) {
      try {
        const settings = await getSiteSettings();
        await sendEnquiryNotifications({
          enquiry,
          recipientEmail: settings.contact.email,
          appUrl: process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL,
        });
      } catch (error) {
        // Persistence has already succeeded. Do not expose provider details or
        // turn a real enquiry into a public failure because email is down.
        console.error("Enquiry notification failed", error instanceof Error ? error.message : "Unknown provider error");
      }
    }

    return NextResponse.json({ ok: true, message: attachmentWarning ?? successMessage });
  } catch (error) {
    if (error instanceof EnquiryRateLimitError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 429 });
    }
    if (error instanceof EnquiryValidationError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 422 });
    }
    console.error("Enquiry submission failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ ok: false, message: "We could not send the enquiry right now. Please try again or contact Star Energies directly." }, { status: 500 });
  }
}
