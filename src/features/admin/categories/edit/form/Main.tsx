"use client";

import { memo, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { Input } from "@/components/input";
import { Select } from "@/components/select";
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

  const [loading, setLoading] = useState(false);

  const categoryOptions = useMemo(
    () => buildCategoryOptions(categories),
    [categories],
  );

  const defaultValues = {
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

      toast.success(result.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form<FormValues>
      onSubmit={handleSubmit}
      resolver={zodResolver(editCategorySchema)}
      defaultValues={defaultValues}
      className="flex h-fit min-w-0 flex-1 flex-col gap-3 lg:gap-4 border border-background-second bg-background p-3 shadow-sm lg:p-4 lg:max-w-96"
    >
      <Select<FormValues>
        name="parentId"
        label="التصنيف الأب"
        placeholder="تصنيف رئيسي"
        options={categoryOptions}
      />

      <Input<FormValues> name="title" label="اسم التصنيف" />

      <Input<FormValues> name="desc" label="الوصف" />

      <Input<FormValues> name="image" label="رابط الصورة" />

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
