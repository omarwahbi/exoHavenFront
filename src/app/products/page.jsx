import { pageMetadata } from "@/utils/metadata";
import ProductsClient from "./ProductsClient";

// Search results (?q=) are kept out of the index: they repeat products listed
// elsewhere. Their links are still followed.
export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  return pageMetadata({
    title: query ? `نتائج البحث عن "${query}"` : "كل المنتجات",
    description: "تصفح جميع مستلزمات الزواحف والطيور والحيوانات الأليفة الغريبة في ExoHaven، مع التوصيل لجميع محافظات العراق والدفع عند الاستلام.",
    path: "/products",
    noindex: Boolean(query),
  });
}

export default function ProductsPage() {
  return <ProductsClient />;
}
