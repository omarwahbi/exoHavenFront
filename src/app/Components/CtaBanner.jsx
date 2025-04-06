"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaWhatsapp, FaEnvelope, FaPhone, FaArrowLeft } from "react-icons/fa";
import Image from "next/image";

const CtaBanner = () => {
  const [hovered, setHovered] = useState(null);
  const whatsappNumber = "+9647838984924";  // Fixed WhatsApp number

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, y: -5 },
    tap: { scale: 0.95 }
  };

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    const message = "مرحباً، أنا مهتم بمنتجاتكم وأود الاستفسار عن بعض التفاصيل.";
    const formattedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${formattedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappURL, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div 
      className="bg-gradient-to-r from-green3 to-green4 py-12 px-4 my-16 rounded-3xl shadow-xl max-w-screen-xl mx-auto overflow-hidden relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* Enhanced decorative elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-black/5 rounded-full -translate-y-1/2 blur-lg"></div>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNiIvPjxjaXJjbGUgY3g9IjQ4IiBjeT0iMTIiIHI9IjYiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjQ4IiByPSI2Ii8+PGNpcmNsZSBjeD0iNDgiIGN5PSI0OCIgcj0iNiIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjYiLz48L2c+PC9zdmc+')]"></div>
      
      <div className="flex flex-col lg:flex-row items-center justify-between z-10 relative">
        <div className="lg:w-3/5 text-center lg:text-right mb-8 lg:mb-0 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <span className="bg-white/20 text-white text-sm px-4 py-1 rounded-full inline-block mb-3 backdrop-blur-sm">
              نحن هنا لمساعدتك
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">هل لديك أي استفسار؟</h2>
            <p className="text-white/80 text-base md:text-lg max-w-xl">
              فريقنا جاهز لمساعدتك والإجابة على جميع أسئلتك. تواصل معنا الآن للحصول على أفضل خدمة.
            </p>
          </motion.div>

          {/* Animated stats */}
          <motion.div 
            className="flex flex-wrap justify-center lg:justify-start gap-4 mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <p className="text-2xl font-bold">+1000</p>
              <p className="text-xs text-white/70">عميل سعيد</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <p className="text-2xl font-bold">24/7</p>
              <p className="text-xs text-white/70">دعم العملاء</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <p className="text-2xl font-bold">100%</p>
              <p className="text-xs text-white/70">ضمان الجودة</p>
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div 
          className="lg:w-2/5 bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-lg flex flex-col gap-4"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-white text-xl font-bold text-center mb-2">تواصل معنا الآن</h3>
          
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <motion.div
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              onHoverStart={() => setHovered('contact')}
              onHoverEnd={() => setHovered(null)}
            >
              <Link 
                href="/contact" 
                className="bg-white text-green4 font-bold px-6 py-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center w-full group"
              >
                <FaEnvelope className="mr-2 text-xl group-hover:scale-110 transition-transform duration-300" />
                <span className="mx-2">راسلنا</span>
                {hovered === 'contact' && (
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-2"
                  >
                    <FaArrowLeft className="text-xs" />
                  </motion.div>
                )}
              </Link>
            </motion.div>
            
            <motion.div
              variants={buttonVariants}
              initial="initial"
              whileHover="hover" 
              whileTap="tap"
              onHoverStart={() => setHovered('whatsapp')}
              onHoverEnd={() => setHovered(null)}
            >
              <button 
                onClick={handleWhatsAppClick}
                className="bg-[#25D366] text-white font-bold px-6 py-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center w-full group"
              >
                <FaWhatsapp className="mr-2 text-xl group-hover:scale-110 transition-transform duration-300" />
                <span className="mx-2">واتساب</span>
                {hovered === 'whatsapp' && (
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-2"
                  >
                    <FaArrowLeft className="text-xs" />
                  </motion.div>
                )}
              </button>
            </motion.div>
          </motion.div>
          
          <motion.div
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="mt-2"
            onHoverStart={() => setHovered('phone')}
            onHoverEnd={() => setHovered(null)}
          >
            <Link 
              href="tel:+9647700000000" 
              className="bg-white/20 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center w-full backdrop-blur-sm group"
            >
              <FaPhone className="mr-2 group-hover:scale-110 transition-transform duration-300" />
              <span className="mx-2" dir="ltr">+964 783 898 4924</span>
              {hovered === 'phone' && (
                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-2"
                >
                  <FaArrowLeft className="text-xs" />
                </motion.div>
              )}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CtaBanner; 