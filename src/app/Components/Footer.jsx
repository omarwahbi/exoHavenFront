import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaWhatsapp, FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 md:py-16 border-t-4 border-brand-green-700">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Logo and Description */}
          <div className="flex flex-col items-center md:items-start">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mb-4"
            >
              <div className="bg-white rounded-xl p-3 inline-block shadow-xl">
                <Image
                  src="/favicon.png"
                  alt="ExoHaven Logo"
                  width={90}
                  height={30}
                  priority
                />
              </div>
            </motion.div>
            <p className="text-gray-300 dark:text-gray-400 text-sm text-center md:text-right max-w-xs leading-relaxed">
              نوفر تشكيلة واسعة من منتجات الحيوانات وملحقاتها عالية الجودة. استكشف مجموعتنا اليوم!
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-bold mb-4 border-b-2 border-brand-yellow pb-2 inline-block">
              روابط سريعة
            </h3>
            <ul className="space-y-3" dir="rtl">
              <li>
                <Link href="/">
                  <motion.span
                    className="text-gray-300 dark:text-gray-400 hover:text-brand-yellow dark:hover:text-brand-yellow transition-colors duration-300 inline-block"
                    whileHover={{ x: -5 }}
                  >
                    الرئيسية
                  </motion.span>
                </Link>
              </li>
              <li>
                <Link href="/category">
                  <motion.span
                    className="text-gray-300 dark:text-gray-400 hover:text-brand-yellow dark:hover:text-brand-yellow transition-colors duration-300 inline-block"
                    whileHover={{ x: -5 }}
                  >
                    كل المواد
                  </motion.span>
                </Link>
              </li>
              <li>
                <Link href="/aboutUs">
                  <motion.span
                    className="text-gray-300 dark:text-gray-400 hover:text-brand-yellow dark:hover:text-brand-yellow transition-colors duration-300 inline-block"
                    whileHover={{ x: -5 }}
                  >
                    من نحن؟
                  </motion.span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <motion.span
                    className="text-gray-300 dark:text-gray-400 hover:text-brand-yellow dark:hover:text-brand-yellow transition-colors duration-300 inline-block"
                    whileHover={{ x: -5 }}
                  >
                    اتصل بنا
                  </motion.span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-bold mb-4 border-b-2 border-brand-yellow pb-2 inline-block" dir="rtl">
              تواصل معنا
            </h3>
            <div className="flex justify-center md:justify-start gap-3 mb-6" dir="rtl">
              <motion.a
                href="https://wa.me/9647838984924"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                className="bg-brand-green-700 dark:bg-brand-green-600 p-3 rounded-xl hover:bg-brand-green-800 dark:hover:bg-brand-green-700 transition-colors duration-300 shadow-lg"
              >
                <FaWhatsapp className="text-white text-xl" />
              </motion.a>
              <motion.a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                className="bg-brand-teal-700 dark:bg-brand-teal-600 p-3 rounded-xl hover:bg-brand-teal-800 dark:hover:bg-brand-teal-700 transition-colors duration-300 shadow-lg"
              >
                <FaInstagram className="text-white text-xl" />
              </motion.a>
              <motion.a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                className="bg-brand-green-700 dark:bg-brand-green-600 p-3 rounded-xl hover:bg-brand-green-800 dark:hover:bg-brand-green-700 transition-colors duration-300 shadow-lg"
              >
                <FaFacebook className="text-white text-xl" />
              </motion.a>
              <motion.a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                className="bg-brand-amber dark:bg-brand-amber-light p-3 rounded-xl hover:bg-brand-amber-dark dark:hover:bg-brand-amber transition-colors duration-300 shadow-lg"
              >
                <FaTwitter className="text-white text-xl" />
              </motion.a>
            </div>
            <p className="text-gray-300 dark:text-gray-400 text-sm mb-2" dir="rtl">
              هاتف: 9647838984924+
            </p>
            <p className="text-gray-300 dark:text-gray-400 text-sm" dir="rtl">
              البريد الإلكتروني: info@exohaven.com
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 dark:border-gray-800 mt-10 pt-8 text-center">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            © {currentYear} ExoHaven. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
