"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/button";
import { useAuth } from "@/context/AuthContext";

const LogoutButton = () => {
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
      className="flex items-center gap-4"
    >
      <LogOut size={18} />
      تسجيل الخروج
    </Button>
  );
};

export default LogoutButton;
