"use client";

import { useSearchParams } from "next/navigation";
import RegisterForm from "@/components/auth/RegisterForm";
import type { CompanyId } from "@/types";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const company = searchParams?.get("company") as CompanyId | null;

  return <RegisterForm companyId={company || undefined} />;
}
