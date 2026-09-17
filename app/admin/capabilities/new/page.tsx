import { CapabilityEditor } from "@/components/admin/catalogue-management";
import { getAdminCapabilities, getAdminMediaAssets } from "@/lib/content";
import type { Capability } from "@/types/content";

const newCapability: Capability = { id: "new-capability", slug: "", title: "", shortDescription: "", featured: false, active: false, status: "draft", displayOrder: 8 };

export default async function NewCapabilityPage() {
  const [capabilities, media] = await Promise.all([getAdminCapabilities(), getAdminMediaAssets()]);
  return <CapabilityEditor initial={{ ...newCapability, id: crypto.randomUUID(), displayOrder: capabilities.length + 1 }} media={media} />;
}
