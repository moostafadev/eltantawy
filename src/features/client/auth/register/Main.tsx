"use client";

import { Form } from "@/components/form";
import { Input } from "@/components/input";
import { LoginForm } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./schema";
import { Button } from "@/components/button";
import PasswordRequirements from "./PasswordRequirements";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const router = useRouter();

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
        return;
      }

      router.push(`/verify-email?userId=${encodeURIComponent(result.userId)}`);
    } catch (error) {
      console.error("Register error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form<LoginForm>
      onSubmit={handleSubmit}
      resolver={zodResolver(loginSchema)}
      className="
        w-full
        max-w-xl
        flex flex-col gap-4
        border border-background-second/60
        bg-background
        p-4
        shadow-sm
        sm:p-8
      "
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
    </Form>
  );
};

export default RegisterForm;
