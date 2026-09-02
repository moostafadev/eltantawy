import Link from "next/link";
import { ArrowLeft, Percent, Truck } from "lucide-react";

const settingsSections = [
  {
    title: "مناطق التوصيل",
    description: "إدارة مناطق التوصيل وتكلفة كل منطقة",
    href: "/admin/settings/delivery",
    icon: Truck,
    isActive: true,
  },
  {
    title: "الخصومات",
    description: "إدارة كوبونات الخصم وخصومات العملاء",
    href: "/admin/settings/discounts",
    icon: Percent,
    isActive: true,
  },
];

const SettingsPage = () => {
  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <div>
        <h1 className="text-2xl font-bold">الإعدادات</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          إدارة الإعدادات العامة للموقع
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4">
        {settingsSections.map(
          ({ title, description, href, icon: Icon, isActive }) =>
            isActive ? (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-3 border border-background-second bg-background p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-main/30 hover:shadow-md lg:p-4"
              >
                <div className="flex size-11 shrink-0 items-center justify-center bg-main/10 text-main">
                  <Icon className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{title}</p>

                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {description}
                  </p>
                </div>

                <ArrowLeft className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-main" />
              </Link>
            ) : (
              <div
                key={href}
                className="flex items-center gap-3 border border-background-second/60 bg-muted/20 p-3 opacity-60 lg:p-4"
              >
                <div className="flex size-11 shrink-0 items-center justify-center bg-muted text-muted-foreground">
                  <Icon className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{title}</p>

                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {description}
                  </p>
                </div>

                <span className="shrink-0 bg-background-second/60 px-2 py-1 text-[10px] font-medium text-muted-foreground">
                  قريبًا
                </span>
              </div>
            ),
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
