"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiGrid, FiShoppingBag, FiShoppingCart } from "react-icons/fi";
import { CartCount, isActivePath } from "./Header";

const TABS = [
  { href: "/", label: "الرئيسية", Icon: FiHome },
  { href: "/categories", label: "الأقسام", Icon: FiGrid },
  { href: "/products", label: "المنتجات", Icon: FiShoppingBag },
  { href: "/cart", label: "السلة", Icon: FiShoppingCart, badge: true },
];

// Bottom navigation for phones, within thumb reach. Hidden from md up, where the
// header shows the links.
export default function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="التنقل السريع"
      dir="rtl"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-4">
        {TABS.map(({ href, label, Icon, badge }) => {
          const active = isActivePath(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold ${active ? "text-green5" : "text-gray-500"}`}
              >
                <span className="relative">
                  <Icon size={22} />
                  {badge && <CartCount className="-top-2 -left-2.5 h-4 min-w-[1rem] text-[10px]" />}
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
