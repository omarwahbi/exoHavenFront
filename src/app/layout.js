// app/layout.js
import { Inter, Cairo } from "next/font/google";
import { CartProvider } from "./context/CartContext";
import "./globals.css";
import ClientLayout from "./ClientLayout"; // Import the client-side layout component
import { Analytics } from "@vercel/analytics/react";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://exohaven-iq.com'),
  title: {
    template: '%s | إكزو هيفن ExoHaven',
    default: 'إكزو هيفن - متجر مستلزمات الحيوانات الأليفة الغريبة في العراق | ExoHaven Iraq',
  },
  description: "متجر إكزو هيفن المتخصص في بيع جميع مستلزمات الحيوانات الأليفة الغريبة والزواحف في العراق. توصيل مجاني للطلبات فوق 50,000 دينار عراقي. خصم 10% على الطلبات عبر الموقع. الدفع عند الاستلام متاح. ExoHaven - Your trusted exotic pets accessories shop in Iraq with free delivery above 50k IQD, 10% website discount, and cash on delivery.",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: [
    // Arabic Keywords - Primary
    "مستلزمات الحيوانات الأليفة الغريبة",
    "مستلزمات الزواحف",
    "متجر حيوانات أليفة العراق",
    "إكزو هيفن",
    "ExoHaven",
    "أطعمة الزواحف",
    "قفص للحيوانات الأليفة",
    "مستلزمات السحالي",
    "مستلزمات الثعابين",
    "مستلزمات السلاحف",
    "مستلزمات الطيور الغريبة",
    "حوض تيراريوم",
    "إضاءة للزواحف",
    "تدفئة للزواحف",
    "ديكور تيراريوم",

    // Arabic Keywords - Iraq Specific
    "متجر حيوانات بغداد",
    "توصيل حيوانات أليفة العراق",
    "مستلزمات حيوانات بغداد",
    "توصيل مجاني العراق",
    "الدفع عند الاستلام العراق",

    // English Keywords - Primary
    "exotic pets accessories Iraq",
    "reptile supplies Iraq",
    "pet shop Baghdad",
    "ExoHaven Iraq",
    "exotic pets store",
    "reptile food Iraq",
    "pet cage Iraq",
    "lizard supplies",
    "snake accessories",
    "turtle supplies",
    "exotic birds accessories",
    "terrarium Iraq",
    "reptile lighting",
    "reptile heating",
    "terrarium decor",

    // English Keywords - Services
    "free delivery Iraq pets",
    "cash on delivery pets Iraq",
    "pet accessories online Iraq",
    "Baghdad pet store",
    "Iraq exotic animals",
  ],
  authors: [
    {
      name: "ExoHaven Iraq",
      url: "https://exohaven-iq.com",
    },
  ],
  category: "E-commerce - Pet Supplies",
  classification: "Exotic Pets Accessories Retail",
  icons: [
    { rel: "apple-touch-icon", url: "/icons/icon-192x192.png" },
    { rel: "icon", url: "/icons/icon-512x512.png" },
  ],
  alternates: {
    canonical: '/',
    languages: {
      'ar-IQ': '/',
      'en-US': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_IQ',
    alternateLocale: ['en_US'],
    url: 'https://exohaven-iq.com/',
    title: 'إكزو هيفن - متجر مستلزمات الحيوانات الأليفة الغريبة في العراق',
    description: 'متجر متخصص في بيع جميع مستلزمات الحيوانات الأليفة الغريبة والزواحف في العراق. توصيل مجاني للطلبات فوق 50,000 دينار. خصم 10% على الطلبات عبر الموقع. الدفع عند الاستلام.',
    siteName: 'ExoHaven Iraq | إكزو هيفن العراق',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'إكزو هيفن - متجر مستلزمات الحيوانات الأليفة الغريبة',
      type: 'image/png',
    }],
    countryName: 'Iraq',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'إكزو هيفن - متجر مستلزمات الحيوانات الأليفة الغريبة في العراق',
    description: 'متجر متخصص في بيع جميع مستلزمات الحيوانات الأليفة الغريبة والزواحف. توصيل مجاني فوق 50,000 دينار، خصم 10%، الدفع عند الاستلام',
    images: ['/og-image.png'],
    creator: '@exohaven.iq',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when you get them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
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
        <Analytics />
      </body>
    </html>
  );
}
