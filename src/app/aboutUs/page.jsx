import Link from "next/link";
import { FiAward, FiCheck, FiHeadphones, FiUsers } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { pageMetadata } from "@/utils/metadata";
import { WHATSAPP_URL } from "@/utils/contact";
import Breadcrumbs from "@/app/Components/Breadcrumbs";

export const metadata = pageMetadata({
  title: "عن إكزو هيفن",
  description: "تعرف على قصتنا ورؤيتنا في تقديم أفضل المنتجات للعناية بالزواحف والحيوانات الغريبة",
  path: "/aboutUs",
});

const GOALS = [
  "توفير منتجات عالية الجودة للعناية بالزواحف",
  "تقديم النصائح والإرشادات من خبراء متخصصين",
  "دعم مجتمع مربي الحيوانات الغريبة في العراق",
];

const VALUES = [
  { Icon: FiAward, title: "الجودة", text: "نقدم فقط المنتجات عالية الجودة التي نثق بها لحيواناتنا" },
  { Icon: FiUsers, title: "الخبرة", text: "فريقنا من المتخصصين ذوي الخبرة في رعاية الزواحف والحيوانات الغريبة" },
  { Icon: FiHeadphones, title: "الدعم", text: "نقدم الدعم والمشورة المستمرة لمساعدتك في العناية بحيواناتك" },
];

export default function AboutUs() {
  return (
    <div className="container-page space-y-10 py-6 sm:space-y-14 sm:py-8" dir="rtl">
      <div>
        <Breadcrumbs className="mb-4" items={[{ label: "من نحن" }]} />
        <section className="overflow-hidden rounded-3xl bg-gradient-to-l from-green5 to-green4 px-6 py-10 text-white sm:px-10 sm:py-14">
          <p className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">منذ عام 2020</p>
          <h1 className="text-3xl font-extrabold sm:text-4xl">عن إكزو هيفن</h1>
          <p className="mt-3 max-w-2xl text-base text-white/90 sm:text-lg">ملاذ لعالم الزواحف الغريبة ومستلزماتها</p>
        </section>
      </div>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card sm:p-8">
          <h2 className="section-title mb-3">رحلتنا</h2>
          <p className="leading-8 text-gray-700">
            في إكزو هيفن، نحن شغوفون بتقديم أفضل الإكسسوارات والمستلزمات المتخصصة للسحالي والزواحف الأخرى. هدفنا هو خلق
            ملاذ لعشاق الزواحف، حيث نقدم كل ما تحتاجه للعناية بحيواناتك الأليفة الفريدة. مع النصائح من الخبراء ومنتجات
            عالية الجودة، نسعى لمساعدتك في بناء الملاذ المثالي لحيواناتك الغريبة.
          </p>
          <p className="mt-4 text-sm font-semibold text-green5">تأسست عام 2020 لتلبية احتياجات مربي الحيوانات الغريبة</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card sm:p-8">
          <h2 className="section-title mb-3">رؤيتنا</h2>
          <p className="leading-8 text-gray-700">
            سواء كنت جديدًا في عالم الزواحف أو مربيًا متمرسًا، فإن إكزو هيفن هو شريكك الموثوق. من إعدادات الموائل إلى
            التغذية، نضمن أن تحصل زواحفك على أفضل رعاية ممكنة.
          </p>
          <ul className="mt-4 space-y-2">
            {GOALS.map((goal) => (
              <li key={goal} className="flex items-start gap-2 text-gray-700">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green1 text-green5">
                  <FiCheck size={13} />
                </span>
                {goal}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="values">
        <h2 id="values" className="section-title mb-1">
          قيمنا
        </h2>
        <p className="mb-5 text-sm text-gray-500">المبادئ التي تقود عملنا كل يوم</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {VALUES.map(({ Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green1 text-green5">
                <Icon size={22} />
              </span>
              <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
              <p className="text-sm leading-7 text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-green1 px-6 py-10 text-center sm:px-10">
        <h2 className="text-2xl font-bold text-gray-900">هل لديك أسئلة؟ نحن هنا للمساعدة!</h2>
        <p className="mx-auto mt-2 max-w-xl text-gray-600">فريقنا جاهز لمساعدتك في اختيار المنتجات المناسبة لحيواناتك الأليفة.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <FaWhatsapp size={18} />
            راسلنا على واتساب
          </a>
          <Link href="/contact" className="btn-outline">
            كل طرق التواصل
          </Link>
        </div>
      </section>
    </div>
  );
}
