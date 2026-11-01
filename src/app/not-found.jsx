import Link from "next/link";

export const metadata = { title: "الصفحة غير موجودة" };

// Shown for links to pages that don't exist (or no longer do), in the site's
// own style instead of the framework's English page.
export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12" dir="rtl">
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-8 sm:p-12 max-w-lg w-full text-center">
        <p className="text-6xl sm:text-7xl font-bold bg-gradient-to-r from-green4 to-green3 bg-clip-text text-transparent mb-4" dir="ltr">
          404
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">الصفحة غير موجودة</h1>
        <p className="text-gray-600 mb-8">
          ربما تغير رابط هذه الصفحة أو لم يعد المنتج متوفراً. يمكنك تصفح منتجاتنا أو العودة للصفحة الرئيسية.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/products"
            className="px-6 py-3 bg-gradient-to-r from-green4 to-green3 text-white font-bold rounded-2xl shadow-green hover:shadow-green-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            تصفح المنتجات
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-white text-green4 font-bold rounded-2xl border border-green3 hover:bg-green1 transition-colors duration-300"
          >
            الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
