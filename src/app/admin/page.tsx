import {
  ArrowLeft,
  Package,
  Plus,
  Tags,
  TrendingUp,
  Users,
} from "lucide-react";

import Link from "next/link";

import { Button } from "@/components/button";
import { prisma } from "@/lib/prisma";
import { toArabicNums } from "@/utils/toArabicNums";

const AdminDashboard = async () => {
  const [usersCount, productsCount, categoriesCount] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.category.count(),
  ]);

  const stats = [
    {
      title: "المستخدمين",
      value: usersCount,
      icon: Users,
      description: "إجمالي المستخدمين",
    },
    {
      title: "المنتجات",
      value: productsCount,
      icon: Package,
      description: "إجمالي المنتجات",
    },
    {
      title: "التصنيفات",
      value: categoriesCount,
      icon: Tags,
      description: "إجمالي التصنيفات",
    },
  ];

  const quickActions = [
    {
      title: "إضافة منتج",
      description: "أضف منتجًا جديدًا إلى الموقع",
      href: "/admin/products/create",
      icon: Package,
    },
    {
      title: "إضافة تصنيف",
      description: "أنشئ تصنيفًا جديدًا للمنتجات",
      href: "/admin/products/categories/create",
      icon: Tags,
    },
  ];

  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">لوحة التحكم</h1>

        <p className="text-sm text-muted-foreground">
          نظرة عامة على أداء الموقع وإحصائياته
        </p>
      </div>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {stats.map(({ title, value, icon: Icon, description }) => (
          <div
            key={title}
            className="group border border-background-second/20 bg-background p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md lg:p-4"
          >
            <div className="flex items-start justify-between gap-3 lg:gap-4">
              <div className="flex min-w-0 flex-col gap-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {title}
                </p>

                <p className="text-3xl font-bold tracking-tight">
                  {toArabicNums(value)}
                </p>

                <p className="text-xs text-muted-foreground">{description}</p>
              </div>

              <div className="flex size-12 shrink-0 items-center justify-center bg-main/10 text-main transition-transform duration-300 group-hover:scale-105">
                <Icon className="size-6" />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
        {/* Store Overview */}
        <section className="flex flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:col-span-2 lg:gap-4 lg:p-4">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-3 lg:gap-4 lg:pb-4">
            <div className="min-w-0">
              <h2 className="font-bold">ملخص الموقع</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                نظرة سريعة على البيانات الحالية
              </p>
            </div>

            <div className="flex size-10 shrink-0 items-center justify-center bg-main/10 text-main">
              <TrendingUp className="size-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:gap-3">
            {stats.map(({ title, value, icon: Icon }) => (
              <div key={title} className="bg-muted p-2 lg:p-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center bg-main/10 text-main">
                    <Icon className="size-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs text-muted-foreground">
                      {title}
                    </p>

                    <p className="mt-1 font-bold">{toArabicNums(value)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="flex flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
          <div className="border-b border-border pb-3 lg:pb-4">
            <h2 className="font-bold">إجراءات سريعة</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              الوصول السريع لأهم العمليات
            </p>
          </div>

          <div className="flex flex-col gap-2 lg:gap-3">
            {quickActions.map(({ title, description, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-3 border border-border p-3 transition-all duration-300 hover:border-main/30 hover:bg-main/5"
              >
                <div className="flex size-10 shrink-0 items-center justify-center bg-main/10 text-main">
                  <Icon className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{title}</p>

                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {description}
                  </p>
                </div>

                <ArrowLeft className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-main" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Welcome */}
      <section className="relative overflow-hidden border border-main/20 bg-main/5 p-3 lg:p-4">
        <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:gap-4">
          <div className="flex min-w-0 flex-col gap-1 lg:gap-1.5">
            <div className="mb-1 flex items-center gap-2 text-main lg:mb-2">
              <TrendingUp className="size-5" />

              <span className="text-sm font-semibold">إدارة الموقع</span>
            </div>

            <h2 className="text-lg font-bold">
              تحكم كامل في الموقع من مكان واحد
            </h2>

            <p className="max-w-xl text-sm text-muted-foreground">
              يمكنك إدارة المنتجات والتصنيفات والمستخدمين بسهولة من لوحة التحكم.
            </p>
          </div>

          <Link href="/admin/products/create" className="self-end sm:self-auto">
            <Button color="MAIN">
              <Plus className="size-4 lg:size-5" />
              إضافة منتج
            </Button>
          </Link>
        </div>

        <div className="pointer-events-none absolute -left-10 -top-10 size-32 rounded-full bg-main/10 blur-2xl" />

        <div className="pointer-events-none absolute -bottom-10 -right-10 size-32 rounded-full bg-background-second/40 blur-2xl" />
      </section>
    </div>
  );
};

export default AdminDashboard;
