import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaWhatsapp, FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-green5 via-green5 to-green4 text-white py-12 md:py-16 mt-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green3 via-green2 to-green3"></div>

      <div className="relative max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
          {/* Logo and Description */}
          <motion.div
            className="flex flex-col items-center md:items-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: -2 }}
              className="mb-6"
            >
              <div className="bg-white rounded-2xl p-3 inline-block shadow-lg">
                <Image
                  src="/favicon.png"
                  alt="ExoHaven Logo"
                  width={90}
                  height={30}
                  priority
                />
              </div>
            </motion.div>
            <p className="text-green1 text-sm md:text-base text-center md:text-right max-w-xs leading-relaxed">
              نوفر تشكيلة واسعة من منتجات الحيوانات وملحقاتها عالية الجودة. استكشف مجموعتنا اليوم!
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="text-center md:text-right"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-xl font-bold mb-6 relative inline-block">
              <span className="relative z-10">روابط سريعة</span>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green3 to-green2 rounded-full"></div>
            </h3>
            <ul className="space-y-3" dir="rtl">
              {[
                { href: "/", label: "الرئيسية" },
                { href: "/category", label: "كل المواد" },
                { href: "/aboutUs", label: "من نحن؟" },
                { href: "/contact", label: "اتصل بنا" }
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <motion.span
                      className="text-green1 hover:text-white transition-colors duration-300 inline-flex items-center gap-2 group"
                      whileHover={{ x: -5 }}
                    >
                      <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l-5 5 5 5" />
                      </svg>
                      <span className="font-medium">{link.label}</span>
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Social */}
          <motion.div
            className="text-center md:text-right"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-6 relative inline-block" dir="rtl">
              <span className="relative z-10">تواصل معنا</span>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green3 to-green2 rounded-full"></div>
            </h3>
            <div className="flex justify-center md:justify-start gap-3 mb-6" dir="rtl">
              {[
                { Icon: FaWhatsapp, href: "https://wa.me/9647838984924", label: "WhatsApp" },
                { Icon: FaInstagram, href: "#", label: "Instagram" },
                { Icon: FaFacebook, href: "#", label: "Facebook" },
                { Icon: FaTwitter, href: "#", label: "Twitter" }
              ].map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -6, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green4/50 backdrop-blur-sm p-3 rounded-xl hover:bg-white hover:text-green4 transition-all duration-400 shadow-md hover:shadow-lg group"
                  aria-label={label}
                >
                  <Icon className="text-xl" />
                </motion.a>
              ))}
            </div>
            <div className="space-y-3" dir="rtl">
              <p className="text-green1 text-sm md:text-base flex items-center justify-center md:justify-start gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-medium">9647838984924+</span>
              </p>
              <p className="text-green1 text-sm md:text-base flex items-center justify-center md:justify-start gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">info@exohaven.com</span>
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="border-t border-green3/30 mt-12 pt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-sm md:text-base text-green1 font-medium">
            © {currentYear} ExoHaven. جميع الحقوق محفوظة.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
