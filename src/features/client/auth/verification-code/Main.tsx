"use client";

import { useSearchParams } from "next/navigation";

import VerifyEmailForm from "./VerifyEmailForm";

const VerifyEmailContent = () => {
  const searchParams = useSearchParams();

  const userId = searchParams.get("userId");

  return <VerifyEmailForm userId={userId} />;
};

export default VerifyEmailContent;
