import { notFound } from "next/navigation";
import { IndustryEditor } from "@/components/admin/catalogue-management";
import { getIndustries, getMediaAssets } from "@/lib/content";

export function generateStaticParams() { return getIndustries().map((industry) => ({ id: industry.id })); }

export default async function IndustryEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const industry = getIndustries().find((item) => item.id === id);
  if (!industry) notFound();
  return <IndustryEditor initial={industry} media={getMediaAssets()} />;
}
