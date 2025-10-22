"use client";

import { useSearchParams } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import type { CompanyId } from "@/types";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const company = searchParams?.get("company") as CompanyId | null;
  const redirectTo = searchParams?.get("redirectTo");

  return (
    <LoginForm
      companyId={company || undefined}
      redirectTo={redirectTo || undefined}
    />
  );
}
