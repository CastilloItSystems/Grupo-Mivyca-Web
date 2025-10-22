"use client";

import { useEffect } from "react";
import { useAuthInitialization } from "@/stores/auth";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initializeAuth } = useAuthInitialization();

  useEffect(() => {
    // Pequeño delay para asegurar que localStorage esté disponible
    const timer = setTimeout(() => {
      initializeAuth();
    }, 100);

    return () => clearTimeout(timer);
  }, [initializeAuth]);

  return <>{children}</>;
}
