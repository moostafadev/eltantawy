import { Table } from "@/components/table";
import { Tag } from "@/components/tag";
import { toArabicNums } from "@/utils/toArabicNums";
import { ordersTableColumns } from "@/features/admin/orders/OrdersTableColumns";
import { returnsTableColumns } from "@/features/admin/returns/ReturnsTableColumns";

import { UserOrderRow, UserReturnRow } from "./types";

interface Props {
  name: string;
  phone: string;
  email: string | null;
  isGuest: boolean;
  isVerified?: boolean;
  role?: "USER" | "ADMIN";
  registeredAt?: Date;
  ordersCount: number;
  totalSpent: number;
  returnsCount: number;
  orders: UserOrderRow[];
  returns: UserReturnRow[];
}

const UserDetailView = ({
  name,
  phone,
  email,
  isGuest,
  isVerified,
  role,
  registeredAt,
  ordersCount,
  totalSpent,
  returnsCount,
  orders,
  returns,
}: Props) => {
  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <section className="overflow-hidden border border-background-second bg-background shadow-sm">
        <div className="border-b border-background-second bg-muted/30 p-3 lg:p-4">
          <h2 className="text-sm font-semibold">بيانات المستخدم</h2>

          <p className="mt-1 text-xs text-muted-foreground">
            المعلومات الأساسية الخاصة بالمستخدم
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          <InfoItem label="الاسم" value={name} />

          <InfoItem label="رقم الهاتف" value={toArabicNums(phone)} />

          <InfoItem label="البريد الإلكتروني" value={email ?? "—"} />

          <div className="flex flex-col gap-1 border-b border-background-second/60 p-3 last:border-b-0 sm:odd:border-l lg:gap-1.5 lg:p-4">
            <p className="text-xs font-medium text-muted-foreground">
              نوع الحساب
            </p>

            <Tag
              color={isGuest ? "SECONDARY" : "MAIN"}
              variant="soft"
              size="sm"
              className="w-fit"
            >
              {isGuest ? "ضيف" : role === "ADMIN" ? "مدير" : "مستخدم مسجل"}
            </Tag>
          </div>

          {!isGuest && (
            <div className="flex flex-col gap-1 border-b border-background-second/60 p-3 last:border-b-0 sm:odd:border-l lg:gap-1.5 lg:p-4">
              <p className="text-xs font-medium text-muted-foreground">
                حالة البريد الإلكتروني
              </p>

              <Tag
                color={isVerified ? "SUCCESS" : "DANGER"}
                variant="soft"
                size="sm"
                className="w-fit"
              >
                {isVerified ? "موثق" : "غير موثق"}
              </Tag>
            </div>
          )}

          {!isGuest && registeredAt && (
            <InfoItem
              label="تاريخ التسجيل"
              value={new Date(registeredAt).toLocaleDateString("ar-EG")}
            />
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
        <StatCard label="عدد الطلبات" value={toArabicNums(ordersCount)} />

        <StatCard
          label="إجمالي المصروف"
          value={`${toArabicNums(String(totalSpent))} ج.م`}
        />

        <StatCard label="عدد المرتجعات" value={toArabicNums(returnsCount)} />
      </section>

      <section className="flex flex-col gap-3 border border-background-second bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
        <div className="border-b border-border pb-3 lg:pb-4">
          <h2 className="font-bold">الطلبات</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            جميع الطلبات الخاصة بهذا المستخدم
          </p>
        </div>

        <Table
          data={orders}
          columns={ordersTableColumns}
          emptyMessage="لا يوجد طلبات"
        />
      </section>

      <section className="flex flex-col gap-3 border border-background-second bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
        <div className="border-b border-border pb-3 lg:pb-4">
          <h2 className="font-bold">المرتجعات</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            جميع طلبات الإرجاع الخاصة بهذا المستخدم
          </p>
        </div>

        <Table
          data={returns}
          columns={returnsTableColumns}
          emptyMessage="لا يوجد مرتجعات"
        />
      </section>
    </div>
  );
};

interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem = ({ label, value }: InfoItemProps) => (
  <div className="flex flex-col gap-1 border-b border-background-second/60 p-3 last:border-b-0 sm:odd:border-l lg:gap-1.5 lg:p-4">
    <p className="text-xs font-medium text-muted-foreground">{label}</p>

    <p className="text-sm font-medium text-foreground">{value}</p>
  </div>
);

interface StatCardProps {
  label: string;
  value: string;
}

const StatCard = ({ label, value }: StatCardProps) => (
  <div className="border border-background-second bg-background p-3 shadow-sm lg:p-4">
    <p className="text-xs font-medium text-muted-foreground">{label}</p>

    <p className="mt-1 text-xl font-bold text-main">{value}</p>
  </div>
);

export default UserDetailView;
