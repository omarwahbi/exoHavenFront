"use client";
import { useEffect } from "react";
import Link from "next/link";

// The shop's WhatsApp, as on the contact page.
const WHATSAPP_URL = "https://wa.me/9647838984924";

// Shown instead of a page that failed to load, in the site's own style; the menu
// and footer stay.
export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12" dir="rtl">
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-8 sm:p-12 max-w-lg w-full text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">حدث خطأ غير متوقع</h1>
        <p className="text-gray-600 mb-8">
          نعتذر عن ذلك. حاول مرة أخرى، وإذا استمرت المشكلة{" "}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-green4 font-medium hover:underline">
            تواصل معنا عبر واتساب
          </a>
          .
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="px-6 py-3 bg-gradient-to-r from-green4 to-green3 text-white font-bold rounded-2xl shadow-green hover:shadow-green-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            حاول مرة أخرى
          </button>
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
