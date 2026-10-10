import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";
import { INSTAGRAM_URL, TIKTOK_URL, WHATSAPP_URL } from "@/utils/contact";

// Home page: invitation to ask questions on WhatsApp, plus the social accounts.
export default function CtaBanner() {
  return (
    <section className="container-page" dir="rtl">
      <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-green2 bg-green1 px-6 py-8 text-center sm:px-10 md:flex-row md:text-right">
        <div>
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">عندك سؤال عن منتج؟</h2>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">راسلنا على واتساب ونساعدك تختار الأنسب لحيوانك الأليف.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-primary bg-[#25D366] shadow-none hover:bg-[#1ebe5a]">
            <FaWhatsapp size={18} />
            راسلنا على واتساب
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-700 shadow-card hover:text-green5">
            <FaInstagram size={18} />
          </a>
          <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-700 shadow-card hover:text-green5">
            <FaTiktok size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
