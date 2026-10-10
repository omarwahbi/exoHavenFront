import { notFound } from "next/navigation";
import { getCategory } from "@/services/catalog";
import { absoluteMediaUrl, pageMetadata, snippet } from "@/utils/metadata";
import CategoryClient from "./CategoryClient";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { entry: category } = await getCategory(id);
  if (!category) return { title: "القسم" };
  return pageMetadata({
    title: category.name,
    description:
      snippet(category.desc) ||
      `تسوق ${category.name} من ExoHaven: مستلزمات الزواحف والحيوانات الأليفة الغريبة مع التوصيل لجميع محافظات العراق.`,
    path: `/categories/${id}`,
    image: absoluteMediaUrl(category.category_thumbnail),
  });
}

export default async function CategoryPage({ params }) {
  const { id } = await params;
  const { entry, missing } = await getCategory(id);
  if (missing) notFound();
  return <CategoryClient initialCategory={entry} />;
}
