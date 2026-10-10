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

export const fetchSubCategoryItems = async (subCategoryId, page = 1, pageSize = 12, sortBy = null) => {
  const { data } = await api.get('/api/items', {
    params: {
      'filters[sub_category][documentId][$eq]': subCategoryId,
      'populate': '*',
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
      'sort[0]': 'new_arrival:desc',
      'sort[1]': 'out_of_stock:asc',
      'sort[2]': sortBy || 'createdAt:desc'
    }
  });
  return data;
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

// One page of /products: optionally one category and a name search.
export const fetchProductsPage = async ({ pageParam = 1, categoryId, searchQuery, signal }) => {
  const params = {
    pagination: {
      page: pageParam,
      pageSize: 12
    },
    // Only select specific fields we need, excluding buffer data
    fields: ['name', 'description', 'state', 'new_arrival', 'out_of_stock', 'low_stock', 'Item_ID'],
    // Use specific fields to populate instead of '*' to reduce response size
    populate: {
      item_thumbnail: {
        fields: ['name', 'url', 'width', 'height', 'formats']
      },
      // Fallback image for items saved without a thumbnail
      item_images: {
        fields: ['url']
      },
      variants: true,
      category: {
        fields: ['name']
      },
      sub_category: {
        fields: ['name']
      }
    },
    // Sort: new items first, out of stock at bottom, then by creation date
    sort: ['new_arrival:desc', 'out_of_stock:asc', 'createdAt:desc']
  };

  if (categoryId) {
    params.filters = {
      ...params.filters,
      category: { documentId: { $eq: categoryId } }
    };
  }
  
  if (searchQuery) {
    params.filters = {
      ...params.filters,
      name: { $containsi: searchQuery }
    };
  }

  try {
    const data = await api.get('/api/items', { params, signal });
    return {
      items: data.data.data,
      nextPage: pageParam + 1,
      hasMore: pageParam < data.data.meta.pagination.pageCount,
      total: data.data.meta.pagination.total,
    };
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export default api; 