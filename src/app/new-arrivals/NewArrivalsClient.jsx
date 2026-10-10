"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchNewArrivals } from "@/services/api";
import { QueryKeys } from "@/utils/queryKeys";
import Breadcrumbs from "@/app/Components/Breadcrumbs";
import ProductCard from "@/app/Components/ProductCard";

const LIMIT = 24;

export default function NewArrivalsPage() {
  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: [QueryKeys.items, "new_arrival", LIMIT],
    queryFn: () => fetchNewArrivals(LIMIT),
  });

  return (
    <div className="container-page py-6 sm:py-8" dir="rtl">
      <Breadcrumbs className="mb-4" items={[{ label: "وصل حديثاً" }]} />
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">وصل حديثاً</h1>
      <p className="mb-6 mt-1 text-sm text-gray-500">أحدث المنتجات التي وصلت إلى متجرنا</p>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : isError ? (
        <p className="py-16 text-center text-gray-600">تعذر تحميل المنتجات، حاول مرة أخرى.</p>
      ) : items.length === 0 ? (
        <p className="py-16 text-center text-gray-600">لا توجد منتجات جديدة حالياً.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {items.map((item, index) => (
            <ProductCard key={item.id} item={item} priority={index < 4} />
          ))}
        </div>
      )}
    </div>
  );
}
