const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function verifyData() {
  try {
    console.log("🔍 VERIFICACIÓN FINAL DE DATOS DE GRUPO MIVYCA");
    console.log("=".repeat(60));

    const companies = await prisma.company.count();
    const users = await prisma.user.count();
    const userAccess = await prisma.userCompanyAccess.count();
    const products = await prisma.product.count();
    const vehicles = await prisma.vehicle.count();
    const orders = await prisma.order.count();

    console.log(`🏢 Empresas: ${companies}`);
    console.log(`👥 Usuarios: ${users}`);
    console.log(`🔗 Accesos usuario-empresa: ${userAccess}`);
    console.log(`📦 Productos (Almivyca): ${products}`);
    console.log(`🚛 Vehículos (Transmivyca): ${vehicles}`);
    console.log(`📋 Pedidos (CAMABAR): ${orders}`);

    console.log("\n🔐 CREDENCIALES DISPONIBLES:");
    console.log("   superadmin@grupomivyca.com | admin123");
    console.log("   admin@almivyca.com | admin123");
    console.log("   admin@transmivyca.com | admin123");
    console.log("   admin@camabar.com | admin123");
    console.log("   manager@grupomivyca.com | admin123");
    console.log("   almacenista@almivyca.com | admin123");
    console.log("   conductor@transmivyca.com | admin123");
    console.log("   vendedor@camabar.com | admin123");

    console.log("\n✅ Base de datos lista para usar!");
    console.log(`📊 Prisma Studio disponible en: http://localhost:5555`);
  } catch (error) {
    console.error("❌ Error verificando datos:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyData();
