"use client";

import { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Spinner from "../Components/Spinner";

// Dynamically import client components with SSR disabled
const CartComponent = dynamic(() => import("../Components/Cart"), { 
  ssr: false,
  loading: () => <LoadingFallback /> 
});

const ErrorBoundary = dynamic(() => import("../Components/ErrorBoundary"), { ssr: false });
const CartErrorMessage = dynamic(() => import("../Components/CartErrorMessage"), { ssr: false });

function LoadingFallback() {
  return (
    <div className="flex justify-center items-center h-[60vh]">
      <Spinner size="lg" />
    </div>
  );
}

export default function CartClientPage() {
  const [isClient, setIsClient] = useState(false);

  // Only render on client side to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingFallback />;
  }

  return (
    <div className="bg-gray-50 min-h-screen fade-in">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <ErrorBoundary fallback={<CartErrorMessage />}>
          <Suspense fallback={<LoadingFallback />}>
            <CartComponent />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
} 