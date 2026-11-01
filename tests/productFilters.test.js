import { describe, expect, it } from 'vitest';
import {
  activeFilterCount,
  filtersToQuery,
  isPlainListing,
  priceBoundsBeforeSale,
  readFilters,
} from '@/utils/productFilters';

const read = (query) => readFilters(new URLSearchParams(query));

describe('readFilters / filtersToQuery', () => {
  it('reads every filter and writes the same address back', () => {
    const query = 'q=%D8%AD%D9%88%D8%B6&category=abc&sub=def&min=5000&max=25000&sort=price_asc&new=1&instock=1';
    const filters = read(query);
    expect(filters).toEqual({
      q: 'حوض', category: 'abc', sub: 'def', min: 5000, max: 25000, sort: 'price_asc', newOnly: true, inStock: true,
    });
    expect(filtersToQuery(filters)).toBe(query);
  });

  it('defaults: the listing order, or relevance with a search', () => {
    expect(read('').sort).toBe('listing');
    expect(read('q=x').sort).toBe('relevance');
    expect(read('sort=relevance').sort).toBe('listing');
    expect(filtersToQuery(read(''))).toBe('');
  });

  it('ignores invalid values', () => {
    const filters = read('category=x"y&min=-5&max=abc&sort=bogus&new=yes');
    expect(filters.category).toBeNull();
    expect(filters.min).toBeNull();
    expect(filters.max).toBeNull();
    expect(filters.sort).toBe('listing');
    expect(filters.newOnly).toBe(false);
  });

  it('accepts prices typed with separators', () => {
    expect(read('min=10%2C000').min).toBe(10000);
  });
});

describe('isPlainListing / activeFilterCount', () => {
  it('a category alone is still the plain listing', () => {
    expect(isPlainListing(read('category=abc'))).toBe(true);
    expect(isPlainListing(read('instock=1'))).toBe(false);
    expect(isPlainListing(read('sort=price_asc'))).toBe(false);
    expect(isPlainListing(read('max=0'))).toBe(false);
  });

  it('counts filters, not the sort; a price range counts once', () => {
    expect(activeFilterCount(read('sort=name'))).toBe(0);
    expect(activeFilterCount(read('category=a&min=1&max=2&instock=1'))).toBe(3);
  });
});

describe('priceBoundsBeforeSale', () => {
  const sale = { active: true, percent: 10, ends_at: null };

  it('turns prices after the sale into prices before it', () => {
    expect(priceBoundsBeforeSale(9000, 18000, sale)).toEqual({ minPrice: 10000, maxPrice: 20000 });
  });

  it('keeps prices as they are without a sale, and empty bounds empty', () => {
    expect(priceBoundsBeforeSale(5000, null, { active: false })).toEqual({ minPrice: 5000, maxPrice: null });
  });
});
