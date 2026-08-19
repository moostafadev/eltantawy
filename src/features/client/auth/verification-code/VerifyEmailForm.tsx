"use client";

import { Form } from "@/components/form";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  verifyEmailSchema,
  VerifyEmailForm as VerifyEmailFormType,
} from "./schema";

interface VerifyEmailFormProps {
  userId: string | null;
}

const VerifyEmailForm = ({ userId }: VerifyEmailFormProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleSubmit = async (data: VerifyEmailFormType) => {
    if (!userId) {
      setServerError("جلسة التحقق غير صالحة.");
      return;
    }

    try {
      setIsLoading(true);
      setServerError("");
      setSuccessMessage("");

      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          code: data.code,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.message || "رمز التحقق غير صحيح.");
        return;
      }

      setSuccessMessage("تم تأكيد البريد الإلكتروني بنجاح.");

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      console.error("Verify email error:", error);

      setServerError(
        "حدث خطأ أثناء تأكيد البريد الإلكتروني، يرجى المحاولة مرة أخرى.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!userId) {
      setServerError("جلسة التحقق غير صالحة.");
      return;
    }

    if (isResending || resendCooldown > 0) {
      return;
    }

    try {
      setIsResending(true);
      setServerError("");
      setSuccessMessage("");

      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.message || "تعذر إعادة إرسال رمز التحقق.");
        return;
      }

      setSuccessMessage("تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني.");

      setResendCooldown(60);
    } catch (error) {
      console.error("Resend verification error:", error);

      setServerError(
        "حدث خطأ أثناء إعادة إرسال رمز التحقق، يرجى المحاولة مرة أخرى.",
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Form<VerifyEmailFormType>
      onSubmit={handleSubmit}
      resolver={zodResolver(verifyEmailSchema)}
      className="w-full max-w-xl flex flex-col gap-6 border border-background-second/60 bg-background p-4 shadow-sm sm:p-8"
    >
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          تأكيد البريد الإلكتروني
        </h1>

        <p className="text-sm leading-6 text-muted-foreground">
          أرسلنا رمز تحقق مكونًا من 6 أرقام إلى بريدك الإلكتروني. أدخل الرمز
          أدناه لتأكيد حسابك.
        </p>
      </div>

      <Input<VerifyEmailFormType>
        name="code"
        label="رمز التحقق"
        type="tel"
        placeholder="000000"
        className="[&_input]:text-center [&_input]:text-2xl [&_input]:font-bold [&_input]:tracking-[0.5em]"
      />

      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {serverError}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-2 text-sm text-green-600"
        >
          {successMessage}
        </div>
      )}

      <Button type="submit" color="MAIN" size="lg" loading={isLoading}>
        {isLoading ? "جاري التأكيد..." : "تأكيد البريد الإلكتروني"}
      </Button>

      <div className="flex flex-col items-center gap-2 text-sm">
        <span className="text-muted-foreground">لم يصلك رمز التحقق؟</span>

        <Button
          type="button"
          onClick={handleResendCode}
          disabled={isResending || resendCooldown > 0}
          color="WHITE"
          size="sm"
        >
          {isResending
            ? "جاري إرسال الرمز..."
            : resendCooldown > 0
              ? `إعادة الإرسال بعد ${resendCooldown} ثانية`
              : "إعادة إرسال رمز التحقق"}
        </Button>
      </div>
    </Form>
  );
};

export default VerifyEmailForm;
