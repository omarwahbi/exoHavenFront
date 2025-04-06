import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaWhatsapp, FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-green5 text-white py-8 md:py-12">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Logo and Description */}
          <div className="flex flex-col items-center md:items-start">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="mb-4"
            >
              <div className="bg-white rounded-md p-2 inline-block">
                <Image
                  src="/favicon.png"
                  alt="ExoHaven Logo"
                  width={90}
                  height={30}
                  priority
                />
              </div>
            </motion.div>
            <p className="text-gray-200 text-sm text-center md:text-right max-w-xs">
              نوفر تشكيلة واسعة من منتجات الحيوانات وملحقاتها عالية الجودة. استكشف مجموعتنا اليوم!
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-bold mb-4 border-b border-green4 pb-2 inline-block">
              روابط سريعة
            </h3>
            <ul className="space-y-2" dir="rtl">
              <li>
                <Link href="/">
                  <motion.span 
                    className="text-gray-200 hover:text-white transition-colors duration-300 inline-block"
                    whileHover={{ x: -5 }}
                  >
                    الرئيسية
                  </motion.span>
                </Link>
              </li>
              <li>
                <Link href="/category">
                  <motion.span 
                    className="text-gray-200 hover:text-white transition-colors duration-300 inline-block"
                    whileHover={{ x: -5 }}
                  >
                    كل المواد
                  </motion.span>
                </Link>
              </li>
              <li>
                <Link href="/aboutUs">
                  <motion.span 
                    className="text-gray-200 hover:text-white transition-colors duration-300 inline-block"
                    whileHover={{ x: -5 }}
                  >
                    من نحن؟
                  </motion.span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <motion.span 
                    className="text-gray-200 hover:text-white transition-colors duration-300 inline-block"
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
            <h3 className="text-lg font-bold mb-4 border-b border-green4 pb-2 inline-block" dir="rtl">
              تواصل معنا
            </h3>
            <div className="flex justify-center md:justify-start gap-4 mb-6" dir="rtl">
              <motion.a 
                href="https://wa.me/9647838984924" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                className="bg-green4 p-2 rounded-full hover:bg-green3 transition-colors duration-300"
              >
                <FaWhatsapp className="text-white text-xl" />
              </motion.a>
              <motion.a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                className="bg-green4 p-2 rounded-full hover:bg-green3 transition-colors duration-300"
              >
                <FaInstagram className="text-white text-xl" />
              </motion.a>
              <motion.a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                className="bg-green4 p-2 rounded-full hover:bg-green3 transition-colors duration-300"
              >
                <FaFacebook className="text-white text-xl" />
              </motion.a>
              <motion.a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                className="bg-green4 p-2 rounded-full hover:bg-green3 transition-colors duration-300"
              >
                <FaTwitter className="text-white text-xl" />
              </motion.a>
            </div>
            <p className="text-gray-200 text-sm" dir="rtl">
              هاتف: 9647838984924+
            </p>
            <p className="text-gray-200 text-sm" dir="rtl">
              البريد الإلكتروني: info@exohaven.com
            </p>
          </div>
        </div>

        <div className="border-t border-green3 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-300">
            © {currentYear} ExoHaven. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
