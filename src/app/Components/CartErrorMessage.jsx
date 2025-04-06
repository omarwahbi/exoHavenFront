'use client';

export default function CartErrorMessage() {
  return (
    <div className="text-center py-12 px-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-red-600 mb-4">عذراً! حدث خطأ ما</h2>
        <p className="text-gray-600 mb-6">
          نواجه مشكلة في عرض سلة المشتريات الخاصة بك. يرجى تحديث الصفحة أو المحاولة مرة أخرى لاحقاً.
        </p>
        <div className="flex justify-center space-x-4 space-x-reverse">
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-green4 text-white rounded-md hover:bg-green3 transition-colors"
          >
            تحديث الصفحة
          </button>
        </div>
      </div>
    </div>
  );
} 