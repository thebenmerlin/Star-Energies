import { NextResponse } from "next/server";

import { AdminAuthorizationError } from "@/lib/auth";
import { getEnquiryLabReportDownloadUrl } from "@/lib/cloudinary";
import { getAdminEnquiryLabReport } from "@/lib/enquiries";

export const runtime = "nodejs";

function attachmentName(name: string) {
  return name.replace(/[\r\n"\\]/g, "-") || "lab-report";
}

/** Streams the authenticated Cloudinary file so the signed storage URL is never exposed to the browser. */
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const report = await getAdminEnquiryLabReport(id);
    if (!report) return NextResponse.json({ message: "No lab report is attached to this enquiry." }, { status: 404 });

    const upstream = await fetch(getEnquiryLabReportDownloadUrl(report.publicId), { cache: "no-store" });
    if (!upstream.ok || !upstream.body) throw new Error("The lab report could not be retrieved from private storage.");

    return new Response(upstream.body, {
      headers: {
        "Content-Type": report.mimeType,
        "Content-Disposition": `attachment; filename="${attachmentName(report.name)}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (error instanceof AdminAuthorizationError) return NextResponse.json({ message: "Authentication is required." }, { status: 401 });
    console.error("Lab report download failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ message: "The lab report could not be downloaded. Please try again." }, { status: 500 });
  }
}
