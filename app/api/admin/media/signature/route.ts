import { NextResponse } from "next/server";
import { z } from "zod";

import { AdminAuthorizationError, requireAdmin } from "@/lib/auth";
import { createCloudinaryUploadSignature } from "@/lib/cloudinary";

export const runtime = "nodejs";

const signatureRequestSchema = z.object({
  category: z.enum(["logo", "coal", "facility", "industrial", "operations", "team", "hero"]),
});

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const { category } = signatureRequestSchema.parse(await request.json());
    return NextResponse.json(createCloudinaryUploadSignature(category));
  } catch (error) {
    if (error instanceof AdminAuthorizationError) return NextResponse.json({ message: "Authentication is required." }, { status: 401 });
    if (error instanceof z.ZodError) return NextResponse.json({ message: "Choose a valid media category." }, { status: 400 });
    console.error("Cloudinary upload signature failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ message: "The image upload could not be prepared." }, { status: 500 });
  }
}
