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

import { buildCategoryOptions } from "../../create/Graph";
import { editCategorySchema } from "./schema";
import { editCategoryAction } from "./editCategory.service";

import { IProps } from "../types";

type FormValues = {
  title: string;
  desc?: string;
  parentId?: string;
  image?: string;
};

const EditCategoryForm = ({ category, categories }: IProps) => {
  const { toast } = useToast();

  const [formMethods, setFormMethods] =
    useState<UseFormReturn<FormValues> | null>(null);

  const [loading, setLoading] = useState(false);
  const [useImageUpload, setUseImageUpload] = useState(false);

  const categoryOptions = useMemo(() => {
    const availableCategories = categories.filter(
      (item) => item.id !== category.id && item._count.products === 0,
    );

    return buildCategoryOptions(availableCategories);
  }, [categories, category.id]);

  const defaultValues: FormValues = {
    title: category.title,
    desc: category.desc ?? "",
    image: category.image ?? "",
    parentId: category.parentId ?? "",
  };

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);

    try {
      const result = await editCategoryAction(category.id, values);

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
      resolver={zodResolver(editCategorySchema)}
      defaultValues={defaultValues}
      onFormReady={setFormMethods}
      className="flex h-fit min-w-0 flex-1 flex-col gap-3 border border-background-second bg-background p-3 shadow-sm lg:max-w-96 lg:gap-4 lg:p-4"
    >
      <Select<FormValues>
        name="parentId"
        label="التصنيف الأب"
        placeholder="تصنيف رئيسي"
        options={categoryOptions}
      />

      <Input<FormValues>
        name="title"
        label="اسم التصنيف"
        placeholder="مثال: اللحوم الطازجة"
      />

      <Input<FormValues>
        name="desc"
        label="الوصف"
        placeholder="وصف مختصر للتصنيف"
      />

      <div className="flex flex-col gap-3">
        <Switch
          checked={useImageUpload}
          onCheckedChange={setUseImageUpload}
          label="طريقة إضافة الصورة"
        />

        {useImageUpload ? (
          <ImageInput<FormValues>
            name="image"
            label="الصورة"
            placeholder="اختر صورة من الجهاز"
          />
        ) : (
          <Input<FormValues>
            name="image"
            label="رابط الصورة"
            placeholder="https://example.com/image.jpg"
          />
        )}
      </div>

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

export default memo(EditCategoryForm);
