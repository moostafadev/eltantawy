"use client";

import { memo, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useFieldArray, useFormContext } from "react-hook-form";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { ImageInput } from "@/components/image-input";
import { Input } from "@/components/input";
import { Select } from "@/components/select";
import { Switch } from "@/components/switch";
import { useToast } from "@/components/toaster";
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
  saleType: "NORMAL",
  weightOptions: [],
};

const WeightOptionsFields = () => {
  const { control, watch } = useFormContext<CreateProductFormValues>();

  const saleType = watch("saleType");

  const { fields, append, remove } = useFieldArray<CreateProductFormValues>({
    control,
    name: "weightOptions",
  });

  if (saleType !== "WEIGHT_RANGE") return null;

  return (
    <div className="flex flex-col gap-3 border border-background-second p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">خيارات الوزن</p>

        <Button
          type="button"
          size="sm"
          color="INFO"
          variant="soft"
          onClick={() => append({ name: "", minWeight: "", maxWeight: "" })}
        >
          <Plus className="size-4" />
          <span>إضافة خيار</span>
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-xs text-muted-foreground">
          لا توجد خيارات وزن، قم بإضافة خيار واحد على الأقل
        </p>
      )}

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex flex-col gap-2 border border-background-second/60 p-2"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">
              خيار {index + 1}
            </p>

            <Button
              type="button"
              size="icon"
              color="DANGER"
              variant="outline"
              onClick={() => remove(index)}
            >
              <X className="size-4" />
            </Button>
          </div>

          <Input<CreateProductFormValues>
            name={`weightOptions.${index}.name`}
            label="اسم الخيار"
            placeholder="مثال: نصف كيلو"
          />

          <div className="grid grid-cols-2 gap-2">
            <Input<CreateProductFormValues>
              name={`weightOptions.${index}.minWeight`}
              label="الوزن الأدنى (كجم)"
              type="number"
              placeholder="مثال: 0.5"
            />

            <Input<CreateProductFormValues>
              name={`weightOptions.${index}.maxWeight`}
              label="الوزن الأعلى (كجم)"
              type="number"
              placeholder="مثال: 1"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const CreateProductForm = ({ categories }: IProps) => {
  const { setSelectedParentId } = useCategoryCreateActions();
  const { toast } = useToast();

  const [formMethods, setFormMethods] =
    useState<UseFormReturn<CreateProductFormValues> | null>(null);

  const [loading, setLoading] = useState(false);
  const [useImageUpload, setUseImageUpload] = useState(true);

  const categoryOptions = useMemo(() => {
    const parentIds = new Set(
      categories
        .map((category) => category.parentId)
        .filter((parentId): parentId is string => Boolean(parentId)),
    );

    const leafCategories = categories.filter(
      (category) => !parentIds.has(category.id),
    );

    const getCategoryPath = (categoryId: string): string => {
      const category = categories.find((item) => item.id === categoryId);

      if (!category) return "";

      if (!category.parentId) {
        return category.title;
      }

      const parentPath = getCategoryPath(category.parentId);

      return parentPath ? `${parentPath} / ${category.title}` : category.title;
    };

    return leafCategories.map((category) => ({
      value: category.id,
      label: getCategoryPath(category.id),
    }));
  }, [categories]);

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
      className="flex h-fit min-w-0 flex-1 flex-col gap-3 border border-background-second bg-background p-3 shadow-sm lg lg lg"
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
          { value: "KG", label: "كيلوجرام" },
          { value: "PIECE", label: "قطعة" },
        ]}
      />

      <Select<CreateProductFormValues>
        name="saleType"
        label="نوع البيع"
        placeholder="اختر نوع البيع"
        options={[
          { value: "NORMAL", label: "عادي" },
          { value: "WEIGHT_RANGE", label: "نطاق وزن" },
        ]}
      />

      <WeightOptionsFields />

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
