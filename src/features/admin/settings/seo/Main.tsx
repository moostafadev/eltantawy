"use client";

import { memo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";

import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { Input } from "@/components/input";
import { ImageInput } from "@/components/image-input";
import { useToast } from "@/components/toaster";

import { updateSeoSettingsAction } from "./seo.service";
import {
  seoSettingsSchema,
  SeoSettingsForm as SeoSettingsFormValues,
} from "./schema";

interface Props {
  settings: {
    siteTitle: string;
    siteDescription: string;
    keywords: string[];
    ogImage: string;
  };
}

const SeoSettingsForm = ({ settings }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const defaultValues: SeoSettingsFormValues = {
    siteTitle: settings.siteTitle,
    siteDescription: settings.siteDescription,
    keywords: settings.keywords.join(", "),
    ogImage: settings.ogImage,
  };

  const handleSubmit = async (values: SeoSettingsFormValues) => {
    setLoading(true);

    try {
      const result = await updateSeoSettingsAction(values);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    } catch {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form<SeoSettingsFormValues>
      onSubmit={handleSubmit}
      resolver={zodResolver(seoSettingsSchema)}
      defaultValues={defaultValues}
      className="flex flex-col gap-4 border border-background-second bg-background p-3 shadow-sm lg:max-w-2xl lg:p-4"
    >
      <div className="flex items-start gap-2 border border-info/30 bg-info/5 p-3 text-xs text-info">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>
          هذه الإعدادات تتحكم في العنوان والوصف الافتراضيين اللي بتظهر في نتائج
          بحث جوجل ومشاركات السوشيال ميديا للصفحة الرئيسية، والكلمات المفتاحية
          العامة اللي بتتضاف لكل صفحات الموقع.
        </p>
      </div>

      <Input<SeoSettingsFormValues>
        name="siteTitle"
        label="عنوان الموقع"
        placeholder="مثال: الطنطاوي"
      />

      <Input<SeoSettingsFormValues>
        name="siteDescription"
        label="وصف الموقع (الأفضل بين 150-160 حرف)"
        placeholder="وصف مختصر وجذاب يظهر في نتائج البحث"
      />

      <Input<SeoSettingsFormValues>
        name="keywords"
        label="الكلمات المفتاحية (افصل بينها بفاصلة)"
        placeholder="لحوم طازجة, دواجن طازجة, توصيل لحوم"
      />

      <ImageInput<SeoSettingsFormValues>
        name="ogImage"
        label="صورة المشاركة الافتراضية (Open Graph)"
        placeholder="اختر صورة للمشاركة على السوشيال ميديا"
      />

      <Button
        type="submit"
        color="SUCCESS"
        loading={loading}
        className="mt-auto mr-auto w-fit"
      >
        حفظ إعدادات SEO
      </Button>
    </Form>
  );
};

export default memo(SeoSettingsForm);
