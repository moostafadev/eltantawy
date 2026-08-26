"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { Button } from "../button";
import { useToast } from "../toaster";
import { IProps } from "./types";

const LogoutButton = ({
  children,
  className,
  size = "md",
  color = "MAIN",
}: IProps) => {
  const router = useRouter();
  const { logout } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);

      await logout();

      toast.success("تم تسجيل الخروج بنجاح.");

      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);

      toast.error("حدث خطأ أثناء تسجيل الخروج، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleLogout}
      color={color}
      size={size}
      loading={isLoading}
      className={`flex items-center gap-4 ${className}`}
    >
      {children ?? (
        <>
          <LogOut className="size-5" />
          <span>تسجيل الخروج</span>
        </>
      )}
    </Button>
  );
};

export default LogoutButton;
