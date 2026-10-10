import { SITE_URL } from '@/utils/metadata';

// Everything is crawlable except the cart. Next's own files (/_next/) must stay
// open: search engines load a page's scripts and styles to render it.
export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/cart'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
