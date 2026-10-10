import { API_URL } from '@/utils/apiUrl';
import { flattenResponse } from '@/utils/strapi';
import { NO_SALE } from '@/utils/saleUtils';

// The sale that was hard-coded here before it moved to the admin. Used only while
// the backend doesn't serve /api/sale yet (404); remove once it does.
const LEGACY_SALE = { active: true, percent: 10, ends_at: '2026-12-31T23:59:59+03:00' };

// Server-side: the current sale settings, cached for 5 minutes. Any other failure
// means no discount, so the shop never shows a price it didn't intend.
export async function getSale() {
  try {
    const res = await fetch(`${API_URL}/api/sale`, { next: { revalidate: 300 } });
    if (res.status === 404) return LEGACY_SALE;
    if (!res.ok) return NO_SALE;
    const { active, percent, ends_at } = flattenResponse(await res.json()).data ?? {};
    return { active: Boolean(active), percent: Number(percent) || 0, ends_at: ends_at ?? null };
  } catch {
    return NO_SALE;
  }
}
