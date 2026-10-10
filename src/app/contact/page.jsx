import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { pageMetadata } from "@/utils/metadata";
import { EMAIL, INSTAGRAM_URL, PHONE_URL, TIKTOK_URL, WHATSAPP_NUMBER, WHATSAPP_URL } from "@/utils/contact";
import Breadcrumbs from "@/app/Components/Breadcrumbs";

export const metadata = pageMetadata({
  title: "تواصل معنا",
  description: "تواصل مع فريق إكزو هيفن للاستفسارات وطلبات المساعدة - نحن هنا لخدمتك",
  path: "/contact",
});

// "+9647838984924" -> "+964 783 898 4924"
const displayNumber = WHATSAPP_NUMBER.replace(/^(\+964)(\d{3})(\d{3})(\d+)$/, "$1 $2 $3 $4");

const CHANNELS = [
  { Icon: FaWhatsapp, title: "واتساب", value: displayNumber, href: WHATSAPP_URL, action: "دردشة عبر واتساب", external: true },
  { Icon: FiPhone, title: "الهاتف", value: displayNumber, href: PHONE_URL, action: "اتصل بنا" },
  { Icon: FiMail, title: "البريد الإلكتروني", value: EMAIL, href: `mailto:${EMAIL}`, action: "إرسال بريد إلكتروني" },
];

const SOCIAL = [
  { Icon: FaInstagram, label: "Instagram", handle: "@exohaven.iq", href: INSTAGRAM_URL },
  { Icon: FaTiktok, label: "TikTok", handle: "@exohaven.iq", href: TIKTOK_URL },
];

export default function Contact() {
  return (
    <div className="container-page space-y-8 py-6 sm:space-y-10 sm:py-8" dir="rtl">
      <div>
        <Breadcrumbs className="mb-4" items={[{ label: "اتصل بنا" }]} />
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">تواصل معنا</h1>
        <p className="mt-1 text-gray-600">نحن هنا لمساعدتك والإجابة على جميع استفساراتك.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        {CHANNELS.map(({ Icon, title, value, href, action, external }) => (
          <a
            key={title}
            href={href}
            {...(external && { target: "_blank", rel: "noopener noreferrer" })}
            className="group flex flex-col items-start gap-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green1 text-green5">
              <Icon size={22} />
            </span>
            <span className="text-sm font-semibold text-gray-500">{title}</span>
            <span dir="ltr" className="font-bold text-gray-900">
              {value}
            </span>
            <span className="text-sm font-bold text-green5 group-hover:text-green4">{action} ←</span>
          </a>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
          <h2 className="mb-1 text-lg font-bold text-gray-900">تابعنا</h2>
          <p className="mb-4 text-sm text-gray-600">أحدث المنتجات والنصائح حول العناية بالحيوانات الغريبة.</p>
          <div className="flex flex-wrap gap-3">
            {SOCIAL.map(({ Icon, label, handle, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:border-green3 hover:text-green5"
              >
                <Icon size={18} />
                {label}
                <span dir="ltr" className="font-normal text-gray-500">
                  {handle}
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green1 text-green5">
            <FiMapPin size={22} />
          </span>
          <div>
            <h2 className="mb-1 text-lg font-bold text-gray-900">موقعنا</h2>
            <p className="text-gray-600">نحن في بغداد، ونوصل لجميع محافظات العراق. الدفع عند الاستلام.</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-gradient-to-l from-green5 to-green4 px-6 py-10 text-center text-white sm:px-10">
        <h2 className="text-2xl font-bold">هل تحتاج إلى مساعدة في الاختيار؟</h2>
        <p className="mx-auto mt-2 max-w-xl text-white/90">أرسل لنا نوع حيوانك واحتياجاته، ونقترح عليك المنتجات المناسبة.</p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-green5 shadow-md transition-colors hover:bg-green1"
        >
          <FaWhatsapp size={20} />
          تواصل عبر واتساب
        </a>
      </section>
    </div>
  );
}
