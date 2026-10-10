import axios from 'axios';

import { API_URL } from '@/utils/apiUrl';
import { flattenResponse } from '@/utils/strapi';

export { API_URL };

// Create axios instance with default config and improved caching
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
// The app reads Strapi data in its flat v5 shape (see utils/strapi.js).
api.interceptors.response.use((response) => {
  response.data = flattenResponse(response.data);
  return response;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Categories
export const fetchCategories = async () => {
  const { data } = await api.get('/api/categories', {
    params: {
      populate: '*'
    }
  });
  return data.data;
};

export const fetchCategoryById = async (id) => {
  const { data } = await api.get(`/api/categories/${id}`, {
    params: { 'fields[0]': 'name', 'fields[1]': 'desc' }
  });
  return data.data;
};

// Subcategories
export const fetchSubCategories = async (categoryId) => {
  const { data } = await api.get('/api/sub-categories', {
    params: {
      'filters[category][documentId][$eq]': categoryId,
      'populate': 'subcategory_thumbnail'
    }
  });
  return data.data || [];
};

// Items
export const fetchItemById = async (id) => {
  const { data } = await api.get(`/api/items/${id}`, {
    params: {
      populate: '*'
    }
  });
  return data.data;
};

export const fetchCategoryItems = async (categoryId, page = 1, pageSize = 12) => {
  const { data } = await api.get('/api/items', {
    params: {
      'filters[category][documentId][$eq]': categoryId,
      'populate': 'item_thumbnail,item_images,variants',
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
      'sort[0]': 'new_arrival:desc',
      'sort[1]': 'out_of_stock:asc',
      'sort[2]': 'createdAt:desc'
    }
  });
  return data.data || [];
};

export const fetchNewArrivals = async (limit = 6) => {
  const { data } = await api.get('/api/items', {
    params: {
      'filters[new_arrival][$eq]': true,
      'populate': 'category,sub_category,item_thumbnail,item_images,variants',
      'pagination[limit]': limit
    }
  });
  return data.data;
};

export const fetchFeaturedProducts = async (limit = 4, sort = null) => {
  const { data } = await api.get('/api/items', {
    params: {
      'populate': '*',
      'pagination[limit]': limit,
      'sort[0]': 'new_arrival:desc',
      'sort[1]': 'out_of_stock:asc',
      'sort[2]': sort || 'createdAt:desc'
    }
  });
  return data.data;
};

export const fetchLatestProducts = async (limit = 3) => {
  const { data } = await api.get('/api/items', {
    params: {
      'populate': '*',
      'pagination[limit]': limit,
      'sort': 'createdAt:desc'
    }
  });
  return data.data;
};

export const fetchRelatedProducts = async (categoryId, currentItemId, limit = 4) => {
  const { data } = await api.get('/api/items', {
    params: {
      'filters[category][documentId][$eq]': categoryId,
      'filters[documentId][$ne]': currentItemId,
      'populate': 'item_thumbnail,item_images,variants',
      'pagination[limit]': limit,
      'sort[0]': 'new_arrival:desc',
      'sort[1]': 'out_of_stock:asc',
      'sort[2]': 'createdAt:desc'
    }
  });
  return data.data;
};

export const fetchSubCategoryById = async (id) => {
  const { data } = await api.get(`/api/sub-categories/${id}`, {
    params: {
      populate: 'category'
    }
  });
  return data;
};

export const fetchSuggestedItems = async (limit = 4) => {
  const { data } = await api.get('/api/items', {
    params: {
      populate: 'item_thumbnail,item_images,variants',
      'pagination[limit]': limit,
      sort: 'updatedAt:desc',
      'filters[out_of_stock][$eq]': false
    }
  });
  return data.data;
};

// Product search and listings (the backend's /api/search: Meilisearch, or its
// database when that's down). Options: q, category, subCategory (documentIds),
// inStock, sort (relevance | featured | newest | price_asc | price_desc | name),
// page, pageSize, suggest (also return categories whose name matches).
//
// A backend from before /api/search answers 404; then the same filters go to
// /api/items, without the smarter matching and with sorting by the price text.
let searchEndpointMissing = false;

const LEGACY_SORT = {
  relevance: ['new_arrival:desc', 'out_of_stock:asc', 'createdAt:desc'],
  featured: ['new_arrival:desc', 'out_of_stock:asc', 'createdAt:desc'],
  newest: ['out_of_stock:asc', 'createdAt:desc'],
  price_asc: ['out_of_stock:asc', 'state:asc'],
  price_desc: ['out_of_stock:asc', 'state:desc'],
  name: ['out_of_stock:asc', 'name:asc'],
};

const legacySearch = async ({ q, category, subCategory, inStock, sort, page, pageSize, signal }) => {
  const filters = {};
  if (q) filters.name = { $containsi: q };
  if (category) filters.category = { documentId: { $eq: category } };
  if (subCategory) filters.sub_category = { documentId: { $eq: subCategory } };
  if (inStock) filters.out_of_stock = { $eq: false };
  const { data } = await api.get('/api/items', {
    params: {
      filters,
      sort: LEGACY_SORT[sort] ?? LEGACY_SORT.featured,
      populate: { item_thumbnail: true, item_images: true, variants: true, category: true, sub_category: true },
      pagination: { page, pageSize },
    },
    signal,
  });
  return { items: data.data || [], pagination: data.meta.pagination, categories: [] };
};

export const searchProducts = async ({
  q = '',
  category = null,
  subCategory = null,
  inStock = false,
  sort,
  page = 1,
  pageSize = 12,
  suggest = false,
  signal,
} = {}) => {
  const options = { q, category, subCategory, inStock, sort: sort || (q ? 'relevance' : 'featured'), page, pageSize, signal };
  let result;
  if (!searchEndpointMissing) {
    try {
      const { data } = await api.get('/api/search', {
        params: {
          q: q || undefined,
          category: category || undefined,
          sub_category: subCategory || undefined,
          instock: inStock ? 1 : undefined,
          sort: options.sort,
          page,
          pageSize,
          suggest: suggest ? 1 : undefined,
        },
        signal,
      });
      result = { items: data.data || [], pagination: data.meta.pagination, categories: data.meta.categories || [] };
    } catch (error) {
      if (error?.response?.status !== 404) throw error;
      searchEndpointMissing = true;
    }
  }
  if (!result) result = await legacySearch(options);
  const { page: current, pageCount, total } = result.pagination;
  return {
    items: result.items,
    categories: result.categories,
    total,
    page: current,
    pageCount,
    hasMore: current < pageCount,
    nextPage: current + 1,
  };
};

export default api;
