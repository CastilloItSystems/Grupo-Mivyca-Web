"use client";

import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import {
  useTheme,
  useCompanyTheme,
} from "@/components/providers/ThemeProvider";

interface ThemedCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function ThemedCard({
  title,
  subtitle,
  children,
  actions,
  className = "",
}: ThemedCardProps) {
  const { theme } = useTheme();
  const { companyInfo } = useCompanyTheme();

  const header = (
    <div className="p-4 border-b border-border-primary">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          {subtitle && (
            <p className="text-sm text-text-secondary mt-1">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-2">{actions}</div>
        )}
      </div>
    </div>
  );

  return (
    <Card
      className={`bg-background-primary border border-border-primary shadow-lg transition-company ${className}`}
      header={header}
    >
      <div className="p-4">{children}</div>
    </Card>
  );
}

interface ThemedButtonProps {
  label: string;
  icon?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "text";
  size?: "small" | "large";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function ThemedButton({
  label,
  icon,
  onClick,
  variant = "primary",
  size,
  disabled = false,
  loading = false,
  className = "",
}: ThemedButtonProps) {
  const { companyInfo } = useCompanyTheme();

  const getButtonStyle = () => {
    const baseStyle = "transition-company";

    switch (variant) {
      case "primary":
        return {
          backgroundColor:
            companyInfo?.primaryColor || "var(--company-primary)",
          borderColor: companyInfo?.primaryColor || "var(--company-primary)",
          color: "white",
        };
      case "secondary":
        return {
          backgroundColor:
            companyInfo?.secondaryColor || "var(--company-secondary)",
          borderColor:
            companyInfo?.secondaryColor || "var(--company-secondary)",
          color: "white",
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderColor: companyInfo?.primaryColor || "var(--company-primary)",
          color: companyInfo?.primaryColor || "var(--company-primary)",
        };
      case "text":
        return {
          backgroundColor: "transparent",
          borderColor: "transparent",
          color: companyInfo?.primaryColor || "var(--company-primary)",
        };
      default:
        return {};
    }
  };

  return (
    <Button
      label={label}
      icon={icon}
      onClick={onClick}
      size={size}
      disabled={disabled}
      loading={loading}
      className={`transition-company ${className}`}
      style={getButtonStyle()}
    />
  );
}
