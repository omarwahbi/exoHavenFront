// sitemap.js - Dynamic sitemap generation for SEO
import api from '@/services/api';
import { entryKey } from "@/utils/ids";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://exohaven-iq.com';

// Rebuild the sitemap at most hourly. Without this it is generated once at build
// time, and products added afterwards never appear in it.
export const revalidate = 3600;

// Every published entry of a collection, page by page (Strapi caps a page at 100).
async function fetchAll(collection) {
  const entries = [];
  try {
    for (let page = 1; ; page++) {
      const { data } = await api.get(`/api/${collection}`, {
        params: {
          'fields[0]': 'updatedAt',
          'pagination[page]': page,
          'pagination[pageSize]': 100,
        },
      });
      entries.push(...(data.data || []));
      if (page >= (data.meta?.pagination?.pageCount ?? 1)) return entries;
    }
  } catch (error) {
    console.error(`Error fetching ${collection} for sitemap:`, error.message);
    return entries;
  }
}

export default async function sitemap() {
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/aboutUs`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Fetch dynamic data
  const [categories, subCategories, items] = await Promise.all([
    fetchAll('categories'),
    fetchAll('sub-categories'),
    fetchAll('items'),
  ]);

  // Category pages: /subCategory/[id] lists a category's subcategories
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/subCategory/${entryKey(category)}`,
    lastModified: category?.updatedAt
      ? new Date(category.updatedAt)
      : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Subcategory pages: /items/[id] lists a subcategory's products
  const subCategoryPages = subCategories.map((subCategory) => ({
    url: `${baseUrl}/items/${entryKey(subCategory)}`,
    lastModified: subCategory?.updatedAt
      ? new Date(subCategory.updatedAt)
      : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Generate item detail pages
  const itemPages = items.map((item) => ({
    url: `${baseUrl}/item/${entryKey(item)}`,
    lastModified: item?.updatedAt
      ? new Date(item.updatedAt)
      : new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  // Combine all pages
  return [
    ...staticPages,
    ...categoryPages,
    ...subCategoryPages,
    ...itemPages,
  ];
}
