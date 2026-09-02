"use client";

import { memo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useFormContext, useWatch } from "react-hook-form";

import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { Input } from "@/components/input";
import { Select } from "@/components/select";
import { Switch } from "@/components/switch";
import { Tag } from "@/components/tag";
import { useToast } from "@/components/toaster";

import { editDiscountAction } from "./editDiscount.service";
import { editDiscountSchema } from "./schema";
import { IProps } from "../types";
import { discountTypeLabels } from "../../types";

type FormValues = {
  code?: string;
  valueType: "PERCENTAGE" | "FIXED";
  value: string;
  minOrderAmount?: string;
  maxDiscountAmount?: string;
  usageLimit?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
};

const toDateInputValue = (date: Date | null) => {
  if (!date) return "";

  return new Date(date).toISOString().slice(0, 10);
};

const EditDiscountConditionalFields = () => {
  const { control } = useFormContext<FormValues>();

  const valueType = useWatch({ control, name: "valueType" });

  return (
    <>
      {valueType === "PERCENTAGE" && (
        <Input<FormValues>
          name="maxDiscountAmount"
          label="حد أقصى لقيمة الخصم (ج.م)"
          type="number"
          placeholder="مثال: 100"
        />
      )}
    </>
  );
};

const EditDiscountForm = ({ discount }: IProps) => {
  const { toast } = useToast();

  const [formMethods, setFormMethods] =
    useState<UseFormReturn<FormValues> | null>(null);

  const [loading, setLoading] = useState(false);

  const isCoupon = discount.type === "COUPON";

  const defaultValues: FormValues = {
    code: discount.code ?? "",
    valueType: discount.valueType,
    value: String(discount.value),
    minOrderAmount:
      discount.minOrderAmount !== null ? String(discount.minOrderAmount) : "",
    maxDiscountAmount:
      discount.maxDiscountAmount !== null
        ? String(discount.maxDiscountAmount)
        : "",
    usageLimit: discount.usageLimit !== null ? String(discount.usageLimit) : "",
    startDate: toDateInputValue(discount.startDate),
    endDate: toDateInputValue(discount.endDate),
    isActive: discount.isActive,
  };

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);

    try {
      const result = await editDiscountAction(discount.id, values);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      formMethods?.reset(values);

      toast.success(result.message);
    } catch {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form<FormValues>
      onSubmit={handleSubmit}
      resolver={zodResolver(editDiscountSchema)}
      defaultValues={defaultValues}
      onFormReady={setFormMethods}
      className="flex h-fit min-w-0 flex-1 flex-col gap-3 border border-background-second bg-background p-3 shadow-sm lg:max-w-96 lg:gap-4 lg:p-4"
    >
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-muted-foreground">
          نوع الخصم
        </span>

        <Tag color="MAIN" variant="soft" size="sm" className="w-fit">
          {discountTypeLabels[discount.type]}
        </Tag>
      </div>

      {isCoupon && (
        <Input<FormValues>
          name="code"
          label="كود الخصم"
          placeholder="مثال: WELCOME10"
        />
      )}

      <Select<FormValues>
        name="valueType"
        label="نوع القيمة"
        options={[
          { value: "PERCENTAGE", label: "نسبة مئوية (%)" },
          { value: "FIXED", label: "مبلغ ثابت (ج.م)" },
        ]}
      />

      <Input<FormValues>
        name="value"
        label="قيمة الخصم"
        type="number"
        placeholder="مثال: 10"
      />

      <EditDiscountConditionalFields />

      {isCoupon && (
        <Input<FormValues>
          name="usageLimit"
          label="عدد مرات الاستخدام المسموح بها"
          type="number"
          placeholder="اتركه فارغًا لعدد غير محدود"
        />
      )}

      <Input<FormValues>
        name="minOrderAmount"
        label="حد أدنى لقيمة الطلب (ج.م)"
        type="number"
        placeholder="اتركه فارغًا بدون حد أدنى"
      />

      <div className="grid grid-cols-2 gap-2">
        <Input<FormValues> name="startDate" label="تاريخ البداية" type="date" />
        <Input<FormValues> name="endDate" label="تاريخ النهاية" type="date" />
      </div>

      <Switch<FormValues> name="isActive" label="تفعيل الخصم" />

      <Button
        type="submit"
        color="INFO"
        loading={loading}
        className="mt-auto mr-auto w-fit"
      >
        حفظ التعديلات
      </Button>
    </Form>
  );
};

export default memo(EditDiscountForm);
