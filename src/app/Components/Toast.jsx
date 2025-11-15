"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

const Toast = ({ id, type = "success", message, duration = 3000, onClose }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const toastConfig = {
    success: {
      icon: FaCheckCircle,
      bgColor: "bg-gradient-to-r from-green4 to-green3",
      iconBg: "bg-green5",
      progressBar: "bg-green5",
    },
    error: {
      icon: FaExclamationCircle,
      bgColor: "bg-gradient-to-r from-red-600 to-red-500",
      iconBg: "bg-red-700",
      progressBar: "bg-red-700",
    },
    info: {
      icon: FaInfoCircle,
      bgColor: "bg-gradient-to-r from-blue-500 to-blue-400",
      iconBg: "bg-blue-600",
      progressBar: "bg-blue-600",
    },
    warning: {
      icon: FaExclamationCircle,
      bgColor: "bg-gradient-to-r from-yellow-500 to-yellow-400",
      iconBg: "bg-yellow-600",
      progressBar: "bg-yellow-600",
    },
  };

  const config = toastConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
      className={`${config.bgColor} text-white rounded-2xl shadow-lg overflow-hidden min-w-[280px] sm:min-w-[320px] max-w-md backdrop-blur-sm`}
    >
      <div className="flex items-center gap-3 p-4">
        {/* Icon */}
        <motion.div
          className={`${config.iconBg} rounded-full p-2 flex-shrink-0`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 25,
            delay: 0.1,
          }}
        >
          <Icon className="w-5 h-5" />
        </motion.div>

        {/* Message */}
        <p className="flex-grow text-sm sm:text-base font-medium" dir="rtl">
          {message}
        </p>

        {/* Close button */}
        <motion.button
          onClick={() => onClose(id)}
          className="flex-shrink-0 p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaTimes className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Progress bar */}
      {duration && (
        <motion.div
          className={`h-1 ${config.progressBar}`}
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{
            duration: duration / 1000,
            ease: "linear",
          }}
          style={{ transformOrigin: "left" }}
        />
      )}
    </motion.div>
  );
};

// Toast Container
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast {...toast} onClose={removeToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
