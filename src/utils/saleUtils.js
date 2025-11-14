// Utility functions for the 10% off sale (active until end of 2026)

/**
 * Checks if the sale is currently active
 * @returns {boolean} True if the sale is active, false otherwise
 */
export const isSaleActive = () => {
  const now = new Date();
  // Sale is active until end of 2026
  const saleEndDate = new Date(2026, 11, 31, 23, 59, 59); // December 31, 2026
  return now < saleEndDate;
};

/**
 * Calculates the sale price (10% off) if the sale is active
 * @param {number} originalPrice - The original price of the product
 * @returns {number} The sale price if sale is active, otherwise the original price
 */
export const calculateSalePrice = (originalPrice) => {
  if (!isSaleActive() || !originalPrice) return originalPrice;
  return Math.round(originalPrice * 0.9); // 10% off
}; 