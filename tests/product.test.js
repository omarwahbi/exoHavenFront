import { describe, expect, test } from "vitest";
import { basePrice, hasPriceRange, isLowStock, isOutOfStock } from "@/utils/product";

const v = (label, price, extra = {}) => ({ label, price, ...extra });

describe("items without variants", () => {
  const item = { state: "10500" };
  test("are priced by state", () => expect(basePrice(item)).toBe(10500));
  test("use their own switches", () => {
    expect(isOutOfStock({ ...item, out_of_stock: true })).toBe(true);
    expect(isLowStock({ ...item, low_stock: true })).toBe(true);
    expect(isLowStock({ ...item, low_stock: true, out_of_stock: true })).toBe(false);
  });
});

describe("items with variants", () => {
  const item = { state: "1", variants: [v("S", 30000), v("M", 20000), v("L", 10000, { out_of_stock: true })] };

  test("show the lowest price of the variants in stock", () => {
    expect(basePrice(item)).toBe(20000);
    expect(hasPriceRange(item)).toBe(true);
  });
  test("a picked variant has its own price", () => expect(basePrice(item, item.variants[0])).toBe(30000));
  test("are out of stock only when every variant is", () => {
    expect(isOutOfStock(item)).toBe(false);
    expect(isOutOfStock({ ...item, variants: item.variants.map((x) => ({ ...x, out_of_stock: true })) })).toBe(true);
    expect(isOutOfStock(item, item.variants[2])).toBe(true);
  });
  test("show 'last piece' when every variant in stock is low", () => {
    expect(isLowStock(item)).toBe(false);
    const low = { ...item, variants: [v("S", 1, { low_stock: true }), v("M", 1, { out_of_stock: true })] };
    expect(isLowStock(low)).toBe(true);
    expect(isLowStock(item, v("S", 1, { low_stock: true }))).toBe(true);
  });
  test("one price for every variant is not a range", () => {
    expect(hasPriceRange({ variants: [v("A", 5), v("B", 5)] })).toBe(false);
  });
});
