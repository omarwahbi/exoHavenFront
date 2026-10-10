"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import Image from "next/image";
import Spinner from "@/app/Components/Spinner";
import { useQuery } from "@tanstack/react-query";
import { fetchCategoryById, fetchSubCategories, fetchCategoryItems } from "@/services/api";
import Breadcrumbs from "@/app/Components/Breadcrumbs";
import ProductGridCard from "@/app/Components/ProductGridCard";
import { imageUrl } from "@/utils/media";
import { entryKey } from "@/utils/ids";

const SubCategories = () => {
  const { id } = useParams();

  const { data: category } = useQuery({
    queryKey: ["category", id],
    queryFn: () => fetchCategoryById(id),
    enabled: !!id,
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (subCategoriesError || itemsError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>Error loading data. Please try again later.</p>
      </div>
    );
  }

  if (subCategories.length === 0 && items.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>عذراً لا يوجد مواد</p>
      </div>
    );
  }

  return (
    <div className="w-11/12 md:w-10/12 mx-auto mt-8 mb-14">
      <Breadcrumbs className="mb-4" items={[{ label: category?.name }]} />
      {category?.name && (
        <header className="mb-8 text-center md:text-right">
          <h1 className="text-2xl md:text-3xl font-bold text-green4">{category.name}</h1>
          {category.desc && <p className="mt-2 text-gray-600">{category.desc}</p>}
          {subCategories.length > 0 && <p className="mt-1 text-sm text-gray-500">اختر القسم الفرعي</p>}
        </header>
      )}
      <div
        className={
          subCategories.length > 0
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
            : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        }
      >
        {subCategories.length > 0
          ? subCategories.map((subCategory) => (
              <Link href={`/sub-categories/${entryKey(subCategory)}`} key={subCategory.id} className="h-full">
                <div className="flex flex-col items-center p-4 shadow-md rounded-lg bg-white hover:shadow-lg transition-shadow duration-300 h-full">
                  <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden mb-4 flex-shrink-0">
                    <Image
                      src={imageUrl(subCategory.subcategory_thumbnail)}
                      width={144}
                      height={144}
                      alt={subCategory.name || "Subcategory Image"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow flex items-center justify-center">
                    {subCategory.name && (
                      <h2 className="text-lg sm:text-xl font-bold text-green4 hover:text-green2 text-center">
                        {subCategory.name}
                      </h2>
                    )}
                  </div>
                </div>
              </Link>
            ))
          : items.map((item, index) => <ProductGridCard key={item.id} item={item} index={index} />)}
      </div>
    </div>
  );
};

export default SubCategories;
