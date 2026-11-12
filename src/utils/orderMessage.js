import { unitPrice } from "./pricing";

// Arabic-Indic (٠-٩) and Persian (۰-۹) digits, and the Arabic thousands and
// decimal separators, as plain English ones.
export const toEnglishDigits = (text) =>
  String(text ?? "")
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/٬/g, ",")
    .replace(/٫/g, ".");

// A phone number as typed ("٠٧٨٠ ١٢٣ ٤٥٦٧", "+964 780 123 4567") in local form:
// "07801234567". Anything else is returned as digits for the check below.
export const normalizePhone = (input) => {
  let digits = toEnglishDigits(input).replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (digits.startsWith("00964")) digits = digits.slice(5);
  else if (digits.startsWith("964")) digits = digits.slice(3);
  if (digits.length === 10 && digits.startsWith("7")) digits = `0${digits}`;
  return digits;
};

// An Iraqi mobile number: 07 and nine more digits.
export const isValidPhone = (input) => /^07\d{9}$/.test(normalizePhone(input));

const formatIQD = (n) => `${Number(n).toLocaleString("en-US")} IQD`;

// The order text the shopper sends us over WhatsApp. Every number in it is in
// English digits, whatever the phone's language or what the shopper typed.
export const buildOrderMessage = ({ cart, sale, subtotal, fee, name = "", phone = "", address = "", note = "" }) => {
  const itemDetails = cart
    .map(
      (item) =>
        `${item.name}${item.variant ? ` (${item.variant.label})` : ""}\nالعدد: ${item.quantity}\nالسعر: ${formatIQD(unitPrice(item, sale) * item.quantity)}\n`
    )
    .join("\n- ");

  const deliveryText = fee === 0 ? "مجاني" : formatIQD(fee);
  const customer = [
    name.trim() && `الاسم: ${name.trim()}`,
    phone.trim() && `رقم الهاتف: ${normalizePhone(phone)}`,
    address.trim() && `عنوان التوصيل: ${address.trim()}`,
  ].filter(Boolean);
  const customerBlock = customer.length ? `\n\n${customer.join("\n")}` : "";
  const noteLine = note.trim() ? `\n\nملاحظة: ${note.trim()}` : "";

  return toEnglishDigits(
    `${itemDetails}\n\nإجمالي السلة: ${formatIQD(subtotal)}\nرسوم التوصيل: ${deliveryText}\nالمجموع الكلي: ${formatIQD(subtotal + fee)}${customerBlock}${noteLine}`
  );
};
