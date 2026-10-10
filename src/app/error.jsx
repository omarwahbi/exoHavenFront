"use client";
import { useEffect } from "react";
import Link from "next/link";

// Shown instead of a page that failed to render; the header and footer stay.
export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[55vh] flex-col items-center justify-center gap-4 py-12 text-center" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-900">حدث خطأ غير متوقع</h1>
      <p className="max-w-md text-gray-600">نعتذر عن ذلك. حاول مرة أخرى، وإذا استمرت المشكلة تواصل معنا عبر واتساب.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn-primary">
          حاول مرة أخرى
        </button>
        <Link href="/" className="btn-outline">
          الصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}
