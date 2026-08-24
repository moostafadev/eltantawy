"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../button";
import { LogOut } from "lucide-react";
import { IProps } from "./types";

const LogoutButton = ({ children, className }: IProps) => {
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);

      await logout();

      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleLogout}
      color="MAIN"
      size="lg"
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
