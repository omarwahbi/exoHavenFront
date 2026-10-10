import { pageMetadata } from "@/utils/metadata";
import NewArrivalsClient from "./NewArrivalsClient";

export const metadata = pageMetadata({
  title: "وصل حديثاً",
  description: "أحدث مستلزمات الزواحف والطيور والحيوانات الأليفة الغريبة التي وصلت إلى ExoHaven، مع التوصيل لجميع محافظات العراق.",
  path: "/new-arrivals",
});

export default function NewArrivalsPage() {
  return <NewArrivalsClient />;
}
