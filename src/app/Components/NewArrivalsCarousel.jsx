"use client";
import { useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { fetchNewArrivals } from "@/services/api";
import { QueryKeys } from "@/utils/queryKeys";
import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";

const NEW_ARRIVALS_LIMIT = 12;

// Swiper's loop mode needs at least 2 x slidesPerView slides (5 per view on wide
// screens), otherwise it silently stops looping; with fewer products they repeat.
const MIN_LOOP_SLIDES = 10;

const BREAKPOINTS = {
  0: { slidesPerView: 2.15, spaceBetween: 12 },
  640: { slidesPerView: 3, spaceBetween: 16 },
  1024: { slidesPerView: 4, spaceBetween: 20 },
  1280: { slidesPerView: 5, spaceBetween: 20 },
};

const CardSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
    <div className="aspect-square animate-pulse bg-gray-100" />
    <div className="space-y-2 p-4">
      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
      <div className="h-4 w-1/3 animate-pulse rounded bg-gray-100" />
    </div>
  </div>
);

// Home page: newest products, in an endless carousel with arrows.
export default function NewArrivalsCarousel() {
  const { data: items = [], isLoading } = useQuery({
    queryKey: [QueryKeys.newArrivals, NEW_ARRIVALS_LIMIT],
    queryFn: () => fetchNewArrivals(NEW_ARRIVALS_LIMIT),
  });
  const swiperRef = useRef(null);

  // A single product is shown on its own; looping it would fill the row with copies.
  const canLoop = items.length > 1;
  const slides = useMemo(() => {
    const copies = canLoop ? Math.ceil(MIN_LOOP_SLIDES / items.length) : 1;
    return Array.from({ length: copies }, (_, copy) => items.map((item) => ({ item, copy, key: `${item.id}-${copy}` }))).flat();
  }, [items, canLoop]);

  if (!isLoading && items.length === 0) return null;

  const arrow = "absolute top-1/3 z-10 hidden h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-md transition-colors hover:text-green5 sm:flex";

  return (
    <section className="container-page" aria-labelledby="home-new-arrivals" dir="rtl">
      <SectionHeader id="home-new-arrivals" title="وصل حديثاً" href="/new-arrivals" />
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }, (_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="relative">
          <Swiper
            modules={[Autoplay]}
            dir="rtl"
            loop={canLoop}
            breakpoints={BREAKPOINTS}
            autoplay={canLoop ? { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            className="!pb-1"
          >
            {slides.map(({ item, copy, key }, index) => (
              // Repeated copies are hidden from screen readers.
              <SwiperSlide key={key} className="!h-auto" aria-hidden={copy > 0 ? "true" : undefined}>
                <ProductCard item={item} priority={index < 2} />
              </SwiperSlide>
            ))}
          </Swiper>
          {canLoop && (
            <>
              <button type="button" aria-label="السابق" onClick={() => swiperRef.current?.slidePrev()} className={`${arrow} -right-3`}>
                <FiChevronRight size={20} />
              </button>
              <button type="button" aria-label="التالي" onClick={() => swiperRef.current?.slideNext()} className={`${arrow} -left-3`}>
                <FiChevronLeft size={20} />
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
