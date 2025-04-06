/**
 * Centralized query keys for React Query
 * This helps ensure consistent caching behavior across the application
 */

export const QueryKeys = {
  // Categories
  categories: 'categories',
  categoriesList: 'categories-list',
  
  // Subcategories
  subcategory: (id) => ['subcategory', id],
  subcategories: (categoryId) => ['subcategories', categoryId],
  
  // Items
  item: (id) => ['item', id],
  items: (filters) => ['items', filters],
  categoryItems: (categoryId, searchQuery) => ['categoryItems', categoryId, searchQuery],
  subcategoryItems: (subcategoryId, sortBy) => ['items', subcategoryId, sortBy],
  
  // Featured content
  featuredProducts: 'featured-products',
  heroProducts: 'hero-products',
  latestProducts: 'latest-products',
  newArrivals: 'new-arrivals',
  
  // Cart related
  suggestedItems: 'suggested-items',
  
  // Related products
  relatedProducts: (categoryId, itemId) => ['related-products', categoryId, itemId]
}; 