"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };

  return (
    <motion.button
      onClick={toggleDarkMode}
      className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-brand-green-700 dark:bg-brand-green-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <FaSun className="text-xl" />
      ) : (
        <FaMoon className="text-xl" />
      )}
    </motion.button>
  );
}
