import { describe, expect, it } from 'vitest';
import { absoluteMediaUrl, pageMetadata, snippet } from '@/utils/metadata';
import { API_URL } from '@/utils/apiUrl';

describe('snippet', () => {
  it('keeps short text as it is, without the ellipsis', () => {
    expect(snippet('  مصباح   حراري  ')).toBe('مصباح حراري');
  });

  it('cuts long text at a word boundary', () => {
    const text = 'كلمة '.repeat(60);
    const out = snippet(text, 50);
    expect(out.length).toBeLessThanOrEqual(50);
    expect(out.endsWith('كلمة…')).toBe(true);
  });

  it('handles missing text', () => {
    expect(snippet(null)).toBe('');
  });
});

describe('absoluteMediaUrl', () => {
  it('keeps absolute URLs and prefixes local uploads with the API', () => {
    expect(absoluteMediaUrl({ url: 'https://ik.imagekit.io/x/a.jpg' })).toBe('https://ik.imagekit.io/x/a.jpg');
    expect(absoluteMediaUrl([{ url: '/uploads/a.jpg' }])).toBe(`${API_URL}/uploads/a.jpg`);
    expect(absoluteMediaUrl(null)).toBeNull();
  });
});

describe('pageMetadata', () => {
  it('sets the canonical and the share image', () => {
    const meta = pageMetadata({ title: 'الإضاءة', description: 'd', path: '/categories/abc' });
    expect(meta.alternates.canonical).toBe('/categories/abc');
    expect(meta.openGraph.images[0].url).toBe('/og-image.png');
    expect(meta.robots).toBeUndefined();
  });

  it('can keep a page out of the index', () => {
    expect(pageMetadata({ title: 't', path: '/products', noindex: true }).robots).toEqual({ index: false, follow: true });
  });
});
