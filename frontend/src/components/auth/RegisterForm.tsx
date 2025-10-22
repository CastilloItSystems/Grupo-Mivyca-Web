"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { Message } from "primereact/message";
import { useAuthStore } from "@/stores/auth";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { COMPANIES } from "@/lib/constants";
import type { CompanyId } from "@/types";

interface RegisterFormProps {
  companyId?: CompanyId;
}

export default function RegisterForm({ companyId }: RegisterFormProps) {
  const router = useRouter();
  const {
    register: registerUser,
    isLoading,
    error,
    clearError,
  } = useAuthStore();

  // Función auxiliar movida al inicio
  const getCompanyIcon = (company: CompanyId): string => {
    const icons = {
      almivyca: "pi pi-building",
      transmivyca: "pi pi-truck",
      camabar: "pi pi-shopping-cart",
    };
    return icons[company];
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      companyId: companyId || "almivyca",
    },
  });

  const selectedCompany = watch("companyId");

  // Opciones de empresas para el dropdown
  const companyOptions = Object.entries(COMPANIES).map(([key, company]) => ({
    label: company.displayName,
    value: key as CompanyId,
    icon: getCompanyIcon(key as CompanyId),
  }));

  const onSubmit = async (data: RegisterFormData) => {
    try {
      clearError();
      await registerUser(data);

      // Redireccionar después del registro exitoso
      router.push(`/${data.companyId}/dashboard`);
    } catch (error) {
      console.error("Error en registro:", error);
    }
  };

  const selectedCompanyData = COMPANIES[selectedCompany];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div
            className="mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: selectedCompanyData.primaryColor }}
          >
            <i
              className={`${getCompanyIcon(selectedCompany)} text-white text-2xl`}
            ></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Crear Cuenta</h2>
          <p className="mt-2 text-sm text-gray-600">
            Únete a {selectedCompanyData.displayName}
          </p>
        </div>

        {/* Formulario */}
        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Error global */}
            {error && (
              <Message severity="error" text={error} className="w-full" />
            )}

            {/* Selector de empresa */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Empresa
              </label>
              <Dropdown
                value={selectedCompany}
                options={companyOptions}
                onChange={(e) => setValue("companyId", e.value)}
                optionLabel="label"
                optionValue="value"
                placeholder="Seleccionar empresa"
                className="w-full"
                itemTemplate={(option) => (
                  <div className="flex items-center gap-2">
                    <i className={option.icon}></i>
                    <span>{option.label}</span>
                  </div>
                )}
                valueTemplate={(option) => {
                  if (option) {
                    return (
                      <div className="flex items-center gap-2">
                        <i className={option.icon}></i>
                        <span>{option.label}</span>
                      </div>
                    );
                  }
                  return <span>Seleccionar empresa</span>;
                }}
              />
              {errors.companyId && (
                <small className="text-red-500">
                  {errors.companyId.message}
                </small>
              )}
            </div>

            {/* Nombre y Apellido en una fila */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <InputText
                  {...register("firstName")}
                  placeholder="Tu nombre"
                  className="w-full"
                  invalid={!!errors.firstName}
                />
                {errors.firstName && (
                  <small className="text-red-500">
                    {errors.firstName.message}
                  </small>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Apellido
                </label>
                <InputText
                  {...register("lastName")}
                  placeholder="Tu apellido"
                  className="w-full"
                  invalid={!!errors.lastName}
                />
                {errors.lastName && (
                  <small className="text-red-500">
                    {errors.lastName.message}
                  </small>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <InputText
                {...register("email")}
                type="email"
                placeholder="tu@email.com"
                className="w-full"
                invalid={!!errors.email}
              />
              {errors.email && (
                <small className="text-red-500">{errors.email.message}</small>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <Password
                {...register("password")}
                placeholder="Tu contraseña"
                className="w-full"
                invalid={!!errors.password}
                feedback={true}
                toggleMask
                promptLabel="Ingresa una contraseña"
                weakLabel="Débil"
                mediumLabel="Media"
                strongLabel="Fuerte"
              />
              {errors.password && (
                <small className="text-red-500">
                  {errors.password.message}
                </small>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Confirmar Contraseña
              </label>
              <Password
                {...register("confirmPassword")}
                placeholder="Confirma tu contraseña"
                className="w-full"
                invalid={!!errors.confirmPassword}
                feedback={false}
                toggleMask
              />
              {errors.confirmPassword && (
                <small className="text-red-500">
                  {errors.confirmPassword.message}
                </small>
              )}
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              label={isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              loading={isLoading}
              className="w-full"
              style={{
                backgroundColor: selectedCompanyData.primaryColor,
                borderColor: selectedCompanyData.primaryColor,
              }}
            />
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/auth/login"
                className="font-medium hover:underline"
                style={{ color: selectedCompanyData.primaryColor }}
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
