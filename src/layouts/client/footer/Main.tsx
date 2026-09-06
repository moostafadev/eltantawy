import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Mail, MapPin, Phone } from "lucide-react";

import { navLinks } from "../header/constants";

const deliveryAreas = ["مدينة 6 أكتوبر", "الشيخ زايد"];

const contactInfo = [
  { icon: Phone, label: "0100 123 4567", dir: "ltr" },
  { icon: Mail, label: "support@eltantawymeats.com", dir: "ltr" },
  { icon: Clock, label: "يوميًا من 9 صباحًا حتى 12 منتصف الليل" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#1B1512] pb-16 text-white/70 lg:pb-0">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-main/60 to-transparent" />

      <div className="pointer-events-none absolute -left-16 -top-16 size-56 rounded-full bg-main/10 blur-3xl" />

      <div className="container relative flex flex-col gap-6 py-6 lg:gap-8 lg:py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="relative flex w-fit items-center justify-center border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
              <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-main/10 to-transparent" />

              <Image
                src="/logo-2.png"
                alt="الطنطاوي"
                width={130}
                height={119}
                className="relative max-h-18 w-auto object-contain"
              />
            </div>

            <p className="max-w-64 text-sm leading-6 text-white/50">
              لحوم ودواجن طازجة من مزارعنا المصرية الخاصة، مباشرة إلى بابك.
            </p>

            <Link
              href="/products"
              className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-main transition-colors hover:text-main/80"
            >
              <span>تصفح المنتجات</span>
              <ArrowLeft className="size-3.5" />
            </Link>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold tracking-wider text-white">
              روابط سريعة
            </h3>

            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-white/50 transition-colors hover:text-main"
                >
                  الرئيسية
                </Link>
              </li>

              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/50 transition-colors hover:text-main"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              <li>
                <Link
                  href="/cart"
                  className="text-white/50 transition-colors hover:text-main"
                >
                  السلة
                </Link>
              </li>
            </ul>
          </div>

          {/* Delivery Areas */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold tracking-wider text-white">
              مناطق التوصيل
            </h3>

            <ul className="flex flex-col gap-2.5">
              {deliveryAreas.map((area) => (
                <li key={area} className="flex items-center gap-2.5 text-sm">
                  <span className="flex size-6 shrink-0 items-center justify-center bg-main/15 text-main">
                    <MapPin className="size-3.5" />
                  </span>

                  <span className="text-white/50">{area}</span>
                </li>
              ))}
            </ul>

            <p className="text-xs leading-5 text-white/35">
              للحفاظ على تجميد المنتجات، نغطي حاليًا هاتين المنطقتين فقط.
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold tracking-wider text-white">
              تواصل معنا
            </h3>

            <ul className="flex flex-col gap-2.5">
              {contactInfo.map(({ icon: Icon, label, dir }) => (
                <li key={label} className="flex items-center gap-2.5 text-sm">
                  <span className="flex size-6 shrink-0 items-center justify-center bg-main/15 text-main">
                    <Icon className="size-3.5" />
                  </span>

                  <span dir={dir} className="text-white/50">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 border-t border-white/10 pt-6 lg:pt-8 text-center sm:flex-row sm:justify-between">
          <p className="text-xs text-white/40">
            © {year} الطنطاوي. جميع الحقوق محفوظة.
          </p>

          <p className="text-xs font-medium tracking-widest text-main">
            جودة وطعم أصلي
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
