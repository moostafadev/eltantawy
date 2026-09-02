"use client";

import { memo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useFormContext, useWatch } from "react-hook-form";

import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { Input } from "@/components/input";
import { Select } from "@/components/select";
import { Switch } from "@/components/switch";
import { useToast } from "@/components/toaster";

import { createDiscountAction } from "./createDiscount.service";
import { createDiscountSchema } from "./schema";
import { CreateDiscountFormValues } from "../types";

const defaultValues: CreateDiscountFormValues = {
  type: "COUPON",
  code: "",
  valueType: "PERCENTAGE",
  value: "",
  minOrderAmount: "",
  maxDiscountAmount: "",
  usageLimit: "",
  startDate: "",
  endDate: "",
  isActive: true,
};

const DiscountConditionalFields = () => {
  const { control } = useFormContext<CreateDiscountFormValues>();

  const type = useWatch({ control, name: "type" });
  const valueType = useWatch({ control, name: "valueType" });

  return (
    <>
      {type === "COUPON" && (
        <Input<CreateDiscountFormValues>
          name="code"
          label="كود الخصم"
          placeholder="مثال: WELCOME10"
        />
      )}

      {valueType === "PERCENTAGE" && (
        <Input<CreateDiscountFormValues>
          name="maxDiscountAmount"
          label="حد أقصى لقيمة الخصم (ج.م)"
          type="number"
          placeholder="مثال: 100"
        />
      )}

      {type === "COUPON" && (
        <Input<CreateDiscountFormValues>
          name="usageLimit"
          label="عدد مرات الاستخدام المسموح بها"
          type="number"
          placeholder="اتركه فارغًا لعدد غير محدود"
        />
      )}
    </>
  );
};

const CreateDiscountForm = () => {
  const { toast } = useToast();

  const [formMethods, setFormMethods] =
    useState<UseFormReturn<CreateDiscountFormValues> | null>(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: CreateDiscountFormValues) => {
    setLoading(true);

    try {
      const result = await createDiscountAction(values);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      formMethods?.reset(defaultValues);

      toast.success(result.message);
    } catch {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form<CreateDiscountFormValues>
      onSubmit={handleSubmit}
      resolver={zodResolver(createDiscountSchema)}
      defaultValues={defaultValues}
      onFormReady={setFormMethods}
      className="flex h-fit min-w-0 flex-1 flex-col gap-3 border border-background-second bg-background p-3 shadow-sm lg:max-w-96 lg:gap-4 lg:p-4"
    >
      <Select<CreateDiscountFormValues>
        name="type"
        label="نوع الخصم"
        options={[
          { value: "COUPON", label: "كوبون خصم" },
          { value: "ALL_CUSTOMERS", label: "خصم على كل العملاء" },
          { value: "REGISTERED_ONLY", label: "خصم على العملاء المسجلين فقط" },
        ]}
      />

      <Select<CreateDiscountFormValues>
        name="valueType"
        label="نوع القيمة"
        options={[
          { value: "PERCENTAGE", label: "نسبة مئوية (%)" },
          { value: "FIXED", label: "مبلغ ثابت (ج.م)" },
        ]}
      />

      <Input<CreateDiscountFormValues>
        name="value"
        label="قيمة الخصم"
        type="number"
        placeholder="مثال: 10"
      />

      <DiscountConditionalFields />

      <Input<CreateDiscountFormValues>
        name="minOrderAmount"
        label="حد أدنى لقيمة الطلب (ج.م)"
        type="number"
        placeholder="اتركه فارغًا بدون حد أدنى"
      />

      <div className="grid grid-cols-2 gap-2">
        <Input<CreateDiscountFormValues>
          name="startDate"
          label="تاريخ البداية"
          type="date"
        />

        <Input<CreateDiscountFormValues>
          name="endDate"
          label="تاريخ النهاية"
          type="date"
        />
      </div>

      <Switch<CreateDiscountFormValues> name="isActive" label="تفعيل الخصم" />

      <Button
        type="submit"
        color="SUCCESS"
        loading={loading}
        className="mt-auto mr-auto w-fit"
      >
        إنشاء الخصم
      </Button>
    </Form>
  );
};

export default memo(CreateDiscountForm);
