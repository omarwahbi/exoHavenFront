// Server Component
import CartClientPage from './CartClientPage';

export const metadata = {
  title: "سلة المشتريات | Shopping Cart",
  description: "عرض المنتجات المضافة إلى سلة المشتريات الخاصة بك وإكمال عملية الشراء. View your cart items and complete your order.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: "سلة المشتريات | إكزو هيفن ExoHaven",
    description: "أكمل طلبك واستمتع بتجربة تسوق سهلة وآمنة",
    images: [{ url: '/og-image.png' }],
  },
};

export default function ShoppingCartPage() {
  // Return the client component which handles dynamic imports and error boundaries
  return <CartClientPage />;
}
