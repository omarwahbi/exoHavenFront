'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function TopProgressBar() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Set mounted state to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    // Don't run on server
    if (!isMounted) return;
    if (!searchParams) return; // Safe guard for SSR
    
    // Reset and show progress bar on route change
    setVisible(true);
    setProgress(0);
    
    // Simulate progress
    const timer1 = setTimeout(() => setProgress(40), 100);
    const timer2 = setTimeout(() => setProgress(80), 300);
    const timer3 = setTimeout(() => {
      setProgress(100);
      // Hide the bar after completion
      const hideTimer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(hideTimer);
    }, 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [pathname, searchParams, isMounted]);

  // Don't render anything on server
  if (!isMounted) return null;

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-1.5 z-50 bg-transparent"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease' }}
    >
      <div 
        className="h-full bg-green5"
        style={{ 
          width: `${progress}%`,
          transition: 'width 0.5s ease-out',
          boxShadow: '0 0 8px rgba(44, 122, 50, 0.5)'
        }}
      />
    </div>
  );
} 