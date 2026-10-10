import { calculateSalePrice } from "./saleUtils";
import { basePrice } from "./product";

// Delivery fees in IQD. Delivery is free from FREE_DELIVERY_THRESHOLD up.
export const DELIVERY_FEES = { baghdad: 5000, other: 6000 };
export const FREE_DELIVERY_THRESHOLD = 50000;

// The price after the running sale (see saleUtils) of an item, or of a cart line
// (an item with the chosen `variant`). See product.js for variants.
export const unitPrice = (item, sale) => {
  const price = basePrice(item, item?.variant);
  if (!Number.isFinite(price)) return 0;
  return calculateSalePrice(price, sale);
};

export const cartSubtotal = (cart, sale) =>
  cart.reduce((total, line) => total + unitPrice(line, sale) * line.quantity, 0);

export const deliveryFee = (subtotal, location) =>
  subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEES[location] ?? DELIVERY_FEES.other;
