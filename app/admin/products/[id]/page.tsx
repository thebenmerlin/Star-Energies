import { notFound } from "next/navigation";
import { ProductEditor } from "@/components/admin/catalogue-management";
import { getMediaAssets, getProducts } from "@/lib/content";

export function generateStaticParams() { return getProducts().map((product) => ({ id: product.id })); }

export default async function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProducts().find((item) => item.id === id);
  if (!product) notFound();
  return <ProductEditor initial={product} media={getMediaAssets()} />;
}
