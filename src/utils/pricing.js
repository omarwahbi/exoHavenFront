import { calculateSalePrice, isSaleActive } from "./saleUtils";

// Delivery fees in IQD. Delivery is free from FREE_DELIVERY_THRESHOLD up.
export const DELIVERY_FEES = { baghdad: 5000, other: 6000 };
export const FREE_DELIVERY_THRESHOLD = 50000;

// An item's price after any running sale. Prices live in the item's `state` field.
export const unitPrice = (item) => {
  const price = Number(item?.state);
  if (!Number.isFinite(price)) return 0;
  return isSaleActive() ? calculateSalePrice(price) : price;
};

export const cartSubtotal = (cart) =>
  cart.reduce((total, line) => total + unitPrice(line) * line.quantity, 0);

export const deliveryFee = (subtotal, location) =>
  subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEES[location] ?? DELIVERY_FEES.other;
