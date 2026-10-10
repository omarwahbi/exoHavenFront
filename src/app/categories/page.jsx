import { pageMetadata } from "@/utils/metadata";
import Breadcrumbs from "@/app/Components/Breadcrumbs";
import { CategoryGrid } from "@/app/Components/Categories";

export const metadata = pageMetadata({
  title: "الأقسام",
  description: "تصفح جميع أقسام متجر ExoHaven: مستلزمات الزواحف والطيور والحيوانات الأليفة الغريبة.",
  path: "/categories",
});

export default function CategoriesPage() {
  return (
    <div className="container-page py-6 sm:py-8" dir="rtl">
      <Breadcrumbs className="mb-4" items={[{ label: "الأقسام" }]} />
      <h1 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">الأقسام</h1>
      <CategoryGrid />
    </div>
  );
}
