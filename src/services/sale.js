import { API_URL } from '@/utils/apiUrl';
import { flattenResponse } from '@/utils/strapi';
import { DEFAULT_BANNER_TEXT, NO_SALE } from '@/utils/saleUtils';

// The sale that was hard-coded here before it moved to the admin. Used only while
// the backend doesn't serve /api/sale yet (404); remove once it does.
const LEGACY_SALE = {
  active: true,
  percent: 10,
  ends_at: '2026-12-31T23:59:59+03:00',
  show_banner: true,
  banner_text: DEFAULT_BANNER_TEXT,
};

// The API's sale entry, with defaults for fields an older entry doesn't have yet.
export const toSale = ({ active, percent, ends_at, show_banner, banner_text } = {}) => ({
  active: Boolean(active),
  percent: Number(percent) || 0,
  ends_at: ends_at ?? null,
  show_banner: show_banner ?? true,
  banner_text: banner_text?.trim() || DEFAULT_BANNER_TEXT,
});

// Server-side: the current sale settings, cached for 5 minutes. Any other failure
// (including a timeout)
// means no discount, so the shop never shows a price it didn't intend.
export async function getSale() {
  try {
    // Every page waits for this, so don't let a slow API hold them up.
    const res = await fetch(`${API_URL}/api/sale`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(3000),
    });
    if (res.status === 404) return LEGACY_SALE;
    if (!res.ok) return NO_SALE;
    return toSale(flattenResponse(await res.json()).data ?? {});
  } catch {
    return NO_SALE;
  }
}
