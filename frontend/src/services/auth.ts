import axios from "axios";
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
} from "@/types";

// Configuración base de Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("mivyca_auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem("mivyca_auth_token");
      localStorage.removeItem("mivyca_user_data");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post("/api/auth/login", credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Error en el inicio de sesión"
        );
      }
      throw new Error("Error de conexión");
    }
  },

  // Registro
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post("/api/auth/register", data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Error en el registro"
        );
      }
      throw new Error("Error de conexión");
    }
  },

  // Obtener perfil del usuario
  async getProfile(): Promise<User> {
    try {
      const response = await api.get("/api/auth/profile");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Error al obtener el perfil"
        );
      }
      throw new Error("Error de conexión");
    }
  },

  // Refresh token
  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = localStorage.getItem("mivyca_refresh_token");
      const response = await api.post("/api/auth/refresh", {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Error al renovar la sesión"
        );
      }
      throw new Error("Error de conexión");
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      // Continuar con el logout local aunque falle la petición
      console.warn("Error en logout del servidor:", error);
    } finally {
      // Limpiar datos locales
      localStorage.removeItem("mivyca_auth_token");
      localStorage.removeItem("mivyca_refresh_token");
      localStorage.removeItem("mivyca_user_data");
    }
  },

  // Forgot password
  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post("/api/auth/forgot-password", { email });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "Error al enviar email de recuperación"
        );
      }
      throw new Error("Error de conexión");
    }
  },

  // Reset password
  async resetPassword(token: string, password: string): Promise<void> {
    try {
      await api.post("/api/auth/reset-password", { token, password });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Error al restablecer la contraseña"
        );
      }
      throw new Error("Error de conexión");
    }
  },
};

export default api;
