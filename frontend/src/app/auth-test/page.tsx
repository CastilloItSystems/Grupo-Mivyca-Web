"use client";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthDebugInfo } from "@/components/shared/AuthDebugInfo";
import { autoLoginInDev, clearDevAuth, DEV_USERS } from "@/utils/devAuth";

export default function AuthTestPage() {
  const { user, isAuthenticated, logout, setAuthForTesting } = useAuthStore();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Debug: log para verificar el estado de auth
  console.log("AuthTest - Usuario:", user);
  console.log("AuthTest - isAuthenticated:", isAuthenticated);

  // Función para simular login exitoso usando dev utilities
  const simulateLogin = async (companyId: string = "almivyca") => {
    setIsLoggingIn(true);

    const devAuth = autoLoginInDev(companyId);
    if (devAuth) {
      console.log("🔧 simulateLogin - Setting auth state...");
      console.log("🔧 Dev user:", devAuth.user.email);
      console.log("🔧 Dev token:", devAuth.token);

      // Update Zustand store using testing function
      setAuthForTesting(devAuth.user, devAuth.token);

      // Verify localStorage was updated
      setTimeout(() => {
        const storedData = localStorage.getItem("mivyca-auth-store");
        console.log("🔧 After login - localStorage data:", storedData);
        console.log("🔧 After login - Auth state:", { isAuthenticated, user });
      }, 100);

      setIsLoggingIn(false);
      router.push(`/${companyId}/dashboard`);
    } else {
      console.error("Failed to create dev auth");
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    clearDevAuth();
    await logout();
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card title="🧪 Página de Pruebas de Autenticación">
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                Estado de Autenticación:
              </h3>
              <p className="text-blue-800">
                <strong>Autenticado:</strong>{" "}
                {isAuthenticated ? "✅ Sí" : "❌ No"}
              </p>
              {user && (
                <div className="mt-2 text-blue-800">
                  <p>
                    <strong>Usuario:</strong> {user.firstName} {user.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Empresa:</strong>{" "}
                    {user.companyAccess?.[0]?.companyId}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">
                🚀 Login Rápido por Empresa:
              </h4>

              <Button
                label="🔵 Login como Almivyca"
                onClick={() => simulateLogin("almivyca")}
                className="w-full"
                loading={isLoggingIn}
                style={{ backgroundColor: "#0ea5e9", borderColor: "#0ea5e9" }}
              />

              <Button
                label="🟢 Login como Transmivyca"
                onClick={() => simulateLogin("transmivyca")}
                className="w-full"
                loading={isLoggingIn}
                style={{ backgroundColor: "#10b981", borderColor: "#10b981" }}
              />

              <Button
                label="🔴 Login como CAMABAR"
                onClick={() => simulateLogin("camabar")}
                className="w-full"
                loading={isLoggingIn}
                style={{ backgroundColor: "#ef4444", borderColor: "#ef4444" }}
              />

              <Button
                label="🚪 Logout"
                onClick={handleLogout}
                className="w-full"
                severity="danger"
                disabled={!isAuthenticated}
              />

              <Button
                label="🔄 Refrescar Estado"
                onClick={() => window.location.reload()}
                className="w-full"
                outlined
                size="small"
              />
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">
                💡 Instrucciones:
              </h3>
              <ul className="text-yellow-800 space-y-1 text-sm">
                <li>
                  1. Haz clic en cualquier botón de empresa para login
                  automático
                </li>
                <li>
                  2. Serás redirigido automáticamente al dashboard de esa
                  empresa
                </li>
                <li>3. Verifica que el theming funcione correctamente</li>
                <li>4. Prueba el toggle de tema claro/oscuro</li>
                <li>5. Usa "Logout" para cerrar sesión</li>
              </ul>
            </div>

            {isAuthenticated && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">
                  📊 Enlaces Directos:
                </h4>
                <div className="space-y-2">
                  <Button
                    label="Ver Dashboard Almivyca"
                    onClick={() => router.push("/almivyca/dashboard")}
                    className="w-full"
                    outlined
                    size="small"
                  />
                  <Button
                    label="Ver Dashboard Transmivyca"
                    onClick={() => router.push("/transmivyca/dashboard")}
                    className="w-full"
                    outlined
                    size="small"
                  />
                  <Button
                    label="Ver Dashboard CAMABAR"
                    onClick={() => router.push("/camabar/dashboard")}
                    className="w-full"
                    outlined
                    size="small"
                  />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Componente de debug */}
        <AuthDebugInfo />
      </div>
    </div>
  );
}
