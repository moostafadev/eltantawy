import Link from "next/link";
import { ArrowLeft, Package, ShoppingBag } from "lucide-react";

import { Tag } from "@/components/tag";
import { toArabicNums } from "@/utils/toArabicNums";

import { getRecentOrdersForUser } from "./orders.service";
import { clientOrderStatusColors, clientOrderStatusLabels } from "./types";

interface Props {
  userId: string;
}

const RecentOrders = async ({ userId }: Props) => {
  const orders = await getRecentOrdersForUser(userId, 3);

  return (
    <div className="overflow-hidden border border-background-second/60 bg-background shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-background-second/60 p-3 lg:p-4">
        <div className="flex items-center gap-2">
          <div className="flex size-9 shrink-0 items-center justify-center bg-main/10 text-main">
            <ShoppingBag className="size-4" />
          </div>

          <div>
            <h2 className="text-sm font-semibold">طلباتي</h2>

            <p className="mt-0.5 text-xs text-muted-foreground">
              آخر الطلبات التي قمت بها
            </p>
          </div>
        </div>

        <Link
          href="/profile/orders"
          className="flex items-center gap-1 text-xs font-medium text-main hover:underline"
        >
          <span>عرض كل الطلبات</span>
          <ArrowLeft className="size-3.5" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 p-8 text-center">
          <div className="flex size-12 items-center justify-center bg-muted text-muted-foreground">
            <Package className="size-6" />
          </div>

          <p className="text-sm font-medium text-foreground">
            لا توجد طلبات سابقة
          </p>

          <p className="text-xs text-muted-foreground">
            ابدأ التسوق الآن وستظهر طلباتك هنا
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {orders.map((order) => (
            <Link
              key={order.id}
              href="/profile/orders"
              className="flex flex-wrap items-center justify-between gap-3 border-b border-background-second/60 p-3 transition-colors last:border-b-0 hover:bg-background-second/10 lg:p-4"
            >
              <div className="min-w-0">
                <p dir="ltr" className="text-left font-bold text-main">
                  #{toArabicNums(order.orderNumber)}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {toArabicNums(order.itemsCount)} منتج ·{" "}
                  {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-medium">
                  {toArabicNums(String(order.total))} ج.م
                </span>

                <Tag
                  color={clientOrderStatusColors[order.status]}
                  variant="soft"
                  size="sm"
                >
                  {clientOrderStatusLabels[order.status]}
                </Tag>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentOrders;
