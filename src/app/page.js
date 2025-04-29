import Carousel from "./Components/NewArrivalsCarousel";
import Categories from "./Components/Categories";
import FeaturedProducts from "./Components/FeaturedProducts";
import CtaBanner from "./Components/CtaBanner";
import HeroSection from "./Components/HeroSection";
import SaleHero from "./Components/SaleHero";

export default function Home() {
  return (
    <div className="space-y-0 overflow-hidden">
      {/* Hero section with gradient background */}
      <section className="bg-gradient-to-br from-green1 via-accent2/20 to-green2/40">
        <HeroSection />
      </section>
      
      {/* Sale Hero - Limited Time 15% Off */}
      <SaleHero />
      
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
  );
}
