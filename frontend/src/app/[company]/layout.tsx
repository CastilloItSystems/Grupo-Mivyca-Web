"use client";

import { notFound } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useEffect } from "react";
import Header from "@/components/layout/Header";

const companies = ["almivyca", "transmivyca", "camabar"];

interface CompanyLayoutProps {
  children: React.ReactNode;
  params: {
    company: string;
  };
}

export default function CompanyLayout({
  children,
  params,
}: CompanyLayoutProps) {
  const { company } = params;
  const { setCompany } = useTheme();

  // Verificar si la empresa es válida
  if (!companies.includes(company)) {
    notFound();
  }

  // Configurar el tema de la empresa
  useEffect(() => {
    setCompany(company as any);
  }, [company, setCompany]);

  const getCompanyColors = (company: string) => {
    const colors: Record<string, { primary: string; secondary: string }> = {
      almivyca: { primary: "#0ea5e9", secondary: "#0284c7" },
      transmivyca: { primary: "#10b981", secondary: "#059669" },
      camabar: { primary: "#ef4444", secondary: "#dc2626" },
    };
    return colors[company] || colors.almivyca;
  };

  const companyColors = getCompanyColors(company);

  return (
    <div className="min-h-screen bg-background-primary transition-company">
      {/* Header con tema de empresa */}
      <Header />

      {/* Indicador visual de la empresa */}
      <div
        className="h-1 transition-company"
        style={{ backgroundColor: companyColors.primary }}
      />

      {/* Contenido principal */}
      <main className="flex-1 bg-background-primary transition-company">
        {children}
      </main>
    </div>
  );
}
