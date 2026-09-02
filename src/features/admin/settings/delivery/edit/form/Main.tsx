"use client";

import { memo, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { Input } from "@/components/input";
import { Select } from "@/components/select";
import { Switch } from "@/components/switch";
import { useToast } from "@/components/toaster";
import { buildCategoryOptions } from "@/features/admin/categories/create/Graph";

import { editDeliveryZoneSchema } from "./schema";
import { editDeliveryZoneAction } from "./editDeliveryZone.service";

import { IProps } from "../types";

type FormValues = {
  title: string;
  parentId?: string;
  cost?: string;
  isActive: boolean;
};

const EditDeliveryZoneForm = ({ zone, zones }: IProps) => {
  const { toast } = useToast();

  const [formMethods, setFormMethods] =
    useState<UseFormReturn<FormValues> | null>(null);

  const [loading, setLoading] = useState(false);

  const zoneOptions = useMemo(() => {
    const availableZones = zones.filter(
      (item) => item.id !== zone.id && item.cost === null,
    );

    return buildCategoryOptions(availableZones);
  }, [zones, zone.id]);

  const defaultValues: FormValues = {
    title: zone.title,
    parentId: zone.parentId ?? "",
    cost: zone.cost !== null ? String(zone.cost) : "",
    isActive: zone.isActive,
  };

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);

    try {
      const result = await editDeliveryZoneAction(zone.id, values);

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
      resolver={zodResolver(editDeliveryZoneSchema)}
      defaultValues={defaultValues}
      onFormReady={setFormMethods}
      className="flex h-fit min-w-0 flex-1 flex-col gap-3 border border-background-second bg-background p-3 shadow-sm lg:max-w-96 lg:gap-4 lg:p-4"
    >
      <Select<FormValues>
        name="parentId"
        label="المنطقة الأب"
        placeholder="منطقة رئيسية"
        options={zoneOptions}
      />

      <Input<FormValues>
        name="title"
        label="اسم المنطقة"
        placeholder="مثال: مدينة السادس من أكتوبر"
      />

      <Input<FormValues>
        name="cost"
        label="تكلفة التوصيل (ج.م)"
        type="number"
        placeholder="مثال: 30"
      />

      <Switch<FormValues> name="isActive" label="تفعيل المنطقة" />

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

export default memo(EditDeliveryZoneForm);
