import { Package, Tags, Users } from "lucide-react";

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
    },
    {
      title: "المنتجات",
      value: productsCount,
      icon: Package,
    },
    {
      title: "التصنيفات",
      value: categoriesCount,
      icon: Tags,
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          نظرة عامة على المتجر
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ title, value, icon: Icon }) => (
          <div
            key={title}
            className="border border-background-second/20 bg-background p-5 shadow-sm transition duration-300 hover:shadow-md "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{title}</p>

                <p className="mt-2 text-3xl font-bold">{toArabicNums(value)}</p>
              </div>

              <div className="flex size-12 items-center justify-center bg-main/10 text-main ">
                <Icon className="size-6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
