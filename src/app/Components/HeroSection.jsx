"use client";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { FiTruck, FiCreditCard, FiGift } from "react-icons/fi";
import { fetchLatestProducts } from "@/services/api";
import { QueryKeys } from "@/utils/queryKeys";
import { itemImageUrl } from "@/utils/media";
import { entryKey } from "@/utils/ids";
import { FREE_DELIVERY_THRESHOLD } from "@/utils/pricing";

const PERKS = [
  { Icon: FiTruck, text: "توصيل لكل محافظات العراق" },
  { Icon: FiCreditCard, text: "الدفع عند الاستلام" },
  { Icon: FiGift, text: `توصيل مجاني فوق ${FREE_DELIVERY_THRESHOLD.toLocaleString("en-US")} د.ع` },
];

// Top of the home page: what the shop is, the two main ways in, and the three
// newest products.
export default function HeroSection() {
  const { data: products = [] } = useQuery({
    queryKey: [QueryKeys.latestProducts],
    queryFn: () => fetchLatestProducts(3),
  });

  return (
    <section className="container-page pt-4 sm:pt-6" dir="rtl">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-green5 to-green4 px-6 py-10 text-white sm:px-10 lg:py-14">
        {/* Soft decorative circles. */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-white/5" />

        <div className="relative grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              متجر مستلزمات الحيوانات الأليفة الغريبة في العراق
            </p>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">كل ما تحتاجه زواحفك وطيورك في مكان واحد</h1>
            <p className="mt-4 max-w-xl text-sm text-white/85 sm:text-base">
              إضاءة، أحواض، أغذية وإكسسوارات مختارة بعناية، تصلك لباب البيت.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/products" className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-bold text-green5 shadow-lg transition-transform hover:-translate-y-0.5">
                تسوق الآن
              </Link>
              <Link href="/categories" className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10">
                تصفح الأقسام
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/90 sm:text-sm">
              {PERKS.map(({ Icon, text }) => (
                <li key={text} className="flex items-center gap-2">
                  <Icon size={16} />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* The newest products, desktop only. */}
          <div className="hidden grid-cols-3 gap-3 lg:grid">
            {products.slice(0, 3).map((product, index) => (
              <Link
                key={product.id}
                href={`/products/${entryKey(product)}`}
                className={`group relative aspect-[3/4] overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/20 ${index === 1 ? "-translate-y-6" : ""}`}
              >
                <Image src={itemImageUrl(product)} alt={product.name || ""} fill sizes="200px" className="object-cover transition-transform duration-500 group-hover:scale-105" priority />
                <span className="absolute inset-x-2 bottom-2 line-clamp-1 rounded-xl bg-white/90 px-2 py-1 text-center text-xs font-bold text-gray-900">
                  {product.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
