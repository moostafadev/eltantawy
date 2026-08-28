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

import { editProductSchema } from "./schema";
import { EditProductFormValues, IProps } from "../types";
import { editProductAction } from "./editProduct.service";

const EditProductForm = ({ product, categories }: IProps) => {
  const { toast } = useToast();

  const [formMethods, setFormMethods] =
    useState<UseFormReturn<EditProductFormValues> | null>(null);

  const [loading, setLoading] = useState(false);
  const [useImageUpload, setUseImageUpload] = useState(false);

  const categoryOptions = useMemo(() => {
    const leafCategories = categories.filter(
      (category) => !categories.some((item) => item.parentId === category.id),
    );

    return leafCategories.map((category) => ({
      value: category.id,
      label: category.title,
    }));
  }, [categories]);

  const defaultValues: EditProductFormValues = {
    title: product.title,
    desc: product.desc ?? "",
    image: product.image ?? "",
    price: String(product.price),
    discountPrice:
      product.discountPrice !== null ? String(product.discountPrice) : "",
    unit: product.unit,
    categoryId: product.categoryId ?? "",
  };

  const handleSubmit = async (values: EditProductFormValues) => {
    setLoading(true);

    try {
      const result = await editProductAction(product.id, values);

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
    <Form<EditProductFormValues>
      onSubmit={handleSubmit}
      resolver={zodResolver(editProductSchema)}
      defaultValues={defaultValues}
      onFormReady={setFormMethods}
      className="flex h-fit min-w-0 flex-1 flex-col gap-3 border border-background-second bg-background p-3 shadow-sm lg:max-w-96 lg:gap-4 lg:p-4"
    >
      <Select<EditProductFormValues>
        name="categoryId"
        label="التصنيف"
        placeholder="اختر التصنيف"
        options={categoryOptions}
      />

      <Input<EditProductFormValues>
        name="title"
        label="اسم المنتج"
        placeholder="مثال: لحم بقري طازج"
      />

      <Input<EditProductFormValues>
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
          <ImageInput<EditProductFormValues>
            name="image"
            label="الصورة"
            placeholder="اختر صورة من الجهاز"
          />
        ) : (
          <Input<EditProductFormValues>
            name="image"
            label="رابط الصورة"
            placeholder="https://example.com/image.jpg"
          />
        )}
      </div>

      <Input<EditProductFormValues>
        name="price"
        label="السعر"
        type="number"
        placeholder="مثال: 250"
      />

      <Input<EditProductFormValues>
        name="discountPrice"
        label="سعر الخصم"
        type="number"
        placeholder="مثال: 220"
      />

      <Select<EditProductFormValues>
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
        color="INFO"
        loading={loading}
        className="mt-auto mr-auto w-fit"
      >
        حفظ التعديلات
      </Button>
    </Form>
  );
};

export default memo(EditProductForm);
