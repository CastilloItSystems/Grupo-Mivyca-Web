"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";
export type Company = "almivyca" | "transmivyca" | "camabar";

interface ThemeContextType {
  theme: Theme;
  company: Company | null;
  setTheme: (theme: Theme) => void;
  setCompany: (company: Company) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultCompany?: Company;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  defaultCompany,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [company, setCompany] = useState<Company | null>(
    defaultCompany || null
  );

  // Aplicar tema al documento
  useEffect(() => {
    const root = document.documentElement;

    // Aplicar clase de tema
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Aplicar clase de empresa
    if (company) {
      root.classList.remove(
        "theme-almivyca",
        "theme-transmivyca",
        "theme-camabar"
      );
      root.classList.add(`theme-${company}`);
    }
  }, [theme, company]);

  // Persistir tema en localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("grupo-mivyca-theme") as Theme;
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("grupo-mivyca-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const value: ThemeContextType = {
    theme,
    company,
    setTheme,
    setCompany,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Hook para obtener información de la empresa actual
export function useCompanyTheme() {
  const { company } = useTheme();

  const getCompanyInfo = (companyName: Company) => {
    const companyData = {
      almivyca: {
        name: "Almivyca",
        primaryColor: "#0ea5e9",
        secondaryColor: "#0284c7",
        accentColor: "#38bdf8",
        description: "Grupo Almivyca",
      },
      transmivyca: {
        name: "Transmivyca",
        primaryColor: "#10b981",
        secondaryColor: "#059669",
        accentColor: "#34d399",
        description: "Grupo Transmivyca",
      },
      camabar: {
        name: "CAMABAR",
        primaryColor: "#ef4444",
        secondaryColor: "#dc2626",
        accentColor: "#f87171",
        description: "CAMABAR",
      },
    };

    return companyData[companyName];
  };

  return {
    company,
    companyInfo: company ? getCompanyInfo(company) : null,
    getCompanyInfo,
  };
}
