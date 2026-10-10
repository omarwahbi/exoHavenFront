// Variants and stock.
//
// An item may have variants (sizes, wattages, models; set in the admin), each
// with its own price and stock switches. The shopper then picks one, and the cart
// holds that variant. Items without variants are priced by their `state` field.

export const variantsOf = (item) => (Array.isArray(item?.variants) ? item.variants : []);

export const hasVariants = (item) => variantsOf(item).length > 0;

export const availableVariants = (item) => variantsOf(item).filter((variant) => !variant.out_of_stock);

export const findVariant = (item, label) => variantsOf(item).find((variant) => variant.label === label);

// Out of stock: switched off in the admin, or every variant is.
export const isOutOfStock = (item, variant) =>
  variant
    ? Boolean(variant.out_of_stock)
    : Boolean(item?.out_of_stock) || (hasVariants(item) && availableVariants(item).length === 0);

// "Last piece": for a chosen variant, its own switch; for the item as a whole, the
// item's switch, or every variant still available is marked low.
export const isLowStock = (item, variant) => {
  if (isOutOfStock(item, variant)) return false;
  if (variant) return Boolean(variant.low_stock);
  if (item?.low_stock) return true;
  const available = availableVariants(item);
  return available.length > 0 && available.every((v) => v.low_stock);
};

// The price before any sale: the chosen variant's; for an item with variants, the
// lowest available one ("from ..."); otherwise the item's own price.
export const basePrice = (item, variant) => {
  if (variant) return Number(variant.price);
  if (hasVariants(item)) {
    const pool = availableVariants(item).length ? availableVariants(item) : variantsOf(item);
    return Math.min(...pool.map((v) => Number(v.price)));
  }
  return Number(item?.state);
};

// True when the available variants don't all cost the same, so cards say "from".
export const hasPriceRange = (item) => new Set(availableVariants(item).map((v) => Number(v.price))).size > 1;

// What the cart keeps of a variant: enough to show and price it.
export const cartVariant = (variant) =>
  variant ? { label: variant.label, price: Number(variant.price), sku: variant.sku ?? null, low_stock: Boolean(variant.low_stock) } : undefined;
