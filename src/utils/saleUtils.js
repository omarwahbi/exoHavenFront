// The site-wide sale, set in the admin (Strapi single type "Sale", /api/sale):
// { active, percent, ends_at, show_banner, banner_text }. Read it with useSale() in client components and
// getSale() (src/services/sale.js) on the server.

export const DEFAULT_BANNER_TEXT = "على جميع المنتجات عند الطلب من الموقع";

export const NO_SALE = { active: false, percent: 0, ends_at: null, show_banner: false, banner_text: "" };

export const isSaleActive = (sale, now = new Date()) =>
  Boolean(sale?.active && sale.percent > 0 && (!sale.ends_at || now < new Date(sale.ends_at)));

// The price after the sale's discount, rounded to whole dinars; unchanged when no
// sale is running.
export const calculateSalePrice = (price, sale) => {
  if (!price || !isSaleActive(sale)) return price;
  return Math.round((price * (100 - sale.percent)) / 100);
};
