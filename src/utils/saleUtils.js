// Utility functions for the 15% off sale (active for 1 year)

/**
 * Checks if the sale is currently active
 * @returns {boolean} True if the sale is active, false otherwise
 */
export const isSaleActive = () => {
  const now = new Date();
  // Sale is active for 1 year from November 14, 2024
  const saleEndDate = new Date(2025, 10, 14, 23, 59, 59); // November 14, 2025
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