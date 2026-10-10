"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchFeaturedProducts } from "@/services/api";
import { QueryKeys } from "@/utils/queryKeys";
import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";

const COUNT = 8;

// Home page: a grid of products (in stock and newest first).
export default function FeaturedProducts() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: [QueryKeys.featuredProducts, COUNT],
    queryFn: () => fetchFeaturedProducts(COUNT),
  });

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="container-page" aria-labelledby="home-featured" dir="rtl">
      <SectionHeader id="home-featured" title="منتجات مختارة" subtitle="مختارات من متجرنا" href="/products" linkLabel="كل المنتجات" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }, (_, i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-white" />)
          : products.map((product) => <ProductCard key={product.id} item={product} />)}
      </div>
    </section>
  );
}
