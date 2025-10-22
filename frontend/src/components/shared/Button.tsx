import React from "react";
import { Button as PrimeButton } from "primereact/button";
import { classNames } from "primereact/utils";
import type { CompanyId } from "@/types";

interface ButtonProps {
  label?: string;
  icon?: string;
  iconPos?: "left" | "right";
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warning"
    | "danger"
    | "help"
    | "text";
  size?: "small" | "large";
  severity?: "secondary" | "success" | "info" | "warning" | "danger" | "help";
  outlined?: boolean;
  text?: boolean;
  raised?: boolean;
  rounded?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  companyTheme?: CompanyId;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  icon,
  iconPos = "left",
  variant = "primary",
  size = undefined,
  severity,
  outlined = false,
  text = false,
  raised = false,
  rounded = false,
  loading = false,
  disabled = false,
  onClick,
  className,
  children,
  companyTheme,
  fullWidth = false,
  ...props
}) => {
  // Mapear variantes a severity de PrimeReact
  const getSeverity = () => {
    if (severity) return severity;

    switch (variant) {
      case "secondary":
        return "secondary";
      case "success":
        return "success";
      case "info":
        return "info";
      case "warning":
        return "warning";
      case "danger":
        return "danger";
      default:
        return undefined;
    }
  };

  // Clases personalizadas por empresa
  const getCompanyClasses = () => {
    if (!companyTheme) return "";

    const baseClasses = "company-button";
    switch (companyTheme) {
      case "almivyca":
        return `${baseClasses} company-almivyca`;
      case "transmivyca":
        return `${baseClasses} company-transmivyca`;
      case "camabar":
        return `${baseClasses} company-camabar`;
      default:
        return baseClasses;
    }
  };

  const buttonClasses = classNames(
    getCompanyClasses(),
    {
      "w-full": fullWidth,
    },
    className
  );

  return (
    <PrimeButton
      label={label}
      icon={icon}
      iconPos={iconPos}
      severity={getSeverity()}
      size={size}
      outlined={outlined}
      text={text}
      raised={raised}
      rounded={rounded}
      loading={loading}
      disabled={disabled}
      onClick={onClick}
      className={buttonClasses}
      {...props}
    >
      {children}
    </PrimeButton>
  );
};

export default Button;
