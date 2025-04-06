"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import Image from "next/image";
import Spinner from "@/app/Components/Spinner";
import { useQuery } from "@tanstack/react-query";
import { fetchSubCategories, fetchCategoryItems } from "@/services/api";

const SubCategories = () => {
  const { id } = useParams();

  // Query for subcategories
  const { 
    data: subCategories = [],
    isLoading: isSubCategoriesLoading,
    error: subCategoriesError 
  } = useQuery({
    queryKey: ['subcategories', id],
    queryFn: () => fetchSubCategories(id),
    enabled: !!id
  });

  // Query for items (only runs if subcategories are loaded and empty)
  const {
    data: items = [],
    isLoading: isItemsLoading,
    error: itemsError
  } = useQuery({
    queryKey: ['category-items', id],
    queryFn: () => fetchCategoryItems(id),
    enabled: !!id && !isSubCategoriesLoading && subCategories.length === 0
  });

  // Derived loading state
  const isLoading = isSubCategoriesLoading || 
    (subCategories.length === 0 && isItemsLoading);

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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-14 w-10/12 mx-auto mt-14">
      {subCategories.length > 0
        ? subCategories.map((subCategory) => (
            <Link href={`/items/${subCategory.id}`} key={subCategory.id} className="h-full">
              <div className="flex flex-col items-center p-4 shadow-md rounded-lg bg-white hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden mb-4 flex-shrink-0">
                  {subCategory.attributes.subcategory_thumbnail.data && (
                    <Image
                      src={
                        subCategory.attributes.subcategory_thumbnail.data
                          .attributes.url
                      }
                      width={144}
                      height={144}
                      alt={subCategory.attributes.name || "Subcategory Image"}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-grow flex items-center justify-center">
                  {subCategory.attributes.name && (
                    <h2 className="text-lg sm:text-xl font-bold text-green4 hover:text-green2 text-center">
                      {subCategory.attributes.name}
                    </h2>
                  )}
                </div>
              </div>
            </Link>
          ))
        : items.map((item) => (
            <Link href={`/item/${item.id}`} key={item.id} className="h-full">
              <div className="flex flex-col items-center p-4 shadow-md rounded-lg bg-white hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden mb-4 flex-shrink-0">
                  {item.attributes.item_thumbnail.data && (
                    <Image
                      src={item.attributes.item_thumbnail.data.attributes.url}
                      width={144}
                      height={144}
                      alt={item.attributes.name || "Item Image"}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-grow flex items-center justify-center">
                  {item.attributes.name && (
                    <h2 className="text-lg sm:text-xl font-bold text-green4 hover:text-green2 text-center">
                      {item.attributes.name}
                    </h2>
                  )}
                </div>
              </div>
            </Link>
          ))}
    </div>
  );
};

export default SubCategories;
