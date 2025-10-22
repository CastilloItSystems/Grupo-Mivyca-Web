# 🚀 Grupo Mivyca - Plataforma Web Corporativa

---

## 📝 Descripción del Proyecto

Plataforma web unificada para la gestión centralizada y los servicios digitales de las empresas **Almivyca, Transmivyca y CAMABAR**.

Esta aplicación está diseñada para optimizar las operaciones internas, la comunicación y los procesos de negocio críticos del grupo empresarial, proporcionando una experiencia cohesiva y eficiente para todos los usuarios.

---

## 🏗️ Arquitectura del Proyecto

```
Grupo-Mivyca-Web/
├── backend/                       # Proyecto NestJS (API REST)
│   ├── src/                       # Código fuente del Backend
│   │   ├── auth/                  # Módulo de Autenticación (AuthGuard para Company ID)
│   │   ├── company/               # Servicios de gestión de Empresas (Almivyca, Transmivyca, CAMABAR)
│   │   ├── core/                  # Módulos centrales (AppModule, Logging, Config)
│   │   ├── user/                  # Módulo de gestión de Usuarios
│   │   └── modules/               # 🚨 Lógica de Negocio Específica por Empresa
│   │       ├── almivyca/          # Módulo de Operaciones Almivyca (ej. Inventario)
│   │       ├── transmivyca/       # Módulo de Logística Transmivyca (ej. Flota)
│   │       └── camabar/           # Módulo de Ventas Camabar (ej. Pedidos)
│   ├── test/                      # Archivos de prueba
│   ├── nest-cli.json
│   └── package.json
│
├── frontend/                      # Proyecto Next.js (Interfaz de Usuario)
│   ├── pages/                     # Rutas de la aplicación
│   │   ├── [company]/             # 🚨 Enrutamiento Dinámico por Empresa
│   │   ├── api/                   # Rutas API de Next.js (Proxies o SSR)
│   │   └── _app.tsx
│   ├── components/                # Componentes Reutilizables
│   │   └── shared/                # Componentes sin lógica de negocio
│   ├── context/                   # Contexto Global (Auth, Tema, CompanyContext)
│   ├── styles/                    # Archivos de estilos globales
│   ├── public/                    # Archivos estáticos (logos, favicon, etc.)
│   └── package.json
│
├── prisma/                        # Configuración de Prisma y Base de Datos
│   ├── migrations/                # Historial de migraciones de la DB
│   └── schema.prisma              # 🚨 Definición de la DB (incluye company_id en entidades clave)
│
├── infrastructure/                # Archivos de Docker y Despliegue
│   ├── docker-compose.yml         # Orquestador de servicios (frontend, backend, db)
│   ├── Dockerfile.backend         # Dockerfile para la app NestJS
│   └── Dockerfile.frontend        # Dockerfile para la app Next.js
│
├── .env.example                   # Variables de Entorno (DB_URL, API_URL, etc.)
├── .gitignore                     # Archivos a ignorar (node_modules, dist, .env)
├── LICENSE                        # Licencia Propietaria
└── README.md                      # Guía de inicio
```

---

## 🛠️ Instalación y Configuración

### Prerrequisitos

- **Runtime:** Node.js v18+
- **Base de Datos:** PostgreSQL 14+
- **Docker:** Docker Desktop (opcional)
- **Git:** Para control de versiones

### Configuración Local

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/CastilloItSystems/Grupo-Mivyca-Web.git
   cd Grupo-Mivyca-Web
   ```

2. **Configurar variables de entorno:**

   ```bash
   cp .env.example .env
   # Editar el archivo .env con tus credenciales
   ```

3. **Instalar dependencias del Backend:**

   ```bash
   cd backend
   npm install
   ```

4. **Instalar dependencias del Frontend:**

   ```bash
   cd ../frontend
   npm install
   ```

5. **Configurar Base de Datos:**

   ```bash
   cd ../
   npx prisma migrate dev
   npx prisma generate
   ```

6. **Ejecutar en modo desarrollo:**

   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

### Configuración con Docker

1. **Construir y ejecutar con Docker Compose:**

   ```bash
   docker-compose -f infrastructure/docker-compose.yml up --build
   ```

2. **Acceder a la aplicación:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:3001`
   - Base de Datos: `localhost:5432`

---

## 💻 Stack Tecnológico

### Frontend

- **Framework:** Next.js 14
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS / CSS Modules
- **Estado:** React Context / Zustand
- **Autenticación:** NextAuth.js

### Backend

- **Framework:** NestJS
- **Lenguaje:** TypeScript
- **Base de Datos:** PostgreSQL + Prisma ORM
- **Autenticación:** JWT + Passport
- **Validación:** Class Validator
- **Documentación:** Swagger/OpenAPI

### DevOps & Herramientas

- **Contenedores:** Docker
- **Base de Datos:** PostgreSQL 15
- **Control de Versiones:** Git
- **CI/CD:** GitHub Actions (futuro)
- **Testing:** Jest + Cypress

---

## 🏢 Empresas del Grupo

### 🏭 Almivyca

- **Sector:** Operaciones y Almacenamiento
- **Módulos:** Inventario, Logística Interna, Control de Stock

### 🚛 Transmivyca

- **Sector:** Transporte y Logística
- **Módulos:** Gestión de Flota, Rutas, Seguimiento de Envíos

### 🏪 CAMABAR

- **Sector:** Ventas y Comercio
- **Módulos:** Gestión de Pedidos, CRM, Punto de Venta

---

## 🚀 Comandos Útiles

### Desarrollo

```bash
# Reinstalar dependencias
npm run clean:install

# Ejecutar tests
npm run test

# Linting y formato
npm run lint
npm run format

# Generar cliente Prisma
npx prisma generate

# Reset de base de datos
npx prisma migrate reset
```

### Producción

```bash
# Construir para producción
npm run build

# Ejecutar en producción
npm run start

# Healthcheck
npm run health
```

---

## � Seguridad y Autenticación

- **Autenticación basada en JWT**
- **Autorización por roles y empresas**
- **Middleware de validación por Company ID**
- **Encriptación de contraseñas con bcrypt**
- **Rate limiting para APIs**
- **CORS configurado por entorno**

---

## 📊 Monitoreo y Logs

- **Logs estructurados con Winston**
- **Health checks automatizados**
- **Métricas de performance**
- **Error tracking y alertas**

---

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

---

## 📞 Contacto y Soporte

- **Equipo de Desarrollo:** [contacto@grupomivyca.com]
- **Issues:** [GitHub Issues](https://github.com/CastilloItSystems/Grupo-Mivyca-Web/issues)
- **Documentación:** [Wiki del Proyecto](https://github.com/CastilloItSystems/Grupo-Mivyca-Web/wiki)

---

## 📄 Licencia

Este proyecto es propiedad de **Grupo Mivyca** y está protegido bajo licencia propietaria. Todos los derechos reservados.
