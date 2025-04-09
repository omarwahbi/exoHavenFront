"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Spinner from "./Components/Spinner";
import TopProgressBar from "./Components/TopProgressBar";
import GoogleAnalyticsScript from "./Components/GoogleAnalyticsScript";

const ClientLayout = ({ children }) => {
  // Initialize QueryClient with improved caching settings
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,      // Don't refetch on component mount if data is fresh
        refetchOnReconnect: false,  // Don't refetch when reconnecting if data is fresh
        retry: 1,
        staleTime: 10 * 60 * 1000,  // 10 minutes (increased from 5 minutes)
        cacheTime: 30 * 60 * 1000,  // Keep data in cache for 30 minutes
      },
    },
  }));

  // State for managing the loading spinner
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname(); // Detect route changes

  // Set mounted state to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Skip effect during SSR to prevent hydration mismatch
    if (!isMounted) return;
    
    // Show loader on pathname change only if data is being fetched
    const handleRouteChange = () => {
      if (queryClient.isFetching() > 0) {
        setIsLoading(true);
      } else {
        // Short delay to check if any queries start fetching
        const timer = setTimeout(() => {
          setIsLoading(queryClient.isFetching() > 0);
        }, 100);
        return () => clearTimeout(timer);
      }
    };

    handleRouteChange();
    
    // Hide loader after a short delay regardless
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname, queryClient, isMounted]);

  // Scroll to top on route changes - only run on client
  useEffect(() => {
    if (!isMounted) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, isMounted]);

  // Don't render full content until after mount to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="flex flex-col min-h-screen bg-green1">
        <div className="flex-grow">
          <div className="flex justify-center h-[50vh] items-center">
            <Spinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={null}>
        <TopProgressBar />
      </Suspense>
      <GoogleAnalyticsScript />
      <div className="flex flex-col min-h-screen bg-green1">
        <Navbar />
        
        <main className="flex-grow">
          {isLoading ? (
            <div className="flex justify-center h-[50vh] items-center fade-in bg-green1">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="fade-in">
              {children}
            </div>
          )}
        </main>
        
        <Footer />
      </div>
    </QueryClientProvider>
  );
};

export default ClientLayout;
