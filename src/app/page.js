import Carousel from "./Components/NewArrivalsCarousel";
import Categories from "./Components/Categories";
import FeaturedProducts from "./Components/FeaturedProducts";
import CtaBanner from "./Components/CtaBanner";
import HeroSection from "./Components/HeroSection";
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateLocalBusinessSchema,
  generateFAQSchema,
  renderJSONLD,
} from "@/utils/seo";

// Enhanced homepage metadata for SEO
export const metadata = {
  title: 'الصفحة الرئيسية - متجر مستلزمات الحيوانات الأليفة الغريبة | Home - Exotic Pets Accessories',
  description:
    'تسوق أفضل مستلزمات الحيوانات الأليفة الغريبة والزواحف في العراق. توصيل مجاني للطلبات فوق 50,000 دينار، خصم 10% على الطلبات عبر الموقع، الدفع عند الاستلام. Shop the best exotic pets and reptile accessories in Iraq with free delivery above 50k IQD, 10% discount, and cash on delivery.',
  keywords: [
    'مستلزمات الحيوانات الغريبة العراق',
    'مستلزمات الزواحف بغداد',
    'متجر حيوانات أليفة',
    'توصيل مجاني العراق',
    'exotic pets Iraq',
    'reptile accessories Baghdad',
    'free delivery pets',
  ],
  openGraph: {
    title: 'ExoHaven - متجر مستلزمات الحيوانات الأليفة الغريبة في العراق',
    description:
      'أفضل متجر لمستلزمات الحيوانات الأليفة الغريبة والزواحف في العراق. توصيل مجاني، خصم 10%، الدفع عند الاستلام',
    type: 'website',
    locale: 'ar_IQ',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ExoHaven Iraq - Exotic Pets Accessories',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ExoHaven - متجر مستلزمات الحيوانات الأليفة الغريبة في العراق',
    description:
      'أفضل متجر لمستلزمات الحيوانات الأليفة الغريبة والزواحف في العراق. توصيل مجاني فوق 50,000 دينار',
  },
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  // Generate structured data for the homepage
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();
  const localBusinessSchema = generateLocalBusinessSchema();
  const faqSchema = generateFAQSchema();
  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={renderJSONLD(organizationSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={renderJSONLD(websiteSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={renderJSONLD(localBusinessSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={renderJSONLD(faqSchema)}
      />

      <div className="space-y-0 overflow-hidden">
        {/* Hero section with gradient background */}
        <section className="bg-gradient-to-br from-green1 via-accent2/20 to-green2/40">
          <HeroSection />
        </section>

      {/* Carousel section with glass effect */}
      <section className="py-12 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-2xl shadow-xl p-6 sm:p-8">
            <Carousel />
          </div>
        </div>
      </section>
      
      {/* Categories with subtle pattern and glass cards */}
      <section className="py-16 bg-gradient-to-r from-accent1 via-white to-green1/30 relative">
        <div className="absolute inset-0 bg-pattern-grid opacity-70"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Categories />
        </div>
      </section>
      
      {/* Featured products with glass morphism */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent3/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green3/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="glass rounded-xl">
            <FeaturedProducts />
          </div>
        </div>
      </section>
      
      {/* CTA Banner with stronger accent and glass effect */}
      <section className="py-16 bg-gradient-to-br from-green2/70 via-green3/40 to-accent2/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent4/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green5/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="glass rounded-xl shadow-lg p-6 sm:p-8">
            <CtaBanner />
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
