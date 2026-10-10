// Server Component for dynamic metadata generation
import ItemClient from './ItemClient';
import axios from 'axios';
import { API_URL as apiUrl } from '@/services/api';
import { mediaUrl } from '@/utils/media';
import { entryKey } from '@/utils/ids';
import { unitPrice } from '@/utils/pricing';
import { flattenResponse } from '@/utils/strapi';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://exohaven-iq.com';

// Fetch item data for metadata generation (server-side)
async function getItem(id) {
  try {
    const { data } = await axios.get(`${apiUrl}/api/items/${id}`, {
      params: {
        populate: '*'
      }
    });
    return flattenResponse(data).data;
  } catch (error) {
    console.error('Error fetching item for metadata:', error);
    return null;
  }
}

// Generate dynamic metadata for each product page
export async function generateMetadata(props) {
  const params = await props.params;
  const item = await getItem(params.id);

  if (!item) {
    return {
      title: 'منتج غير موجود | ExoHaven Iraq',
      description: 'المنتج الذي تبحث عنه غير متوفر',
    };
  }

  const { name, description, out_of_stock, category } = item;

  // Get image URL
  let imageUrl = `${siteUrl}/og-image.png`;
  const thumbnailUrl = mediaUrl(item.item_thumbnail) || mediaUrl(item.item_images);
  if (thumbnailUrl) {
    imageUrl = thumbnailUrl.startsWith('http')
      ? thumbnailUrl
      : `https://ik.imagekit.io/5a72nvbtu${thumbnailUrl}`;
  }

  const salePrice = unitPrice(item);

  const productTitle = `${name} | ExoHaven Iraq - مستلزمات الحيوانات الأليفة`;
  const productDescription = description
    ? `${description.substring(0, 150)}... اشتري الآن من ExoHaven مع توصيل مجاني فوق 50,000 دينار. خصم 10% على الطلبات عبر الموقع.`
    : `${name} - متوفر الآن في ExoHaven Iraq. توصيل مجاني للطلبات فوق 50,000 دينار، خصم 10% على الموقع، الدفع عند الاستلام.`;

  return {
    title: productTitle,
    description: productDescription,
    keywords: [
      name,
      'مستلزمات حيوانات أليفة',
      'مستلزمات زواحف',
      'ExoHaven Iraq',
      'توصيل مجاني العراق',
      category?.name || 'pet accessories',
      'exotic pets Iraq',
      'reptile supplies Baghdad',
    ],
    openGraph: {
      title: productTitle,
      description: productDescription,
      type: 'website', // Changed from 'product' to 'website' - Next.js doesn't support 'product' type
      locale: 'ar_IQ',
      url: `${siteUrl}/item/${entryKey(item)}`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: name,
        },
      ],
      siteName: 'ExoHaven Iraq',
    },
    twitter: {
      card: 'summary_large_image',
      title: productTitle,
      description: productDescription.substring(0, 200),
      images: [imageUrl],
    },
    alternates: {
      canonical: `/item/${entryKey(item)}`,
    },
    other: {
      'product:price:amount': salePrice.toString(),
      'product:price:currency': 'IQD',
      'product:availability': out_of_stock ? 'out of stock' : 'in stock',
      'product:condition': 'new',
    },
  };
}

// Main page component (server component)
export default async function ItemPage(props) {
  const params = await props.params;
  return <ItemClient params={params} />;
}
