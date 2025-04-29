// Utility functions for the 15% off sale (until June 1, 2025)

/**
 * Checks if the sale is currently active
 * @returns {boolean} True if the sale is active, false otherwise
 */
export const isSaleActive = () => {
  const now = new Date();
  // Use the year 2025, month 5 (June, zero-indexed), day 1
  const saleEndDate = new Date(2025, 5, 1, 23, 59, 59);
  return now < saleEndDate;
};

/**
 * Calculates the sale price (15% off) if the sale is active
 * @param {number} originalPrice - The original price of the product
 * @returns {number} The sale price if sale is active, otherwise the original price
 */
export const calculateSalePrice = (originalPrice) => {
  if (!isSaleActive() || !originalPrice) return originalPrice;
  return Math.round(originalPrice * 0.85); // 15% off
}; 