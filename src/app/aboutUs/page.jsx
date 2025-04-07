import React from "react";
import { Metadata } from "next";

export const metadata = {
  title: "عن إكزو هيفن",
  description: "تعرف على قصتنا ورؤيتنا في تقديم أفضل المنتجات للعناية بالزواحف والحيوانات الغريبة",
};

const AboutUs = () => {
  return (
    <div className="bg-gradient-to-b from-green1 to-white min-h-screen py-16" dir="rtl">
      {/* Hero Section */}
      <div className="container mx-auto px-4 mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-green5 mb-6">عن إكزو هيفن</h1>
          <div className="h-1 w-24 bg-green4 mx-auto mb-8"></div>
          <p className="text-xl text-gray-700 leading-relaxed">
            ملاذ لعالم الزواحف الغريبة ومستلزماتها
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="rounded-xl overflow-hidden shadow-xl relative h-[400px] bg-gradient-to-br from-green3 to-green4 flex items-center justify-center">
            <div className="text-white text-center p-8">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24 mx-auto mb-4 opacity-80">
                <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm0 11a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" />
              </svg>
              <h3 className="text-2xl font-bold">إكزو هيفن للحيوانات الغريبة</h3>
              <p className="mt-2 opacity-90">منذ عام 2020</p>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-green5 mb-4">رحلتنا</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              في إكزو هيفن، نحن شغوفون بتقديم أفضل الإكسسوارات والمستلزمات
              المتخصصة للسحالي والزواحف الأخرى. هدفنا هو خلق ملاذ لعشاق الزواحف، حيث
              نقدم كل ما تحتاجه للعناية بحيواناتك الأليفة الفريدة. مع النصائح من
              الخبراء ومنتجات عالية الجودة، نسعى لمساعدتك في بناء الملاذ المثالي
             لحيواناتك الغريبة.            </p>
            <div className="pt-4">
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 rounded-full bg-green4 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" />
                  </svg>
                </div>
                <p className="font-medium text-gray-800 mx-1">تأسست عام 2020 لتلبية احتياجات مربي الحيوانات الغريبة</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 md:order-1 space-y-6">
            <h2 className="text-3xl font-bold text-green5 mb-4">رؤيتنا</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              سواء كنت جديدًا في عالم الزواحف أو مربيًا متمرسًا، فإن إكزو هيفن هو
              شريكك الموثوق. من إعدادات الموائل إلى التغذية، نضمن أن تحصل زواحفك على
              أفضل رعاية ممكنة. انضم إلينا في هذه الرحلة المثيرة، ودعونا نخلق البيئة
              المثالية لحيواناتك المدهشة.
            </p>
            <ul className="space-y-3 pt-2">
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-green3 flex items-center justify-center mt-1 ml-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                </div>
                <p className="text-gray-700">توفير منتجات عالية الجودة للعناية بالزواحف</p>
              </li>
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-green3 flex items-center justify-center mt-1 ml-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                </div>
                <p className="text-gray-700">تقديم النصائح والإرشادات من خبراء متخصصين</p>
              </li>
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-green3 flex items-center justify-center mt-1 ml-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                </div>
                <p className="text-gray-700">دعم مجتمع مربي الحيوانات الغريبة في العراق</p>
              </li>
            </ul>
          </div>
          <div className="order-1 md:order-2 rounded-xl overflow-hidden shadow-xl relative h-[400px] bg-gradient-to-br from-green4 to-green5 flex items-center justify-center">
            <div className="text-white text-center p-8">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24 mx-auto mb-4 opacity-80">
                <path d="M13 21V11h8v10h-8zM3 13V3h8v10H3zm6-2V5H5v6h4zM3 21v-6h8v6H3zm2-2h4v-2H5v2zm10 0h4v-6h-4v6zM13 3h8v6h-8V3zm2 2v2h4V5h-4z" />
              </svg>
              <h3 className="text-2xl font-bold">رؤيتنا المستقبلية</h3>
              <p className="mt-2 opacity-90">نحو بيئة أفضل للحيوانات الغريبة</p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-green5 mb-4">قيمنا</h2>
            <div className="h-1 w-16 bg-green4 mx-auto mb-6"></div>
            <p className="text-lg text-gray-700">المبادئ التي تقود عملنا كل يوم</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "الجودة",
                description: "نقدم فقط المنتجات عالية الجودة التي نثق بها لحيواناتنا",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M12.0006 15.968L16.2473 18.3451L15.2988 13.5717L18.8719 10.2674L14.0266 9.69434L12.0006 5.27502L9.97461 9.69434L5.12939 10.2674L8.70251 13.5717L7.75401 18.3451L12.0006 15.968Z" />
                  </svg>
                ),
              },
              {
                title: "الخبرة",
                description: "فريقنا من المتخصصين ذوي الخبرة في رعاية الزواحف والحيوانات الغريبة",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M4 6.4L12 2L20 6.4V17.6L12 22L4 17.6V6.4ZM12 4.1L6 7.4V16.6L12 19.9L18 16.6V7.4L12 4.1ZM12 18V13H18V15H14V18H12ZM6 13H12V15H6V13ZM12 11V6H6V8H10V11H12ZM12 8H14V10H16V8H18V6H12V8Z" />
                  </svg>
                ),
              },
              {
                title: "الدعم",
                description: "نقدم الدعم والمشورة المستمرة لمساعدتك في العناية بحيواناتك",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-5-5h2V8H7v9zm3 0h2V8h-2v9zm3 0h2V8h-2v9zm3 0h2v-9h-2v9z" />
                  </svg>
                ),
              },
            ].map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-16 w-16 rounded-full bg-green1 flex items-center justify-center mb-4 text-green5">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-green2 rounded-2xl p-8 md:p-12 shadow-lg text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-green5 mb-4">هل لديك أسئلة؟ نحن هنا للمساعدة!</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            فريقنا من الخبراء جاهز لمساعدتك في اختيار المنتجات المناسبة لحيواناتك الأليفة
          </p>
          <button className="bg-green5 hover:bg-green4 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors shadow-md">
            تواصل معنا
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
