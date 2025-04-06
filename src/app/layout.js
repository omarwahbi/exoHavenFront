// app/layout.js
import { Inter, Cairo } from "next/font/google";
import { CartProvider } from "./context/CartContext";
import "./globals.css";
import ClientLayout from "./ClientLayout"; // Import the client-side layout component

// Font optimization
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

const cairo = Cairo({
  subsets: ["arabic"],
  display: 'swap',
  variable: '--font-cairo',
});

// Metadata export for SEO and page-related settings
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || 'https://admin.exohaven-iq.com'),
  title: {
    template: '%s | إكزو هيفن',
    default: 'إكزو هيفن - متجر للمنتجات الإلكترونية',
  },
  description: "متجر متميز للمنتجات الإلكترونية وأحدث التقنيات بأسعار مناسبة",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["متجر الكتروني", "تسوق", "إكزو هيفن", "منتجات إلكترونية", "توصيل عراق"],
  authors: [
    {
      name: "Omar",
      url: "https://www.linkedin.com/omarwahbi",
    },
  ],
  icons: [
    { rel: "apple-touch-icon", url: "icons/icon-192x192.png" },
    { rel: "icon", url: "icons/icon-512x512.png" },
  ],
  openGraph: {
    type: 'website',
    locale: 'ar_IQ',
    url: 'https://exohaven.com/',
    title: 'إكزو هيفن - متجر للمنتجات الإلكترونية',
    description: 'متجر متميز للمنتجات الإلكترونية وأحدث التقنيات بأسعار مناسبة',
    siteName: 'إكزو هيفن',
    images: [{
      url: 'icons/og-image.png',
      width: 1200,
      height: 630,
      alt: 'إكزو هيفن',
    }],
  },
};

// Viewport configuration
export const viewport = {
  themeColor: "#4A9A51", // Updated to richer green
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true, // Allow users to zoom for accessibility
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${cairo.variable}`}>
      <body className="font-cairo">
        <CartProvider>
          <ClientLayout>{children}</ClientLayout>
        </CartProvider>
      </body>
    </html>
  );
}
