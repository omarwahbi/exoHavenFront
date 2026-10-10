"use client";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "@/app/context/CartContext";
import SearchBox from "./SearchBox";

export const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/categories", label: "الأقسام" },
  { href: "/products", label: "كل المنتجات" },
  { href: "/new-arrivals", label: "وصل حديثاً" },
  { href: "/aboutUs", label: "من نحن" },
  { href: "/contact", label: "اتصل بنا" },
];

export const isActivePath = (pathname, href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

export function CartCount({ className = "" }) {
  const { itemCount } = useCart();
  if (!itemCount) return null;
  return (
    <span
      className={`absolute -top-1 -left-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white ring-2 ring-white ${className}`}
    >
      {itemCount > 99 ? "99+" : itemCount}
    </span>
  );
}

// Sticky site header: logo, search (its own row on phones), main links on
// desktop, and the cart. Phones navigate with the bottom tab bar (MobileTabBar).
export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur" dir="rtl">
      <div className="container-page flex h-16 items-center gap-4 lg:gap-8">
        <Link href="/" className="shrink-0" aria-label="ExoHaven – الصفحة الرئيسية">
          <Image src="/logo.png" alt="ExoHaven" width={128} height={40} priority className="h-8 w-auto sm:h-9" />
        </Link>

        <nav aria-label="القائمة الرئيسية" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActivePath(pathname, link.href) ? "page" : undefined}
                  className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                    isActivePath(pathname, link.href) ? "bg-green1 text-green5" : "text-gray-600 hover:text-green5"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Suspense fallback={<div className="hidden h-11 flex-1 md:block" />}>
          <SearchBox className="hidden flex-1 md:block" />
        </Suspense>

        <Link
          href="/cart"
          aria-label="عربة التسوق"
          className="relative mr-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green1 text-green5 transition-colors hover:bg-green2 md:mr-0"
        >
          <FiShoppingCart size={20} />
          <CartCount />
        </Link>
      </div>

      {/* Phones: search gets its own row under the logo. */}
      <div className="container-page pb-3 md:hidden">
        <Suspense fallback={<div className="h-11" />}>
          <SearchBox />
        </Suspense>
      </div>
    </header>
  );
}
