import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/breadcrumb";
import { Tag } from "@/components/tag";
import { toArabicNums } from "@/utils/toArabicNums";
import {
  getOneOrder,
  paymentMethodLabels,
  StatusChanger,
} from "@/features/admin/orders";
import {
  returnStatusColors,
  returnStatusLabels,
  ReturnStatusChanger,
} from "@/features/admin/returns";
import { CreateReturnButton } from "@/features/admin/returns/create";

interface OrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

const OrderPage = async ({ params }: OrderPageProps) => {
  const { id } = await params;

  const order = await getOneOrder(id);

  if (!order) {
    notFound();
  }

  const returnableItems = order.items.filter(
    (item) => item.qty - item.returnedQty > 0,
  );

  const canCreateReturn =
    order.status === "DELIVERED" && returnableItems.length > 0;

  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <Breadcrumb
        items={[
          {
            label: "الطلبات",
            href: "/admin/orders",
          },
          {
            label: `#${order.orderNumber}`,
          },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            طلب #{toArabicNums(order.orderNumber)}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleString("ar-EG")}
          </p>
        </div>

        {canCreateReturn && (
          <CreateReturnButton
            orderId={order.id}
            items={returnableItems.map((item) => ({
              id: item.id,
              title: item.title,
              price: item.price,
              qty: item.qty,
              returnedQty: item.returnedQty,
              unit: item.unit,
            }))}
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-4">
        {/* Order Items */}
        <section className="overflow-hidden border border-background-second bg-background shadow-sm h-fit">
          <div className="border-b border-background-second bg-muted/30 p-3 lg:p-4">
            <h2 className="text-sm font-semibold">عناصر الطلب</h2>
          </div>

          <div className="flex flex-col">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-background-second/60 p-3 last:border-b-0 lg:p-4"
              >
                <div className="min-w-0">
                  <p className="font-medium">{item.title}</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.weightOptionName ??
                      (item.unit === "KG" ? "كيلو" : "قطعة")}
                    {" · "}
                    {toArabicNums(item.qty)} × {toArabicNums(item.price)} ج.م
                  </p>

                  {item.returnedQty > 0 && (
                    <p className="mt-1 text-xs text-danger">
                      تم إرجاع {toArabicNums(item.returnedQty)} من هذا العنصر
                    </p>
                  )}
                </div>

                <span className="font-bold text-main">
                  {toArabicNums(item.total)} ج.م
                </span>
              </div>
            ))}
          </div>

          {order.returns.length > 0 && (
            <div className="border-t border-background-second bg-muted/10 p-3 lg:p-4">
              <h3 className="mb-2 text-sm font-semibold">المرتجعات</h3>

              <div className="flex flex-col gap-2">
                {order.returns.map((orderReturn) => (
                  <div
                    key={orderReturn.id}
                    className="flex flex-wrap items-center justify-between gap-3 border border-background-second/60 p-2 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">{orderReturn.reason}</p>

                      <p className="text-xs text-muted-foreground">
                        {toArabicNums(orderReturn.refundAmount)} ج.م
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Tag
                        color={returnStatusColors[orderReturn.status]}
                        variant="soft"
                        size="sm"
                      >
                        {returnStatusLabels[orderReturn.status]}
                      </Tag>

                      <ReturnStatusChanger
                        returnId={orderReturn.id}
                        currentStatus={orderReturn.status}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Order Info */}
        <div className="flex flex-col gap-3 lg:gap-4">
          <section className="overflow-hidden border border-background-second bg-background shadow-sm">
            <div className="border-b border-background-second bg-muted/30 p-3 lg:p-4">
              <h2 className="text-sm font-semibold">حالة الطلب</h2>
            </div>

            <div className="p-3 lg:p-4">
              <StatusChanger orderId={order.id} currentStatus={order.status} />
            </div>
          </section>

          <section className="overflow-hidden border border-background-second bg-background shadow-sm">
            <div className="border-b border-background-second bg-muted/30 p-3 lg:p-4">
              <h2 className="text-sm font-semibold">بيانات العميل</h2>
            </div>

            <div className="flex flex-col">
              <InfoRow label="الاسم" value={order.customerName} />
              <InfoRow
                label="الهاتف"
                value={toArabicNums(order.customerPhone)}
              />
              {order.customerEmail && (
                <InfoRow
                  label="البريد الإلكتروني"
                  value={order.customerEmail}
                />
              )}
              <InfoRow label="منطقة التوصيل" value={order.deliveryZoneTitle} />
              <InfoRow label="العنوان" value={order.addressLine} />
              {order.notes && <InfoRow label="ملاحظات" value={order.notes} />}
              <InfoRow
                label="طريقة الدفع"
                value={paymentMethodLabels[order.paymentMethod]}
              />
            </div>
          </section>

          <section className="overflow-hidden border border-background-second bg-background shadow-sm">
            <div className="border-b border-background-second bg-muted/30 p-3 lg:p-4">
              <h2 className="text-sm font-semibold">ملخص السعر</h2>
            </div>

            <div className="flex flex-col gap-2 p-3 text-sm lg:p-4">
              <PriceRow label="المجموع الفرعي" value={order.subtotal} />

              {order.productsDiscount > 0 && (
                <PriceRow
                  label="خصومات المنتجات"
                  value={-order.productsDiscount}
                  positive
                />
              )}

              {order.discountAmount > 0 && (
                <PriceRow
                  label={
                    order.couponCode ? `كوبون (${order.couponCode})` : "خصم"
                  }
                  value={-order.discountAmount}
                  positive
                />
              )}

              <PriceRow label="التوصيل" value={order.deliveryFee} />

              {order.refundedAmount > 0 && (
                <PriceRow
                  label="مبالغ مرتجعة"
                  value={-order.refundedAmount}
                  positive
                />
              )}

              <div className="border-t border-background-second/60 pt-2">
                <div className="flex justify-between font-bold">
                  <span>الإجمالي</span>
                  <span className="text-main">
                    {toArabicNums(order.total - order.refundedAmount)} ج.م
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow = ({ label, value }: InfoRowProps) => {
  return (
    <div className="flex flex-col gap-1 border-b border-background-second/60 p-3 last:border-b-0 lg:gap-1.5 lg:p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
};

interface PriceRowProps {
  label: string;
  value: number;
  positive?: boolean;
}

const PriceRow = ({ label, value, positive = false }: PriceRowProps) => {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${positive ? "text-success" : ""}`}>
        {value < 0 ? "-" : ""}
        {toArabicNums(Math.abs(value))} ج.م
      </span>
    </div>
  );
};

export default OrderPage;
