import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { addRecentSearch, clearRecentSearches, parseSort, readRecentSearches, sortOptions } from '@/utils/search';

describe('sort options', () => {
  it('offers "relevance" only with a search', () => {
    expect(sortOptions(false).map((o) => o.value)).not.toContain('relevance');
    expect(sortOptions(true)[0].value).toBe('relevance');
  });

  it('parses the URL value, falling back to the default', () => {
    expect(parseSort('price_asc', false)).toBe('price_asc');
    expect(parseSort(null, false)).toBe('featured');
    expect(parseSort(null, true)).toBe('relevance');
    expect(parseSort('relevance', false)).toBe('featured');
    expect(parseSort('bogus', true)).toBe('relevance');
  });
});

describe('recent searches', () => {
  beforeEach(() => {
    const store = new Map();
    globalThis.localStorage = {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
    };
  });
  afterEach(() => {
    delete globalThis.localStorage;
  });

  it('keeps the newest five, without duplicates or blanks', () => {
    for (const q of ['a', 'b', 'c', 'a', ' ', 'd', 'e', 'f']) addRecentSearch(q);
    expect(readRecentSearches()).toEqual(['f', 'e', 'd', 'a', 'c']);
    clearRecentSearches();
    expect(readRecentSearches()).toEqual([]);
  });

  it('survives broken or blocked storage', () => {
    localStorage.setItem('recentSearches', '{not json');
    expect(readRecentSearches()).toEqual([]);
    delete globalThis.localStorage;
    expect(readRecentSearches()).toEqual([]);
    // Still shown for this visit, just not saved.
    expect(addRecentSearch('x')).toEqual(['x']);
  });
});
