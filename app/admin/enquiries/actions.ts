"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { AdminAuthorizationError } from "@/lib/auth";
import { addAdminEnquiryNote, updateAdminEnquiryStatus } from "@/lib/enquiries";
import type { AdminActionResult } from "@/app/admin/actions";
import type { EnquiryNote } from "@/types/enquiry";

type EnquiryActionResult<T> = AdminActionResult & { data?: T };

function actionError(error: unknown): EnquiryActionResult<never> {
  if (error instanceof z.ZodError) return { ok: false, message: error.issues[0]?.message ?? "Check the enquiry details and try again." };
  if (error instanceof AdminAuthorizationError) return { ok: false, message: "Your admin session has expired. Sign in again." };
  console.error("Enquiry admin action failed", error instanceof Error ? error.message : "Unknown error");
  return { ok: false, message: "We could not update this enquiry. Please try again." };
}

export async function updateEnquiryStatusAction(input: unknown): Promise<EnquiryActionResult<{ status: string; updatedAt: string }>> {
  try {
    const enquiry = await updateAdminEnquiryStatus(input);
    revalidatePath("/admin");
    revalidatePath("/admin/enquiries");
    revalidatePath(`/admin/enquiries/${enquiry.id}`);
    return { ok: true, message: "Enquiry status updated.", data: { status: enquiry.status, updatedAt: enquiry.updatedAt } };
  } catch (error) {
    return actionError(error);
  }
}

export async function addEnquiryNoteAction(input: unknown): Promise<EnquiryActionResult<EnquiryNote>> {
  try {
    const note = await addAdminEnquiryNote(input);
    const id = typeof input === "object" && input !== null && "enquiryId" in input ? String(input.enquiryId) : "";
    revalidatePath("/admin");
    revalidatePath("/admin/enquiries");
    if (id) revalidatePath(`/admin/enquiries/${id}`);
    return { ok: true, message: "Internal note added.", data: note };
  } catch (error) {
    return actionError(error);
  }
}
