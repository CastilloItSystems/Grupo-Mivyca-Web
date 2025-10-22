"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useAuthStore } from "@/stores/auth";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Si el usuario está autenticado, redirigir a su dashboard
    if (
      isAuthenticated &&
      user?.companyAccess &&
      user.companyAccess.length > 0
    ) {
      const primaryCompany = user.companyAccess[0].companyId;
      router.push(`/${primaryCompany}/dashboard`);
    }
  }, [isAuthenticated, user, router]);

  const companies = [
    {
      id: "almivyca",
      name: "Almivyca",
      description: "Servicios de almacenamiento y logística",
      icon: "pi pi-building",
      color: "#0ea5e9",
      href: "/almivyca",
    },
    {
      id: "transmivyca",
      name: "Transmivyca",
      description: "Servicios de transporte y distribución",
      icon: "pi pi-truck",
      color: "#10b981",
      href: "/transmivyca",
    },
    {
      id: "camabar",
      name: "CAMABAR",
      description: "Restaurante y servicios de alimentación",
      icon: "pi pi-shopping-cart",
      color: "#ef4444",
      href: "/camabar",
    },
  ];

  const CompanyCard = ({ company }: { company: (typeof companies)[0] }) => {
    const cardHeader = (
      <div className="flex justify-center mb-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: company.color }}
        >
          <i className={`${company.icon} text-white text-2xl`}></i>
        </div>
      </div>
    );

    const cardFooter = (
      <div className="flex justify-center mt-4">
        <Link href={company.href}>
          <Button
            label="Acceder al sistema"
            icon="pi pi-arrow-right"
            iconPos="right"
            className="p-button-sm"
          />
        </Link>
      </div>
    );

    return (
      <Card
        title={company.name}
        subTitle={company.description}
        header={cardHeader}
        footer={cardFooter}
        className="hover:shadow-lg transition-shadow cursor-pointer"
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Grupo Mivyca</h1>
            <p className="mt-2 text-gray-600 mb-6">
              Selecciona la empresa para acceder al sistema
            </p>

            {/* Botones de autenticación */}
            {!isAuthenticated && (
              <div className="flex justify-center gap-4">
                <Link href="/auth/login">
                  <Button
                    label="Iniciar Sesión"
                    icon="pi pi-sign-in"
                    className="p-button-outlined"
                  />
                </Link>
                <Link href="/auth/register">
                  <Button label="Registrarse" icon="pi pi-user-plus" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Card className="text-center max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              ¿Necesitas ayuda?
            </h2>
            <p className="text-gray-600 mb-6">
              Contacta con nuestro equipo de soporte para obtener asistencia
              técnica
            </p>
            <Button
              label="Contactar Soporte"
              icon="pi pi-envelope"
              severity="secondary"
            />
          </Card>
        </div>
      </main>

      <footer className="mt-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 Grupo Mivyca. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
