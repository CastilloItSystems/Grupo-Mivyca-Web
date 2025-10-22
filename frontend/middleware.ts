import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COMPANIES } from "./src/lib/constants";
import type { CompanyId } from "./src/types";

// Rutas que requieren validación de empresa
const COMPANY_ROUTES = ["/almivyca", "/transmivyca", "/camabar"];

// Rutas públicas que no requieren autenticación
const PUBLIC_ROUTES = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth-test", // Agregar página de testing
];

// Función para verificar si el usuario está autenticado
function isAuthenticated(request: NextRequest): boolean {
  const token =
    request.cookies.get("mivyca_auth_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  // Para desarrollo: también verificar si hay un token mock en headers
  const mockToken = request.headers.get("x-mock-auth");

  return !!token || !!mockToken;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar si la ruta es pública
  const isPublicRoute =
    PUBLIC_ROUTES.includes(pathname) || pathname.startsWith("/auth/");

  // Verificar si la ruta es una ruta de empresa
  const isCompanyRoute = COMPANY_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isCompanyRoute) {
    // Extraer el ID de la empresa de la URL
    const segments = pathname.split("/");
    const companyId = segments[1] as CompanyId;

    // Verificar si la empresa es válida
    if (!COMPANIES[companyId]) {
      // Redirigir a la página principal si la empresa no es válida
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Verificar autenticación para rutas de empresa
    if (!isAuthenticated(request)) {
      // Redirigir al login con la empresa y URL de retorno
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("company", companyId);
      loginUrl.searchParams.set("redirectTo", pathname);

      return NextResponse.redirect(loginUrl);
    }

    // Agregar headers con información de la empresa
    const response = NextResponse.next();
    response.headers.set("x-company-id", companyId);
    response.headers.set("x-company-name", COMPANIES[companyId].displayName);

    return response;
  }

  // Si el usuario está autenticado y trata de acceder a páginas de auth, redirigir
  if (
    isPublicRoute &&
    pathname.startsWith("/auth/") &&
    isAuthenticated(request)
  ) {
    // Intentar determinar la empresa del usuario y redirigir a su dashboard
    // Por ahora, redirigir a la página principal
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas de solicitud excepto las que comienzan con:
     * - api (rutas de API)
     * - _next/static (archivos estáticos)
     * - _next/image (archivos de optimización de imágenes)
     * - favicon.ico (archivo favicon)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
