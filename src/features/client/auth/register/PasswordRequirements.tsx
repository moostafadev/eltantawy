"use client";

import { Check, Circle } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import { LoginForm } from "./types";

const PasswordRequirements = () => {
  const { control } = useFormContext<LoginForm>();

  const password =
    useWatch({
      control,
      name: "password",
    }) ?? "";

  const requirements = [
    {
      label: "8 أحرف على الأقل",
      valid: password.length >= 8,
    },
    {
      label: "حرف كبير واحد على الأقل",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "حرف صغير واحد على الأقل",
      valid: /[a-z]/.test(password),
    },
    {
      label: "رقم واحد على الأقل",
      valid: /[0-9]/.test(password),
    },
    {
      label: "رمز خاص واحد على الأقل",
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  return (
    <div className="flex flex-col gap-2 text-xs">
      <p className="font-medium text-muted-foreground">
        يجب أن تحتوي كلمة المرور على:
      </p>

      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {requirements.map((requirement) => (
          <div
            key={requirement.label}
            className={`flex items-center gap-2 transition-colors ${
              requirement.valid ? "text-green-600" : "text-muted-foreground"
            }`}
          >
            {requirement.valid ? (
              <Check className="size-3.5 shrink-0" strokeWidth={2.5} />
            ) : (
              <Circle className="size-3.5 shrink-0" />
            )}

            <span>{requirement.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordRequirements;
