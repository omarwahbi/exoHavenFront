import Link from "next/link";

export const metadata = { title: "الصفحة غير موجودة" };

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[55vh] flex-col items-center justify-center gap-4 py-12 text-center" dir="rtl">
      <p className="text-6xl font-extrabold text-green3" dir="ltr">404</p>
      <h1 className="text-2xl font-bold text-gray-900">الصفحة غير موجودة</h1>
      <p className="max-w-md text-gray-600">ربما تغير رابط هذه الصفحة أو لم يعد المنتج متوفراً. جرّب البحث أو تصفح الأقسام.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/products" className="btn-primary">
          تصفح المنتجات
        </Link>
        <Link href="/categories" className="btn-outline">
          الأقسام
        </Link>
      </div>
    </div>
  );
}
