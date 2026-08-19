"use client";

import { Form } from "@/components/form";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { loginSchema } from "./schema";
import { LoginForm } from "./types";
import { useAuth } from "@/context/AuthContext";

const FormLogin = () => {
  const router = useRouter();
  const { setUser } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      setServerError("");

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError("البريد الإلكتروني أو كلمة المرور غير صحيحة.");

        if (result.requiresEmailVerification) {
          router.push("/verify-email");
        }

        return;
      }

      setUser(result.user);

      router.push("/");
    } catch (error) {
      console.error("Login error:", error);

      setServerError("حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form<LoginForm>
      onSubmit={handleSubmit}
      resolver={zodResolver(loginSchema)}
      className="w-full max-w-xl flex flex-col gap-4 border border-background-second/60 bg-background p-4 shadow-sm"
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
        <h1 className="text-2xl font-bold text-foreground">تسجيل الدخول</h1>

        <p className="text-sm text-muted-foreground">
          سجل الدخول إلى حسابك واستمتع بالخصومات
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <Input<LoginForm>
          name="email"
          label="البريد الإلكتروني"
          type="email"
          placeholder="example@email.com"
        />

        <Input<LoginForm>
          name="password"
          label="كلمة المرور"
          type="password"
          placeholder="أدخل كلمة المرور"
        />
      </div>

      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {serverError}
        </div>
      )}

      <Button type="submit" color="MAIN" size="lg" loading={isLoading}>
        {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
      </Button>

      {/* Register */}
      <div className="flex items-center justify-center gap-1 text-sm">
        <span className="text-muted-foreground">ليس لديك حساب؟</span>

        <Link
          href="/register"
          className="font-medium text-main hover:underline"
        >
          إنشاء حساب جديد
        </Link>
      </div>
    </Form>
  );
};

export default FormLogin;
