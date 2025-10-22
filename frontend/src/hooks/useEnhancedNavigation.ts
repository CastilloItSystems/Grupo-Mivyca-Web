"use client";

import { useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { CompanyId } from "@/types";

/**
 * Hook para navegación suave usando React 18 useTransition
 * Proporciona feedback visual durante la navegación sin bloquear la UI
 */
export function useEnhancedNavigation() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const navigateToCompany = useCallback(
    (companyId: CompanyId, path: string = "/dashboard") => {
      startTransition(() => {
        router.push(`/${companyId}${path}`);
      });
    },
    [router]
  );

  const navigateToPage = useCallback(
    (path: string) => {
      startTransition(() => {
        router.push(path);
      });
    },
    [router]
  );

  const navigateBack = useCallback(() => {
    startTransition(() => {
      router.back();
    });
  }, [router]);

  const navigateToAuth = useCallback(
    (action: "login" | "register" = "login", companyId?: CompanyId) => {
      const authPath = `/auth/${action}${companyId ? `?company=${companyId}` : ""}`;
      startTransition(() => {
        router.push(authPath);
      });
    },
    [router]
  );

  const refreshPage = useCallback(() => {
    startTransition(() => {
      router.refresh();
    });
  }, [router]);

  return {
    isPending,
    navigateToCompany,
    navigateToPage,
    navigateBack,
    navigateToAuth,
    refreshPage,
    // Utilidades adicionales
    isNavigating: isPending,
  };
}

/**
 * Hook para transiciones de estado en formularios y acciones
 */
export function useStateTransition() {
  const [isPending, startTransition] = useTransition();

  const performAction = useCallback((action: () => void | Promise<void>) => {
    startTransition(async () => {
      try {
        await action();
      } catch (error) {
        console.error("Error during state transition:", error);
      }
    });
  }, []);

  return {
    isPending,
    performAction,
    isProcessing: isPending,
  };
}
