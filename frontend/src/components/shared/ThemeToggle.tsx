"use client";

import React from "react";
import { Button } from "primereact/button";
import {
  useTheme,
  useCompanyTheme,
} from "@/components/providers/ThemeProvider";

interface ThemeToggleProps {
  size?: "small" | "large";
  className?: string;
}

export function ThemeToggle({
  size = "small",
  className = "",
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const { companyInfo } = useCompanyTheme();

  const isDark = theme === "dark";

  return (
    <Button
      icon={isDark ? "pi pi-sun" : "pi pi-moon"}
      onClick={toggleTheme}
      text
      rounded
      size={size}
      className={`transition-company ${className}`}
      tooltip={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      tooltipOptions={{ position: "bottom" }}
      style={{
        color: companyInfo?.primaryColor || "var(--company-primary)",
      }}
    />
  );
}
