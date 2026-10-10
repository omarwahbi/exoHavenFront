"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FiCheck, FiChevronLeft, FiChevronRight, FiCreditCard, FiMinus, FiPlus, FiShoppingCart, FiTruck } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { fetchItemById, fetchRelatedProducts } from "@/services/api";
import { QueryKeys } from "@/utils/queryKeys";
import { useCart } from "@/app/context/CartContext";
import { useSale } from "@/app/context/SaleContext";
import { calculateSalePrice, isSaleActive } from "@/utils/saleUtils";
import { generateProductSchema, renderJSONLD } from "@/utils/seo";
import { itemImageUrl } from "@/utils/media";
import { entryKey } from "@/utils/ids";
import { availableVariants, basePrice, cartVariant, isLowStock, isOutOfStock, variantsOf } from "@/utils/product";
import { FREE_DELIVERY_THRESHOLD } from "@/utils/pricing";
import { WHATSAPP_URL } from "@/utils/contact";
import Breadcrumbs from "@/app/Components/Breadcrumbs";
import ProductCard from "@/app/Components/ProductCard";

// All of a product's pictures: the thumbnail first, then its images, without repeats.
const galleryOf = (item) => {
  const seen = new Set();
  return [item?.item_thumbnail, ...(item?.item_images || [])].filter((media) => {
    if (!media?.url || seen.has(media.url)) return false;
    seen.add(media.url);
    return true;
  });
};

function Gallery({ item, dimmed }) {
  const images = useMemo(() => galleryOf(item), [item]);
  const [active, setActive] = useState(0);
  const current = images[active]?.url || itemImageUrl(item);
  const go = (step) => setActive((index) => (index + step + images.length) % images.length);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <Image
          key={current}
          src={current}
          alt={item.name}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-contain p-4 ${dimmed ? "opacity-60 grayscale" : ""}`}
          priority
        />
        {images.length > 1 && (
          <>
            <button type="button" aria-label="الصورة السابقة" onClick={() => go(-1)} className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow">
              <FiChevronRight />
            </button>
            <button type="button" aria-label="الصورة التالية" onClick={() => go(1)} className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow">
              <FiChevronLeft />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`الصورة ${index + 1}`}
              aria-current={index === active}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-white sm:h-20 sm:w-20 ${index === active ? "border-green4" : "border-gray-100 hover:border-green2"}`}
            >
              <Image src={image.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Add-to-cart, or once it's in the cart a quantity stepper and a link to the cart.
function PurchaseControls({ item, variant, outOfStock, compact = false }) {
  const { quantityOf, addItem, decreaseItem } = useCart();
  const line = { ...item, variant: cartVariant(variant) };
  const quantity = quantityOf(line);

  if (outOfStock) {
    return (
      <button type="button" disabled className="btn-primary w-full">
        غير متوفر حالياً
      </button>
    );
  }
  if (quantity === 0) {
    return (
      <button type="button" onClick={() => addItem(item, variant)} className="btn-primary w-full py-3 text-base">
        <FiShoppingCart size={18} />
        أضف إلى السلة
      </button>
    );
  }
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1">
        <button type="button" aria-label="إنقاص الكمية" onClick={() => decreaseItem(line)} className="qty-btn h-9 w-9 bg-gray-100 text-gray-700">
          <FiMinus />
        </button>
        <span className="min-w-[1.5rem] text-center font-bold">{quantity}</span>
        <button type="button" aria-label="زيادة الكمية" onClick={() => addItem(item, variant)} className="qty-btn h-9 w-9 bg-green4 text-white">
          <FiPlus />
        </button>
      </div>
      <Link href="/cart" className="btn-outline flex-1">
        <FiCheck />
        {compact ? "السلة" : "في السلة – عرض السلة"}
      </Link>
    </div>
  );
}

function Price({ price, sale, outOfStock, large = false }) {
  if (outOfStock) return <span className="font-bold text-gray-400">غير متوفر</span>;
  const onSale = isSaleActive(sale);
  return (
    <div className="flex items-baseline gap-2">
      <span className={`font-extrabold ${large ? "text-3xl" : "text-lg"} ${onSale ? "text-red-600" : "text-gray-900"}`}>
        {(onSale ? calculateSalePrice(price, sale) : price).toLocaleString("en-US")}
        <span className="mr-1 text-sm font-semibold">د.ع</span>
      </span>
      {onSale && <span className="text-sm text-gray-400 line-through">{price.toLocaleString("en-US")}</span>}
    </div>
  );
}

const ProductSkeleton = () => (
  <div className="container-page grid gap-8 py-8 lg:grid-cols-2">
    <div className="aspect-square animate-pulse rounded-2xl bg-white" />
    <div className="space-y-4">
      <div className="h-8 w-2/3 animate-pulse rounded bg-white" />
      <div className="h-6 w-1/3 animate-pulse rounded bg-white" />
      <div className="h-24 animate-pulse rounded bg-white" />
    </div>
  </div>
);

// initialItem: the product as the server read it (null if that failed; this then
// fetches it in the browser).
export default function ItemClient({ params, initialItem }) {
  const sale = useSale();
  const { data: item, isLoading, error } = useQuery({
    queryKey: QueryKeys.item(params.id),
    queryFn: () => fetchItemById(params.id),
    enabled: !!params.id,
    initialData: initialItem ?? undefined,
  });

  // For items with variants: the one the shopper picked (by label), defaulting to
  // the first one in stock.
  const [variantLabel, setVariantLabel] = useState(null);
  const variants = variantsOf(item);
  const variant = variants.find((v) => v.label === variantLabel) ?? availableVariants(item)[0] ?? variants[0];
  const outOfStock = item ? isOutOfStock(item, variant) : false;
  const price = item ? basePrice(item, variant) : 0;

  const categoryId = entryKey(item?.category);
  const { data: relatedProducts = [] } = useQuery({
    queryKey: QueryKeys.relatedProducts(categoryId, entryKey(item)),
    queryFn: () => fetchRelatedProducts(categoryId, entryKey(item)),
    enabled: !!categoryId && !!item,
  });

  if (isLoading) return <ProductSkeleton />;

  if (error || !item) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center" dir="rtl">
        <p className="text-lg font-bold text-gray-900">{error ? "تعذر تحميل المنتج، حاول مرة أخرى." : "المنتج غير موجود"}</p>
        <Link href="/products" className="btn-primary">
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  const productSchema = generateProductSchema(item, sale);

  return (
    <>
      {productSchema && <script type="application/ld+json" dangerouslySetInnerHTML={renderJSONLD(productSchema)} />}

      <div className="container-page py-6 sm:py-8" dir="rtl">
        <Breadcrumbs
          className="mb-5"
          items={[
            { label: item.category?.name, href: item.category ? `/categories/${entryKey(item.category)}` : null },
            { label: item.sub_category?.name, href: item.sub_category ? `/sub-categories/${entryKey(item.sub_category)}` : null },
            { label: item.name },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <Gallery item={item} dimmed={isOutOfStock(item)} />

          <div className="flex flex-col gap-5">
            <div>
              <div className="mb-2 flex flex-wrap gap-2">
                {outOfStock ? (
                  <span className="badge bg-gray-900 text-white">نفذت الكمية</span>
                ) : isLowStock(item, variant) ? (
                  <span className="badge bg-amber-500 text-white">آخر قطعة – اطلبها الآن</span>
                ) : (
                  <span className="badge bg-green1 text-green5">متوفر</span>
                )}
                {item.new_arrival && <span className="badge bg-blue-50 text-blue-700">وصل حديثاً</span>}
                {isSaleActive(sale) && !outOfStock && <span className="badge bg-red-50 text-red-600">خصم {sale.percent}%</span>}
              </div>
              <h1 className="text-2xl font-extrabold leading-snug text-gray-900 sm:text-3xl">{item.name}</h1>
              {item.Item_ID && <p className="mt-1 text-xs text-gray-400">رمز المنتج: {item.Item_ID}</p>}
            </div>

            <Price price={price} sale={sale} outOfStock={outOfStock} large />

            {variants.length > 0 && (
              <div>
                <h2 className="mb-2 text-sm font-bold text-gray-700">
                  اختر النوع: <span className="font-semibold text-green5">{variant?.label}</span>
                </h2>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="اختر النوع">
                  {variants.map((v) => {
                    const selected = v.label === variant?.label;
                    return (
                      <button
                        key={v.label}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setVariantLabel(v.label)}
                        className={`min-w-[5rem] rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-colors ${
                          selected ? "border-green4 bg-green1 text-green5" : "border-gray-200 bg-white text-gray-700 hover:border-green3"
                        } ${v.out_of_stock ? "opacity-50" : ""}`}
                      >
                        <span className={v.out_of_stock ? "line-through" : ""}>{v.label}</span>
                        <span className="block text-xs font-normal text-gray-500">{Number(v.price).toLocaleString("en-US")} د.ع</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="hidden sm:block">
              <PurchaseControls item={item} variant={variant} outOfStock={outOfStock} />
            </div>

            <ul className="grid gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-700 sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <FiTruck className="shrink-0 text-green5" size={18} />
                توصيل لكل العراق، مجاني فوق {FREE_DELIVERY_THRESHOLD.toLocaleString("en-US")} د.ع
              </li>
              <li className="flex items-center gap-2">
                <FiCreditCard className="shrink-0 text-green5" size={18} />
                الدفع عند الاستلام
              </li>
              <li className="sm:col-span-2">
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-[#128C7E] hover:underline">
                  <FaWhatsapp size={18} />
                  عندك سؤال عن هذا المنتج؟ راسلنا
                </a>
              </li>
            </ul>

            <section>
              <h2 className="mb-2 text-base font-bold text-gray-900">وصف المنتج</h2>
              <p className="whitespace-pre-line text-sm leading-7 text-gray-700">{item.description || "لا يوجد وصف لهذا المنتج بعد."}</p>
            </section>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-14" aria-labelledby="related-products">
            <h2 id="related-products" className="section-title mb-5">
              منتجات من نفس القسم
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} item={product} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Phones: price and add-to-cart stay in reach above the tab bar. */}
      <div className="fixed inset-x-0 bottom-[calc(3.6rem+env(safe-area-inset-bottom))] z-30 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur sm:hidden" dir="rtl">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <Price price={price} sale={sale} outOfStock={outOfStock} />
          </div>
          <div className="flex-1">
            <PurchaseControls item={item} variant={variant} outOfStock={outOfStock} compact />
          </div>
        </div>
      </div>
      <div className="h-20 sm:hidden" aria-hidden="true" />
    </>
  );
}
