"use client";

import React, { Component, ReactNode } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Actualiza el estado para mostrar la UI de error
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log del error para debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Callback opcional para manejo de errores
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // UI personalizada de error
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="m-4">
          <div className="text-center p-6">
            <i className="pi pi-exclamation-triangle text-6xl text-red-500 mb-4"></i>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              ¡Oops! Algo salió mal
            </h3>
            <p className="text-gray-600 mb-4">
              Ha ocurrido un error inesperado. Por favor, intenta recargar la
              página.
            </p>
            <div className="space-x-2">
              <Button
                label="Recargar página"
                icon="pi pi-refresh"
                onClick={() => window.location.reload()}
                className="p-button-primary"
              />
              <Button
                label="Ir al inicio"
                icon="pi pi-home"
                onClick={() => (window.location.href = "/")}
                className="p-button-outlined"
              />
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Ver detalles del error (desarrollo)
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Hook para usar Error Boundary de manera funcional
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error("Error handled by useErrorHandler:", error, errorInfo);
    // Aquí podrías enviar el error a un servicio de logging
  };
}
