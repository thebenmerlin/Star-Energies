import { ProductEditor } from "@/components/admin/catalogue-management";
import { getMediaAssets, getProducts } from "@/lib/content";
import type { Product } from "@/types/content";

const newProduct: Product = { id: "new-product", slug: "", name: "", shortDescription: "", featured: false, active: false, status: "draft", displayOrder: 5, consideredAgainst: "YOUR FULL BRIEF" };

export default function NewProductPage() {
  return <ProductEditor initial={{ ...newProduct, displayOrder: getProducts().length + 1 }} media={getMediaAssets()} isNew />;
}
