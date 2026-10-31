import { API_URL } from './apiUrl';
import { mediaUrl } from './media';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://exohaven-iq.com';
export const DEFAULT_OG_IMAGE = '/og-image.png';

// Absolute URL of a media field, for share previews and structured data. Media
// uploaded to ImageKit already has one; local uploads are relative to the API.
export const absoluteMediaUrl = (field) => {
  const url = mediaUrl(field);
  if (!url) return null;
  return url.startsWith('http') ? url : `${API_URL}${url}`;
};

// A description short enough for search results (about 155 characters), cut at a
// word boundary.
export const snippet = (text, max = 155) => {
  const clean = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ') > max / 2 ? cut.lastIndexOf(' ') : cut.length)}…`;
};

// Metadata for one page: its title (the layout adds " | إكزو هيفن ExoHaven"), a
// description, its canonical path and the image shown when the link is shared.
export const pageMetadata = ({ title, description, path, image, noindex = false }) => {
  const images = [{ url: image || DEFAULT_OG_IMAGE, alt: title }];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: 'website', locale: 'ar_IQ', siteName: 'ExoHaven Iraq', url: path, title, description, images },
    twitter: { card: 'summary_large_image', title, description, images: images.map((i) => i.url) },
    ...(noindex && { robots: { index: false, follow: true } }),
  };
};
