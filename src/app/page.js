import Carousel from "./Components/NewArrivalsCarousel";
import Categories from "./Components/Categories";
import FeaturedProducts from "./Components/FeaturedProducts";
import CtaBanner from "./Components/CtaBanner";
import HeroSection from "./Components/HeroSection";
import { getSale } from "@/services/sale";
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
    'تسوق أفضل مستلزمات الحيوانات الأليفة الغريبة والزواحف في العراق. توصيل مجاني للطلبات فوق 50,000 دينار، الدفع عند الاستلام. Shop the best exotic pets and reptile accessories in Iraq with free delivery above 50k IQD and cash on delivery.',
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
      'أفضل متجر لمستلزمات الحيوانات الأليفة الغريبة والزواحف في العراق. توصيل مجاني، الدفع عند الاستلام',
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

export default async function Home() {
  // Generate structured data for the homepage
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();
  const localBusinessSchema = generateLocalBusinessSchema();
  const faqSchema = generateFAQSchema(await getSale());
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

      <div className="space-y-12 sm:space-y-16">
        <HeroSection />
        <Categories />
        <Carousel />
        <FeaturedProducts />
        <CtaBanner />
      </div>
    </>
  );
}
