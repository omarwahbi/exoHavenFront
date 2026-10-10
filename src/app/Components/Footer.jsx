import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";
import { FiPhone, FiMail } from "react-icons/fi";
import { EMAIL, INSTAGRAM_URL, PHONE_URL, TIKTOK_URL, WHATSAPP_NUMBER, WHATSAPP_URL } from "@/utils/contact";

const SHOP_LINKS = [
  { href: "/products", label: "كل المنتجات" },
  { href: "/categories", label: "الأقسام" },
  { href: "/new-arrivals", label: "وصل حديثاً" },
  { href: "/cart", label: "عربة التسوق" },
];
const INFO_LINKS = [
  { href: "/aboutUs", label: "من نحن" },
  { href: "/contact", label: "اتصل بنا" },
];

const Column = ({ title, links }) => (
  <div>
    <h3 className="mb-3 text-sm font-bold text-gray-900">{title}</h3>
    <ul className="space-y-2 text-sm">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="text-gray-600 hover:text-green5">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white" dir="rtl">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image src="/logo.png" alt="ExoHaven" width={128} height={40} className="h-9 w-auto" />
          <p className="mt-3 max-w-xs text-sm leading-6 text-gray-600">
            متجر متخصص بمستلزمات الزواحف والطيور والحيوانات الأليفة الغريبة، مع توصيل لكل العراق.
          </p>
        </div>
        <Column title="تسوق" links={SHOP_LINKS} />
        <Column title="المتجر" links={INFO_LINKS} />
        <div>
          <h3 className="mb-3 text-sm font-bold text-gray-900">تواصل معنا</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <a href={PHONE_URL} className="inline-flex items-center gap-2 hover:text-green5" dir="ltr">
                <FiPhone /> {WHATSAPP_NUMBER}
              </a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 hover:text-green5">
                <FiMail /> {EMAIL}
              </a>
            </li>
          </ul>
          <div className="mt-4 flex gap-2">
            {[
              { href: WHATSAPP_URL, label: "WhatsApp", Icon: FaWhatsapp },
              { href: INSTAGRAM_URL, label: "Instagram", Icon: FaInstagram },
              { href: TIKTOK_URL, label: "TikTok", Icon: FaTiktok },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-green1 hover:text-green5"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} ExoHaven Iraq. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
