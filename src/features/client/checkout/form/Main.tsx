"use client";

import { memo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { Input } from "@/components/input";
import { Select } from "@/components/select";
import { useToast } from "@/components/toaster";
import { useAuth } from "@/context/AuthContext";

import { checkoutSchema } from "../schema";
import { CheckoutFormValues } from "../schema";
import { createOrderAction } from "./checkout.service";
import { IProps } from "../types";

interface Props extends IProps {
  onZoneChange: (zoneId: string) => void;
}

const CheckoutForm = ({ zones, onZoneChange }: Props) => {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  const defaultValues: CheckoutFormValues = {
    customerName: user ? `${user.fName} ${user.lName}` : "",
    customerPhone: user?.phone ?? "",
    customerEmail: user?.email ?? "",
    deliveryZoneId: "",
    addressLine: "",
    notes: "",
  };

  const zoneOptions = zones.map((zone) => ({
    value: zone.id,
    label: `${zone.title} (${zone.cost.toLocaleString("ar-EG")} ج.م)`,
  }));

  const handleSubmit = async (values: CheckoutFormValues) => {
    setLoading(true);

    try {
      const result = await createOrderAction(values);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      router.push(`/order-success/${result.orderNumber}`);
    } catch {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form<CheckoutFormValues>
      onSubmit={handleSubmit}
      resolver={zodResolver(checkoutSchema)}
      defaultValues={defaultValues}
      className="flex h-fit min-w-0 flex-1 flex-col gap-3 border border-background-second bg-background p-3 shadow-sm lg:gap-4 lg:p-4"
    >
      <Input<CheckoutFormValues>
        name="customerName"
        label="الاسم بالكامل"
        placeholder="مثال: أحمد محمد"
      />

      <Input<CheckoutFormValues>
        name="customerPhone"
        label="رقم الهاتف"
        type="tel"
        placeholder="01xxxxxxxxx"
      />

      <Input<CheckoutFormValues>
        name="customerEmail"
        label="البريد الإلكتروني (اختياري)"
        type="email"
        placeholder="example@email.com"
      />

      <Select<CheckoutFormValues>
        name="deliveryZoneId"
        label="منطقة التوصيل"
        placeholder="اختر منطقة التوصيل"
        options={zoneOptions}
        onValueChange={onZoneChange}
      />

      <Input<CheckoutFormValues>
        name="addressLine"
        label="العنوان بالتفصيل"
        placeholder="مثال: شارع كذا، عمارة كذا، الدور كذا"
      />

      <Input<CheckoutFormValues>
        name="notes"
        label="ملاحظات (اختياري)"
        placeholder="أي ملاحظات إضافية على الطلب"
      />

      <Button type="submit" color="MAIN" size="lg" loading={loading}>
        {loading ? "جاري إرسال الطلب..." : "تأكيد الطلب"}
      </Button>
    </Form>
  );
};

export default memo(CheckoutForm);
