import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import AuthProvider from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { LoadingSpinner } from "@/components/shared/LoadingSkeletons";
import "./globals.css";

// Importar estilos de PrimeReact
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Grupo Mivyca",
  description: "Sistema de gestión empresarial del Grupo Mivyca",
  keywords: [
    "Grupo Mivyca",
    "Almivyca",
    "Transmivyca",
    "CAMABAR",
    "gestión empresarial",
  ],
  authors: [{ name: "Grupo Mivyca" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider>
            <Suspense
              fallback={<LoadingSpinner message="Iniciando aplicación..." />}
            >
              <AuthProvider>
                <Suspense
                  fallback={<LoadingSpinner message="Cargando contenido..." />}
                >
                  {children}
                </Suspense>
              </AuthProvider>
            </Suspense>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
