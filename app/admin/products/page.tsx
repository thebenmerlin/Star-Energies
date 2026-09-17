import { ProductsManager } from "@/components/admin/catalogue-management";
import { getProducts } from "@/lib/content";

export default function AdminProductsPage() {
  return <ProductsManager products={getProducts()} />;
}
