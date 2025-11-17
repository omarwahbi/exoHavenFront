// sitemap.js - Dynamic sitemap generation for SEO
import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://exohaven-iq.com';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://admin.exohaven-iq.com';

async function fetchAllCategories() {
  try {
    const { data } = await axios.get(`${apiUrl}/api/categories`, {
      params: { populate: '*' }
    });
    return data.data || [];
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
    return [];
  }
}

async function fetchAllSubCategories() {
  try {
    const { data } = await axios.get(`${apiUrl}/api/sub-categories`, {
      params: { populate: '*' }
    });
    return data.data || [];
  } catch (error) {
    console.error('Error fetching subcategories for sitemap:', error);
    return [];
  }
}

async function fetchAllItems() {
  try {
    // Fetch with pagination to get all items
    const { data } = await axios.get(`${apiUrl}/api/items`, {
      params: {
        populate: '*',
        'pagination[pageSize]': 100, // Adjust based on your item count
      }
    });
    return data.data || [];
  } catch (error) {
    console.error('Error fetching items for sitemap:', error);
    return [];
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
    fetchAllCategories(),
    fetchAllSubCategories(),
    fetchAllItems(),
  ]);

  // Generate category pages (if you have individual category pages)
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/category/${category.id}`,
    lastModified: category.attributes?.updatedAt
      ? new Date(category.attributes.updatedAt)
      : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Generate subcategory pages
  const subCategoryPages = subCategories.map((subCategory) => ({
    url: `${baseUrl}/subCategory/${subCategory.id}`,
    lastModified: subCategory.attributes?.updatedAt
      ? new Date(subCategory.attributes.updatedAt)
      : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Generate item detail pages
  const itemPages = items.map((item) => ({
    url: `${baseUrl}/item/${item.id}`,
    lastModified: item.attributes?.updatedAt
      ? new Date(item.attributes.updatedAt)
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
