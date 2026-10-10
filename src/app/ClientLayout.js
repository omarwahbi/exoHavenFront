"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, Suspense } from "react";
import Header from "./Components/Header";
import MobileTabBar from "./Components/MobileTabBar";
import Footer from "./Components/Footer";
import TopProgressBar from "./Components/TopProgressBar";
import GoogleAnalyticsScript from "./Components/GoogleAnalyticsScript";
import SaleBanner from "./Components/SaleBanner";

// Page chrome around every page. Pages render straight away (on the server too);
// each one shows its own loading state for data it is still fetching.
const ClientLayout = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            retry: 1,
            staleTime: 10 * 60 * 1000,
            gcTime: 30 * 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={null}>
        <TopProgressBar />
      </Suspense>
      <GoogleAnalyticsScript />
      <div className="flex min-h-screen flex-col bg-gray-50">
        <SaleBanner />
        <Header />
        {/* Room at the bottom on phones for the tab bar. */}
        <main className="flex-grow pb-20 md:pb-0">{children}</main>
        <Footer />
        <MobileTabBar />
      </div>
    </QueryClientProvider>
  );
};

export default ClientLayout;
