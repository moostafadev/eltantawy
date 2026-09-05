"use client";

import Image from "next/image";
import { Package, ShoppingBag } from "lucide-react";

import { Accordion, AccordionItem } from "@/components/accordion";
import { Tag } from "@/components/tag";
import { toArabicNums } from "@/utils/toArabicNums";

import OrderTimeline from "./OrderTimeline";
import { clientOrderStatusColors, clientOrderStatusLabels } from "./types";
import type { getAllOrdersForUser } from "./orders.service";

type Order = Awaited<ReturnType<typeof getAllOrdersForUser>>[number];

interface Props {
  orders: Order[];
}

const OrdersList = ({ orders }: Props) => {
  if (orders.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center gap-3 border border-background-second/60 bg-background p-6 text-center shadow-sm">
        <div className="flex size-14 items-center justify-center bg-muted text-muted-foreground">
          <Package className="size-6" />
        </div>

        <p className="text-sm font-medium text-foreground">
          لا توجد طلبات سابقة
        </p>

        <p className="text-xs text-muted-foreground">
          ابدأ التسوق الآن وستظهر طلباتك هنا
        </p>
      </div>
    );
  }

  return (
    <Accordion>
      {orders.map((order) => (
        <AccordionItem
          key={order.id}
          value={order.id}
          trigger={
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center bg-main/10 text-main">
                  <ShoppingBag className="size-4.5" />
                </div>

                <div className="min-w-0">
                  <p dir="ltr" className="text-left font-bold text-main">
                    #{toArabicNums(order.orderNumber)}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {toArabicNums(order.items.length)} منتج ·{" "}
                    {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-semibold">
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
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-4 p-3 lg:grid-cols-[minmax(0,1fr)_18rem] lg:p-4">
            {/* Items + Summary */}
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="mb-2 text-sm font-semibold">عناصر الطلب</h3>

                <div className="flex flex-col border border-background-second/60 bg-background">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 border-b border-background-second/60 p-2.5 last:border-b-0"
                    >
                      <div className="relative size-12 shrink-0 overflow-hidden bg-muted">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-muted-foreground">
                            <Package className="size-5" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {item.title}
                        </p>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {item.weightOptionName ??
                            (item.unit === "KG" ? "كيلو" : "قطعة")}
                          {" · "}
                          {toArabicNums(item.qty)} × {toArabicNums(item.price)}{" "}
                          ج.م
                        </p>
                      </div>

                      <span className="shrink-0 text-sm font-bold text-main">
                        {item.isApprox
                          ? `${toArabicNums(item.minTotal ?? 0)} - ${toArabicNums(item.maxTotal ?? 0)}`
                          : toArabicNums(item.total)}{" "}
                        ج.م
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 border border-background-second/60 bg-background p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span className="font-medium">
                    {toArabicNums(String(order.subtotal))} ج.م
                  </span>
                </div>

                {order.productsDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      خصومات المنتجات
                    </span>
                    <span className="font-medium text-success">
                      -{toArabicNums(String(order.productsDiscount))} ج.م
                    </span>
                  </div>
                )}

                {order.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {order.couponCode ? `كوبون (${order.couponCode})` : "خصم"}
                    </span>
                    <span className="font-medium text-success">
                      -{toArabicNums(String(order.discountAmount))} ج.م
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    رسوم التوصيل ({order.deliveryZoneTitle})
                  </span>
                  <span className="font-medium">
                    {toArabicNums(String(order.deliveryFee))} ج.م
                  </span>
                </div>

                <div className="border-t border-background-second/60 pt-2">
                  <div className="flex justify-between font-bold">
                    <span>الإجمالي</span>
                    <span className="text-main">
                      {toArabicNums(String(order.total - order.refundedAmount))}{" "}
                      ج.م
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="border border-background-second/60 bg-background p-3 lg:p-4">
              <h3 className="mb-3 text-sm font-semibold">تتبع الطلب</h3>

              <OrderTimeline
                history={order.statusHistory}
                currentStatus={order.status}
              />
            </div>
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default OrdersList;
