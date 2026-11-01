import Categories from "@/app/Components/Categories";
import { pageMetadata } from "@/utils/metadata";

export const metadata = pageMetadata({
  title: "الأقسام",
  description: "تصفح جميع أقسام متجر ExoHaven: مستلزمات الزواحف والطيور والحيوانات الأليفة الغريبة.",
  path: "/categories",
});

// Every category, with the same banner as the products page and the home page's
// category tiles.
export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <div className="bg-gradient-to-r from-green3 to-green4 text-white py-12 px-4 mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">أقسام المتجر</h1>
          <p className="text-lg text-center text-white/80 max-w-2xl mx-auto">
            اختر القسم الذي تبحث عنه وتصفح منتجاته
          </p>
        </div>
      </div>
      <div className="px-4">
        <Categories showHeading={false} />
      </div>
    </div>
  );
}
