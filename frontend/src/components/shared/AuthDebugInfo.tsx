"use client";

import { useAuthStore } from "@/stores/auth";
import { Card } from "primereact/card";

export function AuthDebugInfo() {
  const { user, isAuthenticated, token } = useAuthStore();

  return (
    <Card title="🔍 Debug Info - Estado de Autenticación" className="mt-4">
      <div className="space-y-3">
        <div className="bg-gray-100 p-3 rounded text-sm">
          <strong>isAuthenticated:</strong>{" "}
          {isAuthenticated ? "✅ true" : "❌ false"}
        </div>

        <div className="bg-gray-100 p-3 rounded text-sm">
          <strong>token:</strong>{" "}
          {token ? `✅ ${token.substring(0, 20)}...` : "❌ null"}
        </div>

        <div className="bg-gray-100 p-3 rounded text-sm">
          <strong>user:</strong>
          {user ? (
            <pre className="mt-2 text-xs overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          ) : (
            " ❌ null"
          )}
        </div>

        <div className="bg-blue-100 p-3 rounded text-sm">
          <strong>localStorage mivyca-auth-store:</strong>
          <pre className="mt-2 text-xs overflow-auto">
            {typeof window !== "undefined"
              ? localStorage.getItem("mivyca-auth-store") || "No encontrado"
              : "No disponible (SSR)"}
          </pre>
        </div>

        <div className="bg-green-100 p-3 rounded text-sm">
          <strong>Cookies:</strong>
          <pre className="mt-2 text-xs overflow-auto">
            {typeof document !== "undefined"
              ? document.cookie || "No cookies"
              : "No disponible (SSR)"}
          </pre>
        </div>
      </div>
    </Card>
  );
}
