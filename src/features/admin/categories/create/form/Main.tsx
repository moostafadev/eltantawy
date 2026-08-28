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

import { createCategoryAction } from "./createCategory.service";
import { createCategorySchema } from "./schema";
import { buildCategoryOptions } from "../Graph";
import { CreateCategoryFormValues, IProps } from "../types";
import { useCategoryCreateActions } from "../store";

const defaultValues: CreateCategoryFormValues = {
  title: "",
  desc: "",
  parentId: "",
  image: "",
};

const CreateCategoryForm = ({ categories }: IProps) => {
  const { setSelectedParentId } = useCategoryCreateActions();
  const { toast } = useToast();

  const [formMethods, setFormMethods] =
    useState<UseFormReturn<CreateCategoryFormValues> | null>(null);

  const [loading, setLoading] = useState(false);
  const [useImageUpload, setUseImageUpload] = useState(true);

  const categoryOptions = useMemo(() => {
    const availableCategories = categories.filter(
      (category) => category._count.products === 0,
    );

    return buildCategoryOptions(availableCategories);
  }, [categories]);

  const handleSubmit = async (values: CreateCategoryFormValues) => {
    setLoading(true);

    try {
      const result = await createCategoryAction(values);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      formMethods?.reset({
        title: "",
        desc: "",
        image: "",
        parentId: values.parentId,
      });

      toast.success("تم إنشاء التصنيف بنجاح");
    } catch {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form<CreateCategoryFormValues>
      onSubmit={handleSubmit}
      resolver={zodResolver(createCategorySchema)}
      defaultValues={defaultValues}
      onFormReady={setFormMethods}
      className="flex h-fit min-w-0 flex-1 flex-col gap-3 border border-background-second bg-background p-3 shadow-sm lg:max-w-96 lg:gap-4 lg:p-4"
    >
      <Select<CreateCategoryFormValues>
        name="parentId"
        label="التصنيف الأب"
        placeholder="تصنيف رئيسي"
        options={categoryOptions}
        onValueChange={setSelectedParentId}
      />

      <Input<CreateCategoryFormValues>
        name="title"
        label="اسم التصنيف"
        placeholder="مثال: اللحوم الطازجة"
      />

      <Input<CreateCategoryFormValues>
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
          <ImageInput<CreateCategoryFormValues>
            name="image"
            label="الصورة"
            placeholder="اختر صورة من الجهاز"
          />
        ) : (
          <Input<CreateCategoryFormValues>
            name="image"
            label="رابط الصورة"
            placeholder="https://example.com/image.jpg"
          />
        )}
      </div>

      <Button
        type="submit"
        color="SUCCESS"
        loading={loading}
        className="mt-auto mr-auto w-fit"
      >
        إنشاء التصنيف
      </Button>
    </Form>
  );
};

export default memo(CreateCategoryForm);
