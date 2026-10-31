import { getSubCategory } from "@/services/catalog";
import { entryKey } from "@/utils/ids";
import { absoluteMediaUrl, pageMetadata } from "@/utils/metadata";
import SubCategoryClient from "./SubCategoryClient";

// Server part of the sub-category page: its title, description, canonical URL
// and share image. The page itself is SubCategoryClient, unchanged.
export async function generateMetadata({ params }) {
  const { id } = await params;
  const { entry: sub, missing } = await getSubCategory(id);
  if (!sub) return missing ? { title: "القسم", robots: { index: false } } : { title: "القسم" };
  const title = sub.category?.name ? `${sub.name} - ${sub.category.name}` : sub.name;
  return pageMetadata({
    title,
    description: `تسوق ${sub.name}${sub.category?.name ? ` من قسم ${sub.category.name}` : ""} في ExoHaven: الدفع عند الاستلام والتوصيل لجميع محافظات العراق.`,
    path: `/sub-categories/${entryKey(sub)}`,
    image: absoluteMediaUrl(sub.subcategory_thumbnail),
  });
}

export default function SubCategoryPage() {
  return <SubCategoryClient />;
}
