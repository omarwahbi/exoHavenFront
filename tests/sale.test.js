import { describe, expect, test } from "vitest";
import { DEFAULT_BANNER_TEXT, NO_SALE, calculateSalePrice, isSaleActive } from "@/utils/saleUtils";
import { toSale } from "@/services/sale";

const now = new Date("2026-10-10T12:00:00Z");
const sale = { active: true, percent: 10, ends_at: "2026-12-31T20:59:59Z" };

describe("isSaleActive", () => {
  test("on, with a percent, before its end", () => expect(isSaleActive(sale, now)).toBe(true));
  test("switched off", () => expect(isSaleActive({ ...sale, active: false }, now)).toBe(false));
  test("after its end date", () => expect(isSaleActive({ ...sale, ends_at: "2026-01-01T00:00:00Z" }, now)).toBe(false));
  test("without an end date", () => expect(isSaleActive({ ...sale, ends_at: null }, now)).toBe(true));
  test("0%", () => expect(isSaleActive({ ...sale, percent: 0 }, now)).toBe(false));
  test("no sale data", () => expect(isSaleActive(undefined, now)).toBe(false));
});

describe("calculateSalePrice", () => {
  const running = { ...sale, ends_at: null };
  test("takes the percent off, rounded to whole dinars", () => {
    expect(calculateSalePrice(10500, running)).toBe(9450);
    expect(calculateSalePrice(13500, { ...running, percent: 20 })).toBe(10800);
    expect(calculateSalePrice(999, { ...running, percent: 15 })).toBe(849);
  });
  test("leaves the price alone without a sale", () => {
    expect(calculateSalePrice(10500, NO_SALE)).toBe(10500);
  });
});

describe("toSale (the API's sale entry)", () => {
  test("reads the admin's values", () => {
    expect(
      toSale({ active: true, percent: 25, ends_at: null, show_banner: false, banner_text: "Eid sale" })
    ).toEqual({ active: true, percent: 25, ends_at: null, show_banner: false, banner_text: "Eid sale" });
  });
  test("an entry saved before the banner fields existed shows the default banner", () => {
    const parsed = toSale({ active: true, percent: 10, ends_at: null });
    expect(parsed.show_banner).toBe(true);
    expect(parsed.banner_text).toBe(DEFAULT_BANNER_TEXT);
  });
  test("an empty entry means no sale", () => {
    expect(isSaleActive(toSale({}), now)).toBe(false);
  });
});
