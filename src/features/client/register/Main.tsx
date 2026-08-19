"use client";

import { Form } from "@/components/form";
import { Input } from "@/components/input";
import { LoginForm } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./schema";
import { Button } from "@/components/button";
import PasswordRequirements from "./PasswordRequirements";
import Image from "next/image";

const RegisterForm = () => {
  const handleSubmit = (data: LoginForm) => {
    console.log(data);
  };

  return (
    <Form<LoginForm>
      onSubmit={handleSubmit}
      resolver={zodResolver(loginSchema)}
      className="w-full border border-background-second/60 bg-background p-4 sm:p-8 shadow-sm flex flex-col gap-4 max-w-xl"
    >
      <div className="lg:hidden pb-4 border-b-2 border-b-main/30 w-full flex justify-center items-center">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      <Button type="submit" color="MAIN" size="lg">
        إنشاء الحساب
      </Button>
    </Form>
  );
};

export default RegisterForm;
