// Server Component
import CartClientPage from './CartClientPage';

export const metadata = {
  title: "سلة المشتريات",
  description: "عرض المنتجات المضافة إلى سلة المشتريات الخاصة بك وإكمال عملية الشراء",
  openGraph: {
    title: "سلة المشتريات | إكزو هيفن",
    description: "أكمل طلبك واستمتع بتجربة تسوق سهلة وآمنة",
    images: [{ url: '/images/cart-og.jpg' }],
  },
};

export default function ShoppingCartPage() {
  // Return the client component which handles dynamic imports and error boundaries
  return <CartClientPage />;
}
