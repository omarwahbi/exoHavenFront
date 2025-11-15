"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { cart } = useCart();

  // Calculate total items in cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false); // Close the navbar on link click
  };

  const navbarClasses = scrolled
    ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 transition-all duration-400 sticky top-0 z-50"
    : "bg-white border-b border-transparent transition-all duration-400 z-50";

  const NavLink = ({ href, children }) => {
    const isActive = pathname === href ||
                    (href !== '/' && pathname.startsWith(href));

    return (
      <Link href={href} onClick={handleLinkClick}>
        <motion.div
          className={`px-4 py-2.5 rounded-xl text-sm font-bold relative group
                     ${isActive
                       ? 'text-green4 bg-green1/50'
                       : 'text-gray-700 hover:text-green4 hover:bg-green1/30'}`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {children}
          <span
            className={`absolute inset-x-2 bottom-1 h-0.5 bg-gradient-to-r from-green4 to-green3 rounded-full transform
                      ${isActive
                        ? 'scale-x-100'
                        : 'scale-x-0 origin-left transition-transform group-hover:scale-x-100'}
                      duration-300`}
          ></span>
        </motion.div>
      </Link>
    );
  };

  return (
    <nav className={navbarClasses} dir="rtl">
      <div className="w-11/12 max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link href="/">
                <div className="text-green5 font-bold text-xl">
                  <Image
                    height={30}
                    width={90}
                    src="/favicon.png"
                    alt="logo"
                    priority
                  />
                </div>
              </Link>
            </motion.div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink href="/">الرئيسية</NavLink>
                <NavLink href="/category">كل المواد</NavLink>
                <NavLink href="/aboutUs">من نحن؟</NavLink>
                <NavLink href="/contact">اتصل بنا</NavLink>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Cart Icon - Visible on both mobile and desktop */}
            <div className="relative">
              <Link href="/cart">
                <motion.div
                  className={`text-white p-2.5 md:p-3 rounded-xl transition-all duration-400 flex items-center shadow-sm
                            ${pathname === '/cart'
                              ? 'bg-green5 shadow-green'
                              : 'bg-green4 hover:bg-green5 hover:shadow-green-lg'}`}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ scale: 1 }}
                  animate={cartItemCount > 0 ? {
                    scale: [1, 1.15, 1],
                    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                  } : {}}
                >
                  <ShoppingCartIcon fontSize={cartItemCount > 0 ? "medium" : "small"} />
                  {cartItemCount > 0 && (
                    <motion.span
                      className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md ring-2 ring-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            </div>

            {/* Mobile menu button */}
            <motion.button
              onClick={toggleNavbar}
              type="button"
              className="md:hidden bg-green4 inline-flex items-center justify-center p-2.5 rounded-xl text-white hover:text-white hover:bg-green5 focus:outline-none shadow-sm hover:shadow-md transition-all duration-300"
              aria-controls="mobile-menu"
              aria-expanded={isOpen ? "true" : "false"}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu with improved animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={toggleNavbar}
          >
            <motion.div
              className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white h-full shadow-2xl overflow-y-auto"
              dir="rtl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile menu header */}
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-br from-green1/30 to-white">
                <div className="text-green5 font-bold text-xl">
                  القائمة
                </div>
                <button
                  onClick={toggleNavbar}
                  className="p-2 rounded-xl hover:bg-green1/50 focus:outline-none transition-colors duration-200"
                >
                  <svg
                    className="h-6 w-6 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              
              {/* Mobile menu links */}
              <div className="p-5 space-y-2">
                <Link href="/" onClick={handleLinkClick}>
                  <motion.div
                    className={`flex items-center p-4 rounded-xl transition-all duration-300
                                ${pathname === '/'
                                  ? 'bg-gradient-to-r from-green1 to-green2/50 text-green5 shadow-sm'
                                  : 'text-gray-700 hover:bg-green1/40 hover:text-green5'}`}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg 
                      className="w-5 h-5 ml-3" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                      />
                    </svg>
                    <span className="font-medium">الرئيسية</span>
                  </motion.div>
                </Link>
                
                <Link href="/category" onClick={handleLinkClick}>
                  <motion.div
                    className={`flex items-center p-4 rounded-xl transition-all duration-300
                                ${pathname.startsWith('/category')
                                  ? 'bg-gradient-to-r from-green1 to-green2/50 text-green5 shadow-sm'
                                  : 'text-gray-700 hover:bg-green1/40 hover:text-green5'}`}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg 
                      className="w-5 h-5 ml-3" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                      />
                    </svg>
                    <span className="font-medium">كل المواد</span>
                  </motion.div>
                </Link>
                
                <Link href="/aboutUs" onClick={handleLinkClick}>
                  <motion.div
                    className={`flex items-center p-4 rounded-xl transition-all duration-300
                                ${pathname === '/aboutUs'
                                  ? 'bg-gradient-to-r from-green1 to-green2/50 text-green5 shadow-sm'
                                  : 'text-gray-700 hover:bg-green1/40 hover:text-green5'}`}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg
                      className="w-5 h-5 ml-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-medium">من نحن؟</span>
                  </motion.div>
                </Link>

                <Link href="/contact" onClick={handleLinkClick}>
                  <motion.div
                    className={`flex items-center p-4 rounded-xl transition-all duration-300
                                ${pathname === '/contact'
                                  ? 'bg-gradient-to-r from-green1 to-green2/50 text-green5 shadow-sm'
                                  : 'text-gray-700 hover:bg-green1/40 hover:text-green5'}`}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg
                      className="w-5 h-5 ml-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-medium">اتصل بنا</span>
                  </motion.div>
                </Link>

                <Link href="/cart" onClick={handleLinkClick}>
                  <motion.div
                    className={`flex items-center p-4 rounded-xl transition-all duration-300
                                ${pathname === '/cart'
                                  ? 'bg-gradient-to-r from-green1 to-green2/50 text-green5 shadow-sm'
                                  : 'text-gray-700 hover:bg-green1/40 hover:text-green5'}`}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg 
                      className="w-5 h-5 ml-3" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                      />
                    </svg>
                    <span className="font-medium">عربة التسوق</span>
                    {cartItemCount > 0 && (
                      <span className="bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-6 min-w-[24px] flex items-center justify-center mr-2 px-2 shadow-sm">
                        {cartItemCount > 99 ? '99+' : cartItemCount}
                      </span>
                    )}
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
