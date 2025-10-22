import React from "react";
import { Button } from "primereact/button";
import type { CompanyId } from "@/types";

interface ThemedButtonProps {
  label?: string;
  icon?: string;
  companyTheme?: CompanyId;
  variant?: "primary" | "secondary" | "outline";
  onClick?: () => void;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  size?: "small" | "large";
}

const ThemedButton: React.FC<ThemedButtonProps> = ({
  companyTheme,
  variant = "primary",
  className = "",
  ...props
}) => {
  // Clases CSS personalizadas por empresa
  const getThemeClasses = () => {
    if (!companyTheme) return "";

    const baseClass = variant === "outline" ? "p-button-outlined" : "";

    switch (companyTheme) {
      case "almivyca":
        return `${baseClass} mivyca-button-almivyca`;
      case "transmivyca":
        return `${baseClass} mivyca-button-transmivyca`;
      case "camabar":
        return `${baseClass} mivyca-button-camabar`;
      default:
        return baseClass;
    }
  };

  const severity = variant === "secondary" ? "secondary" : undefined;
  const outlined = variant === "outline";

  return (
    <Button
      {...props}
      severity={severity}
      outlined={outlined}
      className={`${getThemeClasses()} ${className}`}
    />
  );
};

export default ThemedButton;
