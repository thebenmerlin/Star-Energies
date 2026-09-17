import { notFound } from "next/navigation";
import { IndustryEditor } from "@/components/admin/catalogue-management";
import { getAdminIndustries, getAdminMediaAssets } from "@/lib/content";

export default async function IndustryEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [industries, media] = await Promise.all([getAdminIndustries(), getAdminMediaAssets()]);
  const industry = industries.find((item) => item.id === id);
  if (!industry) notFound();
  return <IndustryEditor initial={industry} media={media} />;
}
