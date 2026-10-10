import { notFound } from 'next/navigation';
import ItemClient from './ItemClient';
import { getItem } from '@/services/catalog';
import { getSale } from '@/services/sale';
import { unitPrice } from '@/utils/pricing';
import { isOutOfStock } from '@/utils/product';
import { absoluteMediaUrl, pageMetadata, snippet } from '@/utils/metadata';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const [{ entry: item }, sale] = await Promise.all([getItem(id), getSale()]);
  if (!item) return { title: 'المنتج' };

  const where = [item.sub_category?.name, item.category?.name].filter(Boolean).join(' - ');
  const metadata = pageMetadata({
    title: where ? `${item.name} | ${where}` : item.name,
    description:
      snippet(item.description) ||
      `${item.name} متوفر الآن في ExoHaven. الدفع عند الاستلام والتوصيل لجميع محافظات العراق.`,
    path: `/products/${id}`,
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

// The product is read on the server, so its name, price and description (and its
// structured data) are in the first HTML for search engines and link previews.
export default async function ItemPage({ params }) {
  const { id } = await params;
  const { entry, missing } = await getItem(id);
  if (missing) notFound();
  return <ItemClient params={{ id }} initialItem={entry} />;
}
