"use client";

import { memo, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { ImageInput } from "@/components/image-input";
import { Input } from "@/components/input";
import { Select } from "@/components/select";
import { Switch } from "@/components/switch";
import { useToast } from "@/components/toaster";

import { buildCategoryOptions } from "@/features/admin/categories/create/Graph";
import { useCategoryCreateActions } from "@/features/admin/categories/create/store";

import { CreateProductFormValues, IProps } from "../types";
import { createProductAction } from "./createProduct.service";
import { createProductSchema } from "./schema";

const defaultValues: CreateProductFormValues = {
  title: "",
  desc: "",
  image: "",
  price: "",
  discountPrice: "",
  unit: "KG",
  categoryId: "",
};

const CreateProductForm = ({ categories }: IProps) => {
  const { setSelectedParentId } = useCategoryCreateActions();
  const { toast } = useToast();

  const [formMethods, setFormMethods] =
    useState<UseFormReturn<CreateProductFormValues> | null>(null);

  const [loading, setLoading] = useState(false);
  const [useImageUpload, setUseImageUpload] = useState(true);

  const categoryOptions = useMemo(
    () => buildCategoryOptions(categories),
    [categories],
  );

  const handleSubmit = async (values: CreateProductFormValues) => {
    setLoading(true);

    try {
      const result = await createProductAction(values);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      formMethods?.reset(defaultValues);
      setSelectedParentId("");
      setUseImageUpload(true);

      toast.success("تم إنشاء المنتج بنجاح");
    } catch {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form<CreateProductFormValues>
      onSubmit={handleSubmit}
      resolver={zodResolver(createProductSchema)}
      defaultValues={defaultValues}
      onFormReady={setFormMethods}
      className="flex h-fit min-w-0 flex-1 flex-col gap-3 border border-background-second bg-background p-3 shadow-sm lg:max-w-96 lg:gap-4 lg:p-4"
    >
      <Select<CreateProductFormValues>
        name="categoryId"
        label="التصنيف"
        placeholder="اختر التصنيف"
        options={categoryOptions}
        onValueChange={setSelectedParentId}
      />

      <Input<CreateProductFormValues>
        name="title"
        label="اسم المنتج"
        placeholder="مثال: لحم بقري طازج"
      />

      <Input<CreateProductFormValues>
        name="desc"
        label="الوصف"
        placeholder="وصف مختصر للمنتج"
      />

      <div className="flex flex-col gap-3">
        <Switch
          checked={useImageUpload}
          onCheckedChange={setUseImageUpload}
          label="طريقة إضافة الصورة"
        />

        {useImageUpload ? (
          <ImageInput<CreateProductFormValues>
            name="image"
            label="الصورة"
            placeholder="اختر صورة من الجهاز"
          />
        ) : (
          <Input<CreateProductFormValues>
            name="image"
            label="رابط الصورة"
            placeholder="https://example.com/image.jpg"
          />
        )}
      </div>

      <Input<CreateProductFormValues>
        name="price"
        label="السعر"
        type="number"
        placeholder="مثال: 250"
      />

      <Input<CreateProductFormValues>
        name="discountPrice"
        label="سعر الخصم"
        type="number"
        placeholder="مثال: 220"
      />

      <Select<CreateProductFormValues>
        name="unit"
        label="الوحدة"
        placeholder="اختر الوحدة"
        options={[
          {
            value: "KG",
            label: "كيلوجرام",
          },
          {
            value: "PIECE",
            label: "قطعة",
          },
        ]}
      />

      <Button
        type="submit"
        color="SUCCESS"
        loading={loading}
        className="mt-auto mr-auto w-fit"
      >
        إنشاء المنتج
      </Button>
    </Form>
  );
};

export default memo(CreateProductForm);
