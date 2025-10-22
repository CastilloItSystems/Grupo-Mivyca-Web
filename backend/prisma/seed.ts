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
    // Test de conexión
    await prisma.$connect();
    console.log("✅ Conexión a la base de datos exitosa");

    // === CREACIÓN DE EMPRESAS ===
    console.log("\n🏢 Creando empresas del Grupo Mivyca...");

    const almivyca = await prisma.company.upsert({
      where: { slug: "almivyca" },
      update: {},
      create: {
        name: "Almivyca",
        slug: "almivyca",
        description:
          "Empresa especializada en almacenamiento y logística integral",
        logo: "/logos/almivyca.png",
        isActive: true,
      },
    });

    const transmivyca = await prisma.company.upsert({
      where: { slug: "transmivyca" },
      update: {},
      create: {
        name: "Transmivyca",
        slug: "transmivyca",
        description: "Empresa de transporte y gestión de flota vehicular",
        logo: "/logos/transmivyca.png",
        isActive: true,
      },
    });

    const camabar = await prisma.company.upsert({
      where: { slug: "camabar" },
      update: {},
      create: {
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

    // 1. Super Administrador Global
    const superAdmin = await prisma.user.upsert({
      where: { email: "superadmin@grupomivyca.com" },
      update: {},
      create: {
        email: "superadmin@grupomivyca.com",
        password: hashedPassword,
        firstName: "Super",
        lastName: "Administrador",
        isActive: true,
        emailVerified: true,
        defaultCompanyId: almivyca.id,
      },
    });

    // Dar acceso de SUPER_ADMIN a todas las empresas
    await Promise.all([
      prisma.userCompanyAccess.upsert({
        where: {
          userId_companyId: { userId: superAdmin.id, companyId: almivyca.id },
        },
        update: {},
        create: {
          userId: superAdmin.id,
          companyId: almivyca.id,
          role: UserRole.SUPER_ADMIN,
          isActive: true,
        },
      }),
      prisma.userCompanyAccess.upsert({
        where: {
          userId_companyId: {
            userId: superAdmin.id,
            companyId: transmivyca.id,
          },
        },
        update: {},
        create: {
          userId: superAdmin.id,
          companyId: transmivyca.id,
          role: UserRole.SUPER_ADMIN,
          isActive: true,
        },
      }),
      prisma.userCompanyAccess.upsert({
        where: {
          userId_companyId: { userId: superAdmin.id, companyId: camabar.id },
        },
        update: {},
        create: {
          userId: superAdmin.id,
          companyId: camabar.id,
          role: UserRole.SUPER_ADMIN,
          isActive: true,
        },
      }),
    ]);

    // 2. Administrador de Almivyca
    const adminAlmivyca = await prisma.user.upsert({
      where: { email: "admin@almivyca.com" },
      update: {},
      create: {
        email: "admin@almivyca.com",
        password: hashedPassword,
        firstName: "Carlos",
        lastName: "Administrador",
        isActive: true,
        emailVerified: true,
        defaultCompanyId: almivyca.id,
      },
    });

    await prisma.userCompanyAccess.upsert({
      where: {
        userId_companyId: { userId: adminAlmivyca.id, companyId: almivyca.id },
      },
      update: {},
      create: {
        userId: adminAlmivyca.id,
        companyId: almivyca.id,
        role: UserRole.ADMIN,
        isActive: true,
      },
    });

    // 3. Administrador de Transmivyca
    const adminTransmivyca = await prisma.user.upsert({
      where: { email: "admin@transmivyca.com" },
      update: {},
      create: {
        email: "admin@transmivyca.com",
        password: hashedPassword,
        firstName: "Luis",
        lastName: "Transportista",
        isActive: true,
        emailVerified: true,
        defaultCompanyId: transmivyca.id,
      },
    });

    await prisma.userCompanyAccess.upsert({
      where: {
        userId_companyId: {
          userId: adminTransmivyca.id,
          companyId: transmivyca.id,
        },
      },
      update: {},
      create: {
        userId: adminTransmivyca.id,
        companyId: transmivyca.id,
        role: UserRole.ADMIN,
        isActive: true,
      },
    });

    // 4. Administrador de CAMABAR
    const adminCamabar = await prisma.user.upsert({
      where: { email: "admin@camabar.com" },
      update: {},
      create: {
        email: "admin@camabar.com",
        password: hashedPassword,
        firstName: "Ana",
        lastName: "Comercial",
        isActive: true,
        emailVerified: true,
        defaultCompanyId: camabar.id,
      },
    });

    await prisma.userCompanyAccess.upsert({
      where: {
        userId_companyId: { userId: adminCamabar.id, companyId: camabar.id },
      },
      update: {},
      create: {
        userId: adminCamabar.id,
        companyId: camabar.id,
        role: UserRole.ADMIN,
        isActive: true,
      },
    });

    // 5. Manager Multi-empresa (Transmivyca + CAMABAR)
    const managerMulti = await prisma.user.upsert({
      where: { email: "manager@grupomivyca.com" },
      update: {},
      create: {
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
      prisma.userCompanyAccess.upsert({
        where: {
          userId_companyId: {
            userId: managerMulti.id,
            companyId: transmivyca.id,
          },
        },
        update: {},
        create: {
          userId: managerMulti.id,
          companyId: transmivyca.id,
          role: UserRole.MANAGER,
          isActive: true,
        },
      }),
      prisma.userCompanyAccess.upsert({
        where: {
          userId_companyId: { userId: managerMulti.id, companyId: camabar.id },
        },
        update: {},
        create: {
          userId: managerMulti.id,
          companyId: camabar.id,
          role: UserRole.SUPERVISOR,
          isActive: true,
        },
      }),
    ]);

    // 6. Usuarios estándar por empresa
    const userAlmivyca = await prisma.user.upsert({
      where: { email: "almacenista@almivyca.com" },
      update: {},
      create: {
        email: "almacenista@almivyca.com",
        password: hashedPassword,
        firstName: "Pedro",
        lastName: "Almacenista",
        isActive: true,
        emailVerified: true,
        defaultCompanyId: almivyca.id,
      },
    });

    await prisma.userCompanyAccess.upsert({
      where: {
        userId_companyId: { userId: userAlmivyca.id, companyId: almivyca.id },
      },
      update: {},
      create: {
        userId: userAlmivyca.id,
        companyId: almivyca.id,
        role: UserRole.USER,
        isActive: true,
      },
    });

    const userTransmivyca = await prisma.user.upsert({
      where: { email: "conductor@transmivyca.com" },
      update: {},
      create: {
        email: "conductor@transmivyca.com",
        password: hashedPassword,
        firstName: "Miguel",
        lastName: "Conductor",
        isActive: true,
        emailVerified: true,
        defaultCompanyId: transmivyca.id,
      },
    });

    await prisma.userCompanyAccess.upsert({
      where: {
        userId_companyId: {
          userId: userTransmivyca.id,
          companyId: transmivyca.id,
        },
      },
      update: {},
      create: {
        userId: userTransmivyca.id,
        companyId: transmivyca.id,
        role: UserRole.USER,
        isActive: true,
      },
    });

    const userCamabar = await prisma.user.upsert({
      where: { email: "vendedor@camabar.com" },
      update: {},
      create: {
        email: "vendedor@camabar.com",
        password: hashedPassword,
        firstName: "María",
        lastName: "Vendedora",
        isActive: true,
        emailVerified: true,
        defaultCompanyId: camabar.id,
      },
    });

    await prisma.userCompanyAccess.upsert({
      where: {
        userId_companyId: { userId: userCamabar.id, companyId: camabar.id },
      },
      update: {},
      create: {
        userId: userCamabar.id,
        companyId: camabar.id,
        role: UserRole.USER,
        isActive: true,
      },
    });

    console.log("✅ Usuarios creados con accesos multi-empresa configurados");

    // === PRODUCTOS PARA ALMIVYCA ===
    console.log("\n📦 Creando productos para Almivyca...");

    const products = await Promise.all([
      prisma.product.upsert({
        where: { sku: "ALM-EST-001" },
        update: {},
        create: {
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
      prisma.product.upsert({
        where: { sku: "ALM-EST-002" },
        update: {},
        create: {
          name: "Estantería Industrial Modelo B",
          description:
            "Estantería metálica reforzada, capacidad 800kg por nivel, 6 niveles",
          sku: "ALM-EST-002",
          price: 4299.99,
          stock: 15,
          category: "Mobiliario Industrial",
          isActive: true,
          companyId: almivyca.id,
        },
      }),
      prisma.product.upsert({
        where: { sku: "ALM-MON-001" },
        update: {},
        create: {
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
      prisma.product.upsert({
        where: { sku: "ALM-MON-002" },
        update: {},
        create: {
          name: "Montacargas Eléctrico 3T",
          description:
            "Montacargas eléctrico con capacidad de 3 toneladas, batería de litio",
          sku: "ALM-MON-002",
          price: 189999.99,
          stock: 2,
          category: "Maquinaria",
          isActive: true,
          companyId: almivyca.id,
        },
      }),
      prisma.product.upsert({
        where: { sku: "ALM-ETI-001" },
        update: {},
        create: {
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
      prisma.product.upsert({
        where: { sku: "ALM-PAL-001" },
        update: {},
        create: {
          name: "Pallets de Madera Estándar",
          description:
            "Pallets de madera tratada, dimensiones estándar 120x80cm",
          sku: "ALM-PAL-001",
          price: 450.0,
          stock: 200,
          category: "Logística",
          isActive: true,
          companyId: almivyca.id,
        },
      }),
    ]);

    console.log(`✅ ${products.length} productos creados para Almivyca`);

    // === VEHÍCULOS PARA TRANSMIVYCA ===
    console.log("\n🚛 Creando vehículos para Transmivyca...");

    const vehicles = await Promise.all([
      prisma.vehicle.upsert({
        where: { plate: "TMV-001-MX" },
        update: {},
        create: {
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
      prisma.vehicle.upsert({
        where: { plate: "TMV-002-MX" },
        update: {},
        create: {
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
      prisma.vehicle.upsert({
        where: { plate: "TMV-003-MX" },
        update: {},
        create: {
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
      prisma.vehicle.upsert({
        where: { plate: "TMV-004-MX" },
        update: {},
        create: {
          plate: "TMV-004-MX",
          brand: "Nissan",
          model: "Urvan NV350",
          year: 2024,
          type: VehicleType.VAN,
          status: VehicleStatus.AVAILABLE,
          fuelType: "Gasolina",
          capacity: "2 toneladas",
          companyId: transmivyca.id,
        },
      }),
      prisma.vehicle.upsert({
        where: { plate: "TMV-005-MX" },
        update: {},
        create: {
          plate: "TMV-005-MX",
          brand: "Volvo",
          model: "FH 460",
          year: 2021,
          type: VehicleType.TRUCK,
          status: VehicleStatus.MAINTENANCE,
          fuelType: "Diesel",
          capacity: "15 toneladas",
          companyId: transmivyca.id,
        },
      }),
    ]);

    console.log(`✅ ${vehicles.length} vehículos creados para Transmivyca`);

    // === PEDIDOS PARA CAMABAR ===
    console.log("\n📋 Creando pedidos para CAMABAR...");

    const orders = await Promise.all([
      prisma.order.upsert({
        where: { orderNumber: "CAM-2024-001" },
        update: {},
        create: {
          orderNumber: "CAM-2024-001",
          total: 12999.5,
          status: OrderStatus.CONFIRMED,
          customerName: "Distribuidora El Sol S.A. de C.V.",
          customerEmail: "pedidos@distribuidoraelsol.com",
          customerPhone: "+52-33-1234-5678",
          notes:
            "Cliente: Distribuidora El Sol S.A. de C.V. | Dirección: Av. Industria 123, Guadalajara, Jalisco, México | Entrega programada para el próximo martes. Cliente prefiere horario matutino.",
          companyId: camabar.id,
        },
      }),
      prisma.order.upsert({
        where: { orderNumber: "CAM-2024-002" },
        update: {},
        create: {
          orderNumber: "CAM-2024-002",
          total: 28475.75,
          status: OrderStatus.PROCESSING,
          customerName: "Comercializadora Norte Ltda.",
          customerEmail: "compras@comercializadoranorte.mx",
          customerPhone: "+52-81-9876-5432",
          notes:
            "Cliente: Comercializadora Norte Ltda. | Dirección: Blvd. Comercial 456, Monterrey, Nuevo León, México | Pedido urgente. Requiere facturación especial.",
          companyId: camabar.id,
        },
      }),
      prisma.order.upsert({
        where: { orderNumber: "CAM-2024-003" },
        update: {},
        create: {
          orderNumber: "CAM-2024-003",
          total: 5599.0,
          status: OrderStatus.DELIVERED,
          customerName: "Supermercados La Central",
          customerEmail: "logistica@lacentral.mx",
          customerPhone: "+52-55-5555-1234",
          notes:
            "Cliente: Supermercados La Central | Dirección: Calle Principal 789, Ciudad de México, CDMX, México | Entrega completada satisfactoriamente. Cliente muy conforme.",
          companyId: camabar.id,
        },
      }),
      prisma.order.upsert({
        where: { orderNumber: "CAM-2024-004" },
        update: {},
        create: {
          orderNumber: "CAM-2024-004",
          total: 15890.25,
          status: OrderStatus.PENDING,
          customerName: "Mayorista del Pacífico S.A.",
          customerEmail: "ventas@mayoristadelpacifico.com",
          customerPhone: "+52-664-123-4567",
          notes:
            "Cliente: Mayorista del Pacífico S.A. | Dirección: Zona Industrial Norte, Tijuana, Baja California, México | Pendiente de confirmación de disponibilidad de productos.",
          companyId: camabar.id,
        },
      }),
      prisma.order.upsert({
        where: { orderNumber: "CAM-2024-005" },
        update: {},
        create: {
          orderNumber: "CAM-2024-005",
          total: 7250.0,
          status: OrderStatus.CANCELLED,
          customerName: "Distribuciones del Sur",
          customerEmail: "admin@distribucionsur.mx",
          customerPhone: "+52-961-987-6543",
          notes:
            "Cliente: Distribuciones del Sur | Dirección: Av. Central 321, Tuxtla Gutiérrez, Chiapas, México | Pedido cancelado por el cliente. Cambio en requisitos.",
          companyId: camabar.id,
        },
      }),
    ]);

    console.log(`✅ ${orders.length} pedidos creados para CAMABAR`);

    // === RESUMEN FINAL ===
    console.log(
      "\n🎉 ¡Seeding completo de Grupo Mivyca finalizado exitosamente!"
    );
    console.log("═".repeat(80));
    console.log("📊 RESUMEN COMPLETO DE DATOS CREADOS:");
    console.log("═".repeat(80));
    console.log(`🏢 Empresas creadas: 3`);
    console.log(`   • ${almivyca.name} (${almivyca.slug})`);
    console.log(`   • ${transmivyca.name} (${transmivyca.slug})`);
    console.log(`   • ${camabar.name} (${camabar.slug})`);
    console.log(`👥 Usuarios globales: 7`);
    console.log(`   • 1 Super Administrador (acceso a las 3 empresas)`);
    console.log(`   • 3 Administradores (uno por empresa)`);
    console.log(`   • 1 Manager multi-empresa (Transmivyca + CAMABAR)`);
    console.log(`   • 3 Usuarios estándar (uno por empresa)`);
    console.log(`🔗 Accesos configurados: 9 relaciones usuario-empresa`);
    console.log(`📦 Productos (Almivyca): ${products.length}`);
    console.log(`🚛 Vehículos (Transmivyca): ${vehicles.length}`);
    console.log(`📋 Pedidos (CAMABAR): ${orders.length}`);
    console.log("═".repeat(80));
    console.log("🔐 CREDENCIALES DE ACCESO:");
    console.log("═".repeat(80));
    console.log("Super Admin (todas las empresas):");
    console.log("  📧 superadmin@grupomivyca.com | 🔑 admin123");
    console.log("");
    console.log("Administradores por empresa:");
    console.log("  📧 admin@almivyca.com | 🔑 admin123 (Almivyca)");
    console.log("  📧 admin@transmivyca.com | 🔑 admin123 (Transmivyca)");
    console.log("  📧 admin@camabar.com | 🔑 admin123 (CAMABAR)");
    console.log("");
    console.log("Manager multi-empresa:");
    console.log(
      "  📧 manager@grupomivyca.com | 🔑 admin123 (Transmivyca + CAMABAR)"
    );
    console.log("");
    console.log("Usuarios estándar:");
    console.log("  📧 almacenista@almivyca.com | 🔑 admin123 (Almivyca)");
    console.log("  📧 conductor@transmivyca.com | 🔑 admin123 (Transmivyca)");
    console.log("  📧 vendedor@camabar.com | 🔑 admin123 (CAMABAR)");
    console.log("═".repeat(80));
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
