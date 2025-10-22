import {
  PrismaClient,
  UserRole,
  VehicleStatus,
  VehicleType,
  OrderStatus,
} from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seeding completo de Grupo Mivyca...");

  try {
    await prisma.$connect();
    console.log("✅ Conexión a la base de datos exitosa");

    // === CREACIÓN DE EMPRESAS ===
    console.log("\n🏢 Creando empresas del Grupo Mivyca...");

    const almivyca = await prisma.company.create({
      data: {
        name: "Almivyca",
        slug: "almivyca",
        description:
          "Empresa especializada en almacenamiento y logística integral",
        logo: "/logos/almivyca.png",
        isActive: true,
      },
    });

    const transmivyca = await prisma.company.create({
      data: {
        name: "Transmivyca",
        slug: "transmivyca",
        description: "Empresa de transporte y gestión de flota vehicular",
        logo: "/logos/transmivyca.png",
        isActive: true,
      },
    });

    const camabar = await prisma.company.create({
      data: {
        name: "CAMABAR",
        slug: "camabar",
        description: "Empresa de comercialización y ventas especializada",
        logo: "/logos/camabar.png",
        isActive: true,
      },
    });

    console.log(
      `✅ Empresas creadas: ${almivyca.name}, ${transmivyca.name}, ${camabar.name}`
    );

    // === CREACIÓN DE USUARIOS ===
    console.log("\n👥 Creando usuarios globales multi-empresa...");

    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Super Administrador
    const superAdmin = await prisma.user.create({
      data: {
        email: "superadmin@grupomivyca.com",
        password: hashedPassword,
        firstName: "Super",
        lastName: "Administrador",
        isActive: true,
        emailVerified: true,
        defaultCompanyId: almivyca.id,
      },
    });
    console.log(`✅ Super Admin creado: ${superAdmin.email}`);

    // Accesos del Super Admin
    await Promise.all([
      prisma.userCompanyAccess.create({
        data: {
          userId: superAdmin.id,
          companyId: almivyca.id,
          role: UserRole.SUPER_ADMIN,
          isActive: true,
        },
      }),
      prisma.userCompanyAccess.create({
        data: {
          userId: superAdmin.id,
          companyId: transmivyca.id,
          role: UserRole.SUPER_ADMIN,
          isActive: true,
        },
      }),
      prisma.userCompanyAccess.create({
        data: {
          userId: superAdmin.id,
          companyId: camabar.id,
          role: UserRole.SUPER_ADMIN,
          isActive: true,
        },
      }),
    ]);
    console.log(`✅ Accesos del Super Admin configurados`);

    // Administradores por empresa
    const adminAlmivyca = await prisma.user.create({
      data: {
        email: "admin@almivyca.com",
        password: hashedPassword,
        firstName: "Carlos",
        lastName: "Administrador",
        isActive: true,
        emailVerified: true,
        defaultCompanyId: almivyca.id,
      },
    });

    await prisma.userCompanyAccess.create({
      data: {
        userId: adminAlmivyca.id,
        companyId: almivyca.id,
        role: UserRole.ADMIN,
        isActive: true,
      },
    });
    console.log(`✅ Admin Almivyca creado: ${adminAlmivyca.email}`);

    const adminTransmivyca = await prisma.user.create({
      data: {
        email: "admin@transmivyca.com",
        password: hashedPassword,
        firstName: "Luis",
        lastName: "Transportista",
        isActive: true,
        emailVerified: true,
        defaultCompanyId: transmivyca.id,
      },
    });

    await prisma.userCompanyAccess.create({
      data: {
        userId: adminTransmivyca.id,
        companyId: transmivyca.id,
        role: UserRole.ADMIN,
        isActive: true,
      },
    });
    console.log(`✅ Admin Transmivyca creado: ${adminTransmivyca.email}`);

    const adminCamabar = await prisma.user.create({
      data: {
        email: "admin@camabar.com",
        password: hashedPassword,
        firstName: "Ana",
        lastName: "Comercial",
        isActive: true,
        emailVerified: true,
        defaultCompanyId: camabar.id,
      },
    });

    await prisma.userCompanyAccess.create({
      data: {
        userId: adminCamabar.id,
        companyId: camabar.id,
        role: UserRole.ADMIN,
        isActive: true,
      },
    });
    console.log(`✅ Admin CAMABAR creado: ${adminCamabar.email}`);

    // Manager Multi-empresa
    const managerMulti = await prisma.user.create({
      data: {
        email: "manager@grupomivyca.com",
        password: hashedPassword,
        firstName: "Roberto",
        lastName: "Manager",
        isActive: true,
        emailVerified: true,
        defaultCompanyId: transmivyca.id,
      },
    });

    await Promise.all([
      prisma.userCompanyAccess.create({
        data: {
          userId: managerMulti.id,
          companyId: transmivyca.id,
          role: UserRole.MANAGER,
          isActive: true,
        },
      }),
      prisma.userCompanyAccess.create({
        data: {
          userId: managerMulti.id,
          companyId: camabar.id,
          role: UserRole.SUPERVISOR,
          isActive: true,
        },
      }),
    ]);
    console.log(`✅ Manager Multi-empresa creado: ${managerMulti.email}`);

    // Usuarios estándar
    const userAlmivyca = await prisma.user.create({
      data: {
        email: "almacenista@almivyca.com",
        password: hashedPassword,
        firstName: "Pedro",
        lastName: "Almacenista",
        isActive: true,
        emailVerified: true,
        defaultCompanyId: almivyca.id,
      },
    });

    await prisma.userCompanyAccess.create({
      data: {
        userId: userAlmivyca.id,
        companyId: almivyca.id,
        role: UserRole.USER,
        isActive: true,
      },
    });
    console.log(`✅ Usuario Almivyca creado: ${userAlmivyca.email}`);

    const userTransmivyca = await prisma.user.create({
      data: {
        email: "conductor@transmivyca.com",
        password: hashedPassword,
        firstName: "Miguel",
        lastName: "Conductor",
        isActive: true,
        emailVerified: true,
        defaultCompanyId: transmivyca.id,
      },
    });

    await prisma.userCompanyAccess.create({
      data: {
        userId: userTransmivyca.id,
        companyId: transmivyca.id,
        role: UserRole.USER,
        isActive: true,
      },
    });
    console.log(`✅ Usuario Transmivyca creado: ${userTransmivyca.email}`);

    const userCamabar = await prisma.user.create({
      data: {
        email: "vendedor@camabar.com",
        password: hashedPassword,
        firstName: "María",
        lastName: "Vendedora",
        isActive: true,
        emailVerified: true,
        defaultCompanyId: camabar.id,
      },
    });

    await prisma.userCompanyAccess.create({
      data: {
        userId: userCamabar.id,
        companyId: camabar.id,
        role: UserRole.USER,
        isActive: true,
      },
    });
    console.log(`✅ Usuario CAMABAR creado: ${userCamabar.email}`);

    // === PRODUCTOS PARA ALMIVYCA ===
    console.log("\n📦 Creando productos para Almivyca...");

    const products = await Promise.all([
      prisma.product.create({
        data: {
          name: "Estantería Industrial Modelo A",
          description:
            "Estantería metálica para almacén industrial, capacidad 500kg por nivel, 5 niveles",
          sku: "ALM-EST-001",
          price: 2999.99,
          stock: 25,
          category: "Mobiliario Industrial",
          isActive: true,
          companyId: almivyca.id,
        },
      }),
      prisma.product.create({
        data: {
          name: "Montacargas Eléctrico 2T",
          description:
            "Montacargas eléctrico con capacidad de 2 toneladas, batería de litio",
          sku: "ALM-MON-001",
          price: 159999.99,
          stock: 3,
          category: "Maquinaria",
          isActive: true,
          companyId: almivyca.id,
        },
      }),
      prisma.product.create({
        data: {
          name: "Sistema de Etiquetado por Código de Barras",
          description:
            "Kit completo de etiquetado e impresión de códigos de barras con software",
          sku: "ALM-ETI-001",
          price: 8999.99,
          stock: 10,
          category: "Tecnología",
          isActive: true,
          companyId: almivyca.id,
        },
      }),
    ]);

    console.log(`✅ ${products.length} productos creados para Almivyca`);

    // === VEHÍCULOS PARA TRANSMIVYCA ===
    console.log("\n🚛 Creando vehículos para Transmivyca...");

    const vehicles = await Promise.all([
      prisma.vehicle.create({
        data: {
          plate: "TMV-001-MX",
          brand: "Ford",
          model: "Transit 350",
          year: 2023,
          type: VehicleType.VAN,
          status: VehicleStatus.AVAILABLE,
          fuelType: "Diesel",
          capacity: "3.5 toneladas",
          companyId: transmivyca.id,
        },
      }),
      prisma.vehicle.create({
        data: {
          plate: "TMV-002-MX",
          brand: "Mercedes-Benz",
          model: "Sprinter 516",
          year: 2022,
          type: VehicleType.TRUCK,
          status: VehicleStatus.AVAILABLE,
          fuelType: "Diesel",
          capacity: "7 toneladas",
          companyId: transmivyca.id,
        },
      }),
      prisma.vehicle.create({
        data: {
          plate: "TMV-003-MX",
          brand: "Isuzu",
          model: "NPR 816",
          year: 2023,
          type: VehicleType.TRUCK,
          status: VehicleStatus.IN_USE,
          fuelType: "Diesel",
          capacity: "5 toneladas",
          companyId: transmivyca.id,
        },
      }),
    ]);

    console.log(`✅ ${vehicles.length} vehículos creados para Transmivyca`);

    // === PEDIDOS PARA CAMABAR ===
    console.log("\n📋 Creando pedidos para CAMABAR...");

    const orders = await Promise.all([
      prisma.order.create({
        data: {
          orderNumber: "CAM-2024-001",
          total: 12999.5,
          status: OrderStatus.CONFIRMED,
          customerName: "Distribuidora El Sol S.A. de C.V.",
          customerEmail: "pedidos@distribuidoraelsol.com",
          customerPhone: "+52-33-1234-5678",
          notes:
            "Cliente: Distribuidora El Sol S.A. de C.V. | Dirección: Av. Industria 123, Guadalajara, Jalisco, México",
          companyId: camabar.id,
        },
      }),
      prisma.order.create({
        data: {
          orderNumber: "CAM-2024-002",
          total: 28475.75,
          status: OrderStatus.PROCESSING,
          customerName: "Comercializadora Norte Ltda.",
          customerEmail: "compras@comercializadoranorte.mx",
          customerPhone: "+52-81-9876-5432",
          notes:
            "Cliente: Comercializadora Norte Ltda. | Dirección: Blvd. Comercial 456, Monterrey, Nuevo León, México",
          companyId: camabar.id,
        },
      }),
      prisma.order.create({
        data: {
          orderNumber: "CAM-2024-003",
          total: 5599.0,
          status: OrderStatus.DELIVERED,
          customerName: "Supermercados La Central",
          customerEmail: "logistica@lacentral.mx",
          customerPhone: "+52-55-5555-1234",
          notes:
            "Cliente: Supermercados La Central | Dirección: Calle Principal 789, Ciudad de México, CDMX, México",
          companyId: camabar.id,
        },
      }),
    ]);

    console.log(`✅ ${orders.length} pedidos creados para CAMABAR`);

    // === RESUMEN FINAL ===
    console.log(
      "\n🎉 ¡Seeding completo de Grupo Mivyca finalizado exitosamente!"
    );
    console.log("=".repeat(60));
    console.log("📊 RESUMEN COMPLETO DE DATOS CREADOS:");
    console.log("=".repeat(60));
    console.log(`🏢 Empresas: 3`);
    console.log(`👥 Usuarios: 7`);
    console.log(`🔗 Accesos: 9 relaciones usuario-empresa`);
    console.log(`📦 Productos (Almivyca): ${products.length}`);
    console.log(`🚛 Vehículos (Transmivyca): ${vehicles.length}`);
    console.log(`📋 Pedidos (CAMABAR): ${orders.length}`);
    console.log("=".repeat(60));
    console.log("🔐 CREDENCIALES DE ACCESO:");
    console.log("=".repeat(60));
    console.log("superadmin@grupomivyca.com | admin123 (Todas las empresas)");
    console.log("admin@almivyca.com | admin123 (Almivyca)");
    console.log("admin@transmivyca.com | admin123 (Transmivyca)");
    console.log("admin@camabar.com | admin123 (CAMABAR)");
    console.log("manager@grupomivyca.com | admin123 (Transmivyca + CAMABAR)");
    console.log("almacenista@almivyca.com | admin123 (Almivyca)");
    console.log("conductor@transmivyca.com | admin123 (Transmivyca)");
    console.log("vendedor@camabar.com | admin123 (CAMABAR)");
    console.log("=".repeat(60));
  } catch (error) {
    console.error("❌ Error durante el seeding:", error);
    throw error;
  }
}

main()
  .then(async () => {
    console.log("✅ Seeding completed successfully!");
    await prisma.$disconnect();
  })
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  });
