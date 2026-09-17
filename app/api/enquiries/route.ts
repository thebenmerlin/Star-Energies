import { NextResponse } from "next/server";
import { z } from "zod";

import { getEnquiryIpAddress, createPublicEnquiry, EnquiryRateLimitError, EnquiryValidationError } from "@/lib/enquiries";
import { sendEnquiryNotifications } from "@/lib/mail/enquiries";
import { getSiteSettings } from "@/lib/content";
import { publicEnquiryRequestSchema } from "@/types/enquiry";

export const runtime = "nodejs";

const successMessage = "Your requirement has been received. Star Energies will contact you to discuss availability and quotation.";

function validationResponse(error: z.ZodError) {
  const fields = Object.fromEntries(error.issues.map((issue) => [String(issue.path[0] ?? "form"), issue.message]));
  return NextResponse.json({ ok: false, message: "Please review the highlighted details and try again.", fields }, { status: 422 });
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > 24_000) {
    return NextResponse.json({ ok: false, message: "This enquiry is too large. Please keep the additional message concise." }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "We could not read the enquiry. Please try again." }, { status: 400 });
  }

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

    if (result.enquiry && !result.duplicate) {
      try {
        const settings = await getSiteSettings();
        await sendEnquiryNotifications({
          enquiry: result.enquiry,
          recipientEmail: settings.contact.email,
          appUrl: process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL,
        });
      } catch (error) {
        // Persistence has already succeeded. Do not expose provider details or
        // turn a real enquiry into a public failure because email is down.
        console.error("Enquiry notification failed", error instanceof Error ? error.message : "Unknown provider error");
      }
    }

    return NextResponse.json({ ok: true, message: successMessage });
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
