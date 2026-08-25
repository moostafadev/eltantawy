"use client";

import { useRouter } from "next/navigation";
import { memo, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { Input } from "@/components/input";
import { Select } from "@/components/select";

import { createCategoryAction } from "./createCategory.service";
import { createCategorySchema } from "./schema";
import { buildCategoryOptions } from "../Graph";
import { CreateCategoryFormValues, IProps } from "../types";
import { useCategoryCreateActions } from "../store";

const CreateCategoryForm = ({ categories }: IProps) => {
  const router = useRouter();

  const { setSelectedParentId } = useCategoryCreateActions();

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const categoryOptions = useMemo(
    () => buildCategoryOptions(categories),
    [categories],
  );

  const handleSubmit = async (values: CreateCategoryFormValues) => {
    setLoading(true);
    setServerError("");

    try {
      const result = await createCategoryAction(values);

      if (!result.success) {
        setServerError(result.message);
        return;
      }

      router.push("/admin/products/categories");
      router.refresh();
    } catch {
      setServerError("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form<CreateCategoryFormValues>
      onSubmit={handleSubmit}
      resolver={zodResolver(createCategorySchema)}
      defaultValues={{
        title: "",
        desc: "",
        parentId: "",
        image: "",
      }}
      className="flex h-fit min-w-0 flex-1 flex-col gap-4 border border-background-second bg-background p-3 md:p-4 lg:p-6 shadow-sm lg:max-w-96"
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

      <Input<CreateCategoryFormValues>
        name="image"
        label="رابط الصورة"
        placeholder="https://example.com/image.jpg"
      />

      {serverError && (
        <p className="mt-4 text-sm font-medium text-main">{serverError}</p>
      )}

      <Button
        type="submit"
        color="MAIN"
        loading={loading}
        className="mt-auto w-full"
      >
        إنشاء التصنيف
      </Button>
    </Form>
  );
};

export default memo(CreateCategoryForm);
