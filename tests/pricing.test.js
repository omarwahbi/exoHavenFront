import { describe, expect, test } from "vitest";
import { cartSubtotal, deliveryFee, unitPrice } from "@/utils/pricing";
import { buildOrderMessage, isValidPhone, normalizePhone, toEnglishDigits } from "@/utils/orderMessage";

const sale = { active: true, percent: 10, ends_at: null };
const noSale = { active: false, percent: 0, ends_at: null };
const lamp = { name: "Lamp", state: "10500", quantity: 2 };
const bowl = { name: "Bowl", state: "13000", quantity: 1 };

describe("unitPrice", () => {
  test("reads the string price and applies the sale", () => {
    expect(unitPrice(lamp, noSale)).toBe(10500);
    expect(unitPrice(lamp, sale)).toBe(9450);
  });
  test("treats a missing or malformed price as 0", () => {
    expect(unitPrice({ state: null }, sale)).toBe(0);
    expect(unitPrice({ state: "25,000" }, sale)).toBe(0);
  });
});

test("cartSubtotal adds up quantity x sale price", () => {
  expect(cartSubtotal([lamp, bowl], sale)).toBe(9450 * 2 + 11700);
  expect(cartSubtotal([], sale)).toBe(0);
});

describe("deliveryFee", () => {
  test("is 5,000 IQD for every province below the free-delivery threshold", () => {
    expect(deliveryFee(49999)).toBe(5000);
    expect(deliveryFee(1)).toBe(5000);
  });
  test("is free from 50,000 IQD", () => {
    expect(deliveryFee(50000)).toBe(0);
  });
});

test("the WhatsApp order message lists items, totals, customer details and note", () => {
  const subtotal = cartSubtotal([lamp, bowl], sale);
  const message = buildOrderMessage({
    cart: [lamp, bowl],
    sale,
    subtotal,
    fee: deliveryFee(subtotal),
    name: " Omar ",
    phone: "0780 123 4567",
    address: "Karbala",
    note: "  after 5pm  ",
  });
  expect(message).toBe(
    "Lamp\nالعدد: 2\nالسعر: 18,900 IQD\n" +
      "\n- " +
      "Bowl\nالعدد: 1\nالسعر: 11,700 IQD\n" +
      "\n\nإجمالي السلة: 30,600 IQD" +
      "\nرسوم التوصيل: 5,000 IQD" +
      "\nالمجموع الكلي: 35,600 IQD" +
      "\n\nالاسم: Omar" +
      "\nرقم الهاتف: 07801234567" +
      "\nعنوان التوصيل: Karbala" +
      "\n\nملاحظة: after 5pm"
  );
});

test("the WhatsApp message has only English digits, whatever was typed", () => {
  const message = buildOrderMessage({
    cart: [{ ...lamp, name: "مصباح ١٠٠ واط" }],
    sale,
    subtotal: 18900,
    fee: 5000,
    name: "علي",
    phone: "٠٧٨٠١٢٣٤٥٦٧",
    address: "بغداد - شارع ٥٢",
    note: "بعد الساعة ٥",
  });
  expect(message).not.toMatch(/[٠-٩۰-۹]/);
  expect(message).toContain("مصباح 100 واط");
  expect(message).toContain("رقم الهاتف: 07801234567");
  expect(message).toContain("شارع 52");
  expect(message).toContain("بعد الساعة 5");
});

describe("phone numbers", () => {
  test("accepts Iraqi mobile numbers however they are typed", () => {
    for (const typed of ["07801234567", "0780 123 4567", "0780-123-4567", "٠٧٨٠١٢٣٤٥٦٧", "+9647801234567", "009647801234567", "9647801234567", "7801234567"]) {
      expect(isValidPhone(typed)).toBe(true);
      expect(normalizePhone(typed)).toBe("07801234567");
    }
  });
  test("rejects anything else", () => {
    for (const typed of ["", "0780123456", "078012345678", "06801234567", "abc", "1234"]) {
      expect(isValidPhone(typed)).toBe(false);
    }
  });
  test("toEnglishDigits converts Arabic and Persian digits and separators", () => {
    expect(toEnglishDigits("١٢٬٥٠٠ و ۳٫۵")).toBe("12,500 و 3.5");
  });
});

describe("variants", () => {
  const lampWithVariants = {
    documentId: "lamp",
    name: "Lamp",
    state: "9999",
    variants: [
      { label: "50W", price: 15000 },
      { label: "100W", price: 22000, low_stock: true },
      { label: "150W", price: 30000, out_of_stock: true },
    ],
  };

  test("a cart line is priced by its variant", () => {
    const line = { ...lampWithVariants, variant: { label: "100W", price: 22000 }, quantity: 2 };
    expect(unitPrice(line, noSale)).toBe(22000);
    expect(unitPrice(line, sale)).toBe(19800);
    expect(cartSubtotal([line], sale)).toBe(39600);
  });

  test("the WhatsApp message names the variant", () => {
    const line = { ...lampWithVariants, variant: { label: "100W", price: 22000 }, quantity: 1 };
    const message = buildOrderMessage({ cart: [line], sale: noSale, subtotal: 22000, fee: 5000 });
    expect(message.startsWith("Lamp (100W)\nالعدد: 1\nالسعر: 22,000 IQD")).toBe(true);
  });
});
