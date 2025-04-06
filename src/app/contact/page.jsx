import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaTiktok, FaEnvelope, FaPhone, FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
import { Metadata } from "next";

export const metadata = {
  title: "تواصل معنا",
  description: "تواصل مع فريق إكزو هيفن للاستفسارات وطلبات المساعدة - نحن هنا لخدمتك",
};

const ContactInfo = ({ icon, title, children, link, linkText }) => (
  <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
    <div className="h-14 w-14 rounded-full bg-green1 flex items-center justify-center mb-4 text-green5">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
    <div className="text-gray-700">{children}</div>
    {link && (
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="mt-3 text-green5 hover:text-green4 font-medium flex items-center"
      >
        {linkText} &larr;
      </a>
    )}
  </div>
);

const SocialLink = ({ href, icon, label, hoverColor }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className={`p-4 bg-white rounded-full shadow-md text-2xl hover:shadow-lg transition-all transform hover:-translate-y-1 ${
      label === 'Instagram' 
        ? 'text-pink-500 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white' 
        : 'text-black hover:bg-black hover:text-white'
    }`}
  >
    {icon}
  </a>
);

const Contact = () => {
  return (
    <div className="bg-gradient-to-b from-green1 to-white min-h-screen py-16" dir="rtl">
      {/* Hero Section */}
      <div className="container mx-auto px-4 mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-green5 mb-6">تواصل معنا</h1>
          <div className="h-1 w-24 bg-green4 mx-auto mb-8"></div>
          <p className="text-xl text-gray-700 leading-relaxed">
            نحن هنا لمساعدتك والإجابة على جميع استفساراتك
          </p>
        </div>
      </div>

      {/* Contact Information Cards */}
      <div className="container mx-auto px-4 mb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ContactInfo 
            icon={<FaEnvelope className="w-6 h-6" />} 
            title="البريد الإلكتروني"
            link="mailto:exohaven.iq@gmail.com"
            linkText="إرسال بريد إلكتروني"
          >
            <p dir="ltr" className="text-gray-900 font-medium">
              exohaven.iq@gmail.com
            </p>
          </ContactInfo>

          <ContactInfo 
            icon={<FaPhone className="w-6 h-6" />} 
            title="الهاتف"
            link="tel:+9647838984924"
            linkText="اتصل بنا"
          >
            <p dir="ltr" className="text-gray-900 font-medium">
              +964 783 898 4924
            </p>
          </ContactInfo>

          <ContactInfo 
            icon={<FaWhatsapp className="w-6 h-6" />} 
            title="واتساب"
            link="https://wa.me/9647838984924"
            linkText="دردشة عبر واتساب"
          >
            <p dir="ltr" className="text-gray-900 font-medium">
              +964 783 898 4924
            </p>
          </ContactInfo>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="container mx-auto px-4 mb-16">
        <div className="bg-green2 rounded-2xl p-8 md:p-12 shadow-lg">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-green5 mb-4">تابعنا على وسائل التواصل الاجتماعي</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              انضم إلينا على منصات التواصل الاجتماعي للاطلاع على أحدث المنتجات والنصائح حول العناية بالحيوانات الغريبة
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6" dir="ltr">
            <SocialLink 
              href="https://www.instagram.com/exohaven.iq?igsh=YXl5NzQ5Mm5keW40" 
              icon={<FaInstagram className="w-8 h-8" />} 
              label="Instagram"
            />
            
            <SocialLink 
              href="https://www.tiktok.com/@exohaven.iq" 
              icon={<FaTiktok className="w-8 h-8" />} 
              label="TikTok"
            />
          </div>
        </div>
      </div>

      {/* Map or Location Information */}
      <div className="container mx-auto px-4 mb-16">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="h-24 w-24 rounded-full bg-green1 flex items-center justify-center text-green5">
                <FaMapMarkerAlt className="w-10 h-10" />
              </div>
            </div>
            
            <div className="w-full md:w-2/3 text-center md:text-right">
              <h2 className="text-2xl font-bold text-green5 mb-3">موقعنا</h2>
              <p className="text-gray-700 mb-4">
                نحن متواجدون في مدينة بغداد ونوفر خدمة التوصيل لجميع أنحاء العراق
              </p>
              <p className="text-gray-900 font-medium">
                
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-green4 to-green5 rounded-2xl p-8 md:p-12 shadow-lg text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">هل تحتاج إلى مساعدة خاصة؟</h2>
          <p className="text-white text-opacity-90 mb-8 max-w-2xl mx-auto">
            فريقنا من الخبراء جاهز لمساعدتك في اختيار المنتجات المناسبة لحيواناتك الأليفة
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="tel:+9647838984924" 
              className="bg-white text-green5 hover:bg-green1 px-8 py-3 rounded-lg text-lg font-medium transition-colors shadow-md"
            >
              اتصل بنا الآن
            </a>
            <a 
              href="https://wa.me/9647838984924" 
              className="bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors shadow-md flex items-center justify-center"
            >
              <FaWhatsapp className="mr-2" /> تواصل عبر واتساب
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
