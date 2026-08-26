"use client";

import { Form } from "@/components/form";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { useToast } from "@/components/toaster";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { LoginForm } from "./types";
import { loginSchema } from "./schema";
import PasswordRequirements from "./PasswordRequirements";

const RegisterForm = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "حدث خطأ أثناء إنشاء الحساب.");
        return;
      }

      toast.success("تم إنشاء الحساب بنجاح، يرجى تأكيد بريدك الإلكتروني.");

      router.push("/verify-email");
    } catch (error) {
      console.error("Register error:", error);

      toast.error("حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form<LoginForm>
      onSubmit={handleSubmit}
      resolver={zodResolver(loginSchema)}
      className="flex w-full max-w-xl flex-col gap-4 border border-background-second/60 bg-background p-4 shadow-sm"
    >
      <div className="flex w-full items-center justify-center border-b-2 border-b-main/30 pb-4 lg:hidden">
        <Image
          src="/logo-alt.png"
          alt="الطنطاوي"
          width={300}
          height={300}
          priority
        />
      </div>

      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold text-foreground">إنشاء حساب جديد</h1>

        <p className="text-sm text-muted-foreground">
          أنشئ حسابك واستمتع بالخصومات
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input<LoginForm>
            name="fName"
            label="الاسم الأول"
            placeholder="أدخل اسمك الأول"
          />

          <Input<LoginForm>
            name="lName"
            label="اسم العائلة"
            placeholder="أدخل اسم العائلة"
          />
        </div>

        <Input<LoginForm>
          name="phone"
          label="رقم الهاتف"
          type="tel"
          placeholder="01xxxxxxxxx"
        />

        <Input<LoginForm>
          name="email"
          label="البريد الإلكتروني"
          type="email"
          placeholder="example@email.com"
        />

        <div className="flex flex-col gap-2">
          <Input<LoginForm>
            name="password"
            label="كلمة المرور"
            type="password"
            placeholder="أدخل كلمة مرور قوية"
          />

          <PasswordRequirements />
        </div>
      </div>

      <Button type="submit" color="MAIN" size="lg" loading={isLoading}>
        {isLoading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
      </Button>

      <div className="flex items-center justify-center gap-1 text-sm">
        <span className="text-muted-foreground">لديك حساب بالفعل؟</span>

        <Link href="/login" className="font-medium text-main hover:underline">
          تسجيل الدخول
        </Link>
      </div>
    </Form>
  );
};

export default RegisterForm;
