"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthStore, LoginCredentials, RegisterData, User } from "@/types";
import { authService } from "@/services/auth";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.login(credentials);

          // Guardar token y datos del usuario
          localStorage.setItem("mivyca_auth_token", response.token);
          localStorage.setItem(
            "mivyca_user_data",
            JSON.stringify(response.user)
          );
          if (response.refreshToken) {
            localStorage.setItem("mivyca_refresh_token", response.refreshToken);
          }

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Error desconocido",
          });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.register(data);

          // Guardar token y datos del usuario
          localStorage.setItem("mivyca_auth_token", response.token);
          localStorage.setItem(
            "mivyca_user_data",
            JSON.stringify(response.user)
          );
          if (response.refreshToken) {
            localStorage.setItem("mivyca_refresh_token", response.refreshToken);
          }

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Error desconocido",
          });
          throw error;
        }
      },

      logout: () => {
        authService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
        // Asegurarse de limpiar también localStorage
        localStorage.removeItem("mivyca_user_data");
      },

      refreshToken: async () => {
        try {
          const response = await authService.refreshToken();

          localStorage.setItem("mivyca_auth_token", response.token);
          localStorage.setItem(
            "mivyca_user_data",
            JSON.stringify(response.user)
          );
          if (response.refreshToken) {
            localStorage.setItem("mivyca_refresh_token", response.refreshToken);
          }

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
          });
        } catch (error) {
          // Si falla el refresh, hacer logout
          get().logout();
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      // Función específica para testing/simulación
      setAuthForTesting: (user: User, token: string) => {
        // Guardar también en localStorage para persistencia
        localStorage.setItem("mivyca_auth_token", token);
        localStorage.setItem("mivyca_user_data", JSON.stringify(user));

        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
        });
      },
    }),
    {
      name: "mivyca-auth-store",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      skipHydration: false,
      onRehydrateStorage: () => {
        console.log("🔧 Zustand hydration started");
        return (state, error) => {
          if (error) {
            console.error("🚨 Zustand hydration failed:", error);
          } else {
            console.log(
              "🔧 Zustand hydration finished:",
              state?.user?.email || "no user"
            );
          }
        };
      },
    }
  )
);

// Hook para verificar autenticación al cargar la app
export const useAuthInitialization = () => {
  const { token, refreshToken, logout, user } = useAuthStore();

  const initializeAuth = async () => {
    // En modo desarrollo, si hay datos de usuario en el store, no hacer validación contra backend
    const isDevelopment = process.env.NODE_ENV === "development";

    if (token && user) {
      if (isDevelopment) {
        // En desarrollo, confiar en los datos del store si están presentes
        console.log(
          "🔧 Auth initialized in development mode with existing user:",
          user.email
        );
        return;
      }

      try {
        // Verificar si el token sigue siendo válido solo en producción
        await authService.getProfile();
      } catch (error) {
        // Si el token no es válido, intentar refresh
        try {
          await refreshToken();
        } catch (refreshError) {
          // Si el refresh falla, hacer logout
          logout();
        }
      }
    } else if (isDevelopment) {
      // En desarrollo, verificar si hay datos en localStorage que no estén en el store
      const storedToken = localStorage.getItem("mivyca_auth_token");
      const storedUserData = localStorage.getItem("mivyca_user_data");

      if (storedToken && storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          console.log(
            "🔧 Restoring auth state from localStorage:",
            userData.email
          );
          // No usar la función interna set, sino actualizar directamente el store
          useAuthStore.setState({
            user: userData,
            token: storedToken,
            isAuthenticated: true,
            error: null,
          });
        } catch (error) {
          console.warn("Error restoring auth state from localStorage:", error);
          localStorage.removeItem("mivyca_auth_token");
          localStorage.removeItem("mivyca_user_data");
        }
      } else {
        console.log(
          "🔧 No auth state found, development mode without auto-login"
        );
      }
    }
  };

  return { initializeAuth };
};
