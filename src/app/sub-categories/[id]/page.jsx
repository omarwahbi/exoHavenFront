import { notFound } from "next/navigation";
import { getSubCategory } from "@/services/catalog";
import { absoluteMediaUrl, pageMetadata } from "@/utils/metadata";
import SubCategoryClient from "./SubCategoryClient";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { entry: sub } = await getSubCategory(id);
  if (!sub) return { title: "القسم" };
  const title = sub.category?.name ? `${sub.name} - ${sub.category.name}` : sub.name;
  return pageMetadata({
    title,
    description: `تسوق ${sub.name}${sub.category?.name ? ` من قسم ${sub.category.name}` : ""} في ExoHaven: أسعار واضحة، الدفع عند الاستلام، والتوصيل لجميع محافظات العراق.`,
    path: `/sub-categories/${id}`,
    image: absoluteMediaUrl(sub.subcategory_thumbnail),
  });
}

export default async function SubCategoryPage({ params }) {
  const { id } = await params;
  const { entry, missing } = await getSubCategory(id);
  if (missing) notFound();
  return <SubCategoryClient initialSubCategory={entry} />;
}
