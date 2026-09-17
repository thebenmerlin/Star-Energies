import { NextResponse } from "next/server";

import { createInitialAdministrator } from "@/lib/admin-setup";

export const runtime = "nodejs";

function getClientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim().slice(0, 100) || "unknown";
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 4_096) {
    return NextResponse.json({ message: "The submitted details are too large." }, { status: 413 });
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ message: "Please check the submitted details." }, { status: 400 });
  }

  const result = await createInitialAdministrator(input, getClientIp(request));
  if (!result.ok) return NextResponse.json({ message: result.message }, { status: result.status });

  return NextResponse.json({ ok: true }, { status: 201 });
}
