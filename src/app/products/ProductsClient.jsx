"use client";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProductsPage } from "@/services/api";
import { QueryKeys } from "@/utils/queryKeys";
import { isOutOfStock } from "@/utils/product";
import Breadcrumbs from "@/app/Components/Breadcrumbs";
import ProductCard from "@/app/Components/ProductCard";
import Spinner from "@/app/Components/Spinner";
import { useCategories } from "@/app/Components/Categories";
import ProductFilters from "./components/ProductFilters";

// /products: every product, filtered by ?q= (the header's search), ?category= and
// ?instock=1. Filters live in the URL, so a filtered view can be shared or
// bookmarked and the back button works.
function ProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const query = params.get("q")?.trim() || "";
  const categoryId = params.get("category") || null;
  const inStockOnly = params.get("instock") === "1";

  const setParams = (changes) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const { data: categories = [] } = useCategories();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery({
    queryKey: [...QueryKeys.categoryItems(categoryId, query), inStockOnly],
    queryFn: ({ pageParam = 1, signal }) =>
      fetchProductsPage({ pageParam, signal, categoryId, searchQuery: query, inStockOnly }),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextPage : undefined),
  });

  const items = useMemo(() => {
    const all = data ? data.pages.flatMap((page) => page.items) : [];
    // The API leaves out items marked out of stock; this also drops items whose
    // variants are all out of stock.
    return inStockOnly ? all.filter((item) => !isOutOfStock(item)) : all;
  }, [data, inStockOnly]);
  const total = data?.pages[0]?.total ?? 0;

  // Load the next page when the end of the list scrolls into view.
  const sentinel = useRef(null);
  useEffect(() => {
    const node = sentinel.current;
    if (!node || !hasNextPage) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: "600px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const reset = () => router.replace(pathname, { scroll: false });

  return (
    <div className="container-page py-6 sm:py-8" dir="rtl">
      <Breadcrumbs className="mb-4" items={[{ label: "المنتجات", href: query ? "/products" : null }, query && { label: `بحث: ${query}` }]} />
      <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{query ? `نتائج البحث عن «${query}»` : "كل المنتجات"}</h1>
        {!isLoading && <p className="text-sm text-gray-500">{total.toLocaleString("en-US")} منتج</p>}
      </div>

      <ProductFilters
        categories={categories}
        categoryId={categoryId}
        onCategory={(id) => setParams({ category: id })}
        inStockOnly={inStockOnly}
        onInStockOnly={(on) => setParams({ instock: on ? "1" : null })}
        query={query}
        onClearQuery={() => setParams({ q: null })}
        onReset={reset}
      />

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : isError ? (
        <p className="py-16 text-center text-gray-600">تعذر تحميل المنتجات، حاول مرة أخرى.</p>
      ) : items.length === 0 && !hasNextPage ? (
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-14 text-center">
          <p className="text-lg font-bold text-gray-900">لا توجد منتجات مطابقة</p>
          <p className="mt-1 text-sm text-gray-500">جرّب كلمة بحث أخرى أو أزل بعض الفلاتر.</p>
          <button type="button" onClick={reset} className="btn-primary mt-5">
            عرض كل المنتجات
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {items.map((item, index) => (
              <ProductCard key={item.id} item={item} priority={index < 4} />
            ))}
          </div>
          <div ref={sentinel} className="flex justify-center py-8">
            {isFetchingNextPage ? <Spinner /> : !hasNextPage && <p className="text-sm text-gray-400">هذه كل المنتجات</p>}
          </div>
        </>
      )}
    </div>
  );
}

export default function ProductsClient() {
  return (
    <Suspense>
      <ProductsPage />
    </Suspense>
  );
}
