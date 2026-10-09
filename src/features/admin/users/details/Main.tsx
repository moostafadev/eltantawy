import { Table } from "@/components/table";
import { Tag } from "@/components/tag";
import { toArabicNums } from "@/utils/toArabicNums";
import {
  type LucideIcon,
  Banknote,
  CalendarDays,
  Phone,
  RotateCcw,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { ordersTableColumns } from "@/features/admin/orders/OrdersTableColumns";
import { returnsTableColumns } from "@/features/admin/returns/ReturnsTableColumns";

import { UserOrderRow, UserReturnRow } from "./types";

interface Props {
  name: string;
  phone: string;
  isGuest: boolean;
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
  isGuest,
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
          <InfoItem icon={UserRound} label="الاسم" value={name} />

          <InfoItem
            icon={Phone}
            label="رقم الهاتف"
            value={toArabicNums(phone)}
          />

          <div className="flex flex-col gap-1 border-b border-background-second/60 p-3 last:border-b-0 sm:odd:border-l lg:gap-1.5 lg:p-4">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <UserRound aria-hidden="true" className="size-3.5" />
              <span className="sr-only">نوع الحساب</span>
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

          {!isGuest && registeredAt && (
            <InfoItem
              icon={CalendarDays}
              label="تاريخ التسجيل"
              value={new Date(registeredAt).toLocaleDateString("ar-EG")}
            />
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
        <StatCard
          icon={ShoppingBag}
          label="عدد الطلبات"
          value={toArabicNums(ordersCount)}
        />

        <StatCard
          icon={Banknote}
          label="إجمالي المصروف"
          value={`${toArabicNums(String(totalSpent))} ج.م`}
        />

        <StatCard
          icon={RotateCcw}
          label="عدد المرتجعات"
          value={toArabicNums(returnsCount)}
        />
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
  icon: LucideIcon;
  label: string;
  value: string;
}

const InfoItem = ({ icon: Icon, label, value }: InfoItemProps) => (
  <div className="flex flex-col gap-1 border-b border-background-second/60 p-3 last:border-b-0 sm:odd:border-l lg:gap-1.5 lg:p-4">
    <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <Icon aria-hidden="true" className="size-3.5" />
      <span className="sr-only">{label}</span>
    </p>

    <p className="text-sm font-medium text-foreground">{value}</p>
  </div>
);

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

const StatCard = ({ icon: Icon, label, value }: StatCardProps) => (
  <div className="border border-background-second bg-background p-3 shadow-sm lg:p-4">
    <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <Icon aria-hidden="true" className="size-3.5" />
      <span className="sr-only">{label}</span>
    </p>

    <p className="mt-1 text-xl font-bold text-main">{value}</p>
  </div>
);

export default UserDetailView;
