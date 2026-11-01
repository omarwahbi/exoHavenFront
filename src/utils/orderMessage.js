import { unitPrice } from "./pricing";

const LOCATION_LABELS = { baghdad: "(داخل بغداد)", other: "(المحافظات الأخرى)" };

// The order text the shopper sends us over WhatsApp.
export const buildOrderMessage = ({ cart, sale, subtotal, fee, location, address, note }) => {
  const itemDetails = cart
    .map(
      (item) =>
        `${item.name}${item.variant ? ` (${item.variant.label})` : ""}\nالعدد: ${item.quantity}\nالسعر: ${(unitPrice(item, sale) * item.quantity).toLocaleString()} IQD\n`
    )
    .join("\n- ");

  const deliveryText = fee === 0 ? "مجاني" : `${fee.toLocaleString()} IQD ${LOCATION_LABELS[location]}`;
  const addressLine = address ? `\nعنوان التوصيل: ${address}` : "";
  const noteLine = note.trim() ? `\n\nملاحظة: ${note.trim()}` : "";
  const grandTotal = subtotal + fee;

  return `${itemDetails}\n\nإجمالي السلة: ${subtotal.toLocaleString()} IQD\nرسوم التوصيل: ${deliveryText}\nالمجموع الكلي: ${grandTotal.toLocaleString()} IQD${addressLine}${noteLine}`;
};
