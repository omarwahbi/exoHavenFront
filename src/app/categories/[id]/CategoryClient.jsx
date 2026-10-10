"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import Image from "next/image";
import Spinner from "@/app/Components/Spinner";
import { useQuery } from "@tanstack/react-query";
import { fetchCategoryById, fetchSubCategories, fetchCategoryItems } from "@/services/api";
import Breadcrumbs from "@/app/Components/Breadcrumbs";
import ProductCard from "@/app/Components/ProductCard";
import { imageUrl } from "@/utils/media";
import { entryKey } from "@/utils/ids";

// initialCategory: the category as the server read it, so its name and description
// are in the first HTML.
const SubCategories = ({ initialCategory }) => {
  const { id } = useParams();

  const { data: category } = useQuery({
    queryKey: ["category", id],
    queryFn: () => fetchCategoryById(id),
    enabled: !!id,
    initialData: initialCategory ?? undefined,
  });

  // Query for subcategories
  const {
    data: subCategories = [],
    isLoading: isSubCategoriesLoading,
    error: subCategoriesError,
  } = useQuery({
    queryKey: ["subcategories", id],
    queryFn: () => fetchSubCategories(id),
    enabled: !!id,
  });

  // Query for items (only runs if subcategories are loaded and empty)
  const {
    data: items = [],
    isLoading: isItemsLoading,
    error: itemsError,
  } = useQuery({
    queryKey: ["category-items", id],
    queryFn: () => fetchCategoryItems(id),
    enabled: !!id && !isSubCategoriesLoading && subCategories.length === 0,
  });

  // Derived loading state
  const isLoading = isSubCategoriesLoading || (subCategories.length === 0 && isItemsLoading);

  const empty = !isLoading && subCategories.length === 0 && items.length === 0;

  return (
    <div className="container-page py-6 sm:py-8" dir="rtl">
      <Breadcrumbs className="mb-4" items={[{ label: category?.name }]} />
      {category?.name && (
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{category.name}</h1>
          {category.desc && <p className="mt-2 text-gray-600">{category.desc}</p>}
          {subCategories.length > 0 && <p className="mt-1 text-sm text-gray-500">اختر القسم الفرعي</p>}
        </header>
      )}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : subCategoriesError || itemsError ? (
        <p className="py-16 text-center text-gray-600">تعذر تحميل القسم، حاول مرة أخرى.</p>
      ) : empty ? (
        <p className="py-16 text-center text-gray-600">لا توجد منتجات في هذا القسم حالياً.</p>
      ) : (
      <div
        className={
          subCategories.length > 0
            ? "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5"
            : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        }
      >
        {subCategories.length > 0
          ? subCategories.map((subCategory) => (
              <Link
                href={`/sub-categories/${entryKey(subCategory)}`}
                key={subCategory.id}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-card transition-shadow hover:shadow-card-hover"
              >
                <span className="relative block aspect-square w-full max-w-[9rem] overflow-hidden rounded-full bg-green1">
                  <Image
                    src={imageUrl(subCategory.subcategory_thumbnail)}
                    alt=""
                    fill
                    sizes="144px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </span>
                <span className="line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-green5 sm:text-base">
                  {subCategory.name}
                </span>
              </Link>
            ))
          : items.map((item, index) => <ProductCard key={item.id} item={item} priority={index < 4} />)}
      </div>
      )}
    </div>
  );
};

export default SubCategories;
