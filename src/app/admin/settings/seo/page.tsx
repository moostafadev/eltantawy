import { Breadcrumb } from "@/components/breadcrumb";
import { SeoSettingsForm, getSeoSettings } from "@/features/admin/settings/seo";

const SeoSettingsPage = async () => {
  const settings = await getSeoSettings();

  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <Breadcrumb
        items={[
          {
            label: "الإعدادات",
            href: "/admin/settings",
          },
          {
            label: "إعدادات SEO",
          },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold">إعدادات SEO</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          تحكم في العنوان والوصف والكلمات المفتاحية لتحسين ظهور الموقع في محركات
          البحث
        </p>
      </div>

      <SeoSettingsForm settings={settings} />
    </div>
  );
};

export default SeoSettingsPage;
