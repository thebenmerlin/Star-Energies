import { IndustryEditor } from "@/components/admin/catalogue-management";
import { getAdminIndustries, getAdminMediaAssets } from "@/lib/content";
import type { Industry } from "@/types/content";

const newIndustry: Industry = { id: "new-industry", slug: "", name: "", shortDescription: "", featured: false, active: false, status: "draft", displayOrder: 7 };

export default async function NewIndustryPage() {
  const [industries, media] = await Promise.all([getAdminIndustries(), getAdminMediaAssets()]);
  return <IndustryEditor initial={{ ...newIndustry, id: crypto.randomUUID(), displayOrder: industries.length + 1 }} media={media} isNew />;
}
