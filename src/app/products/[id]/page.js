// Server part of the product page: its title, description, canonical URL, share
// image and price tags. The page itself is ItemClient, unchanged.
import ItemClient from './ItemClient';
import { getItem } from '@/services/catalog';
import { getSale } from '@/services/sale';
import { entryKey } from '@/utils/ids';
import { unitPrice } from '@/utils/pricing';
import { isOutOfStock } from '@/utils/product';
import { absoluteMediaUrl, pageMetadata, snippet } from '@/utils/metadata';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const [{ entry: item, missing }, sale] = await Promise.all([getItem(id), getSale()]);
  if (!item) {
    return {
      title: 'منتج غير موجود',
      description: 'المنتج الذي تبحث عنه غير متوفر',
      // A removed product shouldn't stay in Google.
      ...(missing && { robots: { index: false } }),
    };
  }

  const where = [item.sub_category?.name, item.category?.name].filter(Boolean).join(' - ');
  const metadata = pageMetadata({
    title: where ? `${item.name} | ${where}` : item.name,
    description:
      snippet(item.description) ||
      `${item.name} متوفر الآن في ExoHaven. الدفع عند الاستلام والتوصيل لجميع محافظات العراق.`,
    path: `/products/${entryKey(item)}`,
    image: absoluteMediaUrl(item.item_thumbnail) || absoluteMediaUrl(item.item_images),
  });
  return {
    ...metadata,
    other: {
      'product:price:amount': String(unitPrice(item, sale)),
      'product:price:currency': 'IQD',
      'product:availability': isOutOfStock(item) ? 'out of stock' : 'in stock',
      'product:condition': 'new',
    },
  };
}

export default async function ItemPage({ params }) {
  return <ItemClient params={await params} />;
}
