import { pageMetadata } from "@/utils/metadata";
import ProductsClient from "./ProductsClient";

// Filtered, sorted and search views (?q=, ?category=, ?instock=, ?sort=) are kept
// out of the index:
// they repeat products listed elsewhere. Their links are still followed.
export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const filtered = Boolean(query || params.category || params.instock || params.sort);
  return pageMetadata({
    title: query ? `نتائج البحث عن "${query}"` : "كل المنتجات",
    description: "تصفح جميع مستلزمات الزواحف والطيور والحيوانات الأليفة الغريبة في ExoHaven، مع التوصيل لجميع محافظات العراق والدفع عند الاستلام.",
    path: "/products",
    noindex: filtered,
  });
}

export default function ProductsPage() {
  return <ProductsClient />;
}
