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

import { createDeliveryZoneAction } from "./createDeliveryZone.service";
import { createDeliveryZoneSchema } from "./schema";
import { CreateDeliveryZoneFormValues, IProps } from "../types";
import { useDeliveryZoneCreateActions } from "../store";

const defaultValues: CreateDeliveryZoneFormValues = {
  title: "",
  parentId: "",
  cost: "",
  isActive: true,
};

const CreateDeliveryZoneForm = ({ zones }: IProps) => {
  const { setSelectedParentId } = useDeliveryZoneCreateActions();
  const { toast } = useToast();

  const [formMethods, setFormMethods] =
    useState<UseFormReturn<CreateDeliveryZoneFormValues> | null>(null);

  const [loading, setLoading] = useState(false);

  const zoneOptions = useMemo(() => {
    const availableZones = zones.filter((zone) => zone.cost === null);

    return buildCategoryOptions(availableZones);
  }, [zones]);

  const handleSubmit = async (values: CreateDeliveryZoneFormValues) => {
    setLoading(true);

    try {
      const result = await createDeliveryZoneAction(values);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      formMethods?.reset({
        title: "",
        cost: "",
        isActive: true,
        parentId: values.parentId,
      });

      toast.success("تم إنشاء منطقة التوصيل بنجاح");
    } catch {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form<CreateDeliveryZoneFormValues>
      onSubmit={handleSubmit}
      resolver={zodResolver(createDeliveryZoneSchema)}
      defaultValues={defaultValues}
      onFormReady={setFormMethods}
      className="flex h-fit min-w-0 flex-1 flex-col gap-3 border border-background-second bg-background p-3 shadow-sm lg:max-w-96 lg:gap-4 lg:p-4"
    >
      <Select<CreateDeliveryZoneFormValues>
        name="parentId"
        label="المنطقة الأب"
        placeholder="منطقة رئيسية"
        options={zoneOptions}
        onValueChange={setSelectedParentId}
      />

      <Input<CreateDeliveryZoneFormValues>
        name="title"
        label="اسم المنطقة"
        placeholder="مثال: مدينة السادس من أكتوبر"
      />

      <Input<CreateDeliveryZoneFormValues>
        name="cost"
        label="تكلفة التوصيل (ج.م)"
        type="number"
        placeholder="مثال: 30"
      />

      <Switch<CreateDeliveryZoneFormValues>
        name="isActive"
        label="تفعيل المنطقة"
      />

      <Button
        type="submit"
        color="SUCCESS"
        loading={loading}
        className="mt-auto mr-auto w-fit"
      >
        إنشاء المنطقة
      </Button>
    </Form>
  );
};

export default memo(CreateDeliveryZoneForm);
