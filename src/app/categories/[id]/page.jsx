import { getCategory } from "@/services/catalog";
import { entryKey } from "@/utils/ids";
import { absoluteMediaUrl, pageMetadata, snippet } from "@/utils/metadata";
import CategoryClient from "./CategoryClient";

// Server part of the category page: its title, description, canonical URL and
// share image. The page itself is CategoryClient, unchanged.
export async function generateMetadata({ params }) {
  const { id } = await params;
  const { entry: category, missing } = await getCategory(id);
  if (!category) return missing ? { title: "القسم", robots: { index: false } } : { title: "القسم" };
  return pageMetadata({
    title: category.name,
    description:
      snippet(category.desc) ||
      `تسوق ${category.name} من ExoHaven: مستلزمات الزواحف والحيوانات الأليفة الغريبة مع التوصيل لجميع محافظات العراق.`,
    path: `/categories/${entryKey(category)}`,
    image: absoluteMediaUrl(category.category_thumbnail),
  });
}

export default function CategoryPage() {
  return <CategoryClient />;
}
