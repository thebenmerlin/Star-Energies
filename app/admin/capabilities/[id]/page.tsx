import { notFound } from "next/navigation";
import { CapabilityEditor } from "@/components/admin/catalogue-management";
import { getCapabilities, getMediaAssets } from "@/lib/content";

export function generateStaticParams() { return getCapabilities().map((capability) => ({ id: capability.id })); }

export default async function CapabilityEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const capability = getCapabilities().find((item) => item.id === id);
  if (!capability) notFound();
  return <CapabilityEditor initial={capability} media={getMediaAssets()} />;
}
