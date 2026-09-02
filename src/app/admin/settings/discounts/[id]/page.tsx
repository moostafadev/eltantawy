import Link from "next/link";
import { Pencil } from "lucide-react";

import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/button";
import { Tag } from "@/components/tag";
import { toArabicNums } from "@/utils/toArabicNums";
import { getOneDiscount } from "@/features/admin/settings/discounts/table";
import {
  discountTypeLabels,
  discountValueTypeLabels,
} from "@/features/admin/settings/discounts/types";

interface DiscountPageProps {
  params: Promise<{
    id: string;
  }>;
}

const DiscountPage = async ({ params }: DiscountPageProps) => {
  const { id } = await params;

  const discount = await getOneDiscount(id);

  if (!discount) {
    return (
      <div className="flex flex-col gap-3 lg:gap-4">
        <p className="text-sm text-muted-foreground">الخصم غير موجود</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <Breadcrumb
        items={[
          {
            label: "الإعدادات",
            href: "/admin/settings",
          },
          {
            label: "الخصومات",
            href: "/admin/settings/discounts",
          },
          {
            label: discount.code ?? discountTypeLabels[discount.type],
          },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {discount.code ?? discountTypeLabels[discount.type]}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            تفاصيل الخصم وإدارته
          </p>
        </div>

        <Link
          href={`/admin/settings/discounts/${discount.id}/edit`}
          className="mr-auto self-end"
        >
          <Button color="INFO" size="sm" variant="soft">
            <Pencil className="size-4" />
            <span>تعديل الخصم</span>
          </Button>
        </Link>
      </div>

      <section className="overflow-hidden border border-background-second bg-background shadow-sm">
        <div className="border-b border-background-second bg-muted/30 p-3 lg:p-4">
          <h2 className="text-sm font-semibold">بيانات الخصم</h2>

          <p className="mt-1 text-xs text-muted-foreground">
            المعلومات الأساسية الخاصة بالخصم
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          <Item label="نوع الخصم" value={discountTypeLabels[discount.type]} />

          <Item label="الكود" value={discount.code ?? "بدون كود"} />

          <Item
            label="نوع القيمة"
            value={discountValueTypeLabels[discount.valueType]}
          />

          <Item
            label="قيمة الخصم"
            value={
              discount.valueType === "PERCENTAGE"
                ? `${toArabicNums(String(discount.value))}%`
                : `${toArabicNums(String(discount.value))} ج.م`
            }
          />

          <Item
            label="حد أدنى للطلب"
            value={
              discount.minOrderAmount !== null
                ? `${toArabicNums(String(discount.minOrderAmount))} ج.م`
                : "بدون حد أدنى"
            }
          />

          <Item
            label="حد أقصى للخصم"
            value={
              discount.maxDiscountAmount !== null
                ? `${toArabicNums(String(discount.maxDiscountAmount))} ج.م`
                : "بدون حد أقصى"
            }
          />

          <Item
            label="عدد مرات الاستخدام"
            value={`${toArabicNums(discount.usageCount)}${
              discount.usageLimit
                ? ` / ${toArabicNums(discount.usageLimit)}`
                : " / بدون حد"
            }`}
          />

          <Item
            label="تاريخ البداية"
            value={
              discount.startDate
                ? new Date(discount.startDate).toLocaleDateString("ar-EG")
                : "غير محدد"
            }
          />

          <Item
            label="تاريخ النهاية"
            value={
              discount.endDate
                ? new Date(discount.endDate).toLocaleDateString("ar-EG")
                : "غير محدد"
            }
          />

          <div className="flex flex-col gap-1 border-b border-background-second/60 p-3 last:border-b-0 sm:odd:border-l lg:gap-1.5 lg:p-4">
            <p className="text-xs font-medium text-muted-foreground">الحالة</p>

            <Tag
              color={discount.isActive ? "SUCCESS" : "DANGER"}
              variant="soft"
              size="sm"
              className="w-fit"
            >
              {discount.isActive ? "مفعّل" : "معطّل"}
            </Tag>
          </div>

          <Item
            label="تاريخ الإنشاء"
            value={new Date(discount.createdAt).toLocaleDateString("ar-EG")}
          />
        </div>
      </section>
    </div>
  );
};

interface ItemProps {
  label: string;
  value: string;
}

const Item = ({ label, value }: ItemProps) => {
  return (
    <div className="flex flex-col gap-1 border-b border-background-second/60 p-3 last:border-b-0 sm:odd:border-l lg:gap-1.5 lg:p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
};

export default DiscountPage;
