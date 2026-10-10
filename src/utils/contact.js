// The shop's contact details, used by the header, footer, contact page and the
// WhatsApp order button.
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+9647838984924";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`;
export const PHONE_URL = `tel:${WHATSAPP_NUMBER}`;
export const INSTAGRAM_URL = "https://www.instagram.com/exohaven.iq/";
export const TIKTOK_URL = "https://www.tiktok.com/@exohaven.iq";
export const EMAIL = "exohaven.iq@gmail.com";
