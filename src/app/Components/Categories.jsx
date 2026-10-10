"use client";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/services/api";
import { QueryKeys } from "@/utils/queryKeys";
import { imageUrl } from "@/utils/media";
import { entryKey } from "@/utils/ids";
import SectionHeader from "./SectionHeader";

export const useCategories = () =>
  useQuery({ queryKey: [QueryKeys.categoriesList], queryFn: fetchCategories });

// One category: picture and name, linking to its page.
export function CategoryTile({ category }) {
  return (
    <Link
      href={`/categories/${entryKey(category)}`}
      className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-card transition-shadow hover:shadow-card-hover"
    >
      <span className="relative block aspect-square w-full max-w-[9rem] overflow-hidden rounded-full bg-green1">
        <Image
          src={imageUrl(category.category_thumbnail)}
          alt=""
          fill
          sizes="144px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </span>
      <span className="line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-green5 sm:text-base">{category.name}</span>
    </Link>
  );
}

const TileSkeleton = () => (
  <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
    <div className="aspect-square w-full max-w-[9rem] animate-pulse rounded-full bg-gray-100" />
    <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
  </div>
);

// Grid of every category (the /categories page and the home page section).
export function CategoryGrid() {
  const { data: categories = [], isLoading } = useCategories();
  return (
    // Centered, wrapping row: a shop with few categories doesn't leave a gap at the end.
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-4 sm:[&>*]:w-48" dir="rtl">
      {isLoading
        ? Array.from({ length: 5 }, (_, i) => <TileSkeleton key={i} />)
        : categories.map((category) => <CategoryTile key={category.id} category={category} />)}
    </div>
  );
}

// Home page section.
export default function Categories() {
  return (
    <section className="container-page" aria-labelledby="home-categories">
      <div id="home-categories">
        <SectionHeader title="تسوق حسب القسم" href="/categories" linkLabel="كل الأقسام" />
      </div>
      <CategoryGrid />
    </section>
  );
}
